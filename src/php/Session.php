<?php 
include "PHPConst.php";

class Session{
    function __construct(){
        session_start();
        $c = json_encode("Username: " . $_SESSION[PHPConst\Session::CONST_SESSION_USERNAME]);
        echo $c;
    }
}
$session = new Session();
?>