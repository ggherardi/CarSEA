<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
use Models;

class Authentication {
    private $name;
    private $surname;
    private $username;
    private $email;
    private $password;
    
    function __construct() {
        $this->retrievePostVariables();
    }

    // Recupera le variabili POST passate dalla chiamata lato client
    private function retrievePostVariables() {
        $this->name = isset($_POST["name"]) ? $_POST["name"] : "";
        $this->surname = isset($_POST["surname"]) ? $_POST["surname"] : "";
        $this->username = isset($_POST["username"]) ? $_POST["username"] : "";
        $this->email = isset($_POST["email"]) ? $_POST["email"] : "";
        $this->password = isset($_POST["password"]) ? $_POST["password"] : "";
    }

    // Switch per l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "signup":
                $this->SignUp();
            break;
            case "login":
                $this->Login();
                break;
            default: 
                echo json_encode($_POST);
                break;
        }
    }
    
    // Effettua il login al sito con l'username inserito, ritorna:
    // -1 se non è stato trovato l'account associato
    // L'oggetto $user se l'account è stato trovato
    function Login(){
        // $encodedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "SELECT *
                FROM users 
                WHERE Username = '$this->username'";
        $res = $this->GetData($query);

        while($row = $res->fetch_assoc()){
            $fetchedPassword = $row["Password"];
            $validRow = $row;
        }

        if(password_verify($this->password, $fetchedPassword)){
            $user = new Models\UserModel($validRow["Username"], $validRow["Id"], $validRow["Nome"]);
            echo json_encode($user);
        }
        else{
            echo json_encode(-1);
        }
    }
    
    // Effettua l'iscrizione al sito, ritorna:
    // -1 se l'username esiste già nel DB
    // -2 se l'email esiste già nel DB
    // -3 se l'email e lo username esistono già nel DB
    // 1 se l'iscrizione è andata a buon fine
    function SignUp(){      
        $query = "SELECT *
                FROM users
                WHERE Username = '$this->username'
                OR Email = '$this->email'";

        $res = $this->GetData($query);

        while($row = $res->fetch_assoc()){
            if($row["Username"] == $this->username && $row["Email"] == $this->email) {
                echo json_encode("Email e Username!");
                return;
            }
            if($row["Username"] == $this->username) {
                echo json_encode("Username!");
            }
            else {
                echo json_encode("Email!"); 
            }
            return;
        }

        echo json_encode("Inizio inserimento");
        
    }
    
    // Metodo per recuperare le row. Utilizza la classe ausiliare DBConnection
    function GetData($query = "") {
        $dbContext = new DBConnection();
        $dbContext->Query = $query;
        return $dbContext->ExecuteQuery();
    }
}

// Inizializza la classe per restituire i risultati
$Auth = new Authentication();
$Auth->Init();

?>