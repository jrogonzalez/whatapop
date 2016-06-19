
angular
    .module("whatapop")
    .service("ServiceProducts", function($http, Properties, $haversine, UserService, $q) {

        // show all products
        this.showProducts = function() {
            return $http.get(Properties.urlServidor + Properties.endpointProduct + "/showProducts");
        };

        // search a producto by id
        this.findProduct = function(idProduct) {

            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/" + idProduct);;
        };

        // Search for a criteria introduced for the user
        this.searchProducts = function(datos) {
            console.log("buscar Productos LOG", datos);
            let name = datos.name;
            let minprice = datos.minprice;
            let maxprice = datos.maxprice;
            let cat1 = datos.cat1;
            let cat2 = datos.cat2;
            let cat3 = datos.cat3;
            let date = datos.date;
            let state = datos.state;
            let criteria = "?";

            if (typeof name !== 'undefined' && name !== "") {
                criteria = criteria + "name=" + name + "&";
            }

            if (typeof cat1 !== 'undefined' && cat1 !== "") {
                criteria = criteria + "cat1=" + cat1 + "&";
            }
            if (typeof cat2 !== 'undefined' && cat2 !== "") {
                criteria = criteria + "cat2=" + cat2 + "&";
            }
            if (typeof cat3 !== 'undefined' && cat3 !== "") {
                criteria = criteria + "cat3=" + cat3 + "&";
            }

            if (typeof minprice !== 'undefined' && minprice !== "") {
                criteria = criteria + "minprice=" + minprice + "&";
            }
            if (typeof maxprice !== 'undefined' && maxprice !== "") {
                criteria = criteria + "maxprice=" + maxprice + "&";
            }

            if (typeof date !== 'undefined' && date !== "") {
                criteria = criteria + "date=" + date + "&";
            }

            if (typeof state !== 'undefined' && state !== "") {
                criteria = criteria + "state=" + state + "&";
            }

            console.log("criteria", criteria);
            

            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/searchProduct" + criteria );
        };

        // Save a new Product
        this.addProduct = function(receta, imagen) {


        };

        //
        this.obtenerRutaImagenAbsoluta = function(rutaRelativa) {

            return rutaRelativa
                ? (Properties.urlServidor  + "/" + rutaRelativa)
                : undefined;
        };

        this.obtenerGeolocalizacion = function() {

            var deferred = $q.defer();

            // ask wether the API is supported
            if (navigator.geolocation) {

                // Solicitamos la posición.
                navigator.geolocation.getCurrentPosition(

                    // Obtain th position.
                    function(datos) {

                        deferred.resolve({"latitude": datos.coords.latitude, "longitude": datos.coords.longitude});
                    },

                    // User doesnt authorize the petition.
                    function() {
                        alert("¡El usuario no autorizó!");
                    }
                );
            }
            // Geolocalize is not supported.
            else {
                alert("El navegador no soporta geolocalización");
            }

            return deferred.promise;
        };




    });