/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('cloneEvent',
        ['$scope', 'session', '$state', 'localStorageService', '$http', 'loadEventLocation', 'loadEventClass', '$timeout', 'ngDialog', 'dataSubmit', 'loadEventStatus', '$uibModal', '$rootScope', 'retrieveOwnContactInfo',
            function ($scope, session, $state, localStorageService, $http, loadEventLocation, loadEventClass, $timeout, ngDialog, dataSubmit, loadEventStatus, $uibModal, $rootScope, retrieveOwnContactInfo) {
                var user = session.getSession('userType');
                var eventIdToClone = localStorageService.get('eventIdToClone');
                $scope.backHome = function () {
                    $state.go(user);
                };
                $scope.userLoggedIn = user;
                
                $scope.regex = '\\d+';

                $scope.loadEventStatusList = function () {
                    loadEventStatus.retrieveEventStatus().then(function (response) {
                        $scope.eventStatusList = response.data.eventStatusList;
                    });
                };

                $scope.loadEventLocationList = function () {
                    loadEventLocation.retrieveEventLocation().then(function (response) {
                        $scope.eventLocationList = response.data.eventLocationList;
                    });
                };

                $scope.loadEventClassList = function () {
                    loadEventClass.retrieveEventClass().then(function (response) {
                        $scope.eventClassList = response.data.eventClassList;
                    });
                };
                
                $scope.retrieveContact = function(){
                    $scope.toRetrieve = {
                        'token': session.getSession('token')
                    };
                    $scope.verifiedEmail = [];
                    retrieveOwnContactInfo.retrieveContact($scope.toRetrieve).then(function(response){
                        var emailArray = response.data.contact.email;
                        angular.forEach(emailArray, function(obj){
                            if(obj.verified==="true"){
                                $scope.verifiedEmail.push(obj.email);
                            }
                        });
                    });
                };

                $scope.endDaily = 'isOccurence';
                $scope.endWeekly = 'isOccurence';
                $scope.endMonthly = 'isOccurence';
                
                $scope.newEvent = {
                    'token': session.getSession('token'),
                    'event_title': '',
                    'event_start_date': '',
                    'event_end_date': '',
                    'event_time_start': '',
                    'event_time_end': '',
                    'send_reminder': false,
                    'event_description': '',
                    'minimum_participation': '',
                    'event_class': "Internal",
                    'event_location': '',
                    'event_status': "Open",
                    'event_lat': '',
                    'event_lng': '',
                    'address': '',
                    'zipcode': '',
                    'remarks': '',
                    'reminder_email': '',
                    'ignore': false,
                    'repeat': {
                        'mode': '',
                        'repeat_every_daily': '1',
                        'repeat_every_weekly': '1',
                        'repeat_every_monthly': '1',
                        'end_occurence_daily': '',
                        'end_occurence_weekly': '',
                        'end_occurence_monthly': '',
                        'end_on_daily': '',
                        'end_on_weekly': '',
                        'end_on_monthly': '',
                        'repeat_on': [],
                        'repeat_by': 'day of the month'
                    }
                }
                
                $scope.retrieveEvent = function () {
                    $scope.toRetrieve = {
                        'token': session.getSession('token'),
                        'eventId': eventIdToClone
                    };
                    var url = '/event.retrieveindiv';
                    $scope.myPromise = dataSubmit.submitData($scope.toRetrieve, url).then(function (response) {
                        $scope.eventInfo = response.data;
                        $scope.newEvent = {
                            'token': session.getSession('token'),
                            'event_title': $scope.eventInfo['event_title'],
                            'event_start_date': '',
                            'event_end_date': '',
                            'event_time_start': '',
                            'event_time_end': '',
                            'send_reminder': false,
                            'event_description': $scope.eventInfo['event_description'],
                            'minimum_participation': $scope.eventInfo['minimum_participation'],
                            'event_class': $scope.eventInfo['event_class'],
                            'event_location': $scope.eventInfo['event_location'],
                            'event_status': $scope.eventInfo['event_status'],
                            'event_lat': $scope.eventInfo['event_lat'],
                            'event_lng': $scope.eventInfo['event_lng'],
                            'address': $scope.eventInfo['address'],
                            'zipcode': $scope.eventInfo['zipcode'],
                            'remarks': $scope.eventInfo['remarks'],
                            'ignore': false,
                            'repeat': {
                                'mode': '',
                                'repeat_every_daily': '1',
                                'repeat_every_weekly': '1',
                                'repeat_every_monthly': '1',
                                'end_occurence_daily': '',
                                'end_occurence_weekly': '',
                                'end_occurence_monthly': '',
                                'end_on_daily': '',
                                'end_on_weekly': '',
                                'end_on_monthly': '',
                                'repeat_on': [],
                                'repeat_by': 'day of the month'
                            }
                        }
                    })
                }


                //-----for the datepicker-----
                $scope.today = function () {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                };

                $scope.inlineOptions = {
                    customClass: getDayClass,
                    showWeeks: true
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    formatMonth: 'MMM',
                    formatDay: 'dd',
                    startingDay: 1
                };

                $scope.openStart = function () {
                    $timeout(function () {
                        $scope.openedStart = true;
                    });
                };


                $scope.openEnd = function () {
                    $timeout(function () {
                        $scope.openedEnd = true;
                    });
                };

                $scope.dateOptionsRepeat = {
                    formatYeat: 'yy',
                    formatMonth: 'MMM',
                    formatDay: 'dd',
                    startingDay: 1,
                    minDate: $scope.newEvent['event_start_date']
                };
                $scope.openRepeatDaily = function () {
                    $timeout(function () {
                        $scope.openedRepeatDaily = true;
                    });
                };

                $scope.openRepeatWeekly = function () {
                    $timeout(function () {
                        $scope.openedRepeatWeekly = true;
                    });
                };

                $scope.openRepeatMonthly = function () {
                    $timeout(function () {
                        $scope.openedRepeatMonthly = true;
                    });
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
                $scope.format = 'dd MMM yyyy';
                $scope.altInputFormats = ['M!/d!/yyyy'];
                //----- end of datepicker settings-----

                $scope.$watch("newEvent['event_start_date']", function () {
                    if (angular.isUndefined($scope.newEvent['event_start_date']) || $scope.newEvent['event_start_date'] === "") {
                        $scope.dayOfStartDate = "";
                    } else {
                        var numberDay = $scope.newEvent['event_start_date'].getDay();
                        if (numberDay === 0) {
                            $scope.dayOfStartDate = "Sunday";
                        } else if (numberDay === 1) {
                            $scope.dayOfStartDate = "Monday";
                        } else if (numberDay === 2) {
                            $scope.dayOfStartDate = "Tuesday";
                        } else if (numberDay === 3) {
                            $scope.dayOfStartDate = "Wednesday";
                        } else if (numberDay === 4) {
                            $scope.dayOfStartDate = "Thursday";
                        } else if (numberDay === 5) {
                            $scope.dayOfStartDate = "Friday";
                        } else if (numberDay === 6) {
                            $scope.dayOfStartDate = "Saturday";
                        }
                    }
                    $scope.newEvent['event_end_date'] = $scope.newEvent['event_start_date'];
                });

                $scope.$watch("newEvent['event_end_date']", function () {
                    if (angular.isUndefined($scope.newEvent['event_end_date']) || $scope.newEvent['event_end_date'] === "") {
                        $scope.dayOfEndDate = "";
                    } else {
                        var numberDay = $scope.newEvent['event_end_date'].getDay();
                        if (numberDay === 0) {
                            $scope.dayOfEndDate = "Sunday";
                        } else if (numberDay === 1) {
                            $scope.dayOfEndDate = "Monday";
                        } else if (numberDay === 2) {
                            $scope.dayOfEndDate = "Tuesday";
                        } else if (numberDay === 3) {
                            $scope.dayOfEndDate = "Wednesday";
                        } else if (numberDay === 4) {
                            $scope.dayOfEndDate = "Thursday";
                        } else if (numberDay === 5) {
                            $scope.dayOfEndDate = "Friday";
                        } else if (numberDay === 6) {
                            $scope.dayOfEndDate = "Saturday";
                        }
                    }
                });

                $scope.daysChosen = {
                    'Su': false,
                    'Mo': false,
                    'Tu': false,
                    'We': false,
                    'Th': false,
                    'Fr': false,
                    'Sa': false
                };

                $scope.endDailyChanged = function () {
                    if ($scope.endDaily == 'isOccurence') {
                        $scope.newEvent['repeat']['end_on_daily'] = '';
                    } else {
                        $scope.newEvent['repeat']['end_occurence_daily'] = '';
                    }
                };

                $scope.endWeeklyChanged = function () {
                    if ($scope.endWeekly == 'isOccurence') {
                        $scope.newEvent['repeat']['end_on_weekly'] = '';
                    } else {
                        $scope.newEvent['repeat']['end_occurence_weekly'] = '';
                    }
                };

                $scope.endMonthlyChanged = function () {
                    if ($scope.endMonthly == 'isOccurence') {
                        $scope.newEvent['repeat']['end_on_monthly'] = '';
                    } else {
                        $scope.newEvent['repeat']['end_occurence_monthly'] = '';
                    }
                };

                //--for google maps--
                $scope.map = {center: {latitude: 1.355865, longitude: 103.819129}, zoom: 10, options: {scrollwheel: false}, control: {}};
                $scope.$watch('showGoogleMaps', function () {
                    if ($scope.showGoogleMaps == true) {
                        $timeout(function () {
                            $scope.map.control.refresh({latitude: 1.355865, longitude: 103.819129});
                            $scope.map.zoom = 10;
                        }, 0);
                    }
                });
                $scope.marker = {coords: {latitude: '', longitude: ''}, id: 1};
                $scope.searchbox = {template: './style/ngTemplate/searchbox.tpl.html', events: {places_changed: function (searchBox) {
                            $scope.newEvent['event_lat'] = searchBox.getPlaces()[0].geometry.location.lat();
                            $scope.newEvent['event_lng'] = searchBox.getPlaces()[0].geometry.location.lng();
                            $scope.marker = {coords: {latitude: searchBox.getPlaces()[0].geometry.location.lat(), longitude: searchBox.getPlaces()[0].geometry.location.lng()}};
                            $scope.map.zoom = 15;
                            $scope.map.control.refresh({latitude: searchBox.getPlaces()[0].geometry.location.lat(), longitude: searchBox.getPlaces()[0].geometry.location.lng()});
                        }}, options: {}};
                //--end of settings for google maps--

                //location change function to populate address and zipcode
                $scope.locationChange = function (location) {
                    angular.forEach($scope.eventLocationList, function (value, key) {
                        if (value.eventLocation == location) {
                            $scope.newEvent['address'] = value.address;
                            $scope.newEvent['zipcode'] = value.zipcode;
                        }
                    });
                };
                //--end of location change function--

                $scope.showRepeat = function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: './style/ngTemplate/repeatingEvent.html',
                        scope: $scope,
                        controller: 'RepeatingEventInstanceCtrl',
                        backdrop: 'static',
                        keyboard: false,
                        size: "md"
                    });
                };

                $scope.removeRepeat = function () {
                    $scope.newEvent['repeat']['mode'] = '';
                };

                $scope.createEvent = function () {
                    if ($scope.newEvent['event_start_date'] == null) {
                        $scope.newEvent['event_start_date'] = ''
                    } else if ($scope.newEvent['event_start_date'] != null || $scope.newEvent['event_start_date'] != '') {
                        $scope.newEvent['event_start_date'] = $scope.newEvent['event_start_date'].valueOf() + "";
                    }
                    if ($scope.newEvent['event_end_date'] == null) {
                        $scope.newEvent['event_end_date'] = ''
                    } else if ($scope.newEvent['event_end_date'] != null || $scope.newEvent['event_end_date'] != '') {
                        $scope.newEvent['event_end_date'] = $scope.newEvent['event_end_date'].valueOf() + "";
                    }
                    if ($scope.newEvent['event_time_start'] == null) {
                        $scope.newEvent['event_time_start'] = ''
                    } else if ($scope.newEvent['event_time_start'] != null || $scope.newEvent['event_time_start'] != '') {
                        $scope.newEvent['event_time_start'] = $scope.newEvent['event_time_start'].valueOf() + "";
                    }
                    if ($scope.newEvent['event_time_end'] == null) {
                        $scope.newEvent['event_time_end'] = ''
                    } else if ($scope.newEvent['event_time_end'] != null || $scope.newEvent['event_time_end'] != '') {
                        $scope.newEvent['event_time_end'] = $scope.newEvent['event_time_end'].valueOf() + "";
                    }
                    if ($scope.showGoogleMaps == false) {
                        $scope.newEvent['event_lat'] = '';
                        $scope.newEvent['event_lng'] = '';
                    }
                    if ($scope.newEvent['minimum_participation'] == '') {
                        $scope.newEvent['minimum_participation'] = "1";
                    }
                    if ($scope.newEvent['repeat']['end_on_daily'] == null) {
                        $scope.newEvent['repeat']['end_on_daily'] = ''
                    } else if ($scope.newEvent['repeat']['end_on_daily'] != null || $scope.newEvent['repeat']['end_on_daily'] != '') {
                        $scope.newEvent['repeat']['end_on_daily'] = $scope.newEvent['repeat']['end_on_daily'].valueOf() + "";
                    }
                    if ($scope.newEvent['repeat']['end_on_weekly'] == null) {
                        $scope.newEvent['repeat']['end_on_weekly'] = ''
                    } else if ($scope.newEvent['repeat']['end_on_weekly'] != null || $scope.newEvent['repeat']['end_on_weekly'] != '') {
                        $scope.newEvent['repeat']['end_on_weekly'] = $scope.newEvent['repeat']['end_on_weekly'].valueOf() + "";
                    }
                    if ($scope.newEvent['repeat']['end_on_monthly'] == null) {
                        $scope.newEvent['repeat']['end_on_monthly'] = ''
                    } else if ($scope.newEvent['repeat']['end_on_monthly'] != null || $scope.newEvent['repeat']['end_on_monthly'] != '') {
                        $scope.newEvent['repeat']['end_on_monthly'] = $scope.newEvent['repeat']['end_on_monthly'].valueOf() + "";
                    }
                    angular.forEach($scope.daysChosen, function (value, key) {
                        if (value === true) {
                            $scope.newEvent['repeat']['repeat_on'].push(key);
                        }
                    });
                    
                    if($scope.newEvent['send_reminder']===false){
                        $scope.newEvent['reminder_email']= "";
                    }if($scope.newEvent['send_reminder']===true){
                        if($scope.newEvent['reminder_email']===""){
                            $scope.newEvent['send_reminder']=false;
                        }
                    }
                    
                    var url = "/event.create";
                    $scope.myPromise = dataSubmit.submitData($scope.newEvent, url).then(function (response) {
                        if (response.data.message == 'success') {
                            var id = response.data['event_id'];
                            var idArray = response.data['event_id_list'];
                            localStorageService.set('eventIdCreate', id);
                            localStorageService.set('eventIdArray', idArray);
                            var toURL = user + '.cloneEventRoles';
                            $state.go(toURL);
                        } else if (response.data.message == 'error') {
                            $scope.errorMessages = response.data.errorMsg;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        } else if (response.data.message == 'conflict') {
                            $scope.errorMessages = response.data.errorMsg;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/addEventConflict.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            }).then(function (response) {
                                $scope.newEvent.ignore = true;
                                dataSubmit.submitData($scope.newEvent, url).then(function (response) {
                                    if (response.data.message == 'success') {
                                        var id = response.data['event_id'];
                                        var idArray = response.data['event_id_list'];
                                        localStorageService.set('eventIdCreate', id);
                                        localStorageService.set('eventIdArray', idArray);
                                        var toURL = user + '.cloneEventRoles';
                                        $state.go(toURL);
                                    }
                                });
                            });
                        } else {
                            window.alert("Unable to establish connection");
                        }
                    });

                };

            }]);

app.controller('RepeatingEventInstanceCtrl', function ($scope, $rootScope, $uibModalInstance, dataSubmit, session, ngDialog, $state) {
    $scope.number = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
    ];

    $scope.ok = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});