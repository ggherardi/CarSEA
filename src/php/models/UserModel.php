<?php 
namespace Models {
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

    class UserModelDetail {
        public $Name;
        public $Surname;
        public $Email;
        public $Age;
        public $Description;
        public $PictureFolder;

        public function __construct(string $name, string $surname, string $email, $age = "", 
                                    $description = "", $pictureFolder = ""){
            $this->Name = $name;
            $this->Surname = $surname;
            $this->Email = $email;
            $this->Age = $age;
            $this->Description = $description;
            $this->PictureFolder = $pictureFolder;
        }
    }
}
?>