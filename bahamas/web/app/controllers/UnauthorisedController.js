/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('unauthorisedController',
        ['$scope', 'session', '$state', 'localStorageService', '$rootScope', '$timeout',
            function ($scope, session, $state, localStorageService, $rootScope, $timeout) {

                $scope.previousPage = function () {
                    $state.go($rootScope.previousState);
                };

                $scope.toLogin = function () {
                    $timeout.cancel($scope.logoutTimer);
                    $timeout.cancel($scope.tokenTimer);
                    session.terminateSession();
                    localStorageService.clearAll();
                    $state.go('login');
                };

            }]);