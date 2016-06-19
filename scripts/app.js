
// Setter module.
angular.module("whatapop", [
    "ngComponentRouter",
    "dahr.ng-image-picker",
    "dahr.ng-haversine",
    "ngSanitize"
]);

// Configuramos el proveedor '$locationProvider'. Establish
// HTML5 navigation for working with the SPA.
angular.module("whatapop").config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});

// With the value '$routerRootComponent' indicate the root component.
angular.module("whatapop").value("$routerRootComponent","raiz");