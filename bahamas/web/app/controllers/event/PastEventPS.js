/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('pastEventsPS',
        ['$scope', 'session', '$state', 'filterFilter', 'ngDialog', 'dataSubmit', 'deleteService', 'localStorageService', 'loadTeamAffiliation', '$rootScope', '$uibModal',
            function ($scope, session, $state, filterFilter, ngDialog, dataSubmit, deleteService, localStorageService, loadTeamAffiliation, $rootScope, $uibModal) {
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.addRemarks = function ($event, part) {
                    $rootScope.participant = part;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/addRemarks.html',
                        controller: 'RemarkInstanceCtrl',
                        size: "md"
                    });
                };

                $scope.addServiceComment = function ($event, part) {
                    $rootScope.participant = part;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/addServiceComment.html',
                        controller: 'ServiceCommentInstanceCtrl',
                        size: "md"
                    });
                };

                $scope.toContact = function ($event, part) {
                    var url = user + '.viewIndivContact';
                    $scope.viewIndivContact = user + '/viewIndivContact';
                    session.setSession('contactToDisplayCid', part['contact_id']);
                    if($event.which == 1) {
                        $state.go(url);
                    }
                };
                
                $scope.teamFilterChanged = function(){
                    localStorageService.set('PastEventsParticipationTeamFilter', $scope.teamFilter);
                    $scope.retrieveEvents();
                };
                
                $scope.dateStartChanged = function () {
                    if (angular.isUndefined($scope.dateStart)) {
                        localStorageService.set('PastEventsParticipationDateStartFilter', null);
                    } else {
                        localStorageService.set('PastEventsParticipationDateStartFilter', $scope.dateStart);
                    }
                };

                $scope.dateEndChanged = function () {
                    if (angular.isUndefined($scope.dateEnd)) {
                        localStorageService.set('PastEventsParticipationDateEndFilter', null);
                    } else {
                        localStorageService.set('PastEventsParticipationDateEndFilter', $scope.dateEnd);
                    }
                };

                $scope.retrieveEvents = function () {
                    $scope.teamFilter = localStorageService.get('PastEventsParticipationTeamFilter');
                    if($scope.teamFilter == null){
                        $scope.teamFilter = "MY TEAMS";
                    }
                    loadTeamAffiliation.retrieveTeamAffiliation().then(function(response){
                        $scope.teamList = response.data.teamAffiliationList;
                        $scope.teamList.unshift({'teamAffiliation': 'MY TEAMS'});
                        $scope.teamList.unshift({'teamAffiliation': 'ALL'});
                    });
                    var filter;
                    if ($scope.teamFilter == "ALL") {
                        filter = "";
                    } else if($scope.teamFilter == "MY TEAMS"){
                        filter = "my_team";
                    }else{
                        filter = $scope.teamFilter;
                    }
                    $scope.toRetrieve = {
                        'token': session.getSession('token'),
                        'teamFilter': filter
                    };
                    var url = '/event.pastparticipants';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                        if (localStorageService.get('PastEventsParticipationDateStartFilter') === null) {
                            $scope.dateStart = '';
                        } else {
                            $scope.dateStart = new Date(localStorageService.get('PastEventsParticipationDateStartFilter'));
                            $scope.dateStart.setHours(00, 00, 00, 000);
                        }
                        if (localStorageService.get('PastEventsParticipationDateEndFilter') === null) {
                            var end = new Date();
                            end.setHours(23, 59, 59, 999);
                            $scope.dateEnd = end;
                        } else {
                            $scope.dateEnd = new Date(localStorageService.get('PastEventsParticipationDateEndFilter'));
                        }
                        $scope.allEventInfo = response.data.event;
                        $scope.filteredEvents = $scope.allEventInfo;
                        $scope.totalItems = $scope.filteredEvents.length;
                        $scope.currentPage = 0;
                        $scope.currentPageIncrement = 1;
                        $scope.$watch('currentPageIncrement', function () {
                            $scope.currentPage = $scope.currentPageIncrement - 1;
                        });
                        $scope.itemsPerPage = 100;
                        $scope.maxSize = 5;
                        $scope.propertyName = '';
                        $scope.reverse = true;
                        $scope.sortBy = function (propertyName) {
                            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                            $scope.propertyName = propertyName;
                        };
                        $scope.totalPages = function () {
                            return Math.ceil($scope.filteredEvents.length / $scope.itemsPerPage);
                        };
                        $scope.itemsPerPageChanged = function () {
                            if ($scope.itemsPerPage == 'toAll') {
                                $scope.itemsPerPage = $scope.filteredEvents.length;
                                $scope.isAll = true;
                            } else {
                                $scope.isAll = false;
                            }
                        };
                        $scope.$watch('searchEvents', function (term) {
                            $scope.allEventInfoTemp = $scope.allEventInfo;
                            $scope.filteredEvents = filterFilter($scope.allEventInfoTemp, term);
                            $scope.totalItems = $scope.filteredEvents.length;
                        });
                        
                        $scope.$watch('dateStart + dateEnd', function () {
                            var newArray = [];
                            if (angular.isUndefined($scope.dateStart)) {
                                $scope.dateStart = null;
                            }
                            if (angular.isUndefined($scope.dateEnd)) {
                                var end = new Date();
                                end.setHours(23, 59, 59, 999);
                                $scope.dateEnd = end;
                            }
                            angular.forEach($scope.allEventInfo, function (obj) {
                                var startDate = new Date(obj['event_start_date']);
                                if (startDate >= $scope.dateStart && startDate <= $scope.dateEnd) {
                                    newArray.push(obj);
                                }
                            });
                            $scope.allFilteredEventsTime = newArray;
                            $scope.filteredEvents = filterFilter($scope.allFilteredEventsTime, $scope.searchEvents);
                            $scope.totalItems = $scope.filteredEvents.length;
                        });
                    });
                    var end = new Date();
                    end.setHours(23, 59, 59, 999);
                    var d = null;
                    $scope.dateStart = d;
                    $scope.dateEnd = end;

                    $scope.today = function () {
                        $scope.dt = new Date();
                    };
                    $scope.today();

                    $scope.clear = function () {
                        $scope.dt = null;
                    };

                    $scope.inlineOptions = {
                        customClass: getDayClass,
                        minDate: new Date(),
                        showWeeks: true
                    };

                    $scope.dateOptions = {
                        formatYear: 'yy',
                        minDate: new Date(),
                        startingDay: 1
                    };

                    $scope.toggleMin = function () {
                        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
                        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
                    };

                    $scope.toggleMin();

                    $scope.open1 = function () {
                        $scope.popup1.opened = true;
                    };

                    $scope.open2 = function () {
                        $scope.popup2.opened = true;
                    };

                    $scope.setDate = function (year, month, day) {
                        $scope.dt = new Date(year, month, day);
                    };


                    $scope.formats = ['dd MMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

                    $scope.format = $scope.formats[0];
                    $scope.altInputFormats = ['M!/d!/yyyy'];

                    $scope.popup1 = {
                        opened: false
                    };

                    $scope.popup2 = {
                        opened: false
                    };
                    function getDayClass(data) {
                        var date = data.date,
                                mode = data.mode;
                        if (mode === 'day') {
                            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                            for (var i = 0; i < $scope.events.length; i++) {
                                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                                if (dayToCheck === currentDay) {
                                    return $scope.events[i].status;
                                }
                            }
                        }

                        return '';
                    }
                };

                $scope.viewEvent = function ($event, event) {
                    var url = user + '.viewPastIndivEvent';
                    $scope.viewIndivEvent = user + '/viewPastIndivEvent';
                    session.setSession('eventIdToDisplay', event['event_id']);
                    if($event.which == 1) {
                        $state.go(url);
                    }
                };

                $scope.edit = function ($event, event) {
                    var url = user + '.editEvent';
                    var eventid = event['event_id'];
                    localStorageService.set('eventId', eventid);
                    $state.go(url);
                };

                $scope.deleteEvent = function ($event, event) {
                    var toURL = user + ".viewPastEvents";
                    var eventid = event['event_id'];

                    var toDelete = {
                        'token': session.getSession('token'),
                        'event_id': eventid
                    };
                    ngDialog.openConfirm({
                        template: './style/ngTemplate/deletePrompt.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    }).then(function (response) {
                        deleteService.deleteDataService(toDelete, '/event.delete').then(function (response) {
                            if (response.data.message === "success") {
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/deleteSuccess.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function (response) {
                                    $state.reload(toURL);
                                });
                            } else {
                                $scope.error = response.data.message;
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/deleteFailure.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function (response) {
                                    $state.reload(toURL);
                                });
                            }
                        });
                    });
                };
            }]);

app.controller('RemarkInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state) {
    var part = $rootScope.participant;
    $scope.input = part['remarks'];
    $scope.ok = function () {
        if (angular.isUndefined($scope.input)) {
            $scope.input = "";
        }
        ;
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
                    var current = session.getSession('userType') + '.pastEventParticipationSummary';
                    $state.go(current, {}, {reload: true});
                })
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ServiceCommentInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state) {
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
                    var current = session.getSession('userType') + '.pastEventParticipationSummary';
                    $state.go(current, {}, {reload: true});
                })
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        if (angular.isUndefined(input)) {
            return null;
        } else {
            return input.slice(start);
        }
    }
}); 