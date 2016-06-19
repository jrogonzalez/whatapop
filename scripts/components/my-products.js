
angular
    .module("whatapop")
    .component("myProducts", {

        // With 'template' / 'templateUrl' establish the component view
        templateUrl: "views/my-products.html",

        // This 'controller' estabish the logic for the component.
        controller: function(ServiceProducts, UserService, $haversine, $filter ) {

            var self = this;

            self.localizacion = {
                latitude: "",
                longitude: ""
            }

            // This is the initial hook '$onInit', that stats
            // when the component is initialized.
            self.$onInit = function() {

                self.finish = 0;

                //  'showProducts()' return a Promise and I have to
                // pass a manager to the function 'then()'.
                ServiceProducts.showProducts().then(function(respuesta) {

                    self.productList = respuesta.data.results;
                    self.total = respuesta.data.total;
                    self.finish = 1;

                });
            };

            // Invoque for a search.
            self.searchProducts = function(datos) {
                
                let distance = datos.dist || 100; 

                self.productList = [];
                self.total = 0;
                self.finish = 0;


                ServiceProducts.obtenerGeolocalizacion().then(function (resp) {
                    self.localizacion.latitude = resp.latitude;
                    self.localizacion.longitude = resp.longitude;

                    UserService.showUsers().then(function (response) {

                        var nearSellers = response.data.result.reduce(function(selected, seller) {

                            var sellerLocalization = {
                                "latitude": seller.latitude,
                                "longitude": seller.longitude
                            }

                            var distanceKm = parseInt($haversine.distance(sellerLocalization, self.localizacion)/1000, 10);

                            if (distanceKm < distance) {
                                selected.push(seller.id);
                            }
                            return selected;
                        }, []);



                        //console.log("filtros pantalla buscar productos", datos);
                        ServiceProducts
                            .searchProducts(datos)
                            .then(function(resultado) {

                                var products = resultado.data.products;

                                // Filter by sooner sellers.
                                var nearProducts = $filter("filter")(products, function(producto) {
                                    return nearSellers.indexOf(producto.seller.id) > -1;
                                });

                                self.productList = nearProducts;
                                self.total = nearProducts.length;
                                self.finish = 1;


                            });
                    });
                });
            };

            // Reset for default search.
            self.defaultSearch = function() {

                self.finish = 0;

                ServiceProducts.showProducts().then(function(respuesta) {

                    self.productList = respuesta.data.results;
                    self.total = respuesta.data.total;
                    self.finish = 1;

                });
            };

            // Obtain the absolute image route.
            self.obtenerRutaImagen = ServiceProducts.obtenerRutaImagenAbsoluta;

        }
    });