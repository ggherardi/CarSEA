<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
include 'TokenGenerator.php';
use Logger;
use Models;
use TokenGenerator;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class TripService {
    private $name;
    private $surname;
    private $username;
    private $email;
    private $password;
    private $dbContext;

    function __construct() {
    }

    /** Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection */
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    /** Crea nella tabella trip un nuovo viaggio. Se sono presenti uno o più waypoints,
     * vengono create anche le relative row all'interno della tabella trip_waypoint */
    private function SaveNewTrip(){
        TokenGenerator::ValidateToken();
        Logger::Write("Processing SaveNewTrip request", $GLOBALS["CorrelationID"]);
        try {
            foreach($_POST as $key => $value){
                Logger::Write("$key => $value", $GLOBALS["CorrelationID"]);
            }
            $newTrip = json_decode($_POST["trip"]);
            $departureCityId = self::MapCityId($newTrip->departureCity);
            $arrivalCityId = self::MapCityId($newTrip->arrivalCity);
            $description = (strlen($newTrip->description) != 0) ? $newTrip->description : "NULL";
    
            $query = "INSERT INTO `trip` 
                VALUES (NULL, $newTrip->ownerId, $departureCityId, 
                        $arrivalCityId, '$newTrip->departureDate', 
                        $newTrip->price, $newTrip->seats, '$description',
                        $newTrip->duration, $newTrip->distance)";
    
            $res = self::ExecuteQuery($query);
            Logger::Write("SaveNewTrip status: $res", $GLOBALS["CorrelationID"]);
            if($res && $newTrip->waypoints > 0) {
                $tripId = $this->dbContext->GetLastID();
                foreach($newTrip->waypoints as $waypoint){
                    $values .= "(NULL, $tripId, $waypoint->id),";
                }
                $values = rtrim($values, ",");
                $waypointsQuery = "INSERT INTO `trip_waypoint` VALUES" . $values;
                $resWpQuery = self::ExecuteQuery($waypointsQuery);
                Logger::Write("Waypoints save status: $resWpQuery", $GLOBALS["CorrelationID"]);
                $res = $resWpQuery;
            }
            exit(json_encode($res));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while saving a new trip: $ex", $GLOBALS["CorrelationID"]);
        }
    }

    private function MapCityId($city){
        return $city != $null ? $city->id : "NULL";
    }

    private function GetTrips() {
        try {
            Logger::Write("Processing GetTrips request", $GLOBALS["CorrelationID"]);
            $date = getdate();
            $day = (strlen($date["mday"]) == 2 ? $date["mday"] : ("0" . $date["mday"]));
            $month = (strlen($date["mon"]) == 2 ? $date["mon"] : ("0" . $date["mon"]));
            $today = sprintf("%s-%s-%s %s:%s", $date["year"], $month, $day, $date["hours"], $date["minutes"]);
            $filters = json_decode($_POST["filters"]);

            $query = "SELECT
                u.Id as ownerId,
                u.Nome as ownerName, 
                t.id as tripId, 
                t.departure_date as departureDate,
                t.price, t.seats, t.duration, t.distance,
                depc.nome as departureCityName, 
                arrc.nome as arrivalCityName,
                wayc.id as waypointId,
                wayc.nome as waypointCityName
                FROM trip as t
                LEFT JOIN user as u
                ON u.Id = t.owner_id
                LEFT JOIN trip_waypoint as tw
                ON t.id = tw.trip_id
                LEFT JOIN city as depc
                ON depc.id = t.departure_city
                LEFT JOIN city as arrc
                ON arrc.id = t.arrival_city
                LEFT JOIN city as wayc
                ON wayc.id = tw.city_id
                WHERE 
                t.departure_city = $filters->departureCity
                AND t.arrival_city = $filters->arrivalCity
                AND t.departure_date >= '$today'
                AND t.departure_date >= '$filters->dateStart' 
                AND t.departure_date <= '$filters->dateEnd'
                AND t.price <= $filters->price";
            // exit(json_encode($query));
            $res = self::ExecuteQuery($query);
            $results = array();
            if($res){
                while($row = $res->fetch_assoc()){
                    $results[] = $row;      
                }            
            }
            $responseObject = self::BuildResponseObject($results);
            exit(json_encode($responseObject));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while querying GetTrips -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    function BuildResponseObject($results) {
        $auxResponseObject = array();
        $responseObject = array();
        foreach($results as $row) {
            if($auxResponseObject[$row["tripId"]] == null) {
                $auxResponseObject[$row["tripId"]] = $row;
            }
            if($row["waypointId"] != null) {
                $auxResponseObject[$row["tripId"]]["allWaypoints"][] = $row;
            }
        }
        foreach($auxResponseObject as $item) {
            $responseObject[] = $item;
        }
        return $responseObject;
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "saveNewTrip":
                self::SaveNewTrip();
            break;
            case "getTrips":
                self::GetTrips();
                break;
            default: 
                exit(json_encode($_POST));
                break;
        }
    }
}
Logger::Write("Reached TripService API", $GLOBALS["CorrelationID"]);   
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Trip = new TripService();
$Trip->Init();
?>