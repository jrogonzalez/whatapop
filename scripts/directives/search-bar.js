
angular
    .module("whatapop")
    .directive("searchBar", function() {

        return {
            // Con 'restrict' indicamos cómo vamos a usar la directiva.
            // Con 'A' la usamos como atributo de un elemento HTML.
            // Con 'E' la usamos como elemento HTML.
            restrict: "EA",

            // Con 'template' o 'templateUrl' indicamos la jerarquía de
            // componentesque el navegador va a renderizar como vista
            // de la directiva.
            templateUrl: "views/search-bar.html",

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

                /*
                // Creo un nuevo objeto receta.
                scope.receta = {
                    //nombre: "",
                    //ingredientes: []
                    id: Number,
                    name: String,
                    description: String,
                    category: String,
                    seller: String,
                    published_date: Number,
                    state: String,
                    maxprice: Number,
                    minprice: Number,
                    photo: [String]
                };


                // Manejador del botón 'Aceptar'.
                scope.notificarTexto = function() {

                    // Notificamos al scope padre.
                    scope.alHacerClick({ receta: scope.receta });
                };
                */

                scope.searchData = function() {

                    // Notificamos al scope padre.
                    scope.buttonSearchSelected({ datos: scope.datos });
                };

                scope.defaultSearch = function() {
                    
                    // Notificamos al scope padre.
                    scope.buttonResetSelected({ datos: scope.datos });
                };

                /*
                // Añadimos el ingrediente procedente del componente
                // a la colección que cuelga de la receta.
                scope.agregarIngrediente = function(ingrediente) {
                    scope.receta.ingredientes.push(ingrediente);
                };

                // Eliminamos el ingrediente que está en la posición
                // indicada por el parámetro 'indice'.
                scope.eliminarIngrediente = function(indice) {
                    scope.receta.ingredientes.splice(indice, 1);
                };

                // Comprobamos que el formulario tiene los datos
                // necesarios para guardar la receta.
                scope.puedoGuardar = function() {
                    return scope.receta.nombre &&
                        scope.receta.ingredientes.length > 0;
                };
                */
            }
        };
    });