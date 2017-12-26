<?php

include "Common.php";

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

// return;


// function test() {
//    $pass = "Pippopaperino123";
//    $var1 = 1;
//    $var2 = 2; 
//    $var3 = $var1 + $var2;
//    $encodedPass = password_hash($pass, PASSWORD_DEFAULT);
//    print_r(encodedPass);
//    print_r(" ");
//    if(password_verify("Pippopaperino123", $encodedPass) == 1)
//        print_r("Password esatta!");
//    else
//        print_r("Password sbagliata!");
// }
?>


