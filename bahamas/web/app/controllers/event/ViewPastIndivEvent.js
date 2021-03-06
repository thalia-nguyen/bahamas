/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('viewPastIndivEvent',
        ['$scope', 'session', '$state', 'filterFilter', 'ngDialog', 'dataSubmit', '$timeout', 'localStorageService', 'deleteService', '$uibModal', '$rootScope',
            function ($scope, session, $state, filterFilter, ngDialog, dataSubmit, $timeout, localStorageService, deleteService, $uibModal, $rootScope) {
                var user = session.getSession('userType');
                var eventId = session.getSession('eventIdToDisplay');
                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.toEvents = function () {
                    var url = user + '.viewUpcomingEvents';
                    $state.go(url);
                };
                
                $scope.toContact = function($event, part){
                    var url = user + '.viewIndivContact';
                    session.setSession('contactToDisplayCid', part['contact_id']);
                    $state.go(url);
                };
                
                $scope.retrieveEvent = function () {
                    $scope.toRetrieve = {
                        'token': session.getSession('token'),
                        'eventId': eventId
                    }
                    var url = '/event.retrieveindiv';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                        $scope.eventInfo = response.data;
                        $scope.showGmap = true;
                        if ($scope.eventInfo['event_lat'] == '' || $scope.eventInfo['event_lng'] == '') {
                            $scope.showGmap = false;
                        } else {
                            $scope.map = {center: {latitude: $scope.eventInfo['event_lat'], longitude: $scope.eventInfo['event_lng']}, zoom: 15, options: {scrollwheel: false}, control: {}};

                            $scope.marker = {coords: {latitude: $scope.eventInfo['event_lat'], longitude: $scope.eventInfo['event_lng']}, id: 1};
                        }
                        $scope.roles = $scope.eventInfo['event_role'];
                        $scope.participants = $scope.eventInfo['event_participant'];
                        $scope.withdrawn = $scope.eventInfo['withdrawn_participants'];
                        $scope.affiliation = $scope.eventInfo['event_team_affiliation'];
                        $scope.teamA = $scope.eventInfo['event_team_affiliation']['teams_affiliated'];
                    })

                    $scope.$watch('showGmap', function () {
                        if ($scope.showGmap == true) {
                            $timeout(function () {
                                $scope.map.control.refresh({latitude: $scope.eventInfo['event_lat'], longitude: $scope.eventInfo['event_lng']});
                                $scope.map.zoom = 15;
                            }, 0);
                        }
                    })
                }

                $scope.editEvent = function () {
                    var url = user + '.editPastEvent';
                    localStorageService.set('eventId', eventId);
                    $state.go(url);
                };
                
                $scope.addRemarks = function ($event, part) {
                    $rootScope.participant = part;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/addRemarks.html',
                        controller: 'RemarkIndivInstanceCtrl',
                        size: "md"
                    });
                };
                
                $scope.addServiceComment = function ($event, part) {
                    $rootScope.participant = part;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/addServiceComment.html',
                        controller: 'ServiceCommentIndivInstanceCtrl',
                        size: "md"
                    });
                };
                
            }]);

app.controller('RemarkIndivInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state) {
    var part = $rootScope.participant;
    $scope.input = part['remarks'];
    $scope.ok = function () {
        if (angular.isUndefined($scope.input)) {
            $scope.input = "";
        };
        $scope.toAddRemarks = {
            'token': session.getSession('token'),
            'role_id': part['role_id'],
            'contact_id': part['contact_id'],
            'remarks': $scope.input
        };
        var urlToAddRemarks = '/event.addeventremarks';
        dataSubmit.submitData($scope.toAddRemarks, urlToAddRemarks).then(function (response) {
            if (response.data.message == 'success') {
                ngDialog.openConfirm({
                    template: './style/ngTemplate/addSuccess.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (response) {
                    $uibModalInstance.dismiss('cancel');
                    var current = session.getSession('userType') + '.viewPastIndivEvent';
                    $state.go(current, {}, {reload: true});
                })
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ServiceCommentIndivInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state) {
    var part = $rootScope.participant;
    $scope.input = part['eventParticipantservice_comment'];
    $scope.awardHours = part['award_hours'];
    $scope.ok = function () {
        if (angular.isUndefined($scope.input)) {
            $scope.input = "";
        };
        $scope.toAddServiceComment = {
            'token': session.getSession('token'),
            'role_id': part['role_id'],
            'remarks': $scope.input,
            'participant_id': part['contact_id'],
            'award_hours': $scope.awardHours
        };
        var urlToAddServiceComment = '/event.addeventremarks';
        dataSubmit.submitData($scope.toAddServiceComment, urlToAddServiceComment).then(function (response) {
            if (response.data.message == 'success') {
                ngDialog.openConfirm({
                    template: './style/ngTemplate/addSuccess.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (response) {
                    $uibModalInstance.dismiss('cancel');
                    var current = session.getSession('userType') + '.viewPastIndivEvent';
                    $state.go(current, {}, {reload: true});
                })
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});