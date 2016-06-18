
angular
    .module("whatapop")
    .component("newProduct", {

        // Con 'bindings' establecemos la interfaz de comunicación
        // del componente. Solicitamos el enlace de '$router', que
        // lo hace automáticamente AngularJS en el ng-outlet.
        bindings: {
            $router: "<"
        },
        templateUrl: "views/new-detail-product.html",
        controller: function(ServiceProducts) {

            // Guardamos la referencia al componente.
            var self = this;

            // Definimos una variable para el documento de la
            // imagen de la receta que se ha seleccionado.
            var imagenReceta;

            // Guardamos la receta.
            self.guardarReceta = function(receta) {

                ServiceProducts
                    .guardarReceta(receta, imagenReceta)
                    .then(function() {

                        // $router tiene los datos relacionados con la ruta
                        // que se está navegando. Puedo ejecutar su función
                        // 'navigate()' para hacer una redirección.
                        self.$router.navigate(["MisRecetas"]);
                    });
            };

            // Guardamos la receta.
            self.buscarProductos = function(datos) {

                console.log(datos);
                ServiceProducts
                    .buscarProductos(datos, imagenReceta)
                    .then(function() {

                        // $router tiene los datos relacionados con la ruta
                        // que se está navegando. Puedo ejecutar su función
                        // 'navigate()' para hacer una redirección.
                        //self.$router.navigate(["MisRecetas"]);
                    });
            };

            // Guardamos el documento de imagen indicado para
            // almacenarlo en el servidor junto con la receta.
            self.seleccionarImagen = function(imagen) {
                imagenReceta = imagen;
            };

            // Eliminamos el documento de imagen que
            // hubiese seleccionado previamente.
            self.deseleccionarImagen = function() {
                imagenReceta = undefined;
            };
        }
    });