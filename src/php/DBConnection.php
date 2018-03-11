<?php
include 'Logger.php';
use Logger;

class DBConnection {
    private $Connection;

    public $ServerName;
    public $UserName;
    public $Password;
    public $DB;

    function __construct($servername = "127.0.0.1", $username = "root", $password = "root", $db = "carsea"){
        $this->ServerName = $servername;
        $this->UserName = $username;
        $this->Password = $password;
        $this->DB = $db;
        $this->EstablishConnection();
    }

    private function getConnection(): mysqli {
        return $this->Connection;
    }

    private function EstablishConnection() {
        try {
            Logger::Write("Establishing connection to DB", $GLOBALS["CorrelationID"]);
            // $this->Connection = mysqli_connect($this->ServerName, $this->UserName, $this->Password, $this->DB);
            $this->Connection = new mysqli($this->ServerName, $this->UserName, $this->Password, $this->DB);
            if($this->Connection->connect_errno){
                Logger::Write(("Error while establishing a connection with the DB -> " . ($this->Connection->connect_error)), $GLOBALS["CorrelationID"]);
                exit(json_encode($this->Connection->connect_errno));
            }
        }
        catch (Throwable $ex) {
            $exMessage = $ex->getMessage();
            Logger::Write("Error while establishing a connection with the DB -> $exMessage", $GLOBALS["CorrelationID"]);
            http_response_code(500);
            exit(json_encode($exMessage));
        }
    }

    function StartTransaction() {
        Logger::Write("Starting transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->begin_transaction();
    }

    function RollBack() {
        Logger::Write("RollBacking current transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->rollback();
    }

    function CommitTransaction() {
        Logger::Write("Committing transaction", $GLOBALS["CorrelationID"]);
        $this->getConnection()->commit();
    }

    function ExecuteQuery($query = "") {
        try {
            Logger::Write("Executing query", $GLOBALS["CorrelationID"]);
            $msRes = $this->getConnection()->query($query);
            // echo "Rows number -> " . $msRes->num_rows;
            return $msRes;
        } 
        catch (Throwable $ex) {
            $exMessage = $ex->getMessage();
            Logger::Write("Errore while executing query -> $exMessage", $GLOBALS["CorrelationID"]);
        }
    }

    function GetLastID() {
        return $this->Connection->insert_id;
    }
}
?>