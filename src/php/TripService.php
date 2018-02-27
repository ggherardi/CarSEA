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

    // Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    private function SaveNewTrip(){
        TokenGenerator::ValidateToken();
        Logger::Write("Processing SaveNewTrip request", $GLOBALS["CorrelationID"]);
        foreach($_POST as $key => $value){
            Logger::Write("$key => $value", $GLOBALS["CorrelationID"]);
        }
        $newTrip = json_decode($_POST["trip"]);
        $departureCityId = self::MapCityId($newTrip->departureCity);
        $arrivalCityId = self::MapCityId($newTrip->arrivalCity);
        $stopoverCity1Id = self::MapCityId($newTrip->stopoverCity1);
        $stopoverCity2Id = self::MapCityId($newTrip->stopoverCity2);
        $stopoverCity3Id = self::MapCityId($newTrip->stopoverCity3);
        $stopoverCity4Id = self::MapCityId($newTrip->stopoverCity4);
        $description = (strlen($newTrip->description) != 0) ? $newTrip->description : "NULL";

        $query = "INSERT INTO `trips` 
            VALUES (NULL, $newTrip->ownerId, $departureCityId, 
                    $arrivalCityId, $stopoverCity1Id, 
                    $stopoverCity2Id, $stopoverCity3Id, 
                    $stopoverCity4Id, '$newTrip->departureDate', 
                    $newTrip->price, $newTrip->seats, '$description',
                    $newTrip->duration, $newTrip->distance)";

        $res = self::ExecuteQuery($query);
        Logger::Write("SaveNewTrip status: $res", $GLOBALS["CorrelationID"]);
        exit(json_encode($res));
    }

    private function MapCityId($city){
        return $city != $null ? $city->id : "NULL";
    }

    private function GetTrips(){
        Logger::Write("Processing GetTrips request", $GLOBALS["CorrelationID"]);
        $date = getdate();
        $month = substr("0" . $date["mon"], 0, 2);
        $today = sprintf("%s-%s-%s %s:%s", $date["year"], $month, $date["mday"], $date["hours"], $date["minutes"]);
        $filters = json_decode($_POST["filters"]);

        $query = "SELECT c.nome 
            FROM trips as t
            INNER JOIN cities as c
            ON t.departure_city = c.id
            WHERE t.departure_city = $filters->departureCity
            AND t.arrival_city = $filters->arrivalCity
            AND t.price <= $filters->price
            AND t.departure_date >= '$today'
            AND t.departure_date >= '$filters->dateStart' 
            AND t.departure_date <= '$filters->dateEnd'";
        exit(json_encode($query));
        $res = self::ExecuteQuery($query);
        while($row = $res->fetch_assoc()){
            exit(json_encode($row));
        }
        exit(json_encode($res));
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