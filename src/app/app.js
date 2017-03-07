'use strict';

/**
 * @author ankostyuk
 */

var appInfo = require('info/info');

var _       = require('lodash'),
    i18n    = require('i18n'),
    angular = require('angular');

var ngModules = [
    require('i18n-app/i18n'),

    require('commons-angular/directives/directives'),

    require('app/components/lang/lang'),
    require('app/components/message/message'),

    require('app/components/table-editor/table-editor'),

    require('utils/utils')
];

require('bootstrap/dist/css/bootstrap.css');
require('./styles/app.less');

angular.module('app', _.map(ngModules, 'name'))
    //
    .constant('appConfig', {
        name: _tr('app.name'),
        resource: {},
        readyDelay: 500
    })
    .constant('appEvents', {
        'ready': 'app.ready',
        'error': 'app.error'
    })
    //
    .constant('appErrors', {
    })
    //
    .config(['$qProvider', '$logProvider', '$compileProvider', function($qProvider, $logProvider, $compileProvider) {
        $qProvider.errorOnUnhandledRejections(!CONFIG.PRODUCTION);

        $logProvider.debugEnabled(!CONFIG.PRODUCTION);

        $compileProvider.debugInfoEnabled(!CONFIG.PRODUCTION);
        $compileProvider.commentDirectivesEnabled(!CONFIG.PRODUCTION);
        $compileProvider.cssClassDirectivesEnabled(!CONFIG.PRODUCTION);
    }])
    //
    .run(['$log', '$rootScope', '$timeout', 'appConfig', 'appEvents', 'i18nService', function($log, $rootScope, $timeout, appConfig, appEvents, i18nService) {
        _.extend($rootScope, {
            appConfig: appConfig,
            app: {
                info: appInfo,
                lang: i18nService.getLang(),
                ready: false
            },
            isAppReady: function() {
                return $rootScope.app.ready;
            }
        }, i18n.translateFuncs);

        $timeout(function() {
            $rootScope.app.ready = true;
            $rootScope.$emit(appEvents['ready']);
        }, appConfig.readyDelay);
    }]);
//

angular.bootstrap(document, ['app'], {
    strictDi: true
});

// Analytics
require('./analytics');
