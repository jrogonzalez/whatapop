
angular
    .module("whatapop")
    .service("UserService", function($http, Properties) {

        // Search one user.
        this.searchUser = function(id) {
            let userId = id;

            return $http.get(Properties.urlServidor + Properties.endpointUser +  "/" + userId );
        };

        // Search sll users
        this.showUsers = function() {
            
            return $http.get(Properties.urlServidor + Properties.endpointUser +  "/showUsers");
        };
        
    });