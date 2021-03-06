exports.execute = function() {

    beforeAll(function() {
        'use strict';
        function stringify(entity) {
            return jasmine.pp(entity);
        }
        jasmine.addMatchers({
            toHaveSameItems: function(util, customEqualityTesters) {
                function isObject(obj) {
                    return Object.prototype.toString.apply(obj) === '[object Object]';
                }
                function craftMessage(actual, expected, mismatches) {
                    if(mismatches.length === 0) {
                        return 'The collections do not match in length or objects. \n Expected collection:' + stringify(actual) + ' is not equal to ' + stringify(expected);
                    }
                    return ['The collections have equal length, but do not match.'].concat(mismatches.map(function(m) {
                        return 'At ' + m.index + ': expected ' + stringify(m.expected) + ', actual ' + stringify(m.actual);
                    })).join('\n    ');
                }
                function compareArraysSorted(actual, expected) {
                    var mismatches = [];
                    actual.forEach(function(item, i) {
                        if(!util.equals(item, expected[i], customEqualityTesters)) {
                            mismatches.push({index: i, actual: item, expected: expected[i]});
                        }
                    });
                    return mismatches;
                }
                function compareArraysIgnoreSort(actual, expected) {
                    expected = expected.slice(0);
                    var mismatches = [];
                    actual.forEach(function(item, i) {
                        var foundIndex = -1;
                        expected.some(function(expectedItem, i) {
                            if(util.equals(item, expectedItem, customEqualityTesters)) {
                                foundIndex = i;
                                return true;
                            }
                        });
                        if(foundIndex > -1) {
                            expected.splice(foundIndex, 1)
                        } else {
                            mismatches.push({index: i, actual: item, expected: null});
                        }
                    });
                    mismatches = mismatches.concat(expected.map(function(val, i) {
                        return {index: actual.length+i, actual: null, expected: val};
                    }));
                    return mismatches;
                }
                function compareHashes(actual, expected) {
                    var mismatches = {};
                    Object.keys(actual).forEach(function(key) {
                        if(!util.equals(actual[key], expected[key], customEqualityTesters)) {
                            mismatches[key] = {index: key, actual: actual[key], expected: expected[key]};
                        }
                    });
                    Object.keys(expected).forEach(function(key) {
                        if(!util.equals(actual[key], expected[key], customEqualityTesters) && !mismatches[key]) {
                            mismatches[key] = {index: key, actual: actual[key], expected: expected[key]};
                        }
                    });
                    return Object.keys(mismatches).map(function(key) {
                        return mismatches[key];
                    });
                }
                return {
                    compare: function(actual, expected, ignoreOrder) {
                        if(!Array.isArray(actual) && !isObject(actual)) {
                            throw new Error('Actual must be an Array or Object. Is type: ' + typeof actual);
                        }
                        if(!Array.isArray(expected) && !isObject(expected)) {
                            throw new Error('Expectation must be an Array or Object. Is type: ' + typeof expected);
                        }
                        var mismatches;
                        if(Array.isArray(actual) && Array.isArray(expected)) {
                            if(actual.length !== expected.length) {
                                return {
                                    pass: false,
                                    message: 'Array length differs! Actual length: ' + actual.length + ', expected length: ' + expected.length
                                };
                            }
                            if(ignoreOrder) {
                                mismatches = compareArraysIgnoreSort(actual, expected);
                            } else {
                                mismatches = compareArraysSorted(actual, expected);
                            }
                        }
                        else {
                            mismatches = compareHashes(actual, expected);
                        }
                        return {
                            pass: mismatches.length === 0,
                            message: craftMessage(actual, expected, mismatches)
                        };
                    }
                };
            },

            toBeAnyOf: function(util, customEqualityTesters) {
                function craftMessage(actual, expected){
                    if (Array.isArray(expected)) {
                        return "Expected '" + actual + "' to be any one of these:\n" + expected.join(" | ");
                    } else{
                        return "Expected value must be an array.";
                    }
                };
                return {
                    compare: function(actual, expected){
                        var result = false;
                        if(Array.isArray(expected)){
                            for (var i = 0; i < expected.length; i++) {
                                if (actual === expected[i]) {
                                    result = true;
                                    break;
                                }
                            }
                        }
                        return {
                            pass: result,
                            message: craftMessage(actual, expected)
                        };
                    }
                }
            },

            toThrow: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var result = false;
                        var exception;
                        if (typeof actual != 'function') {
                            throw new Error('Actual is not a function');
                        }
                        try {
                            actual();
                        } catch (e) {
                            exception = e;
                        }
                        if (exception) {
                            result = (expected === jasmine.undefined || util.equals(exception.code || exception.message || exception, expected.code || expected.message || expected, customEqualityTesters));
                        }

                        var message;

                        if (exception && (expected === jasmine.undefined || !util.equals(exception.message || exception, expected.message || expected, customEqualityTesters))) {
                          message = ["Expected function not to throw", expected ? expected.message || expected : "an exception", ", but it threw", exception.message || exception].join(' ');
                        } else {
                          message = "Expected function to throw an exception.";
                        }

                        return { pass: result, message: message };
                    }
                }
            }
        });
    });
};
