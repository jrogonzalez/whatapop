
angular
    .module("whatapop")
    .service("MapService", function($http, Properties, $haversine, UserService) {

        this.initMap = function() {
            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.397, lng: 150.644},
                scrollwheel: false,
                zoom: 8
            });
        }
    });