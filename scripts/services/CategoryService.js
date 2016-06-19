
angular
    .module("whatapop")
    .service("CategoryProducts", function($http, Properties) {

        // Create a new Category.
        // TO-DO
        this.createCategory = function(category) {

            return $http.post(Properties.urlServidor + Properties.endpointCategory +  "/" , category);
        };


        // Remove an existing Category.
        this.deleteCategory = function(id) {
            let categoryId = id;

            return $http.delete(Properties.urlServidor + Properties.endpointCategory +  "/removeCategory/" + categoryId);
        };

        // Search one determinate category.
        this.searchCategory = function(id) {
            let categoryId = id;

            return $http.get(Properties.urlServidor + Properties.endpointCategory +  "/" + categoryId);
        };

        // Show all Categories.
        this.showCategories = function() {

            return $http.get(Properties.urlServidor + Properties.endpointCategory +  "/showCategories");
        };

        
    });