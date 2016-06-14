
angular
    .module("whatapop")
    .service("ServiceProducts", function($http, Properties) {

        // Toda funcionalidad que quieras exponer hacia
        // afuera, tiene que estar publicada en this.
        
        // Obtenemos la colección de productos.
        this.obtenerRecetas = function() {
            return $http.get(Properties.urlServidor + Properties.endpointProduct + "/showProducts");
        };

        // Obtenemos el producto que queremos buscar.
        this.obtenerReceta = function(idReceta) {
            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/" + idReceta);
        };

        // Obtenemos el producto que queremos buscar.
        this.buscarProductos = function(datos) {
            console.log("buscar Productos LOG", datos);
            let name = datos.name;
            let minprice = datos.name;
            let maxprice = datos.name;
            let dist = datos.name;
            let cat1 = datos.name;
            let cat2 = datos.name;
            let cat3 = datos.name;
            let criteria = "";

            if (typeof name !== 'undefined') {
                criteria = criteria + "name=" + name;
            }
            

            return $http.get(Properties.urlServidor + Properties.endpointProduct +  "/searchProduct?" + criteria );
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

        this.obtenerGeolocaliacon = function() {

            // Preguntamos si la API está soportada.
            if (navigator.geolocation) {

                // Solicitamos la posición.
                navigator.geolocation.getCurrentPosition(

                    // En caso de obtener la posición.
                    function(datos) {

                        return {"latitude": datos.coords.latitude, "longitude": datos.coords.longitude};
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
        };

        
    });