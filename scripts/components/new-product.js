
angular
    .module("whatapop")
    .component("newProduct", {
        
        bindings: {
            $router: "<"
        },
        templateUrl: "views/new-product.html",
        controller: function(ServiceProducts) {


        }
    });