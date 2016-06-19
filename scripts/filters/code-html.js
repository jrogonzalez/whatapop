
angular
    .module("whatapop")
    .filter('trustAsHTML', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    });