
angular
    .module("whatapop")
    .service("UserService", function($http, Properties) {



        // Obtenemos el producto que queremos buscar.
        this.searchUser = function(id) {
            console.log("id usuario", id);
            let userId = id;

            return $http.get(Properties.urlServidor + Properties.endpointUser +  "/" + userId );
        };


        
    });