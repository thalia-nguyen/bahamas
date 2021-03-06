///* 
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
'use strict';

var app = angular.module('bahamas',
        ['ui.router', 'ngAnimate', 'ngDialog', 'ui.bootstrap', 'cgBusy', 'LocalStorageModule', 'ngIdle', 'ui.tree', 'uiGmapgoogle-maps', 'ngFileUpload', 'ui.calendar', 'registration', 'forgotPassword']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/notFound");

    $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller: 'loginController'
            })
            .state('forgotPassword', {
                url: '/forgotPassword',
                templateUrl: 'forgotPassword.html',
                controller: 'ForgotPassCtrl'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/views/admin.html',
                controller: 'pageController'
            })
            .state('admin.addContact', {
                url: '/addContact',
                templateUrl: 'app/views/contact/createContact.html',
                controller: 'createContact'
            })
            .state('admin.viewContacts', {
                url: '/viewContacts',
                templateUrl: 'app/views/contact/viewContacts.html',
                controller: 'viewContacts'
            })
            .state('admin.audit', {
                url: '/auditlog',
                templateUrl: 'app/views/auditlog/viewAuditLog.html',
                controller: 'viewAuditLog'
            })
            .state('admin.viewIndivContact', {
                url: '/viewIndivContact',
                templateUrl: 'app/views/contact/viewIndividualContact.html',
                controller: 'viewIndivContact'
            })
            .state('admin.profile', {
                url: '/profile',
                templateUrl: 'app/views/contact/profile.html',
                controller: 'profileCtrl'
            })
            .state('admin.editContact', {
                url: '/editContact',
                templateUrl: 'app/views/contact/editContact.html',
                controller: 'editContact'
            })
            .state('admin.export', {
                url: '/export',
                templateUrl: 'app/views/dataManagement/export.html',
                controller: 'export'
            })
            .state('admin.import', {
                url: '/import',
                templateUrl: 'app/views/dataManagement/import.html',
                controller: 'import'
            })
            .state('admin.generalReport', {
                url: '/generalReport',
                templateUrl: 'app/views/report/generalReport.html',
                controller: 'generalReport'
            })
            .state('admin.individualReport', {
                url: '/individualReport',
                templateUrl: 'app/views/report/individualReport.html',
                controller: 'individualReport'
            })
            .state('admin.globalSettings', {
                url: '/globalSettings',
                templateUrl: 'app/views/settings/globalSettings.html',
                controller: 'globalSettings'
            })
            .state('admin.createEvent', {
                url: '/createEvent',
                templateUrl: 'app/views/event/createEvent.html',
                controller: 'createEvent'
            })
            .state('admin.createEventRoles', {
                url: '/createEventRoles',
                templateUrl: 'app/views/event/createEventRoles.html',
                controller: 'createEventRoles'
            })
            .state('admin.createEventAffiliation', {
                url: '/createEventAffiliation',
                templateUrl: 'app/views/event/createEventAffiliation.html',
                controller: 'createEventAffiliation'
            })
            .state('admin.viewPastEvents', {
                url: '/viewPastEvents',
                templateUrl: 'app/views/event/viewPastEvents.html',
                controller: 'viewPastEvents'
            })
            .state('admin.viewUpcomingEvents', {
                url: '/viewUpcomingEvents',
                templateUrl: 'app/views/event/viewUpcomingEvents.html',
                controller: 'viewUpcomingEvents'
            })
            .state('admin.viewIndivEvent', {
                url: '/viewIndivEvent',
                templateUrl: 'app/views/event/viewIndivEvent.html',
                controller: 'viewIndivEvent'
            })
            .state('admin.editEvent', {
                url: '/editEvent',
                templateUrl: 'app/views/event/editEvent.html',
                controller: 'editEvent'
            })
            .state('admin.eventParticipationSummary', {
                url: '/eventParticipationSummary',
                templateUrl: 'app/views/event/upcomingEventPS.html',
                controller: 'upcomingEventPS'
            })
            .state('admin.pastEventParticipationSummary', {
                url: '/pastEventParticipationSummary',
                templateUrl: 'app/views/event/pastEventPS.html',
                controller: 'pastEventsPS'
            })
            .state('admin.viewPastIndivEvent', {
                url: '/viewPastIndivEvent',
                templateUrl: 'app/views/event/viewPastIndivEvent.html',
                controller: 'viewPastIndivEvent'
            })
            .state('admin.cloneEvent', {
                url: '/cloneEvent',
                templateUrl: 'app/views/event/cloneEvent.html',
                controller: 'cloneEvent'
            })
            .state('admin.cloneEventRoles', {
                url: '/cloneEventRoles',
                templateUrl: 'app/views/event/cloneEventRoles.html',
                controller: 'cloneEventRoles'
            })
            .state('admin.cloneEventAffiliation', {
                url: '/cloneEventAffiliation',
                templateUrl: 'app/views/event/cloneEventAffiliation.html',
                controller: 'cloneEventAffiliation'
            })
            .state('admin.editPastEvent', {
                url: '/editPastEvent',
                templateUrl: 'app/views/event/editPastEvent.html',
                controller: 'editPastEvent'
            })
            .state('admin.searchContacts', {
                url: '/searchContacts',
                templateUrl: 'app/views/search/searchContacts.html',
                controller: 'searchContacts'
            })
            .state('admin.searchEvents', {
                url: '/searchEvents',
                templateUrl: 'app/views/search/searchEvents.html',
                controller: 'searchEvents'
            })
            .state('admin.userManagement', {
                url: '/userManagement',
                templateUrl: 'app/views/userManagement/userManagement.html',
                controller: 'userManagementCtrl'
            })
            .state('admin.unverifiedUsers', {
                url: '/unverifiedContacts',
                templateUrl: 'app/views/userManagement/unverifiedUsers.html',
                controller: 'unverifiedUsersCtrl'
            })
            .state('admin.verifiedUsers', {
                url: '/verifiedContacts',
                templateUrl: 'app/views/userManagement/verifiedUsers.html',
                controller: 'verifiedUsersCtrl'
            })
            .state('admin.formManagement', {
                url: '/formManagement',
                templateUrl: 'app/views/remoteRegistration/formManagement.html',
                controller: 'formManagement'
            })
            .state('admin.remoteRegistration', {
                url: '/remoteRegistration',
                templateUrl: 'app/views/remoteRegistration/remoteRegistration.html',
                controller: 'remoteRegistration'
            })
            .state('novice', {
                url: '/novice',
                templateUrl: 'app/views/novice.html',
                controller: 'pageController'
            })
            .state('novice.profile', {
                url: '/profile',
                templateUrl: 'app/views/contact/profile.html',
                controller: 'profileCtrl'
            })
            .state('novice.viewUpcomingEvents', {
                url: '/viewUpcomingEvents',
                templateUrl: 'app/views/event/viewUpcomingEvents.html',
                controller: 'viewUpcomingEvents'
            })
            .state('novice.editContact', {
                url: '/editContact',
                templateUrl: 'app/views/contact/editContact.html',
                controller: 'editContact'
            })
            .state('novice.viewIndivEvent', {
                url: '/viewIndivEvent',
                templateUrl: 'app/views/event/viewIndivEvent.html',
                controller: 'viewIndivEvent'
            })
            .state('associate', {
                url: '/associate',
                templateUrl: 'app/views/associate.html',
                controller: 'pageController'
            })
            .state('associate.viewContacts', {
                url: '/viewContacts',
                templateUrl: 'app/views/contact/viewContacts.html',
                controller: 'viewContacts'
            })
            .state('associate.viewIndivContact', {
                url: '/viewIndivContact',
                templateUrl: 'app/views/contact/viewIndividualContact.html',
                controller: 'viewIndivContact'
            })
            .state('associate.profile', {
                url: '/profile',
                templateUrl: 'app/views/contact/profile.html',
                controller: 'profileCtrl'
            })
            .state('associate.viewUpcomingEvents', {
                url: '/viewUpcomingEvents',
                templateUrl: 'app/views/event/viewUpcomingEvents.html',
                controller: 'viewUpcomingEvents'
            })
            .state('associate.viewIndivEvent', {
                url: '/viewIndivEvent',
                templateUrl: 'app/views/event/viewIndivEvent.html',
                controller: 'viewIndivEvent'
            })
            .state('associate.viewPastEvents', {
                url: '/viewPastEvents',
                templateUrl: 'app/views/event/viewPastEvents.html',
                controller: 'viewPastEvents'
            })
            .state('associate.eventParticipationSummary', {
                url: '/eventParticipationSummary',
                templateUrl: 'app/views/event/upcomingEventPS.html',
                controller: 'upcomingEventPS'
            })
            .state('associate.pastEventParticipationSummary', {
                url: '/pastEventParticipationSummary',
                templateUrl: 'app/views/event/pastEventPS.html',
                controller: 'pastEventsPS'
            })
            .state('associate.viewPastIndivEvent', {
                url: '/viewPastIndivEvent',
                templateUrl: 'app/views/event/viewPastIndivEvent.html',
                controller: 'viewPastIndivEvent'
            })
            .state('associate.searchContacts', {
                url: '/searchContacts',
                templateUrl: 'app/views/search/searchContacts.html',
                controller: 'searchContacts'
            })
            .state('associate.searchEvents', {
                url: '/searchEvents',
                templateUrl: 'app/views/search/searchEvents.html',
                controller: 'searchEvents'
            })
            .state('teammanager', {
                url: '/teammanager',
                templateUrl: 'app/views/teammanager.html',
                controller: 'pageController'
            })
            .state('teammanager.viewContacts', {
                url: '/viewContacts',
                templateUrl: 'app/views/contact/viewContacts.html',
                controller: 'viewContacts'
            })
            .state('teammanager.addContact', {
                url: '/addContact',
                templateUrl: 'app/views/contact/createContact.html',
                controller: 'createContact'
            })
            .state('teammanager.viewIndivContact', {
                url: '/viewIndivContact',
                templateUrl: 'app/views/contact/viewIndividualContact.html',
                controller: 'viewIndivContact'
            })
            .state('teammanager.profile', {
                url: '/profile',
                templateUrl: 'app/views/contact/profile.html',
                controller: 'profileCtrl'
            })
            .state('teammanager.editContact', {
                url: '/editContact',
                templateUrl: 'app/views/contact/editContact.html',
                controller: 'editContact'
            })
            .state('teammanager.createEvent', {
                url: '/createEvent',
                templateUrl: 'app/views/event/createEvent.html',
                controller: 'createEvent'
            })
            .state('teammanager.createEventRoles', {
                url: '/createEventRoles',
                templateUrl: 'app/views/event/createEventRoles.html',
                controller: 'createEventRoles'
            })
            .state('teammanager.createEventAffiliation', {
                url: '/createEventAffiliation',
                templateUrl: 'app/views/event/createEventAffiliation.html',
                controller: 'createEventAffiliation'
            })
            .state('teammanager.viewPastEvents', {
                url: '/viewPastEvents',
                templateUrl: 'app/views/event/viewPastEvents.html',
                controller: 'viewPastEvents'
            })
            .state('teammanager.viewUpcomingEvents', {
                url: '/viewUpcomingEvents',
                templateUrl: 'app/views/event/viewUpcomingEvents.html',
                controller: 'viewUpcomingEvents'
            })
            .state('teammanager.viewIndivEvent', {
                url: '/viewIndivEvent',
                templateUrl: 'app/views/event/viewIndivEvent.html',
                controller: 'viewIndivEvent'
            })
            .state('teammanager.editEvent', {
                url: '/editEvent',
                templateUrl: 'app/views/event/editEvent.html',
                controller: 'editEvent'
            })
            .state('teammanager.eventParticipationSummary', {
                url: '/eventParticipationSummary',
                templateUrl: 'app/views/event/upcomingEventPS.html',
                controller: 'upcomingEventPS'
            })
            .state('teammanager.pastEventParticipationSummary', {
                url: '/pastEventParticipationSummary',
                templateUrl: 'app/views/event/pastEventPS.html',
                controller: 'pastEventsPS'
            })
            .state('teammanager.viewPastIndivEvent', {
                url: '/viewPastIndivEvent',
                templateUrl: 'app/views/event/viewPastIndivEvent.html',
                controller: 'viewPastIndivEvent'
            })
            .state('teammanager.cloneEvent', {
                url: '/cloneEvent',
                templateUrl: 'app/views/event/cloneEvent.html',
                controller: 'cloneEvent'
            })
            .state('teammanager.cloneEventRoles', {
                url: '/cloneEventRoles',
                templateUrl: 'app/views/event/cloneEventRoles.html',
                controller: 'cloneEventRoles'
            })
            .state('teammanager.cloneEventAffiliation', {
                url: '/cloneEventAffiliation',
                templateUrl: 'app/views/event/cloneEventAffiliation.html',
                controller: 'cloneEventAffiliation'
            })
            .state('teammanager.editPastEvent', {
                url: '/editPastEvent',
                templateUrl: 'app/views/event/editPastEvent.html',
                controller: 'editPastEvent'
            })
            .state('teammanager.generalReport', {
                url: '/generalReport',
                templateUrl: 'app/views/report/generalReport.html',
                controller: 'generalReport'
            })
            .state('teammanager.individualReport', {
                url: '/individualReport',
                templateUrl: 'app/views/report/individualReport.html',
                controller: 'individualReport'
            })
            .state('teammanager.searchContacts', {
                url: '/searchContacts',
                templateUrl: 'app/views/search/searchContacts.html',
                controller: 'searchContacts'
            })
            .state('teammanager.searchEvents', {
                url: '/searchEvents',
                templateUrl: 'app/views/search/searchEvents.html',
                controller: 'searchEvents'
            })
            .state('teammanager.userManagement', {
                url: '/userManagement',
                templateUrl: 'app/views/userManagement/userManagement.html',
                controller: 'userManagementCtrl'
            })
            .state('teammanager.unverifiedUsers', {
                url: '/unverifiedContacts',
                templateUrl: 'app/views/userManagement/unverifiedUsers.html',
                controller: 'unverifiedUsersCtrl'
            })
            .state('teammanager.verifiedUsers', {
                url: '/verifiedContacts',
                templateUrl: 'app/views/userManagement/verifiedUsers.html',
                controller: 'verifiedUsersCtrl'
            })
            .state('teammanager.formManagement', {
                url: '/formManagement',
                templateUrl: 'app/views/remoteRegistration/formManagement.html',
                controller: 'formManagement'
            })
            .state('teammanager.remoteRegistration', {
                url: '/remoteRegistration',
                templateUrl: 'app/views/remoteRegistration/remoteRegistration.html',
                controller: 'remoteRegistration'
            })
            .state('eventleader', {
                url: '/eventleader',
                templateUrl: 'app/views/eventleader.html',
                controller: 'pageController'
            })
            .state('eventleader.viewContacts', {
                url: '/viewContacts',
                templateUrl: 'app/views/contact/viewContacts.html',
                controller: 'viewContacts'
            })
            .state('eventleader.viewIndivContact', {
                url: '/viewIndivContact',
                templateUrl: 'app/views/contact/viewIndividualContact.html',
                controller: 'viewIndivContact'
            })
            .state('eventleader.profile', {
                url: '/profile',
                templateUrl: 'app/views/contact/profile.html',
                controller: 'profileCtrl'
            })
            .state('eventleader.addContact', {
                url: '/addContact',
                templateUrl: 'app/views/contact/createContact.html',
                controller: 'createContact'
            })
            .state('eventleader.editContact', {
                url: '/editContact',
                templateUrl: 'app/views/contact/editContact.html',
                controller: 'editContact'
            })
            .state('eventleader.createEvent', {
                url: '/createEvent',
                templateUrl: 'app/views/event/createEvent.html',
                controller: 'createEvent'
            })
            .state('eventleader.createEventRoles', {
                url: '/createEventRoles',
                templateUrl: 'app/views/event/createEventRoles.html',
                controller: 'createEventRoles'
            })
            .state('eventleader.createEventAffiliation', {
                url: '/createEventAffiliation',
                templateUrl: 'app/views/event/createEventAffiliation.html',
                controller: 'createEventAffiliation'
            })
            .state('eventleader.viewPastEvents', {
                url: '/viewPastEvents',
                templateUrl: 'app/views/event/viewPastEvents.html',
                controller: 'viewPastEvents'
            })
            .state('eventleader.viewUpcomingEvents', {
                url: '/viewUpcomingEvents',
                templateUrl: 'app/views/event/viewUpcomingEvents.html',
                controller: 'viewUpcomingEvents'
            })
            .state('eventleader.viewIndivEvent', {
                url: '/viewIndivEvent',
                templateUrl: 'app/views/event/viewIndivEvent.html',
                controller: 'viewIndivEvent'
            })
            .state('eventleader.editEvent', {
                url: '/editEvent',
                templateUrl: 'app/views/event/editEvent.html',
                controller: 'editEvent'
            })
            .state('eventleader.eventParticipationSummary', {
                url: '/eventParticipationSummary',
                templateUrl: 'app/views/event/upcomingEventPS.html',
                controller: 'upcomingEventPS'
            })
            .state('eventleader.pastEventParticipationSummary', {
                url: '/pastEventParticipationSummary',
                templateUrl: 'app/views/event/pastEventPS.html',
                controller: 'pastEventsPS'
            })
            .state('eventleader.viewPastIndivEvent', {
                url: '/viewPastIndivEvent',
                templateUrl: 'app/views/event/viewPastIndivEvent.html',
                controller: 'viewPastIndivEvent'
            })
            .state('eventleader.cloneEvent', {
                url: '/cloneEvent',
                templateUrl: 'app/views/event/cloneEvent.html',
                controller: 'cloneEvent'
            })
            .state('eventleader.cloneEventRoles', {
                url: '/cloneEventRoles',
                templateUrl: 'app/views/event/cloneEventRoles.html',
                controller: 'cloneEventRoles'
            })
            .state('eventleader.cloneEventAffiliation', {
                url: '/cloneEventAffiliation',
                templateUrl: 'app/views/event/cloneEventAffiliation.html',
                controller: 'cloneEventAffiliation'
            })
            .state('eventleader.editPastEvent', {
                url: '/editPastEvent',
                templateUrl: 'app/views/event/editPastEvent.html',
                controller: 'editPastEvent'
            })
            .state('eventleader.searchContacts', {
                url: '/searchContacts',
                templateUrl: 'app/views/search/searchContacts.html',
                controller: 'searchContacts'
            })
            .state('eventleader.searchEvents', {
                url: '/searchEvents',
                templateUrl: 'app/views/search/searchEvents.html',
                controller: 'searchEvents'
            })
            .state('eventleader.userManagement', {
                url: '/userManagement',
                templateUrl: 'app/views/userManagement/userManagement.html',
                controller: 'userManagementCtrl'
            })
            .state('eventleader.unverifiedUsers', {
                url: '/unverifiedContacts',
                templateUrl: 'app/views/userManagement/unverifiedUsers.html',
                controller: 'unverifiedUsersCtrl'
            })
            .state('eventleader.verifiedUsers', {
                url: '/verifiedContacts',
                templateUrl: 'app/views/userManagement/verifiedUsers.html',
                controller: 'verifiedUsersCtrl'
            })
            .state('eventleader.formManagement', {
                url: '/formManagement',
                templateUrl: 'app/views/remoteRegistration/formManagement.html',
                controller: 'formManagement'
            })
            .state('eventleader.remoteRegistration', {
                url: '/remoteRegistration',
                templateUrl: 'app/views/remoteRegistration/remoteRegistration.html',
                controller: 'remoteRegistration'
            })
            .state('unauthorised', {
                url: '/unauthorised',
                templateUrl: 'unauthorised.html',
                controller: 'unauthorisedController'
            })
            .state('notFound', {
                url: '/notFound',
                templateUrl: 'notFound.html',
                controller: 'unfoundController'
            })
            .state('registration', {
                url: '/registration',
                templateUrl: 'registration.html'
            });

});

app.config(function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        closeByNavigation: true,
        closeByEscape: true
    });
    ngDialogProvider.setForceBodyReload(true);
});

app.config(['IdleProvider', function (IdleProvider) {
        IdleProvider.idle(1740);
        IdleProvider.timeout(10);
    }]);

app.config([
    'uiGmapGoogleMapApiProvider',
    function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCQeF9t1XxpfqEsfYcX4t03Gd_H7PcKC0Y',
            v: '3.26',
            libraries: 'places,geometry,visualization,weather'
        });
    }
]);

app.run(['$rootScope', 'session', '$state', function ($rootScope, session, $state) {
        $rootScope.commonUrl = 'http://localhost:8084/bahamas';
        $rootScope.previousState;

        if (window.location.hostname == 'localhost') {
            $rootScope.commonUrl = 'http://localhost:8084/bahamas';
        } else {
            //actual server
//            $rootScope.commonUrl = 'https://rms.twc2.org.sg/bahamas';

            //development server
            $rootScope.commonUrl = 'https://rmsdev.twc2.org.sg/bahamas';
        }

        $rootScope.$on('$stateChangeStart', function (event, targetScope, targetParams, fromScope, to, from) {
            var permission = targetScope.name.split('.')[0];

            if (permission == 'notFound' && session.getSession('userType') == null) {
                event.preventDefault();
                $state.go('login');
            }
            if (permission == 'notFound' && session.getSession('userType') != null) {
                event.preventDefault();
                $state.go(session.getSession('userType'));
            }
            if (permission === 'novice') {
                if (session.getSession('userType') !== 'novice' && session.getSession('userType') != null) {
                    event.preventDefault();
                    $state.go('unauthorised');
                } else if (session.getSession('userType') == null) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            if (permission === 'admin') {
                if (session.getSession('userType') !== 'admin' && session.getSession('userType') != null) {
                    event.preventDefault();
                    $state.go('unauthorised');
                } else if (session.getSession('userType') == null) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            if (permission === 'teammanager') {
                if (session.getSession('userType') !== 'teammanager' && session.getSession('userType') != null) {
                    event.preventDefault();
                    $state.go('unauthorised');
                } else if (session.getSession('userType') == null) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            if (permission === 'eventleader') {
                if (session.getSession('userType') !== 'eventleader' && session.getSession('userType') != null) {
                    event.preventDefault();
                    $state.go('unauthorised');
                } else if (session.getSession('userType') == null) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            if (permission === 'associate') {
                if (session.getSession('userType') !== 'associate' && session.getSession('userType') != null) {
                    event.preventDefault();
                    $state.go('unauthorised');
                } else if (session.getSession('userType') == null) {
                    event.preventDefault();
                    $state.go('login');
                }
            }
            if (permission === 'login' && (session.getSession('userType') !== null)) {
                if (fromScope.url == '/unauthorised') {
                    session.terminateSession();
                } else {
                    event.preventDefault();
                    $state.go(session.getSession('userType'));
                }
            }
            if (permission == 'unauthorised' || permission == 'notFound') {
                $rootScope.previousState = fromScope.name;
            }
        }
        );
    }]);

