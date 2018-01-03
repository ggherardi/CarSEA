<?php
include 'PHPConst.php';
include 'UserModel.php';
include 'DBConnection.php';

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
        $user = new Models\UserModel($validRow["Username"], $validRow["Id"]);

        print_r(json_encode($user->getLoginName()));
    }
    else{
        print_r(json_encode("ATTENZIONE! Password sbagliata!"));
    }
    session_write_close();
}

function Logout(){
    session_start();
    print_r("\nTest sessione: " . $_SESSION[PHPConst\Session::CONST_SESSION_USERNAME]);
    print_r("\n\$_SESSION: " . json_encode($_SESSION));
    // session_unset();
    // session_destroy();
}

?>


