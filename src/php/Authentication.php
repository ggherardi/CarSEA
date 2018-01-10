<?php
include 'PHPConst.php';
include 'DBConnection.php';
include 'models\Models.php';
use Models;

Init();

function Init(){
    switch($_POST["action"]){
        case "login":
            Login();
            break;
        case "logout":
            Logout();
            break;
        default: 
            echo json_encode($_POST);
            break;
    }
}

function Login(){
    $username = isset($_POST["username"]) ? $_POST["username"] : "";
    $password = isset($_POST["password"]) ? $_POST["password"] : "";
    // $encodedPassword = password_hash($password, PASSWORD_DEFAULT);

    $dbContext = new DBConnection();
    $dbContext->Query = "SELECT *
                        FROM users 
                        WHERE Username = '$username'";
    
    $res = $dbContext->ExecuteQuery();

    while($row = $res->fetch_assoc()){
        $fetchedPassword = $row["Password"];
        $validRow = $row;
    }
    if(password_verify($password, $fetchedPassword)){
        $user = new Models\UserModel($validRow["Username"], $validRow["Id"], $validRow["Nome"]);
        echo json_encode($user);
    }
    else{
        echo json_encode(-1);
    }
    session_write_close();
}
?>