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
        Logger::Write("Processing SaveNewTrip request for user", $GLOBALS["CorrelationID"]);
        foreach($_POST as $key => $value){
            Logger::Write("$key => $value", $GLOBALS["CorrelationID"]);
        }
        $newTrip = json_decode($_POST["trip"]);
        $departureCityId = $newTrip->departureCity->id;
        $arrivalCityId = $newTrip->arrivalCity->id;
        $stopoverCity1Id = $newTrip->stopoverCity1->id;
        $stopoverCity2Id = $newTrip->stopoverCity2->id;
        $stopoverCity3Id = $newTrip->stopoverCity3->id;
        $stopoverCity4Id = $newTrip->stopoverCity4->id;
        $description = (strlen($newTrip->description) != 0) ? $newTrip->description : "NULL";

        $query = "INSERT INTO `trips` 
            VALUES (NULL, $newTrip->ownerId, $departureCityId, 
                    $arrivalCityId, $stopoverCity1Id, 
                    $stopoverCity2Id, $stopoverCity3Id, 
                    $stopoverCity4Id, '$newTrip->departureDate', 
                    $newTrip->price, $newTrip->seats, '$description')";

        // exit(json_encode($query));

        $res = self::ExecuteQuery($query);
        exit(json_encode($res));
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "saveNewTrip":
                self::SaveNewTrip();
            break;
            case "login":
                self::Login();
                break;
            default: 
                echo json_encode($_POST);
                break;
        }
    }
}
Logger::Write("Reached TripService API", $GLOBALS["CorrelationID"]);   
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Trip = new TripService();
$Trip->Init();
?>