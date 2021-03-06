/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('createEvent',
        ['$scope', 'session', '$state', 'localStorageService', '$http', 'loadEventLocation', 'loadEventClass', '$timeout', 'ngDialog', 'dataSubmit', 'loadEventStatus', '$uibModal', 'retrieveOwnContactInfo',
            function ($scope, session, $state, localStorageService, $http, loadEventLocation, loadEventClass, $timeout, ngDialog, dataSubmit, loadEventStatus, $uibModal, retrieveOwnContactInfo) {
                var user = session.getSession('userType');
                $scope.backHome = function () {
                    $state.go(user);
                };

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
                };

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

                $scope.$watch("daysChosen", function () {
                    $scope.count = 0;
                    $scope.string = "";
                    angular.forEach($scope.daysChosen, function (value, key) {
                        if (value === true) {
                            $scope.count = $scope.count + 1;
                            if (key === "Su") {
                                var day = "Sun";
                            } else if (key === "Mo") {
                                var day = "Mon";
                            } else if (key === "Tu") {
                                var day = "Tue";
                            } else if (key === "We") {
                                var day = "Wed";
                            } else if (key === "Th") {
                                var day = "Thu";
                            } else if (key === "Fr") {
                                var day = "Fri";
                            } else if (key === "Sa") {
                                var day = "Sat";
                            }
                            if ($scope.count === 1) {
                                $scope.string = $scope.string + day;
                            } else {
                                $scope.string = $scope.string + ", " + day;
                            }
                        }
                    });
                }, true);
                
                
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
                        controller: function () {
                            $scope.number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
                            $scope.ok = function(){
                                modalInstance.dismiss('cancel');
                            };
                            $scope.cancel = function () {
                                modalInstance.dismiss('cancel');
                                $scope.removeRepeat();
                            };
                        },
                        backdrop: 'static',
                        keyboard: false,
                        size: "md"
                    });
                };

                $scope.removeRepeat = function () {
                    $scope.newEvent['repeat']['mode'] = '';
                };

                $scope.createEvent = function () {
                    
                    var dataSend = angular.copy($scope.newEvent);
                    
                    if (dataSend['event_start_date'] == null) {
                        dataSend['event_start_date'] = '';
                    } else if (dataSend['event_start_date'] != null || dataSend['event_start_date'] != '') {
                        dataSend['event_start_date'] = dataSend['event_start_date'].valueOf() + "";
                    }
                    if (dataSend['event_end_date'] == null) {
                        dataSend['event_end_date'] = '';
                    } else if (dataSend['event_end_date'] != null || dataSend['event_end_date'] != '') {
                        dataSend['event_end_date'] = dataSend['event_end_date'].valueOf() + "";
                    }
                    if (dataSend['event_time_start'] == null) {
                        dataSend['event_time_start'] = '';
                    } else if (dataSend['event_time_start'] != null || dataSend['event_time_start'] != '') {
                        dataSend['event_time_start'] = dataSend['event_time_start'].valueOf() + "";
                    }
                    if (dataSend['event_time_end'] == null) {
                        dataSend['event_time_end'] = '';
                    } else if (dataSend['event_time_end'] != null || dataSend['event_time_end'] != '') {
                        dataSend['event_time_end'] = dataSend['event_time_end'].valueOf() + "";
                    }
                    if ($scope.showGoogleMaps == false) {
                        dataSend['event_lat'] = '';
                        dataSend['event_lng'] = '';
                    }
                    if (dataSend['minimum_participation'] == '') {
                        dataSend['minimum_participation'] = "1";
                    }
                    if (dataSend['repeat']['end_on_daily'] == null) {
                        dataSend['repeat']['end_on_daily'] = '';
                    } else if (dataSend['repeat']['end_on_daily'] != null || dataSend['repeat']['end_on_daily'] != '') {
                        dataSend['repeat']['end_on_daily'] = dataSend['repeat']['end_on_daily'].valueOf() + "";
                    }
                    if (dataSend['repeat']['end_on_weekly'] == null) {
                        dataSend['repeat']['end_on_weekly'] = '';
                    } else if (dataSend['repeat']['end_on_weekly'] != null || dataSend['repeat']['end_on_weekly'] != '') {
                        dataSend['repeat']['end_on_weekly'] = dataSend['repeat']['end_on_weekly'].valueOf() + "";
                    }
                    if (dataSend['repeat']['end_on_monthly'] == null) {
                        dataSend['repeat']['end_on_monthly'] = '';
                    } else if (dataSend['repeat']['end_on_monthly'] != null || dataSend['repeat']['end_on_monthly'] != '') {
                        dataSend['repeat']['end_on_monthly'] = dataSend['repeat']['end_on_monthly'].valueOf() + "";
                    }
                    angular.forEach($scope.daysChosen, function (value, key) {
                        if (value === true) {
                            dataSend['repeat']['repeat_on'].push(key);
                        }
                    });
                    if(dataSend['send_reminder']===false){
                        dataSend['reminder_email']= "";
                    }if(dataSend['send_reminder']===true){
                        if(dataSend['reminder_email']===""){
                            dataSend['send_reminder']=false;
                        }
                    }

                    var url = "/event.create";
                    dataSubmit.submitData(dataSend, url).then(function (response) {
                        if (response.data.message == 'success') {
                            var id = response.data['event_id'];
                            var idArray = response.data['event_id_list'];
                            localStorageService.set('eventIdCreate', id);
                            localStorageService.set('eventIdArray', idArray);
                            var toURL = user + '.createEventRoles';
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
                                dataSend.ignore = true;
                                dataSubmit.submitData(dataSend, url).then(function (response) {
                                    if (response.data.message == 'success') {
                                        var id = response.data['event_id'];
                                        var idArray = response.data['event_id_list'];
                                        localStorageService.set('eventIdCreate', id);
                                        localStorageService.set('eventIdArray', idArray);
                                        var toURL = user + '.createEventRoles';
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