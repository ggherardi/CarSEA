<?php
class DBConnection {
    private $Connection;

    public $Query;
    public $ServerName;
    public $UserName;
    public $Password;
    public $DB;

    function getConnection() : mysqli{
        return $this->Connection;
    }

    function __construct($servername = "127.0.0.1", $username = "root", $password = "root", $db = "carsea"){
        $this->ServerName = $servername;
        $this->UserName = $username;
        $this->Password = $password;
        $this->DB = $db;
        $this->EstablishConnection();
    }

    function EstablishConnection(){
         $this->Connection = mysqli_connect($this->ServerName, $this->UserName, $this->Password, $this->DB);
        if(mysqli_connect_errno()){
            print_r("Error -> " . mysqli_connect_error);
        }
    }

    function ExecuteQuery() : mysqli_result {
        $msRes = $this->getConnection()->query($this->Query);
        // echo "Rows number -> " . $msRes->num_rows;
        return $msRes;
    }
}
// $DBContext = new DBConnection();
// $DBContext->ExecuteQuery();
?>
