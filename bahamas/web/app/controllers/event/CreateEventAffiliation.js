/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('createEventAffiliation',
        ['$scope', 'session', '$state', 'localStorageService', '$http', '$timeout', 'ngDialog', 'dataSubmit', 'loadTeamAffiliation',
            function ($scope, session, $state, localStorageService, $http, $timeout, ngDialog, dataSubmit, loadTeamAffiliation) {
                var eventId = localStorageService.get('eventIdCreate');
                var eventIdArray = localStorageService.get('eventIdArray');
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
                        $scope.myTeams = $scope.eventInfo['team'];
                        loadTeamAffiliation.retrieveTeamAffiliation().then(function (response) {
                            $scope.teamList = [];
                            $scope.teamAffiliationList = response.data.teamAffiliationList;
                            angular.forEach($scope.teamAffiliationList, function (obj) {
                                var teamName = obj.teamAffiliation;
                                var hasTeam = false;
                                angular.forEach($scope.myTeams, function (string) {
                                    if (teamName == string) {
                                        hasTeam = true;
                                    }
                                })
                                if (hasTeam == true) {
                                    var teamObj = {
                                        'teamName': teamName,
                                        'selected': true
                                    };
                                    $scope.teamList.push(teamObj);
                                } else {
                                    var teamObj = {
                                        'teamName': teamName,
                                        'selected': false
                                    };
                                    $scope.teamList.push(teamObj);
                                }
                            })
                        });
                    })
                }
                
                $scope.toSubmit = {
                    'token': session.getSession('token'),
                    'event_id': eventId,
                    'event_id_list': eventIdArray,
                    'teams': [
                    ],
                    'explain_if_others': ''
                };
                
                $scope.submit = function () {
                    var hasSelected = false;
                    angular.forEach($scope.teamList, function (obj) {
                        if (obj.selected == true) {
                            hasSelected = true;
                            $scope.toSubmit['teams'].push(obj.teamName);
                        }
                    });
                    if (hasSelected == false) {
                        $scope.errorMessages = ["Please select at least one Team."];
                        ngDialog.openConfirm({
                            template: './style/ngTemplate/errorMessage.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        })
                    } else {
                        var url = "/event.addaffiliation";
                        $scope.myPromise = dataSubmit.submitData($scope.toSubmit, url).then(function (response) {
                            if (response.data.message == 'success') {
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/addEventSuccess.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function (response) {
                                    localStorageService.remove('eventIdCreate');
                                    localStorageService.remove('eventIdArray');
                                    var afterSuccess = user + '.viewUpcomingEvents'
                                    $state.go(afterSuccess);
                                })
                            } else if (response.data.message == 'error') {
                                $scope.errorMessages = response.data.errorMsg;
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/errorMessage.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function(response){
                                    $scope.toSubmit['teams'] = [];
                                })
                            } else {
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/addEventAffiliationFailure.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function (response) {
                                    $scope.toSubmit['teams'] = [];
                                    var currentState = user + '.createEventAffiliation';
                                    $state.go(currentState, {}, {reload: true});
                                })
                            }
                        })
                    }
                };

                $scope.toEvents = function () {
                    localStorageService.remove('eventIdCreate');
                    localStorageService.remove('eventIdArray');
                    var toEventsUrl = user + '.viewUpcomingEvents';
                    $state.go(toEventsUrl);
                };

            }]);