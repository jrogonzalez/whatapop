
angular
    .module("whatapop")
    .value("Properties", {
        urlServidor: "http://localhost:8000",
        endpointProduct: "/api/products",
        endpointUser: "/api/users",
        endpointCategory: "/api/categories",
        endpointImages: "/upload"
    });