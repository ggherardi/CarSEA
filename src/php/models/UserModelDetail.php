<?php
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
?>