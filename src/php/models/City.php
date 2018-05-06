<?php 
    class City {
        public $id;
        public $id_regione;
        public $id_provincia;
        public $value;
        public $latitudine;
        public $longitudine;

        public function __construct($id, $id_regione, $id_provincia, $value, $latitudine, $longitudine){
            $this->id = $id;
            $this->id_regione = $id_regione;
            $this->id_provincia = $id_provincia;
            $this->value = $value;
            $this->latitudine = $latitudine;
            $this->longitudine = $longitudine;
        }
    }
?>