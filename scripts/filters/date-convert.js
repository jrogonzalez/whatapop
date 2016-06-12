
angular
    .module("whatapop")
    .filter("DateConvert", function() {

        // Covert the incoming number data into a date format
        return function(inputDate) {

            if(inputDate == null)
            {
                return "";
            }

            var dateConverted =  new Date(inputDate); //- Create a date object
            var n = dateConverted.toLocaleString();

            console.log(n);

            return n;

        };
    });