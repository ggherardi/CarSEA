<?php 
namespace Models {
    class UserModel {
        public $Username;
        public $UserID;
    
        public function __construct($username, $userID){
            $this->Username = $username;
            $this->UserID = $userID;
        }
    }
}
?>