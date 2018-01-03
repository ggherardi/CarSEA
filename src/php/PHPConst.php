<?php 
namespace PHPConst {
    class Session {
        private static $initialized = false;
        function __construct(){    
            if(self::$initialized)
                return;
            self::$initialized = true;
        }
    
        const CONST_SESSION_USERNAME = "session_username";
    }
}
?>