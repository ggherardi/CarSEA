<?php 
    class Trip {
        public $tripId;
        public $waypointCityName;

        function __construct($tripId, $waypointCityName) {
            $this->tripId = $tripId;
            $this->waypointCityName = $waypointCityName;
        }
    }
?>