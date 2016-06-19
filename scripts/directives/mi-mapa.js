
angular
    .module("whatapop")
    .directive("miMapa", function() {

        return {
            // Con 'restrict' indicamos cómo vamos a usar la directiva.
            // Con 'A' la usamos como atributo de un elemento HTML.
            // Con 'E' la usamos como elemento HTML.
            restrict: "EA",

            // Con 'template' o 'templateUrl' indicamos la jerarquía de
            // componentesque el navegador va a renderizar como vista
            // de la directiva.
            templateUrl: "views/map.html",

            // Con 'scope' definimos la interfaz de comunicación entre la
            // directiva y el scope padre (controlador / componentes).
            scope: {

                // Con '&' notificamos eventos al scope padre.
                buttonSearchSelected: "&",
                buttonResetSelected: "&"
            },

            // Con 'link' establecemos la lógica de la directiva y además
            // podemos hacer manipulación del DOM de la vista.
            link: function(scope) {

                scope.datos = {
                    name: "",
                    minprice: "",
                    maxprice: "",
                    dist: "",
                    cat1: "",
                    cat2: "",
                    cat3: "",
                    date: ""
                };


                scope.searchData = function() {

                    // Notificamos al scope padre.
                    scope.buttonSearchSelected({ datos: scope.datos });
                };

                scope.defaultSearch = function() {

                    // Notificamos al scope padre.
                    scope.buttonResetSelected({ datos: scope.datos });
                };
            }
        };
    });