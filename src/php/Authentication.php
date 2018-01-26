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
    private $dbContext;

    function __construct() {
        self::retrievePostVariables();
    }

    // Recupera le variabili POST passate dalla chiamata lato client
    private function retrievePostVariables() {
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
    private function Login(){
        // $encodedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = 
            "SELECT *
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
        }
        else{
            echo json_encode(-1);
        }
    }

    // Effettua l'iscrizione al sito, ritorna responseCode:
    // -1 se l'email e lo username esistono già nel DB
    // -2 se l'username esiste già nel DB
    // -3 se l'email esiste già nel DB
    // -4 per errori incontrati durante l'inserimento
    // 0 se l'iscrizione è andata a buon fine
    private function SignUp(){      
        $responseCode = self::CheckIfUserAlreadyExists();

        if($responseCode != 0) {
            echo json_encode($responseCode);
            return;
        }

        $successInsert = self::InsertNewUser();
        if(!$successInsert){
            $responseCode = -4;
        }

        echo json_encode($responseCode);
    }

    private function CheckIfUserAlreadyExists() {
        $errorCode = 0;

        $query = 
            "SELECT *
            FROM users
            WHERE Username = '$this->username'
            OR Email = '$this->email'";

        $res = self::ExecuteQuery($query);

        while($row = $res->fetch_assoc()){
            if($row["Username"] == $this->username && $row["Email"] == $this->email) {
                $errorCode = -1;
            }
            else if($row["Username"] == $this->username) {
                $errorCode = -2;
            }
            else {
                $errorCode = -3;
            }
        }
        return $errorCode;
    }

    private function InsertNewUser() {
        $encodedPassword = password_hash($this->password, PASSWORD_DEFAULT);

        $query = 
            "INSERT INTO users
            VALUES (DEFAULT, '$this->username', '$this->email', '$encodedPassword', '$this->name', '$this->surname')";

        return self::ExecuteQuery($query);
    }

    // Switcha l'operazione richiesta lato client
    function Init(){
        switch($_POST["action"]){
            case "signup":
                self::SignUp();
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

// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
$Auth = new Authentication();
$Auth->Init();

?>