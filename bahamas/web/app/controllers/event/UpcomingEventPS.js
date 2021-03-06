/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('upcomingEventPS',
        ['$scope', 'session', '$state', 'filterFilter', 'ngDialog', 'dataSubmit', 'localStorageService', 'loadTeamAffiliation', '$rootScope', '$uibModal',
            function ($scope, session, $state, filterFilter, ngDialog, dataSubmit, localStorageService, loadTeamAffiliation, $rootScope, $uibModal) {
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.toContact = function ($event, part) {
                    var url = user + '.viewIndivContact';
                    $scope.viewIndivContact = user + '/viewIndivContact';
                    session.setSession('contactToDisplayCid', part['contact_id']);
                    if($event.which == 1) {
                        $state.go(url);
                    }
                };
                
                $scope.joinRole = function ($event, role) {
                    $scope.roleName = role['event_role'];
                    ngDialog.openConfirm({
                        template: './style/ngTemplate/joinRolePrompt.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    }).then(function (response) {
                        $scope.toJoin = {
                            'token': session.getSession('token'),
                            'event_id': role['event_id'],
                            'event_role_id': role['event_role_id']
                        };
                        var urlToJoin = '/event.join';
                        dataSubmit.submitData($scope.toJoin, urlToJoin).then(function (response) {
                            if (response.data.message == "success") {
                                ngDialog.openConfirm({
                                    template: './style/ngTemplate/joinRoleSuccess.html',
                                    className: 'ngdialog-theme-default',
                                    scope: $scope
                                }).then(function (response) {
                                    var current = user + '.eventParticipationSummary';
                                    $state.go(current, {}, {reload: true});
                                });
                            }
                        });
                    });
                };
                
                $scope.removeParticipant = function ($event, participant) {
                    $rootScope.participant = participant;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/removeReason.html',
                        controller: 'ReasonInstanceCtrl',
                        size: "md"
                    });
                };
                
                $scope.teamFilterChanged = function(){
                    localStorageService.set('UpcomingEventsParticipationTeamFilter', $scope.teamFilter);
                    $scope.retrieveEvents();
                };
                
                $scope.dateStartChanged = function () {
                    if (angular.isUndefined($scope.dateStart)) {
                        localStorageService.set('UpcomingEventsParticipationDateStartFilter', null);
                    } else {
                        localStorageService.set('UpcomingEventsParticipationDateStartFilter', $scope.dateStart);
                    }
                };

                $scope.dateEndChanged = function () {
                    if (angular.isUndefined($scope.dateEnd)) {
                        localStorageService.set('UpcomingEventsParticipationDateEndFilter', null);
                    } else {
                        localStorageService.set('UpcomingEventsParticipationDateEndFilter', $scope.dateEnd);
                    }
                };
                
                $scope.retrieveEvents = function () {
                    $scope.teamFilter = localStorageService.get('UpcomingEventsParticipationTeamFilter');
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
                    $scope.isAssociate = false;
                    if(user === "associate"){
                        $scope.isAssociate = true;
                    }
                    
                    var url = '/event.upcomingparticipants';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                        if (localStorageService.get('UpcomingEventsParticipationDateStartFilter') === null) {
                            $scope.dateStart = '';
                        } else {
                            $scope.dateStart = new Date(localStorageService.get('UpcomingEventsParticipationDateStartFilter'));
                            $scope.dateStart.setHours(00, 00, 00, 000);
                        }
                        if (localStorageService.get('UpcomingEventsParticipationDateEndFilter') === null) {
                            $scope.dateEnd = '';
                        } else {
                            $scope.dateEnd = new Date(localStorageService.get('UpcomingEventsParticipationDateEndFilter'));
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
                                var start = null;
                                $scope.dateStart = start;
                            }
                            if (angular.isUndefined($scope.dateEnd) || $scope.dateEnd === null || $scope.dateEnd === '') {
                                $scope.superFarDate = new Date(2050, 0, 1, 00, 00, 00, 0);
                                angular.forEach($scope.allEventInfo, function (obj) {
                                    var startDate = new Date(obj['event_start_date']);
                                    if (startDate >= $scope.dateStart && startDate <= $scope.superFarDate) {
                                        newArray.push(obj);
                                    }
                                });
                            } else {
                                $scope.superFarDate = $scope.dateEnd;
                                angular.forEach($scope.allEventInfo, function (obj) {
                                    var startDate = new Date(obj['event_start_date']);
                                    if (startDate >= $scope.dateStart && startDate <= $scope.superFarDate) {
                                        newArray.push(obj);
                                    }
                                });
                            }
                            $scope.allFilteredEventsTime = newArray;
                            $scope.filteredEvents = filterFilter($scope.allFilteredEventsTime, $scope.searchEvents);
                            $scope.totalItems = $scope.filteredEvents.length;
                        });
                    });
                    var start = null;
//                    start.setHours(00, 00, 00, 000);
                    var d = null;
                    $scope.superFarDate = new Date(2050, 0, 1, 00, 00, 00, 0);
                    $scope.dateStart = start;
                    $scope.dateEnd = d;

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
                    var url = user + '.viewIndivEvent';
                    $scope.viewIndivEvent = user + '/viewIndivEvent';
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

                $scope.predicate = '';
                $scope.reverse = false;

                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };

            }]);

app.controller('ReasonInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state, $stateParams) {
    $scope.ok = function () {
        var part = $rootScope.participant;
        if (angular.isUndefined($scope.input)) {
            $scope.input = "";
        }
        ;
        $scope.toRemovePart = {
            'token': session.getSession('token'),
            'role_id': part['role_id'],
            'reason': $scope.input,
            'withdraw_contact_id': part['contact_id']
        };
        var urlToRemove = '/event.leaverole';
        dataSubmit.submitData($scope.toRemovePart, urlToRemove).then(function (response) {
            if (response.data.message == 'success') {
                ngDialog.openConfirm({
                    template: './style/ngTemplate/removeSuccessful.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (response) {
                    $uibModalInstance.dismiss('cancel');
                    var current = session.getSession('userType') + '.eventParticipationSummary';
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