class Startup {
    public static main(): number {
        console.log('Startup');
        return 0;
        }
    }
    Startup.main();
    
class Login {
    public static Login() : void {
        $.ajax({
            url: "lib/Login.php",
            data: {name: "Paperino"},
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

