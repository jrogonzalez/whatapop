angular
    .module("whatapop")
    .component("detailProduct", {

        // Con 'template' / 'templateUrl' establecemos la vista del componente.
        templateUrl: "views/detail-product.html",

        // En 'controller' establecemos la lógica del componente.
        controller: function(ServiceProducts, UserService,$sce) {

            var self = this;

            // Filtro para buscar recetas por nombre.
            self.filtroRecetas = { name: "" };

            // Podemos engancharnos al hook '$onInit', que se
            // dispara cuando el componente se inicia.
            self.$onInit = function() {

                self.$routerOnActivate = function (next) {
                    var id = next.params.id;
                    
                    // Como 'obtenerRecetas()' retorna una promesa, tengo que
                    // pasar un manejador a su funcion 'then()'.
                    ServiceProducts.findProduct(id).then(function (respuesta) {
                        
                        self.productList = respuesta.data.results;
                        console.log("data", respuesta.data.results);
                        //self.distance = ServiceProducts.obtenerGeolocalizacion(respuesta.data.results)

                    });
                };
            };

            self.textHtml = function (text) {
                return $sce.trustAsHtml(text);
            };

            // Obtenemos la ruta absoluta de la imagen.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;
        }
    });