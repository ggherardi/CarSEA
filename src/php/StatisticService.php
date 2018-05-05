<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
include 'TokenGenerator.php';
use Logger;
use Models;
use TokenGenerator;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class StatisticService {
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

    function GetMostFrequentTrips() {
        // TokenGenerator::ValidateToken();
        Logger::Write("Processing GetMostFrequentTrips request", $GLOBALS["CorrelationID"]);
        try {
            $query = "SELECT 
                depcity.nome as departureCity,
                arrcity.nome as arrivalCity,
                ROUND(AVG(t.price)) as averagePrice,
                COUNT(t.departure_city) as tripsCount
                FROM trip as t
                LEFT JOIN city as depcity
                ON t.departure_city = depcity.id
                LEFT JOIN city as arrcity
                ON t.arrival_city = arrcity.id
                GROUP BY t.departure_city, t.arrival_city
                LIMIT 6";
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
            Logger::Write("Error while processing GetMostFrequentTrips request: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        $this->dbContext = new DBConnection();
        switch($_POST["action"]){
            case "getMostFrequentTrips":
                self::GetMostFrequentTrips();
                break;
            default: 
                exit(json_encode($_POST));
                break;
        }
    }
}
Logger::Write("Reached StatisticService API", $GLOBALS["CorrelationID"]);   
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Trip = new StatisticService();
$Trip->Init();
?>