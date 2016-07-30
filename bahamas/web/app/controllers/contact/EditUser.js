/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('EditUser', ['$scope', 'session', 'ngDialog', '$timeout', 'dataSubmit', 'deleteService',
    function ($scope, session, ngDialog, $timeout, dataSubmit, deleteService) {
        //For generating password
        $scope.generatePassword = function () {
            var a = Math.floor((Math.random() * 10) + 10);
            $scope.editUser.password = Math.random().toString(36).substring(2, a);
        };
        //For changing password
        $scope.changePass = false;
        $scope.changePassword = function () {
            $scope.changePass = !$scope.changePass;
        };

        //user
        $scope.existedUsername = false;
        $scope.checkingUsername = false;
        $scope.checkedUsername = false;
        $scope.ignore = false;
        //control errors shown
        $scope.$watch('editUser.username', function () {
            if ($scope.editUser.username == '') {
                $scope.ignore = false;
            }
        });

        $scope.resultUser = {
            status: false,
            message: ''
        };
        $scope.editTheUser = function () {
            var datasend = {};
            if ($scope.editMode == 'true') {
                if ($scope.isUser) {
                    if ($scope.isAdmin) {
                        datasend['token'] = session.getSession('token');
                        datasend['contact_id'] = $scope.editUser['contact_id'];
                        datasend['deactivated'] = ($scope.editUser['deactivated'] === 'true');
                        datasend['is_admin'] = ($scope.editUser['is_admin'] === 'true');
                        submitUser(datasend, false);
                    }
                } else {
                    $scope.checkingUsername = true;
                    var dataToSend = {};
                    dataToSend['token'] = session.getSession('token');
                    dataToSend['username'] = $scope.editUser['username'];
                    datasend['token'] = session.getSession('token');
                    datasend['contact_id'] = contactToRetrieve['other_cid'];
                    datasend['username'] = $scope.editUser['username'];
                    datasend['password'] = $scope.editUser['password'];
                    datasend['email'] = $scope.editUser['email'];
                    submitUser(datasend, true);
                }
            } else {
                datasend['token'] = session.getSession('token');
                datasend['contact_id'] = $scope.editUser['contact_id'];
                datasend['current_password'] = $scope.editUser['current_password'];
                datasend['password'] = $scope.editUser['password'];
                datasend['confirm_password'] = $scope.editUser['confirm_password'];
                submitUser(datasend, false);
                $scope.changePassword();
            }
        };
        //to update user info
        var submitUser = function (datasend, create) {
            var url = AppAPI.updateUser;
            dataSubmit.submitData(datasend, url).then(function (response) {
                $scope.resultUser.status = true;
                if (response.data.message == 'success') {
                    $scope.resultUser.message = $scope.successMsg;
                    $scope.retrieveFunc();
                    if (create) {
                        $scope.isUser = true;
                    }
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
    }]);
