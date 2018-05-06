<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'TokenGenerator.php';
use Logger;
use TokenGenerator;

function __autoload($className) {
    require_once "./models/$className.php";
}

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class TripService {
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
            Logger::Write("Error while processing SaveNewTrip request: $ex", $GLOBALS["CorrelationID"]);
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
            $ownerID = isset($_POST["ownerID"]) ? $_POST["ownerID"] : 0;
            Logger::Write("tripId: $tripID", $GLOBALS["CorrelationID"]);
            Logger::Write("ownerId: $ownerID", $GLOBALS["CorrelationID"]);
            $query = "SELECT
                u.Id as ownerId,
                u.Nome as ownerName, 
                t.id as tripId,
                t.description as tripDescription,
                t.departure_date as departureDate,
                t.price, t.seats, t.duration, t.distance,
                depc.nome as departureCityName, 
                arrc.nome as arrivalCityName,
                GROUP_CONCAT('', wayc.id, '_', wayc.nome) as allWaypoints,
                GROUP_CONCAT(DISTINCT tb.id) as allBookings
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
                LEFT JOIN trip_booking as tb
                ON t.id = tb.trip_id 
                WHERE ";
               
            if($tripID != 0) {
                $whereCondition = "t.id = $tripID";
            }
            else if($ownerID != 0) {
                $whereCondition = "t.owner_id  = $ownerID";
            }
            else {
                $whereCondition =  "t.seats > 0
                AND t.departure_city = $filters->departureCity
                AND t.arrival_city = $filters->arrivalCity
                AND t.departure_date >= '$today'
                AND t.departure_date >= '$filters->dateStart' 
                AND t.departure_date <= '$filters->dateEnd'";
            }
            $query .= $whereCondition;
            $query .= " GROUP BY t.id";
            Logger::Write("$query", $GLOBALS["CorrelationID"]);
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
            Logger::Write("Error while processing GetTrips request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    function BuildResponseObject($results) {
        $auxResponseObject = array();
        $i = 0;
        foreach($results as $row) {
            $auxResponseObject[] = $row;
            if($row["allWaypoints"] != null) {
                $waypointsArray = explode(",", $row["allWaypoints"]);
                $auxWaypointsArray = array();
                foreach($waypointsArray as $waypoint) {
                    $splittedWaypoint = explode("_", $waypoint);
                    $oWaypoint = new Trip($splittedWaypoint[0], $splittedWaypoint[1]);
                    $auxWaypointsArray[] = $oWaypoint;
                }
                $auxResponseObject[$i]["allWaypoints"] = $auxWaypointsArray;
            }
            if($row["allBookings"] != null) {
                $bookingsArray = explode(",", $row["allBookings"]);
                $auxBookingsArray = array();
                foreach($bookingsArray as $booking) {
                    $auxBookingsArray[] = $booking;
                }
                $auxResponseObject[$i]["allBookings"] = $auxBookingsArray;
            }
            $i++;
        }
        Logger::Write(json_encode($auxResponseObject), $GLOBALS["CorrelationID"]);
        return $auxResponseObject;
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
            Logger::Write("InsertBooking status: $res", $GLOBALS["CorrelationID"]);
            $this->dbContext->CommitTransaction();
            exit(json_encode($res));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while processing InsertBooking request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            exit(json_encode($ex->getMessage()));
        }
    }

    function GetBookingsForUser() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing GetBookingsForUser request", $GLOBALS["CorrelationID"]);
        try {
            $userId = json_decode($_POST["userId"]);
            $query = "SELECT
                tb.id as bookingId,
                tb.user_id as userId,
                tb.trip_id as tripId,
                tb.trip_booking_status_code as bookingStatusCode,
                tbs.status as bookingStatus,
                c_departure.nome as departureCity,
                c_arrival.nome as arrivalCity,
                u.Username as ownerUsername,
                u.Id as tripOwnerId,
                t.price as price,
                t.departure_date as departureDate
                FROM `trip_booking` as tb
                INNER JOIN `trip` as t
                ON tb.trip_id = t.id
                INNER JOIN `user` as u
                ON t.owner_id = u.Id
                INNER JOIN `city` as c_departure
                ON t.departure_city = c_departure.id
                INNER JOIN `city` as c_arrival
                ON t.arrival_city = c_arrival.id
                LEFT JOIN `trip_booking_status` as tbs
                ON tb.trip_booking_status_code = tbs.code
                WHERE tb.user_id = $userId";
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
            Logger::Write("Error while processing GetBookingsForUser request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    function GetBookingsForTrip() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing GetBookingForTrip request", $GLOBALS["CorrelationID"]);
        try {
            $tripId = json_decode($_POST["tripId"]);
            $query = "SELECT
                tb.id as bookingId,
                tb.user_id as userId,
                tb.trip_id as tripId,
                tb.trip_booking_status_code as bookingStatusCode,
                tbs.status as bookingStatus,
                u.Username as ownerUsername,
                u.Id as tripOwnerId
                FROM `trip_booking` as tb
                INNER JOIN `user` as u
                ON tb.user_id = u.Id
                LEFT JOIN `trip_booking_status` as tbs
                ON tb.trip_booking_status_code = tbs.code
                WHERE tb.trip_id = $tripId";
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
            Logger::Write("Error while processing GetBookingsForTrip request: $ex", $GLOBALS["CorrelationID"]);
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
            Logger::Write("Error while processing GetExistingBooking request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    function SetBookingStatus() {
        TokenGenerator::ValidateToken();
        Logger::Write("Processing SetBookingstatus request", $GLOBALS["CorrelationID"]);
        try {
            $this->dbContext->StartTransaction();
            $tripId = isset($_POST["tripId"]) ? $_POST["tripId"] : 0;
            $bookingId = isset($_POST["bookingId"]) ? $_POST["bookingId"] : 0;
            $bookingStatus = isset($_POST["bookingStatus"]) ? $_POST["bookingStatus"] : 0;
            $query =  "UPDATE trip_booking
                        SET trip_booking_status_code = $bookingStatus
                        WHERE id = $bookingId";;
            $res = self::ExecuteQuery($query);
            Logger::Write("$bookingStatus", $GLOBALS["CorrelationID"]);
            if($bookingStatus == 1) {
                $query =  "UPDATE trip
                SET seats = seats - 1
                WHERE id = $tripId";;
            }
            $res = self::ExecuteQuery($query);
            $this->dbContext->CommitTransaction();
            exit(json_encode($row));
        }
        catch(Throwable $ex) {
            Logger::Write("Error while processing SetBookingStatus request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
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
            case "getBookingsForUser":
                self::GetBookingsForUser();
                break;
            case "getBookingsForTrip":
                self::GetBookingsForTrip();
                break;
            case "getExistingBooking":
                self::GetExistingBooking();
                break;
            case "setBookingStatus":
                self::SetBookingStatus();
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