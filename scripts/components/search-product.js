        
angular
    .module("whatapop")
    .component("searchProduct", {
        bindings: {
            coleccion: "<"
        },
        templateUrl: "views/search-detail-product.html",
        controller: function(ServiceProducts) {
            
            var self = this;
            
            // Initialize default values
            self.$onInit = function() {
                
                // Objeto nuevo ingrediente.
                self.ingrediente = {
                    nombre: "",
                    cantidad: 1
                };

               
            };

            // Guardamos la receta.
            self.buscarProductos = function(datos) {
                ServiceProducts
                    .buscarProductos(datos, imagenReceta)
                    .then(function(resultado) {

                        self.coleccion = resultado;

                    });
            };
        }
    });