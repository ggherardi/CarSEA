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
            $this->dbContext->StartTransaction();
            $newTrip = json_decode($_POST["trip"]);
            $departureCityId = self::MapCityId($newTrip->departureCity);
            $arrivalCityId = self::MapCityId($newTrip->arrivalCity);
            $description = (strlen($newTrip->tripDescription) != 0) ? $newTrip->tripDescription : "NULL";
            $query = "INSERT INTO `trip` 
                VALUES (NULL, $newTrip->ownerId, $departureCityId, 
                        $arrivalCityId, '$newTrip->departureDate', 
                        $newTrip->price, $newTrip->seats, '$description',
                        $newTrip->duration, $newTrip->distance)";
            $res = self::ExecuteQuery($query);
            Logger::Write("SaveNewTrip status: $res", $GLOBALS["CorrelationID"]);
            if($res && count($newTrip->waypoints) > 0) {
                $tripId = $this->dbContext->GetLastID();
                foreach($newTrip->waypoints as $waypoint){
                    if($waypoint != null)
                        $values .= "(NULL, $tripId, $waypoint->id),";
                }
                $values = rtrim($values, ",");
                if(strlen($values) > 0) {
                    $waypointsQuery = "INSERT INTO `trip_waypoint` VALUES" . $values;
                    $resWpQuery = self::ExecuteQuery($waypointsQuery);
                    Logger::Write("Waypoints save status: $resWpQuery", $GLOBALS["CorrelationID"]);
                    $res = $resWpQuery;
                }
            }
            $this->dbContext->CommitTransaction();
            exit(json_encode($res));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while saving a new trip: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            exit(json_encode($ex->getMessage()));
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
            $tripID = isset($_POST["tripID"]) ? $_POST["tripID"] : 0;

            $query = "SELECT
                u.Id as ownerId,
                u.Nome as ownerName, 
                t.id as tripId,
                t.description as tripDescription,
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
                WHERE ";
            $query .= ($tripID != 0 ? "t.id = $tripID" : 
                    "t.seats > 0
                    AND t.departure_city = $filters->departureCity
                    AND t.arrival_city = $filters->arrivalCity
                    AND t.departure_date >= '$today'
                    AND t.departure_date >= '$filters->dateStart' 
                    AND t.departure_date <= '$filters->dateEnd'
                    AND t.price <= $filters->price");
            $res = self::ExecuteQuery($query);
            $results = array();
            if($res) {
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

    function InsertBooking() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing InsertBooking request", $GLOBALS["CorrelationID"]);
        try {
            $this->dbContext->StartTransaction();
            $newBooking = json_decode($_POST["newBooking"]);
            $query = "INSERT INTO `trip_booking` 
                VALUES (DEFAULT, $newBooking->userId, $newBooking->tripId, DEFAULT)";
                Logger::Write("$query", $GLOBALS["CorrelationID"]);
            $res = self::ExecuteQuery($query);
            Logger::Write("SaveNewTrip status: $res", $GLOBALS["CorrelationID"]);
            $this->dbContext->CommitTransaction();
            exit(json_encode($res));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while inserting a new booking: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            exit(json_encode($ex->getMessage()));
        }
    }

    function GetBookings() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing GetExistingBooking request", $GLOBALS["CorrelationID"]);
        try {
            $userId = json_decode($_POST["userId"]);
            $query = "SELECT *
                FROM `trip_booking` as tb
                INNER JOIN `trip` as t
                ON tb.trip_id = t.id
                INNER JOIN `user` as u
                ON t.owner_id = u.Id
                LEFT JOIN `trip_booking_status` as tbs
                ON tb.trip_booking_status_code = tbs.code
                WHERE user_id = $userId";
                Logger::Write($query, $GLOBALS["CorrelationID"]);
            $res = self::ExecuteQuery($query);
            $results = array();
            if($res) {
                while($row = $res->fetch_assoc()){
                    $results[] = $row;      
                }            
            }
            exit(json_encode($results));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while retrieving existing booking: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    function GetExistingBooking() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing GetExistingBooking request", $GLOBALS["CorrelationID"]);
        try {
            $existingBooking = json_decode($_POST["existingBooking"]);
            $query = "SELECT 
                tb.id as bookingId,
                tb.user_id as userId,
                tb.trip_id as tripId,
                tbs.status as bookingStatus
                FROM `trip_booking` as tb
                LEFT JOIN `trip_booking_status` as tbs
                ON tb.trip_booking_status_code = tbs.code
                WHERE user_id = $existingBooking->userId
                AND trip_id = $existingBooking->tripId";
            $res = self::ExecuteQuery($query);
            $row = $res->fetch_assoc();
            exit(json_encode($row));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while retrieving existing booking: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        $this->dbContext = new DBConnection();
        switch($_POST["action"]){
            case "saveNewTrip":
                self::SaveNewTrip();
            break;
            case "getTrips":
                self::GetTrips();
                break;
            case "insertBooking":
                self::InsertBooking();
                break;
            case "getBookings":
                self::GetBookings();
                break;
            case "getExistingBooking":
                self::GetExistingBooking();
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