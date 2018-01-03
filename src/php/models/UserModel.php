<?php 
namespace Models {
    class UserModel {
        public $LoginName;
        public $UserID;
    
        public function __construct($loginName, $userID){
            $this->LoginName = $loginName;
            $this->UserID = $userID;
            print_r("USEROBJ");
        }

        public function getLoginName() : string {
            return $this->LoginName;
        }
    }
}
?>