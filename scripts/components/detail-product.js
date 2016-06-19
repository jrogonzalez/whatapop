angular
    .module("whatapop")
    .component("detailProduct", {

        // With 'template' / 'templateUrl' establish the componente view.
        templateUrl: "views/detail-product.html",

        // establish the 'controller' logic.
        controller: function(ServiceProducts, UserService,$sce, $haversine) {

            var self = this;

            // Filtro para buscar recetas por nombre.
            self.filtroRecetas = { name: "" };

            self.localizacion = {
                latitude: "",
                longitude: ""
            }

            // Hook '$onInit'
            self.$onInit = function() {

                self.$routerOnActivate = function (next) {
                    var id = next.params.id;


                    ServiceProducts.obtenerGeolocalizacion().then(function (resp) {
                        console.log("COORDENADAS", resp);
                        self.localizacion.latitude = resp.latitude;
                        self.localizacion.longitude = resp.longitude;

                        ServiceProducts.findProduct(id).then(function (respuesta) {

                            UserService.searchUser(respuesta.data.results.seller.id).then(function (result) {

                                var coodSeller = {
                                    "latitude": result.data.result.latitude,
                                    "longitude": result.data.result.longitude
                                }

                                self.distance = $haversine.distance(coodSeller, self.localizacion);

                            });

                            self.productList = respuesta.data.results;
                        });
                    });
                };
            };

            self.textHtml = function (text) {
                return $sce.trustAsHtml(text);
            };

            // Obtain the absolute image route.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;
        }
    });