<?php

include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
include 'TokenGenerator.php';
use TokenGenerator;
use Models;

$GLOBALS["CorrelationID"] = uniqid("corrId_", true);

class PeopleDetailService {
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

    private function RetrieveDetails() {
        try {
            $userId = $_POST["userId"];
            Logger::Write("Retrieving details for user: $userId", $GLOBALS["CorrelationID"]);
            $query = "SELECT u.Username as username, 
                        u.Nome as name, 
                        u.Cognome as surname,
                        u.Email as email,
                        ud.age,
                        ud.description,
                        ud.photo_folder,
                        c.id as car_id,
                        c.make,
                        c.model,
                        c.year
                    FROM user AS u
                    INNER JOIN user_detail AS ud
                    ON u.id = ud.user_id
                    INNER JOIN car_detail as cd
                    ON u.id = cd.user_id
                    INNER JOIN car as c
                    ON cd.car_id = c.id 
                    WHERE u.id = $userId";
            $res = self::ExecuteQuery($query);
            if($res) {
                $row = $res->fetch_assoc();
                Logger::Write("Retrieved details for user: " . $row["username"], $GLOBALS["CorrelationID"]);
                return json_encode($row);
            }
            else {
                Logger::Write("Details for user: $userId not found.", $GLOBALS["CorrelationID"]);
                return json_encode("");
            }
        }
        catch(Throwable $ex) {
            Logger::Write("Error occured in RetrieveDetails -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $res = $false;
        }
    }

    private function InsertDetails() {
        TokenGenerator::ValidateToken();
        try {
            $details = json_decode($_POST["userDetails"]);
            Logger::Write("Updating details for user: $details->userId", $GLOBALS["CorrelationID"]);  
            $res = false;
            $this->dbContext->StartTransaction();
            $query = 
                "UPDATE user
                SET Nome = '$details->name', 
                Cognome = '$details->surname'
                WHERE Id = $details->userId";
            $res = self::ExecuteQuery($query);
            if(!$res) {
                throw new Exception("Error while updating user");
            }

            $query = 
                "UPDATE user_detail
                SET age = '$details->age',
                description = '$details->description'
                WHERE user_id = $details->userId";
            $res = self::ExecuteQuery($query);
            if(!$res) {
                throw new Exception("Error while updating user details");
            }
            if($details->car != null) {
                $query = 
                    "UPDATE car_detail
                    SET car_id = ".$details->car->id."
                    WHERE user_id = $details->userId";
                $res = self::ExecuteQuery($query);
                if(!$res) {
                    throw new Exception("Error while updating user car details");
                } 
            }
            $res = $this->dbContext->CommitTransaction();
        }
        catch(Throwable $ex) {
            Logger::Write("Error occured in InsertDetails -> $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            $this->dbContext->RollBack();
            $res = $false;
        }
        return $res;
    }

    private function InsertProfilePicture() {              
        try {
            $file = $_FILES["profilePicture"];
            foreach($file as $key=>$value){
                Logger::Write("File1: $key => $value", $GLOBALS["CorrelationID"]);
            }
            return move_uploaded_file($file["tmp_name"], $file["name"]);
        }
        catch(Throwable $ex) {
            Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($ex->getMessage()));
        }
    }

    // Switcha l'operazione richiesta lato client
    function Init() {
        $this->dbContext = new DBConnection();
        switch(isset($_POST["action"]) ? $_POST["action"] : ""){
            case "insertDetails":
                $res = self::InsertDetails();
            break;
            case "insertProfilePicture":
                $res = self::InsertProfilePicture();
            break;
            case "retrieveDetails":
                $res = self::RetrieveDetails();
            break;
            default: 
                $res = $_POST;
                break;
        }
        exit(json_encode($res));
    }
}


// Inizializza la classe per restituire i risultati e richiama il metodo d'ingresso
try {
    Logger::Write("Reached PeopleDetailService API", $GLOBALS["CorrelationID"]);
    $PeopleDetailService = new PeopleDetailService();
    $PeopleDetailService->Init();
}
catch(Throwable $ex) {
    Logger::Write("Error occured: $ex", $GLOBALS["CorrelationID"]);
    http_response_code(500);
    exit(json_encode($ex->getMessage()));
}
?>