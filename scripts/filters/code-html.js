
angular
    .module("whatapop")
    .filter('trustAsHTML', function($sce){
        return function(text) {
            console.log("FILTER 1", $sce.trustAsHtml(text));
            return $sce.trustAsHtml(text);
        };
    });