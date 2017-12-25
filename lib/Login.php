<?php
include "Common.php";

$username = isset($_POST["username"]) ? $_POST["username"] : "isnotset";
$password = isset($_POST["password"]) ? $_POST["password"] : "isnotset";
$encodedPassword = password_hash($password, PASSWORD_DEFAULT);
$dbContext = new DBConnection();
$dbContext->Query = "SELECT *
                    FROM users 
                    WHERE Username = '$username'";
$res = $dbContext->ExecuteQuery();
echo $res->num_rows;
$rows = $res->fetch_all();
foreach($rows as $row){
    echo $row[1];
}
echo $res->fetch_row();
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


