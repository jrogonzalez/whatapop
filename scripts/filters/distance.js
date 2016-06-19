
angular
    .module("whatapop")
    .filter("Distance", function() {

        // Add the incoming price eur symbol
        return function(distance) {
            var result = parseInt(distance/1000, 10) + " km";
            return result;
        };
    });