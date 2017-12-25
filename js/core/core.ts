class Startup {
    public static main(): number {
        console.log('Startup');
        return 0;
        }
    }
    Startup.main();
    
class Login {
    public static Login() : void {
        var username =  jQuery("#login_username").val() as string;
        var password : string = jQuery("#login_password").val() as string;
        $.ajax({
            url: "lib/Login.php",
            data: {username: username, password: password},
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

