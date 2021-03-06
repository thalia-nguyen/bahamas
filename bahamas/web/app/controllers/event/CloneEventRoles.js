/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('cloneEventRoles',
        ['$scope', 'session', '$state', 'localStorageService', '$http', '$timeout', 'ngDialog', 'dataSubmit',
            function ($scope, session, $state, localStorageService, $http, $timeout, ngDialog, dataSubmit) {
                var eventId = localStorageService.get('eventIdCreate');
                var eventIdArray = localStorageService.get('eventIdArray');
                var eventIdToClone = localStorageService.get('eventIdToClone');
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.eventDetails = function () {
                    var urlToRetrieve = "/event.retrieve";
                    var toRetrieve = {
                        'event_id': eventId,
                        'token': session.getSession('token')
                    }
                    dataSubmit.submitData(toRetrieve, urlToRetrieve).then(function (response) {
                        $scope.eventInfo = response.data;
                    })
                }

                $scope.retrieveEvent = function () {
                    $scope.toRetrieve = {
                        'token': session.getSession('token'),
                        'eventId': eventIdToClone
                    }
                    var url = '/event.retrieveindiv';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                          $scope.newEventInfo = response.data;
                          $scope.newRoles = {
                              'event_id': eventId,
                              'event_id_list': eventIdArray,
                              'roleArray': []
                          }
                          $scope.numberOfRoles = [];
                          var count = 1;
                          angular.forEach($scope.newEventInfo['event_role'], function(obj){
                              if(count == 1){
                                  var nameOfRole = 'role' + count;
                                  var nameOfDesc = 'description' + count;
                                  count = count + 1;
                                  var roleObj = {};
                                  roleObj[nameOfRole] = obj['event_role'];
                                  roleObj[nameOfDesc] = obj['event_desc'];
                                  $scope.newRoles['roleArray'].push(roleObj);
                              }else{
                                  var nameOfRole = 'role' + count;
                                  var nameOfDesc = 'description' + count;
                                  var roleObj = {};
                                  roleObj[nameOfRole] = obj['event_role'];
                                  roleObj[nameOfDesc] = obj['event_desc'];
                                  $scope.newRoles['roleArray'].push(roleObj);
                                  $scope.numberOfRoles.push(count);
                                  count = count + 1;
                              }
                          })
                    })
                }
                
                $scope.submitRoles = function () {
                    console.log($scope.newRoles);
                    $scope.error = false;
//                    var size = Object.keys($scope.newRoles).length / 2;
                    var size = $scope.newRoles['roleArray'].length;
                    for (var i = 1; i <= size; i++) {
                        var role = $scope.newRoles['roleArray'][(i - 1)]['role' + i];
                        var description = $scope.newRoles['roleArray'][(i - 1)]['description' + i];
                        if (role == '' && description != '') {
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
                        //submit to backend here.
                        var url = "/event.addroles";
                        $scope.myPromise = dataSubmit.submitData($scope.newRoles, url).then(function (response) {
                            if (response.data.message == 'success') {
                                var toURL = user + '.cloneEventAffiliation';
                                $state.go(toURL);
                            } else {
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/addRolesError.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                })
                            }
                        });
                    }
                }
                
                $scope.addNumberOfRoles = function () {
                    var roleIntoNewRoles = "role" + ($scope.numberOfRoles.length + 2);
                    var descriptionIntoNewRoles = "description" + ($scope.numberOfRoles.length + 2);
                    var newRole = {};
                    newRole[roleIntoNewRoles] = '';
                    newRole[descriptionIntoNewRoles] = '';
                    $scope.newRoles.roleArray.push(newRole);
                    $scope.numberOfRoles.push($scope.numberOfRoles.length + 2);
                }

            }]);