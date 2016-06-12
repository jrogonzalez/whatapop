
angular
    .module("whatapop")
    .component("ingredientes", {
        bindings: {
            coleccion: "<",
            nuevoIngrediente: "&",
            ingredienteEliminado: "&"
        },
        templateUrl: "views/ingredientes.html",
        controller: function() {
            
            var self = this;
            
            // Inicializamos los valores por defecto del componente.
            self.$onInit = function() {
                
                // Objeto nuevo ingrediente.
                self.ingrediente = {
                    nombre: "",
                    cantidad: 1
                };
            };
            
            // Con cada tecla pulsada en la caja de nuevo ingrediente.
            self.teclaPulsada = function(evento) {
                
                // Obtengo la tecla pulsada.
                var tecla = evento.which || evento.keyCode;
                
                // Si la tecla que he pulsado es 'intro', el ingrediente
                // tiene un nombre y además no existe ya en la colección.
                if (tecla === 13 &&
                    self.ingrediente.nombre &&
                    !ingredienteExiste(self.ingrediente.nombre)) {
                    
                    // Notificamos el nuevo ingrediente.
                    self.nuevoIngrediente({ "ingrediente": self.ingrediente });
                    
                    // Reseteo el ingrediente.
                    self.ingrediente = {
                        nombre: "",
                        cantidad: 1
                    };
                }
            };

            // Notificamos que se ha pulsado el botón eliminar sobre un ingrediente.
            self.eliminar = function(indice) {

                // Notificamos el índice del ingrediente.
                self.ingredienteEliminado({ "indice": indice });
            };

            // Comprobamos si existe o no el ingrediente indicado.
            function ingredienteExiste(nombreIngrediente) {

                // Pasamos a minúsculas el nombre del ingrediente indicado.
                var enMinusculas = nombreIngrediente.toLowerCase();

                // Buscamos aquellos ingredientes cuyo nombre sea igual al indicado.
                var coincidencias = self.coleccion.filter(function(ingrediente) {
                    return ingrediente.nombre.toLowerCase() === enMinusculas;
                });

                return coincidencias.length > 0;
            }
        }
    });