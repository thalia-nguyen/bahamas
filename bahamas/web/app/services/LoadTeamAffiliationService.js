/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var app = angular.module('bahamas');

app.service('loadTeamAffiliation',['$rootScope', '$http', '$location', function($rootScope, $http, $location){    
    this.retrieveTeamAffiliation = function(){
        return $http({
            method: 'POST',
            url: $rootScope.commonUrl + '/teamaffiliationlist'
        });
    }; 
}]);
