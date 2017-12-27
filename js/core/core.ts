jQuery("document").ready(function(){
    $.ajax({
        url: "lib/Session.php",
        data: {},
        method: "post",
        success: function(res){
            console.log(res)
        }
    });
});

class Authentication {
    public static Login() : void {
        var username =  jQuery("#login_username").val() as string;
        var password : string = jQuery("#login_password").val() as string;
        $.ajax({
            url: "lib/Authentication.php",
            data: {action: "login", username: username, password: password},
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    }

    public static Logout() : void {
        $.ajax({
            url: "lib/Authentication.php",
            data: {action: "logout"},
            method: "post",
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    }

    private static LoginSuccess(data : any) : void {
        console.log(data);
    }

    private static LoginFailure(data: any) : void {
        console.log(data.statusText);
    }
}

