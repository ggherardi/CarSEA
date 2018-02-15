<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
use Logger;
use Models;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class TripService {
    private $name;
    private $surname;
    private $username;
    private $email;
    private $password;
    private $dbContext;

    function __construct() {
        self::RetrievePostVariables();
    }

    // Recupera le variabili POST passate dalla chiamata lato client
    private function RetrievePostVariables() {
        $this->name = isset($_POST["name"]) ? $_POST["name"] : "";
        $this->surname = isset($_POST["surname"]) ? $_POST["surname"] : "";
        $this->username = isset($_POST["username"]) ? $_POST["username"] : "";
        $this->email = isset($_POST["email"]) ? $_POST["email"] : "";
        $this->password = isset($_POST["password"]) ? $_POST["password"] : "";
    }

    // Metodo per eseguire le Query. Utilizza la classe ausiliare DBConnection
    private function ExecuteQuery($query = "") {        
        if($this->dbContext == null) {
            $this->dbContext = new DBConnection();
        }
        return $this->dbContext->ExecuteQuery($query);
    }

    // Effettua il login al sito con l'username inserito, ritorna:
    // -1 se non è stato trovato l'account associato
    // L'oggetto $user (UserModel) se l'account è stato trovato
    private function SaveTrip(){

        Logger::Write("Processing SaveTrip request for user", $GLOBALS["CorrelationID"]);
        $query = "INSERT INTO trips
            FROM users 
            WHERE Username = '$this->username'";

        $res = self::ExecuteQuery($query);

        while($row = $res->fetch_assoc()){
            $fetchedPassword = $row["Password"];
            $validRow = $row;
        }

        if(password_verify($this->password, $fetchedPassword)){
            $user = new Models\UserModel($validRow["Username"], $validRow["Id"], $validRow["Nome"]);
            echo json_encode($user);
            Logger::Write("User $this->username succesfully logged in.", $GLOBALS["CorrelationID"]);
        }
        else{
            echo json_encode(-1);
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "saveTrip":
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
$Auth = new TripService();
$Auth->Init();

?>