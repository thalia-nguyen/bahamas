/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('upcomingEventPS',
        ['$scope', 'session', '$state', 'filterFilter', 'ngDialog', 'dataSubmit', 'localStorageService',
            function ($scope, session, $state, filterFilter, ngDialog, dataSubmit, localStorageService) {
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };
                
                $scope.retrieveEvents = function () {
                    $scope.toRetrieve = {
                        'token': session.getSession('token')
                    };
                    var url = '/event.upcomingparticipants';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                        $scope.allEventInfo = response.data.event;
                        $scope.totalItems = $scope.allEventInfo.length;

                        $scope.currentPage = 1;
                        $scope.itemsPerPage = $scope.allEventInfo.length;
                        $scope.allFilteredEvents = $scope.allEventInfo;
                        $scope.isAll = false;
                        var total = $scope.allFilteredEvents.length / $scope.itemsPerPage;
                        $scope.totalPages = Math.ceil(total);
                        if ($scope.totalPages === 0) {
                            $scope.totalPages = 1;
                        }
                        $scope.$watch('currentPage + itemsPerPage', function () {
                            var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
                            var end = begin + parseInt($scope.itemsPerPage);

                            $scope.splitEvents = $scope.allFilteredEvents.slice(begin, end);
                        });

                        $scope.itemsPerPageChanged = function () {
                            if ($scope.itemsPerPage == 'toAll') {
                                $scope.itemsPerPage = $scope.allFilteredEvents.length;
                                $scope.isAll = true;
                            } else {
                                $scope.isAll = false;
                            }
                            var newArray = [];
                            
                            angular.forEach($scope.allEventInfo, function (obj) {
                                var startDate = new Date(obj['event_start_date']);
                                if (startDate >= $scope.dateStart && startDate <= $scope.superFarDate) {
                                    newArray.push(obj);
                                }
                            });
                            $scope.allFilteredEventsTime = newArray;
                            $scope.allFilteredEvents = filterFilter($scope.allFilteredEventsTime, $scope.searchEvents);
                            var total = $scope.allFilteredEvents.length / $scope.itemsPerPage;
                            $scope.totalPages = Math.ceil(total);
                            if ($scope.totalPages === 0) {
                                $scope.totalPages = 1;
                            }
                            $scope.$watch('currentPage + itemsPerPage', function () {
                                var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
                                var end = begin + parseInt($scope.itemsPerPage);
                                $scope.splitEvents = $scope.allFilteredEvents.slice(begin, end);
                            });
                        };

                        $scope.$watch('searchEvents', function (term) {
                            var newArray = [];
                            angular.forEach($scope.allEventInfo, function (obj) {
                                var startDate = new Date(obj['event_start_date']);
                                if (startDate >= $scope.dateStart && startDate <= $scope.superFarDate) {
                                    newArray.push(obj);
                                }
                            });
                            $scope.allFilteredEventsTime = newArray;
                            $scope.allFilteredEvents = filterFilter($scope.allFilteredEventsTime, term);
                            $scope.totalItems = $scope.allFilteredEvents.length;
                            var total = $scope.allFilteredEvents.length / $scope.itemsPerPage;
                            $scope.totalPages = Math.ceil(total);
                            if ($scope.totalPages === 0) {
                                $scope.totalPages = 1;
                            }
                            $scope.$watch('currentPage + itemsPerPage', function () {
                                var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
                                var end = begin + parseInt($scope.itemsPerPage);
                                $scope.splitEvents = $scope.allFilteredEvents.slice(begin, end);
                            });
                        });

                        $scope.$watch('dateStart + dateEnd', function () {
                            var newArray = [];
                            if (angular.isUndefined($scope.dateStart)) {
                                var start = null;
                                $scope.dateStart = start;
                            }
                            if (angular.isUndefined($scope.dateEnd) || $scope.dateEnd === null) {
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
                            $scope.allFilteredEvents = filterFilter($scope.allFilteredEventsTime, $scope.searchEvents);
                            var total = $scope.allFilteredEvents.length / $scope.itemsPerPage;
                            $scope.totalPages = Math.ceil(total);
                            if ($scope.totalPages === 0) {
                                $scope.totalPages = 1;
                            }
                            $scope.$watch('currentPage + itemsPerPage', function () {
                                var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
                                var end = begin + parseInt($scope.itemsPerPage);
                                $scope.splitEvents = $scope.allFilteredEvents.slice(begin, end);
                            });
                        });
                    })
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
                }

                $scope.foo = function ($event, event) {
                    var url = user + '.viewIndivEvent';
                    var eventid = event['event_id'];
                    $state.go(url, {eventId: eventid});
                };

                $scope.edit = function ($event, event) {
                    var url = user + '.editEvent';
                    var eventid = event['event_id'];
                    localStorageService.set('eventId', eventid);
                    $state.go(url);
                };

                $scope.predicate = '';
                $scope.reverse = true;

                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };
                
            }]);