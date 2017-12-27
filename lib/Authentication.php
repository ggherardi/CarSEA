<?php
include "Common.php";

switch($_POST["action"]){
    case "login":
        Login();
        echo "Login";
        break;
    case "logout":
        Logout();
        echo "Logout";
        break;
    default: 
    break;
}
function Login(){
    $username = isset($_POST["username"]) ? $_POST["username"] : "";
    $password = isset($_POST["password"]) ? $_POST["password"] : "";
    $encodedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $dbContext = new DBConnection();
    $dbContext->Query = "SELECT *
                        FROM users 
                        WHERE Username = '$username'";
    
    $res = $dbContext->ExecuteQuery();
    echo "\nRows: " . $res->num_rows . "\n";
    while($row = $res->fetch_assoc()){
        $fetchedPassword = $row["Password"];
    }
    if(password_verify($password, $fetchedPassword)){
        echo "La password inserita è corretta!";
        $_SESSION[Session::CONST_SESSION_USERNAME] = $username;
    }
    else{
        echo "ATTENZIONE! Password sbagliata!";
    }
    session_write_close();
    print_r("\nTest sessione: " . $_SESSION[Session::CONST_SESSION_USERNAME]);
}

function Logout(){
    session_unset();
    session_destroy();
}
?>


