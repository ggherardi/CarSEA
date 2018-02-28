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

    private function GetTrips(){
        Logger::Write("Processing GetTrips request", $GLOBALS["CorrelationID"]);
        $date = getdate();
        $month = (strlen($date["mon"]) == 2 ? $date["mon"] : ("0" . $date["mon"]));
        $today = sprintf("%s-%s-%s %s:%s", $date["year"], $month, $date["mday"], $date["hours"], $date["minutes"]);
        $filters = json_decode($_POST["filters"]);

        $query = "SELECT  *
            -- u.Nome as ownerName, 
            -- t.id as tripId, 
            -- t.departure_date as departureDate,
            -- t.price, t.seats, t.duration, t.distance,
            -- dep.nome as departureCity, 
            -- arr.nome as arrivalCity
            FROM trip as t
            -- INNER JOIN city as dep
            -- ON t.departure_city = dep.id
            -- INNER JOIN city as arr
            -- ON t.arrival_city = arr.id
            -- INNER JOIN user as u
            -- ON t.owner_id = u.Id  
            -- LEFT OUTER JOIN trip_waypoint as tw
            -- ON t.id = tw.trip_id
            WHERE 
            t.departure_city = $filters->departureCity
            AND t.arrival_city = $filters->arrivalCity
            -- OR tw.city_id = $filters->arrivalCity)
            -- OR
            -- (tw.city_id = $filters->departureCity
            -- AND t.arrival_city = $filters->arrivalCity)
            -- t.price <= $filters->price
            -- AND t.departure_date >= '$today'
            -- AND t.departure_date >= '$filters->dateStart' 
            -- AND t.departure_date <= '$filters->dateEnd'
            ";



        // exit(json_encode($query));
        $res = self::ExecuteQuery($query);
        $results = array();
        if($res){
            while($row = $res->fetch_assoc()){
                $results[] = $row;      
            }            
        }
        exit(json_encode($results));
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