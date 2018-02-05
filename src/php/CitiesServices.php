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

    // Switcha l'operazione richiesta lato client
    function Init() {
        switch($_POST["action"]){
            case "insertCities":
                $res = self::InsertCities();
            break;
            default: 
                echo json_encode($_POST);
                break;
        }
        echo json_encode($res);
    }
}

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Cities = new CitiesService();
$Cities->Init();

?>