'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var templates = {
    'table-editor': require('./views/table-editor.html')
};

module.exports = angular.module('app.table-editor.ui', [])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .controller('appTableEditorController', ['$scope', function($scope) {
    }])
    //
    .directive('appTableEditor', [function() {
        return {
            restrict: 'A',
            template: templates['table-editor'],
            scope: {},
            controller: 'appTableEditorController'
        };
    }]);
//
