
angular
    .module("whatapop")
    .component("myProducts", {

        // Con 'template' / 'templateUrl' establecemos la vista del componente.
        templateUrl: "views/my-products.html",

        // En 'controller' establecemos la lógica del componente.
        controller: function(ServiceProducts) {

            var self = this;

            // Filtro para buscar recetas por nombre.
            self.filtroRecetas = { name: "" };

            // Podemos engancharnos al hook '$onInit', que se
            // dispara cuando el componente se inicia.
            self.$onInit = function() {

                // Como 'obtenerRecetas()' retorna una promesa, tengo que
                // pasar un manejador a su funcion 'then()'.
                ServiceProducts.obtenerRecetas().then(function(respuesta) {

                    self.productList = respuesta.data.results;

                });
            };

            // Guardamos la receta.
            self.buscarProductos = function(datos) {

                console.log("log buscar productos");
                ServiceProducts
                    .buscarProductos(datos)
                    .then(function(resultado) {

                        console.log("resultado: ", resultado.data);

                        self.coleccion = resultado;

                        // $router tiene los datos relacionados con la ruta
                        // que se está navegando. Puedo ejecutar su función
                        // 'navigate()' para hacer una redirección.
                        //self.$router.navigate(["MisRecetas"]);
                    });
            };

            // Obtenemos la ruta absoluta de la imagen.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;
        }
    });