'use strict';

/**
 * @author ankostyuk
 */

var _       = require('lodash'),
    angular = require('angular');

var ngModules = [
    require('./ui/table-editor-ui')
];

module.exports = angular.module('app.table-editor', _.map(ngModules, 'name'));
