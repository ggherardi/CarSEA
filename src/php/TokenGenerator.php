<?php
include 'Logger.php';
use Logger;
// Classe che genera e legge il token per il JWT
class TokenGenerator{
    private static $Initialized = false;

    /* Configurazioni per i token, da spostare */
    private static $EncryptMethod = "AES-256-CBC";
    private static $SecretKey = "CarSEAKey";
    private static $SecretIv = "CarSEAivKey";
    private static $Key;
    private static $Iv;

    // Metodo di inizializzazione della classe Logger, per consentire la staticità della stessa
    private static function initialize() {
        if(self::$Initialized){
            return;
        }
        self::$Key = hash("sha256", self::$SecretKey);
        self::$Iv = substr(hash("sha256", self::$SecretIv), 0, 16);
        self::$Initialized = true;
    }

    public function EncryptToken($data) {
        self::initialize();
        $output = openssl_encrypt($data, self::$EncryptMethod, self::$Key, false, self::$Iv);
        return $output;
    }

    public function DecryptToken($data) {
        self::initialize();
        $output = openssl_decrypt($data, self::$EncryptMethod, self::$Key, false, self::$Iv);
        return $output;
    }
}
Logger::Write("Pippo");
?>