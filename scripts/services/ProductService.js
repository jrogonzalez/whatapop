
angular
    .module("whatapop")
    .service("ServiceProducts", function($http, Properties, $haversine, UserService, $q) {

        // Toda funcionalidad que quieras exponer hacia
        // afuera, tiene que estar publicada en this.
        
        // Obtenemos la colección de productos.
        this.showProducts = function() {
            return $http.get(Properties.urlServidor + Properties.endpointProduct + "/showProducts");
        };

        // Obtenemos el producto que queremos buscar.
        this.findProduct = function(idProduct) {

            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/" + idProduct);;
        };

        // Obtenemos el producto que queremos buscar.
        this.searchProducts = function(datos) {
            console.log("buscar Productos LOG", datos);
            let name = datos.name;
            let minprice = datos.minprice;
            let maxprice = datos.maxprice;
            let dist = datos.dist;
            let cat1 = datos.cat1;
            let cat2 = datos.cat2;
            let cat3 = datos.cat3;
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

            if (typeof dist !== 'undefined' && dist !== "") {
                criteria = criteria + "dist=" + dist + "&";
            }

            console.log("criteria", criteria);
            

            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/searchProduct" + criteria );
        };

        // Guardamos la receta.
        this.guardarReceta = function(receta, imagen) {

            var promesa;

            // Si la imagen viene dada.
            if (imagen) {

                // Montamos un 'FormData' con la imagen.
                var datos = new FormData();
                datos.append("img", imagen);

                // Configuramos el 'Content-Type' de la petición.
                // Tenemos que indicarlo como 'undefined' para que
                // AngularJS infiera el tipo de la petición.
                var configuracion = {
                    "headers": {
                        "Content-Type": undefined
                    }
                };

                // Subimos la imagen al servidor.
                promesa = $http
                    .post(
                        Properties.urlServidor + Properties.endpointImages ,
                        datos,
                        configuracion
                    )
                    .then(function(respuesta) {

                        // En la propiedad 'path' me viene dada
                        // la ruta relativa de la imagen subida.
                        var ruta = respuesta.data.path;

                        // Establecemos la ruta de la imagen en
                        // el objeto receta antes de guardarla.
                        receta.rutaImagen = ruta;

                        return $http.post(Properties.urlServidor + Properties.endpointProduct +  receta);
                    });
            }

            // En caso de no haber indicado una imagen.
            else {
                promesa = $http.post(Properties.urlServidor + Properties.endpointProduct +  receta);
            }

            return promesa;
        };

        // Montamos la ruta absoluta a la imagen indicada.
        this.obtenerRutaImagenAbsoluta = function(rutaRelativa) {

            return rutaRelativa
                ? (Properties.urlServidor  + "/" + rutaRelativa)
                : undefined;
        };

        this.obtenerGeolocalizacion = function(userId) {

            var deferred = $q.defer();

            //Debemos buscar al seller para saber sus coordenadas
            UserService.searchUser(userId).then(function (result) {

                var coordenadas = {"latitude": result.data.result.latitude, "longitude": result.data.result.longitude};
                

                // Preguntamos si la API está soportada.
                if (navigator.geolocation) {

                    // Solicitamos la posición.
                    navigator.geolocation.getCurrentPosition(

                        // En caso de obtener la posición.
                        function(datos) {

                            var distance = $haversine.distance(coordenadas, datos.coords);
                            console.log("distance: ", distance);


                            deferred.resolve({ "distance": distance });

                            //return {"latitude": datos.coords.latitude, "longitude": datos.coords.longitude};
                        },

                        // El usuario no autorizó la petición de posición.
                        function() {
                            alert("¡El usuario no autorizó!");
                        }
                    );
                }
                // En caso de no estar soportada.
                else {
                    alert("El navegador no soporta geolocalización");
                }

            });

            return deferred.promise;
        };

        
    });