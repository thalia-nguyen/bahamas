/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.directive('compare', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            scope.$watch(attrs.ngModel, function () {
                validate();
            });
            attrs.$observe('compare', function (val) {
                validate();
            });
            var validate = function () {
                var val1 = ngModel.$viewValue;
                var val2 = attrs.compare;
                ngModel.$setValidity('compare', !val1 || !val2 || val1 === val2);
            };
        }
    };
});

app.directive('empty', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            scope.$watch(attrs.ngModel, function () {
                validate();
            });
            var validate = function () {
                var val1 = ngModel.$viewValue;
                ngModel.$setValidity('empty', val1 != null && val1.length != 0);
            };
        }
    };
});

app.controller('pageController',
        ['$scope', 'session', '$state', 'ngDialog', 'loadAllContacts', 'localStorageService', 'Idle', 'dataSubmit', '$timeout',
            function ($scope, session, $state, ngDialog, loadAllContacts, localStorageService, Idle, dataSubmit, $timeout) {
                var user = session.getSession('userType');

                $scope.$on('IdleStart', function () {
                    ngDialog.openConfirm({
                        template: './style/ngTemplate/refreshToken.html',
                        className: 'ngdialog-theme-default',
                        closeByDocument: false,
                        closeByEscape: false
                    });
                });

                $scope.$on('IdleTimeout', function () {
                    ngDialog.closeAll();
                    session.terminateSession();
                    localStorageService.clearAll();
                    $state.go('login');
                });

                $scope.$on('IdleEnd', function () {
                    ngDialog.closeAll();
                });

                $scope.populatePage = function () {
                    Idle.watch();
                    $scope.name = '';
                    $scope.userType = '';
                    if (session.getSession('username') != null) {
                        var contact = angular.fromJson(session.getSession('contact'));
                        $scope.username = session.getSession('username');
                        $scope.userType = session.getSession('userType');
                        $scope.name = angular.fromJson(session.getSession('contact')).name;
                        $scope.profile_pic = angular.fromJson(session.getSession('contact')).profile_pic;
                        console.log($scope.profile_pic);
                        if($scope.profile_pic == '') {
                            $scope.profile_pic = 'images/default.jpg';
                        }
                                
                        $scope.user = {
                            'token' : session.getSession('token'),
                            'contact_id': angular.fromJson(session.getSession('contact')).cid,
                            'current_password': '',
                            'password': '',
                            'confirm_password': ''
                        };
                        
                        $scope.resultUser = {
                            status: false,
                            message: ''
                        };
                        
                        $scope.changePassword = function () {
                            var url = AppAPI.updateUser;
                            dataSubmit.submitData($scope.user, url).then(function (response) {
                                $scope.resultUser.status = true;
                                if (response.data.message == 'success') {
                                    $scope.resultUser.message = "Change password successfully.";
                                    $timeout(function(){
                                        $('#changePassword').modal('hide');
                                    }, 1000);
                                } else {
                                    if (Array.isArray(response.data.message)) {
                                        $scope.errorMessages = response.data.message;
                                        ngDialog.openConfirm({
                                            template: './style/ngTemplate/errorMessage.html',
                                            className: 'ngdialog-theme-default',
                                            scope: $scope
                                        });
                                    } else {
                                        $scope.errorMessages = [];
                                        $scope.errorMessages.push(response.data.message);
                                        ngDialog.openConfirm({
                                            template: './style/ngTemplate/errorMessage.html',
                                            className: 'ngdialog-theme-default',
                                            scope: $scope
                                        });
                                    }
                                }
                            }, function () {
                                window.alert("Fail to send request!");
                            });
                        };
                    }
                };

                $scope.logout = function () {
                    ngDialog.openConfirm({
                        template: './style/ngTemplate/logoutPrompt.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope
                    }).then(function (response) {
//                        $timeout.cancel($scope.logoutTimer);
//                        $timeout.cancel($scope.tokenTimer);
                        session.terminateSession();
                        localStorageService.clearAll();
                        $state.go('login');
                    });
                };

                $scope.retrieveAllContacts = function () {

                    if (session.getSession('teams') === 'undefined') {
                        var contactToRetrieve = {
                            'token': session.getSession('token'),
                            'cid': angular.fromJson(session.getSession('contact')).cid,
                            'teamname': "",
                            'permission': user
                        };
                    } else {
                        var contactToRetrieve = {
                            'token': session.getSession('token'),
                            'cid': angular.fromJson(session.getSession('contact')).cid,
                            'teamname': angular.fromJson(session.getSession('teams'))[0].teamname,
                            'permission': user
                        };
                    }

                    loadAllContacts.retrieveAllContacts(contactToRetrieve).then(function (response) {
                        $scope.allContactInfo = response.data.contact;
                        $scope.allContactInfoObj = angular.fromJson($scope.allContactInfo);
                        $scope.contactname = [];
                        angular.forEach($scope.allContactInfo, function (obj) {
                            $scope.contactname.push(obj.name);
                        });
                        $scope.userType = user;
                    });

                    $scope.onSelect = function ($item, $model, $label) {
                        $scope.$item = $item;
                        $scope.$model = $model;
                        $scope.$label = $label;
                        $scope.searchContact();
                    };

                    $scope.searchContact = function () {
                        var contactCid = $scope.selected.cid;
                        var toURL = $scope.userType + ".viewIndivContact";
                        session.setSession('contactToDisplayCid', contactCid);
                        $state.go(toURL, {}, {reload: true});
                    };

                    $scope.toProfile = function () {
                        var toURL = $scope.userType + ".profile";
                        $state.go(toURL);
                    };
                };

                $scope.openSidebar = false;
                $scope.openControlBar = function () {
                    $scope.openSidebar = !$scope.openSidebar;
                };
            }]);