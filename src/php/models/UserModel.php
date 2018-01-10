<?php 
namespace Models {
    class UserModel {
        public $Name;
        public $Username;
        public $UserID;
    
        public function __construct($username, $userID, $name){
            $this->Username = $username;
            $this->UserID = $userID;
            $this->Name = $name;
        }
    }
}
?>