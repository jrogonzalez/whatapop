
angular
    .module("whatapop")
    .component("myProducts", {

        // Con 'template' / 'templateUrl' establecemos la vista del componente.
        templateUrl: "views/my-products.html",

        // En 'controller' establecemos la lógica del componente.
        controller: function(ServiceProducts, UserService) {

            var self = this;

            // Filtro para buscar recetas por nombre.
            self.filtroRecetas = { name: "" };

            // Podemos engancharnos al hook '$onInit', que se
            // dispara cuando el componente se inicia.
            self.$onInit = function() {

                // Como 'obtenerRecetas()' retorna una promesa, tengo que
                // pasar un manejador a su funcion 'then()'.
                ServiceProducts.showProducts().then(function(respuesta) {

                    self.productList = respuesta.data.results;
                    self.total = respuesta.data.total;

                });
            };

            // Guardamos la receta.
            self.searchProducts = function(datos) {

            //console.log("filtros pantalla buscar productos", datos);
                ServiceProducts
                    .searchProducts(datos)
                    .then(function(resultado) {

                        //console.log("resultado: ", resultado.data);

                        //Debemos buscar al seller para saber sus coordenadas
                        UserService.searchUser(resultado.data.products[0].seller.id).then(function (result) {

                            var coords = {"latitude": result.data.result.latitude, "longitude": result.data.result.longitude};

                            ServiceProducts.obtenerGeolocalizacion(coords);
                        });



                        self.productList = resultado.data.products;
                        self.total = resultado.data.total;

                        // $router tiene los datos relacionados con la ruta
                        // que se está navegando. Puedo ejecutar su función
                        // 'navigate()' para hacer una redirección.
                        //self.$router.navigate(["MisRecetas"]);
                    });
            };

            // Guardamos la receta.
            self.defaultSearch = function() {

                // Como 'obtenerRecetas()' retorna una promesa, tengo que
                // pasar un manejador a su funcion 'then()'.
                ServiceProducts.showProducts().then(function(respuesta) {

                    self.productList = respuesta.data.results;

                });
            };

            // Obtenemos la ruta absoluta de la imagen.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;
        }
    });