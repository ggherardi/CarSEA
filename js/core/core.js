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
var Authentication = /** @class */ (function () {
    function Authentication() {
    }
    Authentication.Login = function () {
        var username = jQuery("#login_username").val();
        var password = jQuery("#login_password").val();
        $.ajax({
            url: "lib/Authentication.php",
            data: { action: "login", username: username, password: password },
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    };
    Authentication.Logout = function () {
        $.ajax({
            url: "lib/Authentication.php",
            data: { action: "logout" },
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    };
    Authentication.LoginSuccess = function (data) {
        console.log(data);
    };
    Authentication.LoginFailure = function (data) {
        console.log(data.statusText);
    };
    return Authentication;
}());
