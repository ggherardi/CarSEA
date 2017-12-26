"use strict";
jQuery("document").ready(function () {
    $.ajax({
        url: "lib/Session.php",
        data: {},
        method: "post",
        success: function (res) {
            console.log(res);
        }
    });
});
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
        var username = jQuery("#login_username").val();
        var password = jQuery("#login_password").val();
        $.ajax({
            url: "lib/Login.php",
            data: { username: username, password: password },
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    };
    Login.Logout = function () {
        $.ajax({
            url: "lib/Login.php",
            data: {},
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
