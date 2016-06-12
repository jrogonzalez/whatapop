
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

            // Obtenemos la ruta absoluta de la imagen.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;
        }
    });