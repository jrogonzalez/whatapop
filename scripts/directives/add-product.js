
angular
    .module("whatapop")
    .directive("addProduct", function() {

        return {
            restrict: "EA",
            templateUrl: "views/add-detail-product.html",
            scope: {
                clickForSave: "&"
            },

            link: function(scope) {

                // Create a new object Product
                scope.product = {
                    id: "",
                    name: "",
                    description: "",
                    category: "",
                    seller: "",
                    published_date: "",
                    state: "",
                    price: "",
                    photo: ""
                };

                // Managed the button
                scope.saveData = function() {

                    // Notificamos al scope padre.
                    scope.clickForSave({ product: scope.product });
                };
            }
        };
    });