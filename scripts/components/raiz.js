
angular
    .module("whatapop")
    .component("raiz", {
        $routeConfig: [{
            name: "MyProducts",
            path: "/my-products",
            component: "myProducts",
            useAsDefault: true
        }, {
            name: "NewProduct",
            path: "/new-product",
            component: "newProduct"
        },
            {
             name: "DetailProduct",
             path: "/producto/id",
             component: "detailProduct"
        }],
        templateUrl: "views/raiz.html"
    });