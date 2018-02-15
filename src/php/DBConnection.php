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

    private function getConnection() : mysqli {
        return $this->Connection;
    }

    private function EstablishConnection(){
        Logger::Write("Establishing connection to DB", $GLOBALS["CorrelationID"]);
         $this->Connection = mysqli_connect($this->ServerName, $this->UserName, $this->Password, $this->DB);
        if(mysqli_connect_errno()){
            print_r("Error -> " . mysqli_connect_error());
        }
    }

    function ExecuteQuery($query = "") {
        Logger::Write("Executing query", $GLOBALS["CorrelationID"]);
        $msRes = $this->getConnection()->query($query);
        // echo "Rows number -> " . $msRes->num_rows;
        return $msRes;
    }
}
?>