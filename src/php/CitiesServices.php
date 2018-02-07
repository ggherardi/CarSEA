<?php

include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
use Models;

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
        $query = "INSERT INTO cities (id, id_regione, id_provincia, nome, latitudine, longitudine)
            VALUES (DEFAULT, '$this->id_regione', '$this->id_provincia', '$this->nome', '$this->latitudine', '$this->longitudine')";
        return self::ExecuteQuery($query);
    }

    function SearchCities() {
        $searchKey = isset($_POST["searchKey"]) ? $_POST["searchKey"] : "";
        $query = "SELECT * FROM cities
            WHERE nome LIKE '$searchKey%'";

        $res = self::ExecuteQuery($query);

        $allResults = [];
        // while($row = $res->fetch_assoc()){
        //     $allResults." ".$row;
        // }
        for($i = 0; $i < 10; $i++){
            $row = $res->fetch_assoc();
            $allResults[] = new Models\City($row["id"], $row["id_regione"], $row["id_provincia"], $row["nome"], $row["latitudine"], $row["longitudine"]); 
        }
        return $allResults;
    }

    function DeleteCities() {
        json_decode($_POST["searchKey"], $searchKey);
        return "pippo";
        $query = "DELETE FROM cities
            WHERE nome = '$this->nome'";

        return self::ExecuteQuery($query);
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        json_decode($_POST, $res);
        echo json_encode($res);
        return;
        switch(json_decode($_POST["action"])){
            case "insertCities":
                $res = self::InsertCities();
            break;
            case "deleteCities":
                $res = self::DeleteCities();
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

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Cities = new CitiesService();
$Cities->Init();

?>