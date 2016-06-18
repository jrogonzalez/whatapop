
angular
    .module("whatapop")
    .filter("EurPrice", function() {

        // Add the incoming price eur symbol
        return function(price) {
            var eurPrice = price + "€";
            return eurPrice;
        };
    });