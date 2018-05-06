<?php 
    class UserModel {
        public $Name;
        public $Username;
        public $UserID;
        public $Token;

        public function __construct(string $username, string $userID, string $name, string $token = ""){
            $this->Username = $username;
            $this->UserID = $userID;
            $this->Name = $name;
            $this->Token = $token;
        }
    }
?>