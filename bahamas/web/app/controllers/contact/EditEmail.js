/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('bahamas');

app.controller('EditEmail', ['$scope', 'session', 'ngDialog', '$timeout', 'dataSubmit', 'deleteService',
    function ($scope, session, ngDialog, $timeout, dataSubmit, deleteService) {

        //email
        $scope.addingEmail = false;
        $scope.addNewEmail = function () {
            $scope.addingEmail = !$scope.addingEmail;
        };
        $scope.resultEmail = {
            email: '',
            status: false,
            message: ''
        };
        $scope.editTheEmail = function ($event, email) {
            var datasend = {};
            datasend['token'] = session.getSession('token');
            if ($scope.editMode == 'true') {
                datasend['contact_id'] = $scope.contactToEditCID;
            } else {
                datasend['contact_id'] = $scope.contactToEditCID;
            }
            datasend['user_type'] = session.getSession('userType');
            datasend['email'] = email['email'];
            datasend['email_remarks'] = email['remarks'];
            if (email['date_obsolete'] == null) {
                datasend['date_obsolete'] = '';
            } else if (angular.isUndefined(email['date_obsolete'])) {
                datasend['date_obsolete'] = '';
            } else if (isNaN(email['date_obsolete'])) {
                datasend['date_obsolete'] = '';
            } else {
                datasend['date_obsolete'] = email['date_obsolete'].valueOf() + "";
            }
            var url = AppAPI.updateEmail;
            dataSubmit.submitData(datasend, url).then(function (response) {
                $scope.resultEmail.status = true;
                if (response.data.message == 'success') {
                    $scope.resultEmail['email'] = datasend['email'];
                    $scope.resultEmail.message = $scope.successMsg;
                    $scope.retrieveFunc();
                    $scope.form.editEmailForm.$setValidity();
                    $timeout(function () {
                        $scope.resultEmail.status = false;
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
                $timeout(function () {
                    $scope.resultEmail.status = false;
                }, 1000);
            }, function () {
                window.alert("Fail to send request!");
            });
        };
        $scope.deleteTheEmail = function ($event, email) {
            //to add ngDialog for confirmation
            ngDialog.openConfirm({
                template: './style/ngTemplate/deletePrompt.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            }).then(function (response) {
                var deleteEmail = {};
                deleteEmail['token'] = session.getSession('token');
                if ($scope.editMode == 'true') {
                    deleteEmail['contact_id'] = $scope.contactToEditCID;
                } else {
                    deleteEmail['contact_id'] = $scope.contactToEditCID;
                }
                deleteEmail['email'] = email['email'];
                var url = AppAPI.deleteEmail;
                deleteService.deleteDataService(deleteEmail, url).then(function (response) {
                    if (response.data.message == 'success') {
                        ngDialog.openConfirm({
                            template: './style/ngTemplate/deleteSuccess.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        }).then(function () {
                            $scope.retrieveFunc();
                        });
                    } else {
                        window.alert("Fail to delete email");
                    }
                }, function () {
                    window.alert("Fail to send request!");
                });
            });
        };
        $scope.newEmail = {
            token: session.getSession('token'),
            'contact_id': -1,
            email: '',
            'email_remarks': '',
            'date_obsolete': ''
        };
        $scope.copyEmail = angular.copy($scope.newEmail);
        $scope.submitNewEmail = {
            'submittedEmail': false,
            'message': ''
        };
        $scope.addEmail = function () {
            var url = AppAPI.addEmail;
            if ($scope.editMode == 'true') {
                $scope.newEmail['contact_id'] = $scope.contactToEditCID;
            } else {
                $scope.newEmail['contact_id'] = $scope.contactToEditCID;
            }
            dataSubmit.submitData($scope.newEmail, url).then(function (response) {
                if (response.data.message == 'success') {
                    $scope.submitNewEmail.submittedEmail = true;
                    $scope.submitNewEmail.message = $scope.successMsg;
                    $scope.retrieveFunc();
                    $scope.newEmail = angular.copy($scope.copyEmail);
                    $scope.form.editEmailForm.$setValidity();
                    $scope.form.editEmailForm.$setPristine();
                    $timeout(function () {
                        $scope.submitNewEmail.submittedEmail = false;
                    }, 1000);
                    //can set $scope.addingPhone = false if wanting to hide
                    $scope.addingEmail = false;
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

        $scope.openedEmail = [];
        $scope.openEmail = function (index) {
            $timeout(function () {
                $scope.openedEmail[index] = true;
            });
        };

    }]);

