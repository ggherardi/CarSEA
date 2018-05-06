<?php

include 'PHPConst.php';
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;

function __autoload($className) {
    require_once "./models/$className.php";
}

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class CarService {
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

    function SearchCarsMake() {        
        $searchKey = isset($_POST["searchKey"]) ? $_POST["searchKey"] : "";
        $query = "SELECT DISTINCT make
            FROM car
            WHERE make LIKE '%$searchKey%'
            ORDER BY make asc
            LIMIT 10";
        $res = self::ExecuteQuery($query);

        $allResults = [];
        while($row = $res->fetch_assoc()) {
            $allResults[] = $row; 
        }
        return $allResults;
    }

    function SearchCarsModel() {        
        $searchKey = isset($_POST["searchKey"]) ? $_POST["searchKey"] : "";
        $param = isset($_POST["param"]) ? $_POST["param"] : "";

        $query = "SELECT *
            FROM car
            WHERE make LIKE '%$param%'
            AND model LIKE '%$searchKey%'
            ORDER BY make asc
            LIMIT 10";
        $res = self::ExecuteQuery($query);
        Logger::Write("$query", $GLOBALS["CorrelationID"]);
        $allResults = [];
        while($row = $res->fetch_assoc()) {
            $allResults[] = new Car($row["id"], $row["year"], $row["make"], $row["model"]); 
        }
        return $allResults;
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        switch(isset($_POST["action"]) ? $_POST["action"] : ""){
            case "searchMake":
                $res = self::SearchCarsMake();
            break;
            case "searchModel":
                $res = self::SearchCarsModel();
            break;
            default: 
                $res = $_POST;
                break;
        }
        exit(json_encode($res));
    }
}

Logger::Write("Reached Car API", $GLOBALS["CorrelationID"]);
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    $Car = new CarService();
    $Car->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}
?>