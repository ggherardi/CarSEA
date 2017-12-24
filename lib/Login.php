<?php
$name = isset($_POST["name"]) ? $_POST["name"] : "isnotset";
echo $name;
return;


function test() {
   $pass = "Pippopaperino123";
   $var1 = 1;
   $var2 = 2; 
   $var3 = $var1 + $var2;
   $encodedPass = password_hash($pass, PASSWORD_DEFAULT);
   print_r(encodedPass);
   print_r(" ");
   if(password_verify("Pippopaperino123", $encodedPass) == 1)
       print_r("Password esatta!");
   else
       print_r("Password sbagliata!");
}

// test();
// phpinfo();
?>


