/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.service('loadContactType',['$http', function($http){    
    this.retrieveContactType = function(){
        return $http({
            method: 'GET',
            url: 'http://localhost:8084/bahamas/contacttypelist'
        });
    }; 
}]);