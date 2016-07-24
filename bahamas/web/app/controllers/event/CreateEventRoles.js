/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('createEventRoles',
        ['$scope', 'session', '$state', 'localStorageService', '$http', '$timeout', '$stateParams', 'ngDialog', 'dataSubmit',
            function ($scope, session, $state, localStorageService, $http, $timeout, $stateParams, ngDialog, dataSubmit) {
                var eventId = localStorageService.get('eventIdCreate');
                console.log(eventId);
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.eventDetails = function () {
                    var urlToRetrieve = "/event.retrieve";
                    var toRetrieve = {
                        'eventId': eventId,
                        'token': session.getSession('token')
                    }
                    dataSubmit.submitData(toRetrieve, urlToRetrieve).then(function (response) {
                        $scope.eventInfo = response.data;
//                        $scope.eventInfo = {
//                            'event_title': 'EVENT TITLE HERE',
//                            'event_date': new Date(),
//                            'event_time_start': '11:00 AM',
//                            'event_time_end': '12:30 PM',
//                            'send_reminder': false,
//                            'event_description': 'EVENT DESCRIPTION',
//                            'minimum_participation': '5',
//                            'event_class': 'Closed',
//                            'event_location': 'TWC2 Day Office',
//                            'explain_if_others': 'HELLO EXPLAIN HERE'
//                        }
                    })
                }
                
                $scope.newRoles = {
                    'role1': '',
                    'description1': '',
                    'role2': '',
                    'description2': '',
                    'role3': '',
                    'description3': ''
                }


                $scope.submitRoles = function () {
                    $scope.error = false;
                    var size = Object.keys($scope.newRoles).length / 2;
                    for (var i = 1; i <= size; i++) {
                        var role = $scope.newRoles['role' + i];
                        var description = $scope.newRoles['description' + i];
                        if ($scope.newRoles['role' + i] == '' && $scope.newRoles['description' + i] != '') {
                            $scope.error = true;
                        } else if (angular.isUndefined(role)) {
                            $scope.error = true;
                        } else if (angular.isUndefined(description)) {
                            $scope.error = true;
                        }
                    }
                    if ($scope.error == true) {
                        ngDialog.openConfirm({
                            template: './style/ngTemplate/addRolesError.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        })
                    } else {
                        $scope.newRoles.token = session.getSession('token');
                        console.log($scope.newRoles);
                        //submit to backend here.
                        window.alert('success');
                    }
                }

                $scope.numberOfRoles = [1, 2, 3];
                $scope.addNumberOfRoles = function () {
                    var roleIntoNewRoles = "role" + ($scope.numberOfRoles.length + 1);
                    var descriptionIntoNewRoles = "description" + ($scope.numberOfRoles.length + 1);
                    $scope.newRoles[roleIntoNewRoles] = '';
                    $scope.newRoles[descriptionIntoNewRoles] = '';
                    $scope.numberOfRoles.push($scope.numberOfRoles.length + 1);
                }
//
//                $scope.map = {center: {latitude: 1.302918, longitude: 103.864964}, zoom: 15, options: {scrollwheel: false}, control:{}};
//
//                $scope.marker = {coords: {latitude: 1.302918, longitude: 103.864964}, id: 1};
//
//                $scope.searchbox = {template:'./style/ngTemplate/searchbox.tpl.html', events:{places_changed: function (searchBox) {
//                    console.log(searchBox.getPlaces()[0].geometry.location.lat());
//                    console.log(searchBox.getPlaces()[0].geometry.location.lng());
//                    $scope.marker.coords = {
//                        latitude: searchBox.getPlaces()[0].geometry.location.lat(),
//                        longitude: searchBox.getPlaces()[0].geometry.location.lng()
//                    };
//                    $scope.map.control.refresh({latitude: searchBox.getPlaces()[0].geometry.location.lat(), longitude: searchBox.getPlaces()[0].geometry.location.lng()});
//                }}};
            }]);