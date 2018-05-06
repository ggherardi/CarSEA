<?php

include 'PHPConst.php';
include 'DBConnection.php';
include 'TokenGenerator.php';
use TokenGenerator;

function __autoload($className) {
    require_once "./models/$className.php";
}

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class CitiesService {
    private $id_regione;
    private $id_provincia;
    private $nome;
    private $latitudine;
    private $longitudine;
    private $dbContext;

    function __construct() {
        self::RetrievePostVariables();
    }

    // Recupera le variabili POST passate dalla chiamata lato client
    private function RetrievePostVariables() {
        $this->id_regione = isset($_POST["id_regione"]) ? $_POST["id_regione"] : "";
        $this->id_provincia = isset($_POST["id_provincia"]) ? $_POST["id_provincia"] : "";
        $this->nome = isset($_POST["nome"]) ? $_POST["nome"] : "";
        $this->latitudine = isset($_POST["latitudine"]) ? $_POST["latitudine"] : "";
        $this->longitudine = isset($_POST["longitudine"]) ? $_POST["longitudine"] : "";
    }

    // Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    function InsertCities() {
        TokenGenerator::ValidateToken();
        $query = "INSERT INTO city (id, id_regione, id_provincia, nome, latitudine, longitudine)
            VALUES (DEFAULT, '$this->id_regione', '$this->id_provincia', '$this->nome', '$this->latitudine', '$this->longitudine')";
        return self::ExecuteQuery($query);
    }

    function SearchCities() {        
        $searchKey = isset($_POST["searchKey"]) ? $_POST["searchKey"] : "";
        // $searchKey = mysqli_escape_string($searchKey);

        $query = "SELECT *
            FROM city
            WHERE nome LIKE '$searchKey%'
            ORDER BY nome asc
            LIMIT 10";

        $res = self::ExecuteQuery($query);

        $allResults = [];

        while($row = $res->fetch_assoc()) {      
            $allResults[] = new City($row["id"], $row["id_regione"], $row["id_provincia"], $row["nome"], $row["latitudine"], $row["longitudine"]); 
        }
        return $allResults;
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        switch(isset($_POST["action"]) ? $_POST["action"] : ""){
            case "insertCities":
                $res = self::InsertCities();
            break;
            case "search":
                $res = self::SearchCities();
            break;
            default: 
                $res = $_POST;
                break;
        }
        echo json_encode($res);
    }
}

Logger::Write("Reached Cities API", $GLOBALS["CorrelationID"]);
// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Cities = new CitiesService();
$Cities->Init();

?>