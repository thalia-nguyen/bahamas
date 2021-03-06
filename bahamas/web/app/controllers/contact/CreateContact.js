/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Created by Marcus Ong

var app = angular.module('bahamas');

app.controller('createContact',
        ['$scope', '$state', 'session', 'dataSubmit', 'loadCountries', 'loadContactType', 'loadTeamAffiliation', 'loadPermissionLevel', 'loadLanguage', 'loadLSAClass', '$filter', '$timeout', 'ngDialog',
            function ($scope, $state, session, dataSubmit, loadCountries, loadContactType, loadTeamAffiliation, loadPermissionLevel, loadLanguage, loadLSAClass, $filter, $timeout, ngDialog) {
//PAGES TRANSITION
                var user = session.getSession('userType');
                $scope.userLoggedIn = user;
                var viewContact = user + '.viewContacts';
                $scope.userViewContacts = user + "/" + 'viewContacts';
                var currentState = user + '.addContact';
                $scope.userCurrentState = user + '/' + 'addContact';

                $scope.backHome = function () {
                    $state.go(user);
                };

                $scope.viewContact = function () {
                    $state.go(viewContact);
                };

                $scope.addContact = function () {
                    $state.reload(currentState);
                };

                $scope.form = {};
//CALL DROPDOWN LIST SERVICES        
                $scope.loadContactTypeList = function () {
                    loadContactType.retrieveContactType().then(function (response) {
                        $scope.contactTypeList = response.data.contact;
                    });
                };

                $scope.loadTeamAffiliationList = function () {
                    loadTeamAffiliation.retrieveTeamAffiliation().then(function (response) {
                        $scope.teamAffiliationList = response.data.teamAffiliationList;
                        for (var obj in $scope.teamAffiliationList) {
                            if ($scope.teamAffiliationList[obj].teamAffiliation == 'Others' || $scope.teamAffiliationList[obj].teamAffiliation == 'Other') {
                                $scope.teamAffiliationList.splice(obj, 1);
                            }
                        }
                    });
                };

                $scope.loadPermissionLevelList = function () {
                    loadPermissionLevel.retrievePermissionLevel().then(function (response) {
                        $scope.permissionLevelList = response.data.permissionLevelList;
                    });
                };

                $scope.loadLanguageList = function () {
                    loadLanguage.retrieveLanguage().then(function (response) {
                        $scope.languageList = response.data.languageList;
                    });
                };

                $scope.loadLSAList = function () {
                    loadLSAClass.retrieveLSAClass().then(function (response) {
                        $scope.LSAList = response.data.lsaClassList;
                    });
                };

                $scope.loadCountryNames = function () {
                    loadCountries.retrieveCountries().then(function (response) {
                        $scope.countryNames = response.data;
                    });
                };

                $scope.loadCountryCodes = function () {
                    var x = "";
                    loadCountries.retrieveCountries().then(function (response) {
                        $scope.countryCodes = response.data;

                        $scope.updateCountryNames = function (code) {
                            x = " ";
                            code += "";
                            angular.forEach($scope.countryCodes, function (countryObj) {
                                angular.forEach(countryObj.callingCodes, function (value, key) {
                                    if (value == code && value !== "") {
                                        x = x + " " + countryObj.name;
                                    }
                                });
                            });
                            $scope.newCountryName = x;
                        };
                    });
                };
//DEFINE REGEX
                $scope.nationalityRegex = '[A-Za-z ]{0,20}';
                $scope.nricRegex = '[A-Za-z][0-9]\\d{6}[A-Za-z]'; //notice that \d won't work but \\d
                $scope.phoneRegex = '[0-9-]{0,20}';
                $scope.emailRegex = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}';
//DECLARE CONTACT OBJECT              
                $scope.contactInfo = {
                    'token': session.getSession("token"),
                    'user_type': user,
                    'name': '',
                    'alt_name': '',
                    'contact_type': 'Individual',
                    'explain_if_other': '',
                    'profession': '',
                    'job_title': '',
                    'nric_fin': '',
                    'gender': '',
                    'nationality': '',
                    'date_of_birth': '',
                    'remarks': '',
                    'notification': false
                };
//DECLARE RESULT OBJECT 
                $scope.result = {
                    message: false,
                    deliver: '',
                    contactId: ''
                };
//SUBMIT CONTACT 
                $scope.submitted = false;
                $scope.submitContactInfo = function () {
                    var url = "/contact.add";
                    dataSubmit.submitData($scope.contactInfo, url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submitted = true;
                            $scope.result.message = true;
                            $scope.result.deliver = 'Thank you for your time. Would you like to add additional information to your contact?';
                            $scope.result.contactId = response.data['contact_id'];
                        } else {
                            $scope.result.message = false;
                            $scope.result.deliver = 'It seems that there is error in your form. We would be much appreciated if you could spend time checking through all the data again.';
                        }
                    }, function (response) {
                        window.alert("Fail to send request!");
                    });
                };

//DECLARE ADDITIONAL CONTACT INFO OBJECT 
                $scope.additionalContactInfo = {
                    phoneInfo: {
                        token: session.getSession("token"),
                        'contact_id': $scope.result.contactId,
                        'user_type': user,
                        'country_code': 65,
                        'phone_number': '',
                        'phone_remarks': '',
                        'date_obsolete': ''
                    },
                    emailInfo: {
                        token: session.getSession('token'),
                        'contact_id': $scope.result.contactId,
                        'user_type': user,
                        email: '',
                        'email_remarks': '',
                        'date_obsolete': ''
                    },
                    addressInfo: {
                        token: session.getSession('token'),
                        'contact_id': $scope.result.contactId,
                        'user_type': user,
                        address: '',
                        country: 'Singapore',
                        zipcode: '',
                        'address_remarks': '',
                        'date_obsolete': ''
                    },
                    languageInfo: {
                        token: session.getSession('token'),
                        'contact_id': $scope.result.contactId,
                        'user_type': user,
                        language: '',
                        'explain_if_other': '',
                        'speak_write': '',
                        remarks: '',
                        'date_obsolete': ''
                    },
                    skillassetInfo: {
                        token: session.getSession('token'),
                        'contact_id': $scope.result.contactId,
                        'user_type': user,
                        'skill_asset': '',
                        'explain_if_other': '',
                        remarks: '',
                        'date_obsolete': ''
                    },
                    teamInfo: {
                        token: session.getSession('token'),
                        'contact_id': $scope.result.contactId,
                        'contact_name': $scope.contactInfo.name,
                        'user_type': user,
                        team1: '',
                        team2: '',
                        team3: ''
                    }
                };
//DEFINE TEAM LISTS
//watch for change in team list 1
                $scope.teamAffiliationList1 = [{teamAffiliation: '-------------------------------------------------'}, {teamAffiliation: '[Please choose the above option first.]'}];
                $scope.$watch('additionalContactInfo.teamInfo.team1', function () {
                    if ($scope.additionalContactInfo.teamInfo.team1 !== '') {
                        var choice = $scope.additionalContactInfo.teamInfo.team1;
                        var position = -1;
                        for (var i in $scope.teamAffiliationList) {
                            var teamCheck = $scope.teamAffiliationList[i];
                            if (teamCheck.teamAffiliation == $scope.additionalContactInfo.teamInfo.team1) {
                                position = i;
                            }
                        }
                        if (position == -1) {
                            $scope.teamAffiliationList1 = angular.copy($scope.teamAffiliationList);
                        } else {
                            var list = angular.copy($scope.teamAffiliationList);
                            list.splice(position, 1);
                            $scope.teamAffiliationList1 = list;
                            //$scope.additionalContactInfo.teamInfo.team2 = '';
                            if (choice == $scope.additionalContactInfo.teamInfo.team2) {
                                $scope.additionalContactInfo.teamInfo.team2 = '';
                            }
                            if ($scope.additionalContactInfo.teamInfo.team3 != '' && choice == $scope.additionalContactInfo.teamInfo.team3) {
                                $scope.additionalContactInfo.teamInfo.team3 = '';
                                var list2 = angular.copy($scope.teamAffiliationList1);
                                list2.splice(position, 1);
                                $scope.teamAffiliationList2 = list2;
                            }
                        }
                    } 
//                    else {
//                        $scope.teamAffiliationList1 = [{teamAffiliation: '-------------------------------------------------'}, {teamAffiliation: '[Please choose the above option first.]'}];
//                        $scope.teamAffiliationList2 = [{teamAffiliation: '-------------------------------------------------'}, {teamAffiliation: '[Please choose the above option first.]'}];
//                    }
                });
//watch for change in team list 2
                $scope.teamAffiliationList2 = [{teamAffiliation: '-------------------------------------------------'}, {teamAffiliation: '[Please choose the above option first.]'}];
                $scope.$watch('additionalContactInfo.teamInfo.team2', function () {
                    if ($scope.additionalContactInfo.teamInfo.team2 !== '') {
                        var position = -1;
                        for (var i in $scope.teamAffiliationList1) {
                            var teamCheck = $scope.teamAffiliationList1[i];
                            if (teamCheck.teamAffiliation == $scope.additionalContactInfo.teamInfo.team2) {
                                position = i;
                            }
                        }
                        if (position == -1) {
                            $scope.teamAffiliationList2 = angular.copy($scope.teamAffiliationList1);
                        } else {
                            var list = angular.copy($scope.teamAffiliationList1);
                            list.splice(position, 1);
                            $scope.teamAffiliationList2 = list;
                        }
                    } else {
                        $scope.additionalContactInfo.teamInfo.team3 = '';
                        $scope.teamAffiliationList2 = [{teamAffiliation: '-------------------------------------------------'}, {teamAffiliation: '[Please choose the above option first.]'}];
                    }
                });
//DEFINE COPYCAT FOR RE-SUBMIT
                $scope.copyCat = angular.copy($scope.additionalContactInfo);
                var copyService = function (copyData) {
                    $scope.additionalContactInfo[copyData] = angular.copy($scope.copyCat[copyData]);
                };
//SUBMIT PHONE
                $scope.message = '';
                $scope.submittedPhone = false;
                $scope.addPhone = function () {
                    var dataParse = 'phoneInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var url = "/phone.add";
                    dataSubmit.submitData($scope.additionalContactInfo[dataParse], url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submittedPhone = true;
                            $scope.message = 'Submitted successfully.';
                        } else {
                            $scope.message = 'There is error in the data, please check again.';
                            $scope.errorMessages = response.data.message;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//SUBMIT EMAIL
                $scope.submittedEmail = false;
                $scope.addEmail = function () {
                    var dataParse = 'emailInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var url = "/email.add";
                    dataSubmit.submitData($scope.additionalContactInfo[dataParse], url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submittedEmail = true;
                            $scope.message = 'Submitted successfully.';
                        } else {
                            $scope.errorMessages = response.data.message;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//SUBMIT ADDRESS
                $scope.submittedAddress = false;
                $scope.addAddress = function () {
                    var dataParse = 'addressInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var url = "/address.add";
                    dataSubmit.submitData($scope.additionalContactInfo[dataParse], url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submittedAddress = true;
                            $scope.message = 'Submitted successfully.';
                        } else {
                            $scope.errorMessages = response.data.message;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//SUBMIT TEAM PREFERENCE
                $scope.submittedTeam = false;
                $scope.addTeam = function () {
                    var dataParse = 'teamInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var dataSend = {};
                    dataSend.token = $scope.additionalContactInfo.teamInfo.token;
                    dataSend['contact_id'] = $scope.additionalContactInfo.teamInfo['contact_id'];
                    dataSend['user_type'] = $scope.additionalContactInfo.teamInfo['user_type'];
                    dataSend['contact_name'] = $scope.additionalContactInfo.teamInfo.contactname;
                    dataSend.team = $scope.additionalContactInfo.teamInfo.team1;
                    dataSend['explain_if_other'] = '';
                    dataSend.subteam = '';
                    dataSend['permission_level'] = '';
                    dataSend.remarks = '';
                    dataSend['date_obsolete'] = '';
                    var url = "/teamjoin.add";

                    dataSubmit.submitData(dataSend, url).then(function (response) {
                        if (response.data.message == 'success') {
                            if ($scope.additionalContactInfo.teamInfo.team2 != '') {
                                dataSend.team = $scope.additionalContactInfo.teamInfo.team2;

                                dataSubmit.submitData(dataSend, url).then(function (response) {
                                    if (response.data.message == 'success') {
                                        if ($scope.additionalContactInfo.teamInfo.team3 != '') {
                                            dataSend.team = $scope.additionalContactInfo.teamInfo.team3;

                                            dataSubmit.submitData(dataSend, url).then(function (response) {
                                                if (response.data.message == 'success') {
                                                    $scope.submittedTeam = true;
                                                    $scope.message = 'Submitted successfully.';
                                                }
                                            }, function () {
                                                window.alert("Fail to send request!");
                                            });
                                        } else {
                                            $scope.submittedTeam = true;
                                            $scope.message = 'Submitted successfully.';
                                        }
                                    }
                                }, function () {
                                    window.alert("Fail to send request!");
                                });
                            } else {
                                $scope.submittedTeam = true;
                                $scope.message = 'Submitted successfully.';
                            }
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//SUBMIT LANGUAGE
                $scope.submittedLanguage = false;
                $scope.addLanguage = function () {
                    var dataParse = 'languageInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var url = "/language.add";
                    dataSubmit.submitData($scope.additionalContactInfo[dataParse], url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submittedLanguage = true;
                            $scope.message = 'Submitted successfully.';
                        } else {
                            $scope.errorMessages = response.data.message;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//SUBMIT SKILLS AND ASSETS
                $scope.submittedLSA = false;
                $scope.addSkillasset = function () {
                    var dataParse = 'skillassetInfo';
                    $scope.additionalContactInfo[dataParse]['contact_id'] = $scope.result.contactId;
                    var url = "/skill.add";
                    dataSubmit.submitData($scope.additionalContactInfo[dataParse], url).then(function (response) {
                        if (response.data.message == 'success') {
                            $scope.submittedLSA = true;
                            $scope.message = 'Submitted successfully.';
                        } else {
                            $scope.errorMessages = response.data.message;
                            ngDialog.openConfirm({
                                template: './style/ngTemplate/errorMessage.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                    }, function () {
                        window.alert("Fail to send request!");
                    });
                };
//REFRESH PHONE PAGE
                $scope.addMorePhone = function () {
                    copyService('phoneInfo');
                    $scope.submittedPhone = false;
                    $scope.form.additionalContactForm.additionalphonenumber.$setPristine();
                };
//REFRESH EMAIL PAGE
                $scope.addMoreEmail = function () {
                    copyService('emailInfo');
                    $scope.submittedEmail = false;
                    $scope.form.additionalContactForm.additionalemail.$setPristine();
                };
//REFRESH ADDRESS PAGE
                $scope.addMoreAddress = function () {
                    copyService('addressInfo');
                    $scope.submittedAddress = false;
                    $scope.form.additionalContactForm.additionaladdress.$setPristine();
                };
//REFRESH TEAM PAGE
                $scope.addMoreTeam = function () {
                    copyService('teamInfo');
                    $scope.submittedTeam = false;
                };
//REFRESH LANGUAGE PAGE
                $scope.addMoreLanguage = function () {
                    copyService('languageInfo');
                    $scope.submittedLanguage = false;
                };
//REFRESH SKILLS AND ASSETS PAGE
                $scope.addMoreLSA = function () {
                    copyService('skillassetInfo');
                    $scope.submittedLSA = false;
                };
//DATEPICKER    
                $scope.$watch('dob', function () {
                    if (angular.isUndefined($scope.dob)) {
                        $scope.contactInfo['date_of_birth'] = "";
                    } else if ($scope.dob === "") {
                        $scope.contactInfo['date_of_birth'] = "";
                    } else if ($scope.dob === null) {
                        $scope.contactInfo['date_of_birth'] = "";
                    } else {
                        var day = $scope.dob.getDate() + "";
                        var month = ($scope.dob.getMonth() + 1) + "";
                        var year = $scope.dob.getFullYear() + "";
                        if (day.length < 2) {
                            day = '0' + day;
                        }
                        if (month.length < 2) {
                            month = '0' + month;
                        }
                        var ds = day + '/' + month + '/' + year;
                        $scope.contactInfo['date_of_birth'] = ds;
                    }
                });

                //datepickerrrrr
                $scope.today = function () {
                    $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                    $scope.dt = null;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    formatMonth: 'MMM',
                    formatDay: 'dd',
                    maxDate: new Date(),
                    startingDay: 1
                };

                $scope.open = function () {
                    $timeout(function () {
                        $scope.opened = true;
                    });
                };
                
                $scope.format = 'dd MMM yyyy';
                $scope.altInputFormats = ['M!/d!/yyyy'];
            }]);




