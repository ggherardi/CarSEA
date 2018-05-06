<?php 
    class Car {
        public $id;
        public $year;
        public $make;
        public $model;

        public function __construct($id, $year, $make, $model){
            $this->id = $id;
            $this->year = $year;
            $this->make = $make;
            $this->model = $model;
        }
    }
?>