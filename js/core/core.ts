class Startup {
    public static main(): number {
        console.log('Hello World');
        return 0;
        }
    }
    Startup.main();
    
class Login {
    public static Login() : void {
        $.ajax({
            url: "lib/core.php",
            data: {},
            success: this.LoginSuccess,
            error: this.LoginFailure
        });
    }

    private static LoginSuccess() : void {

    }

    private static LoginFailure() : void {

    }
}

