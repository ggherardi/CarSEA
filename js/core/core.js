"use strict";
var Startup = /** @class */ (function () {
    function Startup() {
    }
    Startup.main = function () {
        console.log('Startup');
        return 0;
    };
    return Startup;
}());
Startup.main();
var Login = /** @class */ (function () {
    function Login() {
    }
    Login.Login = function () {
        $.ajax({
            url: "lib/Login.php",
            data: { name: "Paperino" },
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    };
    Login.LoginSuccess = function (data) {
        console.log(data);
    };
    Login.LoginFailure = function (data) {
        console.log(data.statusText);
    };
    return Login;
}());
