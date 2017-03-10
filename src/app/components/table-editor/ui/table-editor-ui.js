'use strict';

/**
 * @author ankostyuk
 */

require('jquery');
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui-touch-punch');

var _           = require('lodash'),
    i18n        = require('i18n'),
    papa        = require('papaparse'),
    encoding    = require('text-encoding'),
    jschardet   = require('jschardet'),
    download    = require('downloadjs'),
    angular     = require('angular');

require('angular-ui-sortable');

var templates = {
    'table-editor': require('./views/table-editor.html')
};

var htmlBody = $('html, body');

module.exports = angular.module('app.table-editor.ui', ['ui.sortable'])
    //
    .run(['utils', function(utils) {
        utils.translateTemplates(templates);
    }])
    //
    .controller('appTableEditorController', ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
        //
        var dataMeta = {
            properties: {
                'name': {
                    normalize: function(value) {
                        return _.isString(value) ? _.trim(value) : '';
                    },
                    isValid: function(value) {
                        return !!value;
                    }
                },
                'value': {
                    normalize: function(value) {
                        return _.isString(value) ? _.trim(value) : '';
                    },
                    isValid: function(value) {
                        return !!value;
                    }
                }
            },
            raw: {
                indent: '    ', // 4 spaces
                newline: '\r\n',
                downloadFileName: 'table-data',
                json: {
                    fromRawFunc: fromJson,
                    toRawFunc: toJson,
                    sample: require('./views/table-editor-raw-sample-json.txt'),
                    downloadFileNameExt: 'json',
                    downloadFileMimeType: 'text/json'
                },
                csv: {
                    fromRawFunc: fromCsv,
                    toRawFunc: toCsv,
                    sample: require('./views/table-editor-raw-sample-csv.txt'),
                    downloadFileNameExt: 'csv',
                    downloadFileMimeType: 'text/csv',
                    parse: {
                        header: true
                    },
                    unparse: {
                        delimiter: ';'
                    }
                }
            }
        };

        //
        _.extend($scope, {
            records: [], //angular.fromJson(require('./views/table-editor-raw-test-json.txt')),
            raw: {
                json: null,
                csv: null,
                current: null,
                error: null,
                active: 'json'
            },
            fileReader: new FileReader(),
            touchSupport: $.support.touch
        }, i18n.translateFuncs);

        //
        $scope.addRecord = function() {
            $scope.records.push({});

            $timeout(function() {
                $element.find($scope.newRowCellSelector).focus();
            });
        };

        $scope.removeRecord = function(index) {
            $scope.records.splice(index, 1);
        };

        //
        $scope.fromRaw = function() {
            fromRaw();
        };

        $scope.toRaw = function() {
            toRaw();
            activateRawTextElement();
        };

        $scope.setActiveRaw = function(type) {
            $scope.raw[$scope.raw.active] = $scope.raw.current;
            setActiveRaw(type);
            activateRawTextElement();
        };

        $scope.isJsonRaw = function() {
            return $scope.raw.active === 'json';
        };

        $scope.isCsvRaw = function() {
            return $scope.raw.active === 'csv';
        };

        $scope.getRawPlaceholder = function() {
            return dataMeta.raw[$scope.raw.active].sample;
        };

        $scope.getRawPlaceholderByType = function(type) {
            return dataMeta.raw[type].sample;
        };

        $scope.isRawEmpty = function() {
            return !_.size($scope.raw.current);
        };

        //
        $scope.fromFile = function() {
            var rawText = _.trim(getFileText() || ''),
                records, rawRecords, fromRawResult;

            _.each([fromJson, fromCsv], function(fromRawFunc) {
                fromRawResult = fromRawFunc(rawText);

                if (!fromRawResult.error) {
                    rawRecords  = fromRawResult.records || [];
                    records     = transformRecords(rawRecords);
                }

                return fromRawResult.error || _.isEmpty(records);
            });

            $scope.fileFormatError = _.isEmpty(records);
            $scope.fileName = _.get($scope.file, 'name');
            $scope.resetFile();

            if (!$scope.fileFormatError) {
                $scope.records = records;
                $scope.changeMode = false;
            }
        };

        $scope.toFile = function(type) {
            var activeRawMeta   = dataMeta.raw[type],
                records         = transformRecords($scope.records);

            var raw = activeRawMeta.toRawFunc(records);

            download(
                raw,
                dataMeta.raw.downloadFileName + '.' + activeRawMeta.downloadFileNameExt,
                activeRawMeta.downloadFileMimeType
            );
        };

        //
        $scope.isTableEmpty = function() {
            return !_.size($scope.records);
        };

        $scope.isTableRowReorder = function() {
            return _.size($scope.records) > 1;
        };

        //
        $scope.toggleChangeMode = function() {
            return $scope.changeMode = !$scope.changeMode;
        };

        //
        // $scope.onContentTextChange = function(model, data) {
        //     if (_.startsWith(data.modelName, 'record.')) {
        //         onRecordsChange();
        //     }
        // };

        //
        // Simple validation:
        //  record valid if one of properties is valid
        function isRecordValid(record) {
            var valid = false;

            _.each(dataMeta.properties, function(propMeta, propName) {
                valid = propMeta.isValid(record[propName]);
                return !valid;
            });

            return valid;
        }

        // Custom pretty JSON:
        // [
        //     {"name":"...","value"="..."},
        //     {"name":"...","value"="..."}
        // ]
        //
        function toJson(records) {
            var raw = dataMeta.raw;

            var recordJsons = _.map(records, function(r) {
                return raw.indent + angular.toJson(r);
            });

            return '[' + raw.newline +
                recordJsons.join(',' + raw.newline) + raw.newline +
            ']';
        }

        // CSV:
        // name;value
        // ...;...
        // ...;...
        //
        function toCsv(records) {
            return papa.unparse({
                fields: _.keys(dataMeta.properties),
                data: !_.isEmpty(records) && records
            }, dataMeta.raw.csv.unparse);
        }

        //
        function fromJson(json) {
            var records, error;

            try {
                records = angular.fromJson(json);
            } catch (e) {
                // log?
                error = true;
            }

            return {
                records: records,
                error: error
            };
        }

        //
        function fromCsv(csv) {
            var results = papa.parse(csv, dataMeta.raw.csv.parse);

            return {
                records: results.data,
                error: !!_.size(results.errors)
            };
        }

        // Build valid record with normalized values
        // and returns record or null
        function transformRecord(object) {
            if (!_.isObject(object) || _.isEmpty(object)) {
                return null;
            }

            var record = {};

            _.each(dataMeta.properties, function(propMeta, propName) {
                record[propName] = propMeta.normalize(object[propName]);
            });

            if (isRecordValid(record)) {
                return record;
            }

            return null;
        }

        // Build valid records from collection
        function transformRecords(collection) {
            var records = [],
                record;

            _.each(collection, function(r) {
                record = transformRecord(r);
                record && records.push(record);
            });

            return records;
        }

        //
        function toRaw() {
            var records = transformRecords($scope.records);

            $scope.raw.json = toJson(records);
            $scope.raw.csv = toCsv(records);

            setActiveRaw($scope.raw.active);
        }

        function fromRaw() {
            var rawText         = _.trim($scope.raw.current || ''),
                fromRawFunc     = dataMeta.raw[$scope.raw.active].fromRawFunc,
                fromJsonResult  = fromRawFunc(rawText),
                error           = fromJsonResult.error;

            if (error) {
                $scope.raw.error = true;
                return;
            }

            var rawRecords  = fromJsonResult.records || [],
                records     = transformRecords(rawRecords);

            if (_.isEmpty(records) && !_.isEmpty(rawRecords)) {
                $scope.raw.error = true;
                return;
            }

            $scope.raw.error = false;
            $scope.records = records;

            $scope.changeMode = false;

            //
            $timeout(function() {
                htmlBody.stop().animate({
                    scrollTop: $scope.editableTable.offset().top
                }, 200, 'swing');
            });
        }

        function setActiveRaw(type) {
            $scope.raw.error = false;
            $scope.raw.current = $scope.raw[type];
            $scope.raw.active = type;
        }

        function activateRawTextElement() {
            $timeout(function() {
                $scope.rawTextInput.focus();
            });
        }

        function getFileText() {
            try {
                var array           = new Uint8Array($scope.fileReader.result),
                    encodingInfo    = jschardet.detect(String.fromCharCode.apply(null, array)),
                    decoder         = new encoding.TextDecoder(encodingInfo.encoding);

                return decoder.decode(array);
            } catch (e) {
                console.warn('getFileText... error:', e);
                return null;
            }
        }
    }])
    //
    .directive('appTableEditor', [function() {
        return {
            restrict: 'A',
            template: templates['table-editor'],
            scope: {},
            controller: 'appTableEditorController',
            link: function(scope, element) {
                //
                var editableTable   = element.find('.table-data table');

                scope.editableTable = editableTable;

                //
                // editable
                //
                editableTable
                    .on('focus', '[contenteditable]', function() {
                        $(this).parent().addClass('focus');
                    })
                    .on('blur', '[contenteditable]', function() {
                        $(this).parent().removeClass('focus');
                    });

                //
                // sortable
                //
                var sortableTemplateCells   = editableTable.find('thead tr').children();

                scope.sortableOptions = {
                    handle: '.reorder-handle',
                    axis: 'y',
                    helper: 'clone',
                    tolerance: 'pointer',

                    // fix layout
                    activate: function(e, ui) {
                        editableTable.find('.editable').removeClass('focus');

                        ui.helper.children().each(function(i, td) {
                            var cell            = $(td),
                                templateCell    = $(sortableTemplateCells[i]),
                                position        = templateCell.position(),
                                width           = templateCell.width();

                            cell.css({
                                left: position.left + 'px'
                            }).width(width);
                        });

                        ui.placeholder.css({
                            'visibility': 'hidden'
                        }).height(ui.helper.height());
                    }
                };

                //
                var newRowCellSelector  = '.table-data table tbody tr:last-child td:first-child [contenteditable]',
                    rawTextInput        = element.find('.raw-data textarea'),
                    fileForm            = element.find('.open-file-form'),
                    fileFormInput       = fileForm.find('.open-file input'),
                    fileReader          = scope.fileReader;

                scope.newRowCellSelector = newRowCellSelector;
                scope.rawTextInput = rawTextInput;

                scope.resetFile = function() {
                    resetFileReader();
                    scope.file = null;
                    fileForm.get(0).reset();
                };

                fileFormInput.change(function(){
                    scope.$apply(doFile());
                });

                function doFile() {
                    resetFileReader();

                    var file = _.get(fileFormInput.get(0), 'files[0]');

                    if (!file) {
                        return;
                    }

                    scope.fileLoad = true;
                    fileReader.readAsArrayBuffer(file);

                    scope.file = file;
                }

                fileReader.onload = function() {
                    if (scope.fileLoad) {
                        scope.fromFile();
                        scope.$apply();
                    }
                };

                function resetFileReader() {
                    if (fileReader.readyState === fileReader.LOADING) {
                        fileReader.abort();
                    }
                    scope.fileLoad = false;
                }
            }
        };
    }])
    //
    // TODO common directive
    .directive('contentTextEditable', [function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, model) {
                if (!model) {
                    return;
                }

                model.$render = function() {
                    render(model.$viewValue);
                };

                element.on('blur keyup change', function(event) {
                    scope.$evalAsync(read, {
                        event: event
                    });
                });

                function render(value) {
                    // text only
                    value = normalizeValue(value);
                    element.text(value);
                }

                function read(scope, locals) {
                    // text only
                    var value       = normalizeValue(element.text()),
                        oldValue    = model.$modelValue;

                    model.$setViewValue(value);

                    emit(value, oldValue, locals);
                }

                function normalizeValue(value) {
                    return _.isString(value) ? _.trim(value) : '';
                }

                function isEquals(v1, v2) {
                    return normalizeValue(v1) === normalizeValue(v2);
                }

                function emit(value, oldValue, locals) {
                    if (!isEquals(value, oldValue) && scope.onContentTextChange) {
                        scope.onContentTextChange(model, _.extend({
                            value: value,
                            oldValue: oldValue,
                            modelName: model.$$attr.ngModel
                        }, locals));
                    }
                }

                //
                scope.$eval(model.$$attr.ngModel);
            }
        };
    }]);
//
