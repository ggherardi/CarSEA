<?php 
class Session{
    const CONST_SESSION_USERNAME = "session_username";

    function __construct(){
        session_start();
        echo("Username: " . $_SESSION[Session::CONST_SESSION_USERNAME]);
    }
}
$session = new Session();
?>