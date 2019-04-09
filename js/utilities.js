
    // polyfill for Array.includes
    // came from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement /*, fromIndex*/) {
            'use strict';
            if (this === null) {
                throw new TypeError('Array.prototype.includes called on null or undefined');
            }

            var O = Object(this);
            var len = parseInt(O.length, 10) || 0;
            if (len === 0) {
                return false;
            }
            var n = parseInt(arguments[1], 10) || 0;
            var k;
            if (n >= 0) {
                k = n;
            } else {
                k = len + n;
                if (k < 0) {k = 0;}
            }
            var currentElement;
            while (k < len) {
                currentElement = O[k];
                if (searchElement === currentElement ||
                    (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                    return true;
                }
                k++;
            }
            return false;
        };
    }

    // polyfill for Array.findIndex
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this === null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    //Polyfill for Array.find
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {

            // 1. Let O be ? ToObject(this value).
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }

            var O = Object(this);

            // 2. Find index of value
            var index = O.findIndex(predicate);

            // 3. If index is not -1 then value  at that index
            if (index !== -1) {
                return O[index];
            }

            // 7. Return undefined.
            return undefined;
        };
    }

    // Polyfill for string.endswith
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }

    // Polyfill for string.startswith
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }

    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';

                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }

    // Utility function to replace all occurances of a search with its replacement in a string
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    // utility function to clear out an array
    // 3 options to do this:
    //  1. this.length = 0
    //  2. this.splice(0, this.length)
    //  3. while (this.length) this.pop()
    // options 1 and 2 are fastest. Option 1 sets
    // the internal data to be removed by the garbage collector
    Array.prototype.clear = function() {
        this.length = 0;
    };

    /**
     * Given a string representing a hex, turn it into base64
     * @private
     * @param  {string} hex
     * @return {string}
     */
    _hexToBase64 = function (hex) {
        return window.btoa(String.fromCharCode.apply(null,
          hex.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
        );
    };

    /**
     * Given a base64 string, url encode it.
     *i.e. '+' and '/' are replaced with '-' and '_' also any trailing '=' removed.
     *
     * @private
     * @param  {string} str
     * @return {string}
     */
    _urlEncodeBase64 = function (str) {
        return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    };

    /**
     * Given a url encoded base64 (output of `_urlEncodeBase64`), return the
     * actual base64 string.
     *
     * @param  {string} str
     * @return {string}
     */
    _urlDecodeBase64 = function (str) {
        str = (str + '===').slice(0, str.length + (str.length % 4));
        return str.replace(/-/g, '+').replace(/_/g, '/');
    };

    /**
     * Given a string represting a JSON document returns the compressed version of it.
     * It will return null if the given string is not a valid JSON.
     * @param  {String} str
     * @return {String}
     */
    module.encodeFacetString = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return "";
        }
        return module._LZString.compressToEncodedURIComponent(str);
    };

    /**
     * Given an object, returns the string comrpessed version of it
     * @param  {Object} obj
     * @return {String}
     */
    module.encodeFacet = function (obj) {
        return module._LZString.compressToEncodedURIComponent(JSON.stringify(obj,null,0));
    };

    module.decodeFacet = function (blob, path) {
        var err = new module.InvalidFacetOperatorError(
            typeof path === "string" ? path : "",
            module._facetingErrors.invalidString
        );

        try {
            var str = module._LZString.decompressFromEncodedURIComponent(blob);
            if (str === null) {
                throw err;
            }
            return JSON.parse(str);
        } catch (exception) {
            console.log(exception);
            throw err;
        }
    };

    /**
     * Returns true if given parameter is object and not null
     * @param  {*} obj
     * @return {boolean}
     */
    var isObjectAndNotNull = function (obj) {
        return typeof obj === "object" && obj !== null;
    };

    /**
     * Returns true if given paramter is object.
     * @param  {*} obj
     * @return {boolean}
     */
    var isObject = function (obj) {
        return obj === Object(obj) && !Array.isArray(obj);
    };

    /**
     * Returns true if given parameter isan integer
     * @param  {*} x
     * @return {boolean}
     */
    var isInteger = function (x) {
        return (typeof x === 'number') && (x % 1 === 0);
    };

    /**
     * Check if object has all the keys in the given array
     * @param  {Object} obj the object
     * @param  {String[]} arr array of key strings
     * @return {boolean}
     */
    module.ObjectHasAllKeys = function (obj, arr) {
        return arr.every(function (item) {
            return obj.hasOwnProperty(item);
        });
    };

    /**
     * Replaces characters in strings that are illegal/unsafe for filenames.
     * Unsafe characters are either removed or replaced by a substitute set
     * in the optional `options` object.
     *
     * Illegal Characters on Various Operating Systems
     * / ? < > \ : * | "
     * https://kb.acronis.com/content/39790
     *
     * Unicode Control codes
     * C0 0x00-0x1f & C1 (0x80-0x9f)
     * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
     *
     * Reserved filenames on Unix-based systems (".", "..")
     * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
     * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
     * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
     * "LPT9") case-insesitively and with or without filename extensions.
     *
     * source: https://github.com/parshap/node-sanitize-filename/blob/master/index.js
     *
     * @param {String} str original filename
     * @param {String=} replacement the string that the invalid characters should be replaced with
     * @return {String} sanitized filename
     */
    module._sanitizeFilename = function (str, replacement) {
        replacement = (typeof replacement == "string") ? replacement : '_';

        var illegalRe = /[\/\?<>\\:\*\|":]/g;
        var controlRe = /[\x00-\x1f\x80-\x9f]/g;
        var reservedRe = /^\.+$/;
        var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
        var windowsTrailingRe = /[\. ]+$/;
        return str.replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement)
            .replace(windowsTrailingRe, replacement);
    };

    /**
     * @private
     * @param {Object} child child class
     * @param {Object} parent parent class
     * @desc
     * This function should be called to extend a prototype with another one.
     * Make sure to attach the right constructor to the prototypes after,
     * and also call `child.superClass.call(this, arguments*)` in frist line of
     * the child constructor with appropriate arguments.
     * You can define the extra or overriden functions of child before calling _extends.
     * This function will take care of copying those functions.
     * *Must be called after defining parent prototype and child constructor*
     */
    module._extends = function (child, parent) {
        var childFns = child.prototype;
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
        child.superClass = parent;
        child.super = parent.prototype;
    };

    /**
     * @function
     * @param {Object} copyTo the object to copy values to.
     * @param {Object} copyFrom the object to copy value from.
     * @desc
     * This private utility function does a shallow copy between objects.
     */
    module._shallowCopy = function (copyTo, copyFrom) {
        for (var key in copyFrom) {
            // only copy those properties that were set in the object, this
            // will skip properties from the source object's prototype
            if (copyFrom.hasOwnProperty(key)) {
                copyTo[key] = copyFrom[key];
            }
        }
    };

    /**
     * @private
     * @function
     * @param  {Object} source the object that you want to be copied
     * @desc
     * Creat a deep copy of the given object.
     * NOTE: This is very limited and only works for simple objects.
     * Some of its limitations are:
     * 1. Cannot copy functions.
     * 2. Cannot work on circular references.
     * 3. Will convert date objects back to UTC in the string representation in the ISO8601 format.
     * 4. It will fail to copy anything that is not in the JSON spec.
     *
     * ONLY USE THIS FUNCTION IF IT IS NOT ANY OF THE GIVEN LIMIATIONS.
     */
    module._simpleDeepCopy = function (source) {
        return JSON.parse(JSON.stringify(source));
    };

    /**
     * Given a string, will return the existing value in the object.
     * It will return undefined if the key doesn't exist or invalid input.
     * @param  {Object} obj  The object that we want the value from
     * @param  {String} path the string path (`a.b.c`)
     * @return {Object}      value
     */
    module._getPath = function (obj, path) {
        var pathNodes;

        if (typeof path === "string") {
            if (path.length === 0) {
                return this[""];
            }
            pathNodes = path.split(".");
        } else if (Array.isArray(path)) {
            pathNodes = path;
        } else {
            return undefined;
        }

        for (var i = 0; i < pathNodes.length; i++) {
            if (!obj.hasOwnProperty(pathNodes[i])) {
                return undefined;
            }
            obj = obj[pathNodes[i]];
        }
        return obj;
    };

    /**
     * @function
     * @param {String} str string to be converted.
     * @desc
     * Converts a string to title case (separators are space, hyphen, and underscore)
     */
    module._toTitleCase = function (str) {
        return str.replace(/([^\x00-\x7F]|([^\W_]))[^\-\s_]*/g, function(txt){
            return txt.charAt(0).toLocaleUpperCase() + txt.substr(1).toLocaleLowerCase();
        });
    };

    /**
    * @function
    * @param {String} str string to be manipulated.
    * @private
    * @desc
    * Replaces underline with space.
    */
    module._underlineToSpace = function (str) {
      return str.replace(/_/g, ' ');
    };

    /**
     * @function
     * @private
     * @param {Object} obj the object
     * @param {String} key the key that we want from the object
     * @desc
     * matches the keys by removing `.`, `-`, `_`, and space.
     */
    module._getClosest = function(obj, key) {
        if (key in obj) { // return the exact
            return {"data": obj[key], "key": key};
        }

        var removeExtra = function (str) { // remove `.`, `-`, `_`, and space
            return str.replace(/[\.\s\_-]+/g, "").toLocaleLowerCase();
        };

        var newKey = removeExtra(key);
        for (var objKey in obj) { // find the closest
            if (obj.hasOwnProperty(objKey) && removeExtra(objKey) == newKey) {
                return {"data": obj[objKey], "key": objKey};
            }
        }
        return undefined;
    };

    /**
     * Given an object recursively replace all the dots in the keys with underscore.
     * This will also remove any custom JavaScript objects.
     * NOTE: This function will ignore any objects that has been created from a custom constructor.
     * NOTE: This function does not detect loop, make sure that your object does not have circular references.
     *
     * @param  {Object} obj A simple javascript object. It should not include anything that is not in JSON syntax (functions, etc.).
     * @return {Object} A new object created by:
     *  1. Replacing the dots in keys to underscore.
     *  2. Ignoring any custom-type objects. The given object should be JSON not JavaScript object.
     */
    module._replaceDotWithUnderscore = function (obj) {
        var res = {}, val, k, newK;
        for (k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            val = obj[k];

            // we don't accept custom type objects (we're not detecting circular reference)
            if (isObject(val) && (val.constructor && val.constructor != Object)) continue;

            newK = k;
            if (k.includes(".")) {
                // replace dot with underscore
                newK = k.replace(/\./g,"_");
            }

            if (isObject(val)) {
                res[newK] = module._replaceDotWithUnderscore(val);
            } else {
                res[newK] = val;
            }
        }
        return res;
    };

    module._stripTrailingSlash = function (str) {
        return str.endsWith("/") ? str.slice(0, -1) : str;
    };

    /**
     * Strip the trailing slash if there's any
     * @private
     * @param  {String} str
     * @return {String}
     */
    module._stripTrailingSlash = function (str) {
        return str.endsWith("/") ? str.slice(0, -1) : str;
    };

    /**
     * trim the slashes that might exist at the begining or end of the string
     * @param  {String} str
     * @return {String}
     */
    module.trimSlashes = function (str) {
        return str.replace(/^\/+|\/+$/g, '');
    };

    /**
     * @function
     * @param {String} str string to be encoded.
     * @desc
     * converts a string to an URI encoded string
     */
    module._fixedEncodeURIComponent = function (str) {
        var result = encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
        return result;
    };

    /**
     * @function
     * @param {String} regExp string to be regular expression encoded
     * @desc converts the string into a regular expression with properly encoded characters
     */
    module._encodeRegexp = function (str) {
        var stringReplaceExp = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$]/g;
        // the first '\' escapes the second '\' which is used to escape the matched character in the returned string
        // $& represents the matched character
        var escapedRegexString = str.replace(stringReplaceExp, '\\$&');

        return escapedRegexString;
    };

    module._nextChar = function (c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    };

    /**
     * @function
     * @param {Object} element a model element (schema, table, or column)
     * @param {boolean} useName determines whether we can use name and name_style or not
     * @param {Object} parentElement the upper element (schema->null, table->schema, column->table)
     * @desc This function determines the display name for the schema, table, or
     * column elements of a model.
     */
    module._determineDisplayName = function (element, useName, parentElement) {
        var value = useName ? element.name : undefined,
            unformatted = useName ? element.name : undefined,
            hasDisplayName = false,
            isHTML = false;
        try {
            var display_annotation = element.annotations.get(module._annotations.DISPLAY);
            if (display_annotation && display_annotation.content) {

                //get the markdown display name
                if(display_annotation.content.markdown_name) {
                    value = module._formatUtils.printMarkdown(display_annotation.content.markdown_name, { inline: true });
                    unformatted = display_annotation.content.name ? display_annotation.content.name : display_annotation.content.markdown_name;
                    hasDisplayName = true;
                    isHTML = true;
                }
                //get the specified display name
                else if (display_annotation.content.name){
                    value = display_annotation.content.name;
                    unformatted = display_annotation.content.name;
                    hasDisplayName = true;
                    isHTML = false;
                }

                //get the name styles
                if(useName && display_annotation.content.name_style){
                    element._nameStyle = display_annotation.content.name_style;
                }
            }
        } catch (exception) {
            // no display annotation, don't do anything
        }

        // if name styles are undefined, get them from the parent element
        // if it's a system column, don't use the name_styles that are defined on the parent.
        // NOTE: underline_space, title_case, markdown might be null.
        if(parentElement && !(element instanceof Column && module._systemColumns.indexOf(element.name) !== -1)){
            if(!("underline_space" in element._nameStyle)){
               element._nameStyle.underline_space = parentElement._nameStyle.underline_space;
            }
            if(!("title_case" in element._nameStyle)){
                element._nameStyle.title_case = parentElement._nameStyle.title_case;
            }
            if(!("markdown" in element._nameStyle)){
                element._nameStyle.markdown = parentElement._nameStyle.markdown;
            }
        }

        // if name was not specified and name styles are defined, apply the heuristic functions (name styles)
        if(useName && !hasDisplayName && element._nameStyle){
            if(element._nameStyle.markdown){
                value = module._formatUtils.printMarkdown(element.name, { inline: true });
                isHTML = true;
            } else {
                if(element._nameStyle.underline_space){
                    value = module._underlineToSpace(value);
                    unformatted = module._underlineToSpace(unformatted);
                }
                if(element._nameStyle.title_case){
                    value = module._toTitleCase(value);
                    unformatted = module._toTitleCase(unformatted);
                }
            }
        }

        return {"isHTML": isHTML, "value": value, "unformatted": unformatted};
    };

    /**
     * @function
     * @param {string} context the context that we want the value of.
     * @param {ERMrest.Annotation} annotation the annotation object.
     * @desc This function returns the list that should be used for the given context.
     * Used for visible columns and visible foreign keys.
     */
    module._getRecursiveAnnotationValue = function (context, annotation) {
        var contextedAnnot = module._getAnnotationValueByContext(context, annotation);
        if (contextedAnnot !== -1) { // found the context
            if (typeof contextedAnnot == "object" || (module._contextArray.indexOf(contextedAnnot) === -1) ) {
                return contextedAnnot;
            } else {
                return module._getRecursiveAnnotationValue(contextedAnnot, annotation); // go to next level
            }
        }

        return -1; // there was no annotation
    };

    /**
    * @param {string} context the context that we want the value of.
    * @param {Object} annotation the annotation object.
    * @desc returns the annotation value based on the given context.
    */
    module._getAnnotationValueByContext = function (context, annotation) {

        // check annotation is an object
        if (typeof annotation !== "object" || annotation == null) {
            return -1;
        }

        if (typeof context === "string") {
            // NOTE: We assume that context names are seperated with `/`
            var partial = context,
                parts = context.split("/");
            while (partial !== "") {
              if (partial in annotation) { // found the context
                return annotation[partial];
              }
              parts.splice(-1,1); // remove the last part
              partial = parts.join("/");
            }
        }

        // if context wasn't in the annotations but there is a default context
        if (module._contexts.DEFAULT in annotation) {
            return annotation[module._contexts.DEFAULT];
        }

        return -1; // there was no annotation
    };

    /**
    * @param {object} ref The object that we want the null value for.
    * @param {string} context The context that we want the value of.
    * @param {Array} elements All the possible levels of heirarchy (column, table, schema).
    * @desc returns the null value for the column based on context and annotation and sets in the ref object too.
    */
    module._getNullValue = function (ref, context, elements) {
        if (context in ref._nullValue) { // use the cached value
            return ref._nullValue[context];
        }

        var value = -1,
            displayAnnot = module._annotations.DISPLAY;

        // first look at the column, then table, and at last schema for annotation.
        for (var i=0; i < elements.length; i++) {
            if (elements[i].annotations.contains(displayAnnot)) {
                var annotation = elements[i].annotations.get(displayAnnot);
                if(annotation && annotation.content && annotation.content.show_nulls){
                    value = module._getAnnotationValueByContext(context, annotation.content.show_nulls);
                    if (value !== -1) break; //found the value
                }
            }
        }

        if (value === false) { //eliminate the field
            value = null;
        } else if (value === true) { //empty field
            value = "";
        } else if (typeof value !== "string") { // default
            if (context === module._contexts.DETAILED) {
                value = null; // default null value for DETAILED context
            } else {
                value = ""; //default null value
            }
        }

        ref._nullValue[context] = value; // cache the value
        return value;
    };

    /**
     * @param {string|object} colObject if the foreignkey/key is compund, this should be the constraint name. otherwise the source syntax for pseudo-column.
     * @desc return the name that should be used for pseudoColumn. This function makes sure that the returned name is unique.
     * This function can be used to get the name that we're using for :
     *
     * - Composite key/foreignkeys:
     *   In this case, if the constraint name is [`s`, `c`], you should pass `s_c` to this function.
     * - Simple foiregnkey/key:
     *   Pass the equivalent pseudo-column definition of them. It must at least have `source` as an attribute.
     * - Pseudo-Columns:
     *   Just pass the object that defines the pseudo-column. It must at least have `source` as an attribute.
     *
     */
    module.generatePseudoColumnHashName = function (colObject) {

        //we cannot create an object and stringify it, since its order can be different
        //instead will create a string of `source + aggregate + entity`
        var str = "";

        // it should have source
        if (typeof colObject === "object") {
            if (!colObject.source) return null;

            if (_sourceHasPath(colObject.source)) {
                // since it's an array, it will preserve the order
                str += JSON.stringify(colObject.source);
            } else {
                str += _getSourceColumnStr(colObject.source);
            }

            if (typeof colObject.aggregate === "string") {
                str += colObject.aggregate;
            }

            // entity true doesn't change anything
            if (colObject.entity === false) {
                str += colObject.entity;
            }

            if (colObject.self_link === true) {
                str += colObject.self_link;
            }
        } else if (typeof colObject === "string"){
            str = colObject;
        } else {
            return null;
        }

        // md5
        str = ERMrest._SparkMD5.hash(str);

        // base64
        str = _hexToBase64(str);

        // url safe
        return _urlEncodeBase64(str);
    };


    /**
     * @private
     * @param  {Object} colObject the column definition
     * @param  {ERMrest.Column} column
     * @return {Object} the returned object has `name` and `isHash` attributes.
     * @desc generates a name for the given pseudo-column
     */
    _generatePseudoColumnName = function (colObject, column) {
        if ((typeof colObject.aggregate === "string") || _sourceHasPath(colObject.source) || _isSourceObjectEntityMode(colObject, column)) {
            return {name: module.generatePseudoColumnHashName(colObject), isHash: true};
        }

        return {name: column.name, isHash: false};
    };

    _generateForeignKeyName = function (fk, isInbound) {
        var eTable = isInbound ? fk._table : fk.key.table;

        if (!isInbound) {
            return module.generatePseudoColumnHashName({
                source: [{outbound: fk.constraint_names[0]}, eTable.shortestKey[0].name]
            });
        }

        var source = [{inbound: fk.constraint_names[0]}];
        if (eTable._isPureBinaryAssociation()) {
            var otherFK;
            for (j = 0; j < eTable.foreignKeys.length(); j++) {
                if(eTable.foreignKeys.all()[j] !== fk) {
                    otherFK = eTable.foreignKeys.all()[j];
                    break;
                }
            }

            source.push({outbound: otherFK.constraint_names[0]});
            source.push(otherFK.key.table.shortestKey[0].name);
        } else {
            source.push(eTable.shortestKey[0].name);
        }

        return module.generatePseudoColumnHashName({source: source});
    };

    // given a reference and associated data to it, will return a list of Values
    // corresponding to its sort object
    _getPagingValues = function (ref, rowData, rowLinkedData) {
        if (!rowData) {
            return null;
        }
        var loc = ref.location,
            values = [], addedCols = {}, sortObjectNames = {},
            col, i, j, sortCol, colName, data, fkData;

        for (i = 0; i < loc.sortObject.length; i++) {
            colName = loc.sortObject[i].column;

            try {
                col = ref.getColumnByName(colName);
            } catch (e) {
                return null; // column doesn't exist return null.
            }

            // avoid duplicate sort columns
            if (col.name in sortObjectNames) continue;
            sortObjectNames[col.name] = true;

            if (!col.sortable) {
                return null;
            }

            for (j = 0; j < col._sortColumns.length; j++) {
                sortCol = col._sortColumns[j].column;

                // avoid duplciate columns
                if (sortCol in addedCols) continue;
                addedCols[sortCol] = true;

                if (col.isForeignKey || (col.isPathColumn && col.isUnique && col.hasPath)) {
                    fkData = rowLinkedData[col.name];
                    data = null;
                    if (isObjectAndNotNull(fkData)) {
                        data =  fkData[sortCol.name];
                    }
                } else {
                    data = rowData[sortCol.name];
                }
                values.push(data);
            }
        }
        return values;
    };

    /**
     * @private
     * Process the given list of column order, and return the appropriate list
     * of objects that have:
     * - `column`: The {@link ERMrest.Column} object.
     * - `descending`: The boolean that Indicates whether we should reverse sort order or not.
     *
     * @param  {string} columnOrder The object that defines the column/row order
     * @param  {ERMrest.Table} table
     * @param  {Object} the extra options:
     *                  - allowNumOccurrences: to allow the specific frequency column_order
     * @return {Array=} If it's undefined, the column_order that is defined is not valid
     */
    _processColumnOrderList = function (columnOrder, table, options) {
        options = options || {};

        if (columnOrder === false) {
            return false;
        }

        var res, colName, descending, colNames = {}, numOccurr = false;
        if (Array.isArray(columnOrder)) {
            res = [];
            for (var i = 0 ; i < columnOrder.length; i++) {
                try {
                    if (typeof columnOrder[i] === "string") {
                        colName = columnOrder[i];
                    } else if (columnOrder[i] && columnOrder[i].column) {
                        colName = columnOrder[i].column;
                    } else if (options.allowNumOccurrences && !numOccurr && columnOrder[i] && columnOrder[i].num_occurrences) {
                        numOccurr = true;
                        // add the frequency sort
                        res.push({num_occurrences: true, descending:  (columnOrder[i] && columnOrder[i].descending === true)});

                        continue;
                    } else {
                        continue; // invalid syntax
                    }

                    col = table.columns.get(colName);

                    // make sure it's sortable
                    if (module._nonSortableTypes.indexOf(col.type.name) !== -1) {
                        continue;
                    }

                    // avoid duplicates
                    if (colName in colNames) {
                        continue;
                    }
                    colNames[colName] = true;

                    descending = (columnOrder[i] && columnOrder[i].descending === true);
                    res.push({
                        column: col,
                        descending: descending,
                    });
                } catch(exception) {}
            }
        }
        return res; // it might be undefined
    };

    /**
     * @function
     * @private
     * @param {ERMrest.Table} table The object that we want the formatted values for.
     * @param {String} context the context that we want the formatted values for.
     * @param {object} data The object which contains key value pairs of data to be transformed
     * @param {object} linkedData The object which contains key value paris of foreign key data.
     * @return {object} A formatted keyvalue pair of object
     * @desc Returns a formatted keyvalue pairs of object as a result of using `col.formatvalue`.
     * If you want the formatted value of a single column, you should call formatvalue,
     * this function is written for the purpose of being used in markdown.
     */
    module._getFormattedKeyValues = function(table, context, data, linkedData) {
        var keyValues, k, fkData, col, cons, rowname, v;

        var findCol = function (colName, currTable) {
            if (Array.isArray(currTable)) {
                return currTable.filter(function (col) {return col.name === colName;})[0];
            }
            return currTable.columns.get(k);
        };

        var getTableValues = function (d, currTable) {
            var res = {};
            for (k in d) {
                try {
                    col = findCol(k, currTable);
                    v = col.formatvalue(d[k], context);
                    if (col.type.isArray) {
                        res[k] = module._formatUtils.printArray(v, {isMarkdown: true});
                    } else {
                        res[k] = v;
                    }
                } catch(e) {
                    res[k] = d[k];
                }
                // Inject raw data in the keyvalues object prefixed with an '_'
                res["_" + k] = d[k];
            }
            return res;
        };

        // get the data from current table
        keyValues = getTableValues(data, table);

        //get foreignkey data if available
        if (linkedData && typeof linkedData === "object" && table.foreignKeys.length() > 0) {
            keyValues.$fkeys = {};
            table.foreignKeys.all().forEach(function (fk) {
                var p = module._generateRowLinkProperties(fk.key, linkedData[fk.name], context);
                if (!p) return;

                cons = fk.constraint_names[0];
                if (!keyValues.$fkeys[cons[0]]) {
                    keyValues.$fkeys[cons[0]] = {};
                }

                var fkTempVal = {
                    "values": getTableValues(linkedData[fk.name], fk.key.table),
                    "rowName": p.unformatted,
                    "uri": {
                        "detailed": p.reference.contextualize.detailed.appLink
                    }
                };

                // the new format
                keyValues["$fkey_" + cons[0] + "_" + cons[1]] = fkTempVal;

                // the old format
                keyValues.$fkeys[cons[0]][cons[1]] = fkTempVal;
            });
        }

        return keyValues;
    };

    /**
     * @private
     * @param  {string[]} columnNames Array of column names
     * @return {string|false} the column name. if couldn't find any columns will return false.
     */
    module._getCandidateRowNameColumn = function (columnNames) {
        var candidates = [
            'title', 'name', 'term', 'label', 'accessionid', 'accessionnumber'
        ];

        var removeExtra = function (str) { // remove `.`, `-`, `_`, and space
            return str.replace(/[\.\s\_-]+/g, "").toLocaleLowerCase();
        };

        for (var i = 0; i < columnNames.length; i++) {
            var closest = removeExtra(columnNames[i]);
            if (candidates.indexOf(closest) !== -1) {
                return columnNames[i];
            }
        }

        // couldn't find any columns
        return false;
    };

    /**
     * returns an object with the following attributes:
     *  - values: the formatted and unformatted values
     *  - rowName: a rowname object.
     *  - uri.detailed: applink to detailed for the row
     * @private
     * @param  {ERMrest.Table} table  the table object
     * @param  {string} context    current context
     * @param  {Object} data       the raw data
     * @param  {Object} linkedData the raw data of foreignkeys
     * @param  {ERMrest.Reference=} ref to avoid creating a new reference
     * @return {Object}
     */
    module._getRowTemplateVariables = function (table, context, data, linkedData, ref) {
        if (ref == null) {
            var uri = _generateRowURI(table, data);
            if (uri == null) return {};
            ref = new Reference(module.parse(uri), table.schema.catalog);
        }
        return {
            values: module._getFormattedKeyValues(table, context, data, linkedData),
            rowName: module._generateRowName(table, context, data, linkedData).value,
            uri: {
                detailed: ref.contextualize.detailed.appLink
            }
        };
    };

    /**
     * @function
     * @private
     * @param {ERMrest.Table} table The table that we want the row name for.
     * @param {String} context Current context.
     * @param {object} data The object which contains key value pairs of data.
     * @param {Object} linkedData The object which contains key value pairs of foreign key data.
     * @param {boolean} isTitle determines Whether we want rowname for title or not
     * @returns {object} The displayname object for the row. It includes has value, isHTML, and unformatted.
     * @desc Returns the row name (html) using annotation or heuristics.
     */
    module._generateRowName = function (table, context, data, linkedData, isTitle) {
        var annotation, col, template, keyValues, pattern, actualContext;

        var formattedValues = module._getFormattedKeyValues(table, context, data, linkedData);

        // If table has table-display annotation then set it in annotation variable
        if (table.annotations && table.annotations.contains(module._annotations.TABLE_DISPLAY)) {
            actualContext = isTitle ? "title" : (typeof context === "string" && context !== "*" ? context : "");
            annotation = module._getRecursiveAnnotationValue(
                [module._contexts.ROWNAME, actualContext].join("/"),
                table.annotations.get(module._annotations.TABLE_DISPLAY).content
            );
        }

        // if annotation is populated and annotation has display.rowName property
        if (annotation && typeof annotation.row_markdown_pattern === 'string') {
            template = annotation.row_markdown_pattern;

            pattern = module._renderTemplate(template, formattedValues, table, context, {formatted: true, templateEngine: annotation.template_engine});

        }

        // annotation was not defined, or it's producing empty string.
        if (pattern == null || pattern.trim() === '') {

            // no row_name annotation, use column with title, name, term
            var candidate = module._getCandidateRowNameColumn(Object.keys(data)), result;
            if (candidate !== false) {
                result = formattedValues[candidate];
            }

            if (!result) {

                // no title, name, term, label column: use id:text type
                // Check for id column whose type should not be integer or serial
                var idCol = table.columns.all().filter(function (c) {
                    return ((c.name.toLowerCase() === "id") && (c.type.name.indexOf('serial') === -1) && (c.type.name.indexOf('int') === -1));
                });


                // no id:text, use the unique key
                // If id column exists
                if (idCol.length && typeof data[idCol[0].name] === 'string') {

                    result = formattedValues[idCol[0].name];

                } else {

                    // Get the columns for displaykey
                    var keyColumns = table.displayKey;

                    // TODO this check needs to change. it is supposed to check if the table has a key or not
                    // if (keyColumns.length >= table.columns.length) {
                    //     return null;
                    // }

                    var values = [];

                    // Iterate over the keycolumns to get their formatted values for `row_name` context
                    keyColumns.forEach(function (c) {
                        var value = formattedValues[c.name];
                        values.push(value);
                    });

                    /*
                     * join all values by ':' to get the display_name
                     * Eg: displayName for values=["12", "DNA results for human specimen"] would be
                     * "12:DNA results for human specimen"
                     */
                    result = values.join(':');
                }
            }

            template = "{{{name}}}";
            keyValues = {"name": result};

            // get templated patten after replacing the values using Mustache
            pattern = module._renderTemplate(template, keyValues, table, context, {formatted: true});
        }

        // Render markdown content for the pattern
        if (pattern == null || pattern.trim() === '') {
            return {"value": "", "unformatted": ""};
        }

        return {
            "value": module._formatUtils.printMarkdown(pattern, { inline: true }),
            "unformatted": pattern,
            "isHTML": true
        };

    };

    /**
     * @function
     * @private
     * @desc Given a key object, will return the presentation object that can bse used for it
     * @param  {ERMrest.Key} key    the key object
     * @param  {object} data        the data for the table that key is from
     * @param  {string} context     the context string
     * @param  {object=} options
     * @return {object} the presentation object that can be used for the key
     * (it has `isHTML`, `value`, and `unformatted`).
     * NOTE the function might return `null`.
     */
    module._generateKeyPresentation = function (key, data, context, options) {
        // if data is empty
        if (typeof data === "undefined" || data === null || Object.keys(data).length === 0) {
            return null;
        }

        var value, caption, unformatted, i;
        var cols = key.colset.columns,
            rowURI = _generateRowURI(key.table, data, key);

        // if any of key columns don't have data, this link is not valid.
        if (rowURI == null) {
            return null;
        }

        // make sure that formattedValues is defined
        options = options || {};
        if (options.formattedValues === undefined) {
           options.formattedValues = module._getFormattedKeyValues(key.table, context, data);
        }

        // use the markdown_pattern that is defiend in key-display annotation
        var display = key.getDisplay(context);
        if (display.isMarkdownPattern) {
            unformatted = module._renderTemplate(display.markdownPattern, options.formattedValues, key.table, context, {formatted:true});
            unformatted = (unformatted === null || unformatted.trim() === '') ? "" : unformatted;
            caption = module._formatUtils.printMarkdown(unformatted, { inline: true });
        } else {
            var values = [], unformattedValues = [];

            // create the caption
            var presentation;
            for (i = 0; i < cols.length; i++) {
                try {
                    presentation = cols[i].formatPresentation(data, context, {formattedValues: options.formattedValues});
                    values.push(presentation.value);
                    unformattedValues.push(presentation.unformatted);
                } catch (exception) {
                    // the value doesn't exist
                    return null;
                }
            }
            caption = values.join(":");
            unformatted = unformattedValues.join(":");

            // if the caption is empty we cannot add any link to that.
            if (caption.trim() === '') {
                return null;
            }
        }

        if (caption.match(/<a\b.+href=/)) {
            value = caption;
        } else {
            var keyRef = new Reference(module.parse(rowURI), key.table.schema.catalog);
            var appLink = keyRef.contextualize.detailed.appLink;

            value = '<a href="' + appLink +'">' + caption + '</a>';
            unformatted = "[" + unformatted + "](" + appLink + ")";
        }

        return {isHTML: true, value: value, unformatted: unformatted};
    };

    /**
     * @function
     * @private
     * @desc Given the key of a table, and data for one row will return the
     * presentation object for the row.
     * @param  {ERMrest.Key} key   the key of the table
     * @param  {String} context    Current context
     * @param  {object} data       Data for the table that this key is referring to.
     * @return {Object}            an object with `caption`, and `reference` object which can be used for getting uri.
     */
    module._generateRowPresentation = function (key, data, context) {
        var presentation = module._generateRowLinkProperties(key, data, context);

        if (!presentation) {
            return null;
        }

        var value, unformatted, appLink;

        // if column is hidden, or caption has a link, or  or context is EDIT: don't add the link.
        // create the link using reference.
        if (presentation.caption.match(/<a\b.+href=/) || module._isEntryContext(context)) {
            value = presentation.caption;
            unformatted = presentation.unformatted;
        } else {
            appLink = presentation.reference.contextualize.detailed.appLink;
            value = '<a href="' + appLink + '">' + presentation.caption + '</a>';
            unformatted = "[" + presentation.unformatted + "](" + appLink + ")";
        }

        return {isHTML: true, value: value, unformatted: unformatted};
    };

    /**
     * Given a table object and raw data for a row, return a uri to that row with fitlers.
     * @param  {ERMrest.Table} table the table object
     * @param  {Object} raw data for the row
     * @param  {ERMrest.Key=} key if we want the link based on a specific key
     * @return {String|null} filter that represents the current row. If row data
     * is missing, it will return null.
     */
    _generateRowURI = function (table, data, key) {
        if (data == null) return null;

        var cols = (key != null) ? key.colset.columns : table.shortestKey;
        var keyPair = "", col, i;
        for (i = 0; i < cols.length; i++) {
            col = cols[i].name;
            if (data[col] == null) return null;
            keyPair +=  module._fixedEncodeURIComponent(col) + "=" + module._fixedEncodeURIComponent(data[col]);
            if (i != cols.length - 1) {
                keyPair += "&";
            }
        }
        return table.uri + "/" + keyPair;
    };

    /**
     * @function
     * @private
     * @param  {ERMrest.Key} key     key of the table
     * @param  {string} context current context
     * @param  {object} data    data for the table that this key is referring to
     * @return {object} an object with the following attributes:
     * - `caption`: The caption that can be used to refer to this row in a link
     * - `unformatted`: The unformatted version of caption.
     * - `refernece`: The reference object that can be used for generating link to the row
     * @desc
     * Creates the properies for generating a link to the given row of data.
     * It might return `null`.
     */
    module._generateRowLinkProperties = function (key, data, context) {

        // if data is empty
        if (typeof data === "undefined" || data === null || Object.keys(data).length === 0) {
            return null;
        }

        var value, rowname, i, caption, unformatted;
        var table = key.table;
        var rowURI = _generateRowURI(table, data, key);

        // if any of key columns don't have data, this link is not valid.
        if (rowURI == null) {
            return null;
        }

        // use row name as the caption
        rowname = module._generateRowName(table, context, data);
        caption = rowname.value;
        unformatted = rowname.unformatted;

        // use key for displayname: "col_1:col_2:col_3"
        if (caption.trim() === '') {
            var formattedValues = module._getFormattedKeyValues(table, context, data),
                formattedKeyCols = [],
                unformattedKeyCols = [],
                pres, col;

            for (i = 0; i < key.colset.columns.length; i++) {
                col = key.colset.columns[i];
                pres = col.formatPresentation(data, context, {formattedValues: formattedValues});
                formattedKeyCols.push(pres.value);
                unformattedKeyCols.push(pres.unformatted);
            }
            caption = formattedKeyCols.join(":");
            unformatted = unformattedKeyCols.join(":");

            if (caption.trim() === '') {
                return null;
            }
        }

        // use the shortest key if it has data (for shorter url).
        var shortestKeyURI = _generateRowURI(table, data);
        if (shortestKeyURI != null) {
            rowURI = shortestKeyURI;
        }

        return {
            unformatted: unformatted,
            caption: caption,
            reference:  new Reference(module.parse(rowURI), table.schema.catalog)
        };
    };

    /**
     * @function
     * @param  {string} errorStatusText    http error status text
     * @param  {string} generatedErrMessage response data returned by http request
     * @return {object}                    error object
     * @desc
     *  - Integrity error message: This entry cannot be deleted as it is still referenced from the Human Age table.
     *                           All dependent entries must be removed before this item can be deleted.
     *  - Duplicate error message: The entry cannot be created/updated. Please use a different ID for this record.
     *                            Or (The entry cannot be created. Please use a combination of different _fields_ to create new record.)
     *
     */
    module._conflictErrorMapping = function(errorStatusText, generatedErrMessage, reference, actionFlag) {
      var mappedErrMessage, refTable, tableDisplayName = '';
      var conflictErrorPrefix = "409 Conflict\nThe request conflicts with the state of the server. ",
          siteAdminMsg = "\nIf you have trouble removing dependencies please contact the site administrator.";

      if (generatedErrMessage.indexOf("violates foreign key constraint") > -1 && actionFlag == module._operationsFlag.DELETE) {

          var referenceTable = "another";

          var detail = generatedErrMessage.search(/DETAIL:/g);
          if (detail > -1) {
            detail = generatedErrMessage.substring(detail, generatedErrMessage.length);
            referenceTable = detail.match(/referenced from table \"(.*)\"(.*)/);
            if(referenceTable && referenceTable.length > 1){
                refTable = referenceTable[1];
                referenceTable =  refTable;
            }
          }


            var fkConstraint = generatedErrMessage.match(/foreign key constraint \"(.*?)\"/)[1];    //get constraintName
            if(typeof reference === 'object' && typeof fkConstraint === 'string' && fkConstraint != ''){
              var relatedRef = reference.related(); //get all related references

              for(var i = 0; i < relatedRef.length; i++){
                  key  = relatedRef[i];
                  if(key.origFKR.constraint_names["0"][1] == fkConstraint && key.origFKR._table.name == refTable){
                    referenceTable = key.displayname.value;
                    siteAdminMsg = "";
                    break;
                  }
                }
            }

          referenceTable =  "the <code>"+ referenceTable +"</code>";

          // NOTE we cannot make any assumptions abou tthe table name. for now we just show the table name that database sends us.
          mappedErrMessage = "This entry cannot be deleted as it is still referenced from " + referenceTable +" table. \n All dependent entries must be removed before this item can be deleted." + siteAdminMsg;
          return new module.IntegrityConflictError(errorStatusText, mappedErrMessage, generatedErrMessage);
      }
      else if (generatedErrMessage.indexOf("violates unique constraint") > -1){
          var regExp = /\(([^)]+)\)/,
              matches = regExp.exec(generatedErrMessage), msgTail;

          if (matches && matches.length > 1) {
              var primaryColumns =  matches[1].split(','),
                  numberOfKeys = primaryColumns.length;

              if (numberOfKeys > 1){
                msgTail = " combination of " + primaryColumns;
              } else {
                msgTail = primaryColumns;
              }
          }


          mappedErrMessage = "The entry cannot be created/updated. ";
          if (msgTail) {
              mappedErrMessage += "Please use a different "+ msgTail +" for this record.";
          } else {
              mappedErrMessage += "Input data violates unique constraint.";
          }
          return new module.DuplicateConflictError(errorStatusText, mappedErrMessage, generatedErrMessage);
      }
      else{
          mappedErrMessage = generatedErrMessage;

          // remove the previx if exists
          if (mappedErrMessage.startsWith(conflictErrorPrefix)){
            mappedErrMessage = mappedErrMessage.slice(conflictErrorPrefix.length);
          }

          // remove the suffix is exists
          errEnd = mappedErrMessage.search(/CONTEXT:/g);
          if (errEnd > -1){
            mappedErrMessage = mappedErrMessage.substring(0, errEnd - 1);
          }

          return new module.ConflictError(errorStatusText, mappedErrMessage, generatedErrMessage);
      }
    };

    /**
     * @function
     * @desc create an error object from http response
     * @param {Object} response http response object
     * @param {ERMrest.Reference=} reference the reference object
     * @param {string=} actionFlag the flag that signals the action that the error occurred from
     * @return {Object} error object
     */
    module.responseToError = function (response, reference, actionFlag) {
        var status = response.status || response.statusCode;
        switch(status) {
            case -1:
                return new module.NoConnectionError(response.data);
            case 0:
                return new module.TimedOutError(response.statusText, response.data);
            case 400:
                if (response.data.includes("Query run time limit exceeded")) return new module.QueryTimeoutError(response.statusText, response.data);
                return new module.BadRequestError(response.statusText, response.data);
            case 401:
                return new module.UnauthorizedError(response.statusText, response.data);
            case 403:
                return new module.ForbiddenError(response.statusText, response.data);
            case 404:
                return new module.NotFoundError(response.statusText, response.data);
            case 408:
                return new module.TimedOutError(response.statusText, response.data);
            case 409:
                return module._conflictErrorMapping(response.statusText, response.data, reference, actionFlag);
            case 412:
                return new module.PreconditionFailedError(response.statusText, response.data);
            case 500:
                return new module.InternalServerError(response.statusText, response.data);
            case 502:
                return new module.BadGatewayError(response.statusText, response.data);
            case 503:
                return new module.ServiceUnavailableError(response.statusText, response.data);
            default:
                if (response.statusText || response.data) {
                    return new Error(response.statusText, response.data);
                } else {
                    return new Error(response);
                }
        }
    };

    module._stringToDate = function(_date, _format, _delimiter) {
        var formatLowerCase=_format.toLowerCase();
        var formatItems=formatLowerCase.split(_delimiter);
        var dateItems=_date.split(_delimiter);
        var monthIndex=formatItems.indexOf("mm");
        var dayIndex=formatItems.indexOf("dd");
        var yearIndex=formatItems.indexOf("yyyy");
        var month=parseInt(dateItems[monthIndex]);
        month-=1;
        var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex].split(" ")[0]);
        return formatedDate;
    };

    /**
     * @desc An object of pretty print utility functions
     * @private
     */
    module._formatUtils = {
        /**
         * @function
         * @param {Object} value A boolean value to transform
         * @param {Object} [options] Configuration options
         * @return {string} A string representation of a boolean value
         * @desc Formats a given boolean value into a string for display
         */
        printBoolean: function printBoolean(value, options) {
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }
            return Boolean(value).toString();
        },

        /**
         * @function
         * @param {Object} value An integer value to transform
         * @param {Object} [options] Configuration options
         * @return {string} A string representation of value
         * @desc Formats a given integer value into a whole number (with a thousands
         * separator if necessary), which is transformed into a string for display.
         */
        printInteger: function printInteger(value, options) {
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }

            // Remove fractional digits
            value = Math.round(value);

            // Add comma separators
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        /**
         * @function
         * @param {Object} value An timestamp value to transform
         * @param {Object} [options] Configuration options. No options implemented so far.
         * @return {string} A string representation of value. Default is ISO 8601-ish like 2017-01-08 15:06:02.
         * @desc Formats a given timestamp value into a string for display.
         */
        printTimestamp: function printTimestamp(value, options) {
            var moment = module._moment;
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }

            try {
                value = value.toString();
            } catch (exception) {
                // Is this the right error?
                throw new module.InvalidInputError("Couldn't extract timestamp from input" + exception);
            }

            if (!moment(value).isValid()) {
                // Invalid timestamp
                throw new module.InvalidInputError("Couldn't transform input to a valid timestamp");
            }

            return moment(value).format(module._dataFormats.DATETIME.display);
        },

        /**
         * @function
         * @param {Object} value A date value to transform
         * @param {Object} [options] Configuration options. No options implemented so far.
         * @return {string} A string representation of value
         * @desc Formats a given date[time] value into a date string for display.
         * If any time information is provided, it will be left off.
         */
        printDate: function printDate(value, options) {
            var moment = module._moment;
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }
            // var year, month, date;
            try {
                value = value.toString();
            } catch (exception) {
                // Is this the right error?
                throw new module.InvalidInputError("Couldn't extract date info from input" + exception);
            }

            if (!moment(value).isValid()) {
                // Invalid date
                throw new module.InvalidInputError("Couldn't transform input to a valid date");
            }

            return moment(value).format(module._dataFormats.DATE);
        },

        /**
         * @function
         * @param {Object} value A float value to transform
         * @param {Object} [options] Configuration options.
         * - "numFracDigits" is the number of fractional digits to appear after the decimal point
         * @return {string} A string representation of value
         * @desc Formats a given float value into a string for display. Removes leading 0s; adds thousands separator.
         */
        printFloat: function printFloat(value, options) {
            options = (typeof options === 'undefined') ? {} : options;

            if (value === null) {
                return '';
            }

            value = parseFloat(value);
            if (options.numFracDigits) {
                value = value.toFixed(options.numFracDigits); // toFixed() rounds the value, is ok?
            } else {
                value = value.toFixed(4);
            }

            // Remove leading zeroes
            value = value.toString().replace(/^0+(?!\.|$)/, '');

            // Add comma separators
            var parts = value.split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        },

        /**
         * @function
         * @param {Object} value A text value to transform
         * @param {Object} [options] Configuration options.
         * @return {string} A string representation of value
         * @desc Formats a given text value into a string for display.
         */
        printText: function printText(value, options) {
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return value.toString();
        },

        /**
         * @function
         * @param {Object} value The Markdown to transform
         * @param {Object} [options] Configuration options.
         * @return {string} A string representation of value
         * @desc Formats Markdown syntax into an HTML string for display.
         */
        printMarkdown: function printMarkdown(value, options) {
            options = (typeof options === 'undefined') ? {} : options;
            if (value === null) {
                return '';
            }

            try {
                if (options.inline) {
                    return module._markdownIt.renderInline(value);
                }
                return module._markdownIt.render(value);
            } catch (e) {
                console.log("Couldn't parse the given markdown value: " + value);
                console.log(e);
                return value;
            }
        },

        /**
        * @function
        * @param {Object} value A json value to transform
        * @return {string} A string representation of value based on different context
        *                  The beautified version of JSON in other cases
            *              A special case to show null if the value is blank string
        * @desc Formats a given json value into a string for display.
        */
        printJSON: function printJSON(value, options) {
            return value === "" ? JSON.stringify(null) : JSON.stringify(value, undefined, 2);
       },

        /**
         * @function
         * @param {string} value The gene sequence to transform
         * @param {Object} [options] Configuration options. Accepted parameters
         * are "increment" (desired number of characters in each segment) and
         * "separator" (desired separator between segments).
         * @return {string} A string representation of value
         * @desc Formats a gene sequence into a string for display. By default,
         * it will split gene sequence into an increment of 10 characters and
         * insert an empty space in between each increment.
         */

        printGeneSeq: function printGeneSeq(value, options) {
            options = (typeof options === 'undefined') ? {} : options;

            if (value === null) {
                return '';
            }

            try {
                // Default separator is a space.
                if (!options.separator) {
                    options.separator = ' ';
                }
                // Default increment is 10
                if (!options.increment) {
                    options.increment = 10;
                }
                var inc = parseInt(options.increment, 10);

                if (inc === 0) {
                    return value.toString();
                }

                // Reset the increment if it's negative
                if (inc <= -1) {
                    inc = 1;
                }

                var formattedSeq = '`';
                var separator = options.separator;
                while (value.length >= inc) {
                    // Get the first inc number of chars
                    var chunk = value.slice(0, inc);
                    // Append the chunk and separator
                    formattedSeq += chunk + separator;
                    // Remove this chunk from value
                    value = value.slice(inc);
                }

                // Append any remaining chars from value that was too small to form an increment
                formattedSeq += value;

                // Slice off separator at the end
                if (formattedSeq.slice(-1) == separator) {
                    formattedSeq = formattedSeq.slice(0, -1);
                }

                // Add the ending backtick at the end
                formattedSeq += '`';

                // Run it through printMarkdown to get the sequence in a fixed-width font
                return module._markdownIt.renderInline(formattedSeq);
            } catch (e) {
                console.log("Couldn't parse the given markdown value: " + value);
                console.log(e);
                return value;
            }

        },

        /**
         * @function
         * @param  {Array} value the array of values
         * @param  {Object} options Configuration options. Accepted parameters:
         * - `isMarkdown`: if this is true, we will not esacpe markdown characters
         * - `returnArray`: if this is true, it will return an array of strings.
         * @return {string} A string represntation of array.
         * @desc
         * Will generate a comma seperated value for an array. It will also change `null` and `""`
         * to their special presentation.
         * The returned value might return markdown, which then should call printMarkdown on it.
         */
        printArray: function (value, options) {
            options = (typeof options === 'undefined') ? {} : options;

            if (!value || !Array.isArray(value) || value.length === 0) {
                return '';
            }

            var arr = value.map(function (v) {
                var isMarkdown = (options.isMarkdown === true);
                var pv = v;
                if (v === "") {
                    pv = module._specialPresentation.EMPTY_STR;
                    isMarkdown = true;
                }
                else if (v == null) {
                    pv = module._specialPresentation.NULL;
                    isMarkdown = true;
                }

                if (!isMarkdown) pv = module._escapeMarkdownCharacters(pv);
                return pv;
            });

            if (options.returnArray) return arr;
            return arr.join(", ");
        }
    };

    /**
     * format the raw value based on the column definition type, heuristics, annotations, etc.
     * @param {ERMrest.Type} type - the type object of the column
     * @param {Object} data - the 'raw' data value.
     * @returns {string} The formatted value.
     */
    _formatValueByType = function(type, data, options) {
        var utils = module._formatUtils;
        switch(type.name) {
            case 'timestamptz':
                data = utils.printTimestamp(data, options);
                break;
            case 'date':
                data = utils.printDate(data, options);
                break;
            case 'numeric':
            case 'float4':
            case 'float8':
                data = utils.printFloat(data, options);
                break;
            case 'int2':
            case 'int4':
            case 'int8':
                data = utils.printInteger(data, options);
                break;
            case 'boolean':
                data = utils.printBoolean(data, options);
                break;
            case 'markdown':
                // Do nothing as we will format markdown at the end of format
                data = data.toString();
                break;
            case 'gene_sequence':
                data = utils.printGeneSeq(data, options);
                break;
            //Cases to support json and jsonb columns
            case 'json':
            case 'jsonb':
                data = utils.printJSON(data, options);
                break;
            default: // includes 'text' and 'longtext' cases
                data = type.baseType ? _formatValueByType(type.baseType, data, options) : utils.printText(data, options);
                break;
        }
        return data;
    };

    /**
     * @function
     * @param {Object} value The Markdown to transform
     * @param {Object} [options] Configuration options.
     * @return {string} A string representation of value
     * @desc public function to access markdown it renderer
     */
    module.renderMarkdown = function(value, options) {
      return module._formatUtils.printMarkdown(value, options);
    };

    module._parsedFilterToERMrestFilter = function(filter, table) {
        if (filter.type === "BinaryPredicate") {
            return new ERMrest.BinaryPredicate(
                table.columns.get(filter.column),
                filter.operator,
                filter.value
            );
        } else {
            // convert nested filter structure to Conjunction or Disjunction filter
            var filters = [];

            if (filter.filters) {
                for (var i = 0; i < filter.filters.length; i++) {
                    var f = filter.filters[i];
                    var f1 = parsedFilterToERMrestFilter(f, table);
                    filters.push(f1);
                }
            }

            if (filter.type === "Conjunction") {
                return new ERMrest.Conjunction(filters);
            } else {
                return new ERMrest.Disjunction(filters);
            }
        }
    };

    module._isValidSortElement = function(element, index, array) {
        return (typeof element == 'object' &&
            typeof element.column == 'string' &&
            typeof element.descending == 'boolean');
    };

    /**
     * @function
     * @private
     * @param {Object} md The markdown-it object
     * @param {Object} md The markdown-it-container object.
     * @desc Sets functionality for custom markdown tags like `iframe` and `dropdown` using `markdown-it-container` plugin.
     * The functions that are required for each custom tag are
     * - validate: to match a given token with the new rule that we are adding.
     * - render: the render rule for the token. This function will be called
     * for opening and closing block tokens that match. The function should be written
     * in a way to handle just the current token and its values. It should not try
     * to modify the whole parse process. Doing so will grant the correct behavior
     * from the markdown-it. If we don't follow this rule while writing the render
     * function, we might lose extra features (recursive blocks, etc.) that the parser
     * can handle. For instance the `iframe` tag is written in a way that you have
     * to follow the given syntax. You cannot have any other tags in iframe and
     * we're not supporting recursive iframe tags. the render function is only
     * handling an iframe with the given syntax. Nothing extra.
     * But we tried to write the `div` tag in a way that you can have
     * hierarichy of `div`s. If you look at its implementation, it has two simple rules.
     * One for the opening tag and the other for the closing.
     *
     */
    module._bindCustomMarkdownTags = function(md, mdContainer) {

        // Set typography to enable breaks on "\n"
        md.set({ typographer: true });

        // Dependent on 'markdown-it-container' and 'markdown-it-attrs' plugins
        // Injects `iframe` tag
        md.use(mdContainer, 'iframe', {
            /*
             * Checks whether string matches format "::: iframe [CAPTION](LINK){ATTR=VALUE .CLASSNAME}"
             * String inside '{}' is Optional, specifies attributes to be applied to prev element
             */
            validate: function(params) {
                return params.trim().match(/iframe\s+(.*)$/i);
            },

            render: function (tokens, idx) {
                // Get token string after regexp matching to determine actual internal markdown
                var m = tokens[idx].info.trim().match(/iframe\s+(.*)$/i);

                // If this is the opening tag i.e. starts with "::: iframe "
                if (tokens[idx].nesting === 1 && m.length > 0) {

                    // Extract remaining string before closing tag and get its parsed markdown attributes
                    var attrs = md.parseInline(m[1]), html = "";

                    if (attrs && attrs.length == 1 && attrs[0].children) {

                        // Check If the markdown is a link
                        if (attrs[0].children[0].type == "link_open") {
                            var iframeHTML = "<iframe ", openingLink = attrs[0].children[0];
                            var enlargeLink, posTop = true, captionClass = "", captionStyle = "", iframeClass = "", iframeStyle = "";

                            // Add all attributes to the iframe
                            openingLink.attrs.forEach(function(attr) {
                                if (attr[0] == "href") {
                                    iframeHTML += 'src="' + attr[1] + '"';
                                } else if (attr[0] == "link") {
                                    enlargeLink = attr[1];
                                } else if (attr[0] == "pos") {
                                    posTop = attr[1].toLowerCase() == 'bottom' ? false : true;
                                } else if (attr[0] == "caption-class") {
                                    captionClass = attr[1];
                                } else if (attr[0] == "caption-style") {
                                    captionStyle = attr[1];
                                } else if (attr[0] == "iframe-class") {
                                    iframeClass = attr[1];
                                } else if (attr[0] == "iframe-style") {
                                    iframeStyle = attr[1];
                                } else {
                                    iframeHTML +=  attr[0] + '="' + attr[1] + '"';
                                }
                                iframeHTML += " ";
                            });
                            html += iframeHTML + "></iframe>";

                            var captionHTML = "";

                            // If the next attribute is not a closing link then iterate
                            // over all the children until link_close is encountered rednering their markdown
                            if (attrs[0].children[1].type != 'link_close') {
                                for(var i=1; i<attrs[0].children.length; i++) {
                                    // If there is a caption then add it as a "div" with "caption" class
                                    if (attrs[0].children[i].type == "text") {
                                       captionHTML += md.renderInline(attrs[0].children[i].content);
                                    } else if (attrs[0].children[i].type !== 'link_close'){
                                       captionHTML += md.renderer.renderToken(attrs[0].children,i,{});
                                    } else {
                                        break;
                                    }
                                }
                            }

                            // If enlarge link is set then add an anchor tag for captionHTML
                            if (enlargeLink) {
                                 if (!captionHTML.trim().length) captionHTML = "Enlarge";
                                captionHTML = '<a href="' + enlargeLink + '" target="_blank">'  + captionHTML + '</a>';
                            }

                            // Encapsulate the captionHTML inside a figcaption tag with class embed-caption
                            if (posTop) {
                                html = '<figcaption class="embed-caption' + (captionClass.length ? (" " + captionClass) : "") +'" style="' + (captionStyle.length ? (" " + captionStyle) : "") + '">' + captionHTML + "</figcaption>" + html;
                            } else {
                                html += '<figcaption class="embed-caption' + (captionClass.length ? (" " + captionClass) : "") + '" style="' + (captionStyle.length ? (" " + captionStyle) : "") + '">' + captionHTML + "</figcaption>";
                            }

                            // Encapsulate the iframe inside a figure tag
                            html = '<figure class="embed-block' + (iframeClass.length ? (" "  + iframeClass): "") + '" style="' + (iframeStyle.length ? (" "  + iframeStyle ) : "") + '">' + html + "</figure>";
                        }
                    }
                    // if attrs was empty or it didn't find any link simply render the internal markdown
                    if (html === "") {
                        html = md.render(m[1]);
                    }

                    return html;
                } else {
                  // closing tag
                  return '';
                }
            }
        });

        // Dependent on 'markdown-it-container' and 'markdown-it-attrs' plugins
        // Injects `dropdwown` tag
        md.use(mdContainer, 'dropdown', {
            /*
             * Checks whether string matches format "::: dropdown DROPDOWN_TITLE{.btn-success} [CAPTION](LINK){ATTR=VALUE .CLASSNAME}"
             * String inside '{}' is Optional, specifies attributes to be applied to prev element
             */
            validate: function(params) {
                return params.trim().match(/dropdown\s+(.*)$/i);
            },

            render: function (tokens, idx) {

                var html = "";
                // Get token string after regeexp matching to determine caption and other links
                var m = tokens[idx].info.trim().match(/dropdown\s+(.*)$/i);

                if (tokens[idx].nesting === 1 && m && m.length > 0) {

                    // If content found after dropdown string
                    if (m && m.length > 0) {

                        var linkTokens = md.parseInline(m[1]);

                        // If the linkTokens contains an inline tag
                        // with children, and type is text for the first child
                        if (linkTokens.length === 1 && linkTokens[0].type === 'inline' &&
                            linkTokens[0].children.length && linkTokens[0].children[0].type === 'text') {

                            var caption = linkTokens[0].children[0].content;
                            var cTokens = md.parse(caption);

                            // If caption is set for the dropdown button between
                            if (cTokens.length === 3 && cTokens[0].type === 'paragraph_open' && cTokens[1].type === 'inline' && cTokens[2].type === 'paragraph_close') {

                                // Build button html and button dropdown html
                                var classes = [];
                                var classNotParsed;
                                var buttonHtml = '<button type="button" ';
                                var buttonDDHtml = '<button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ';

                                // If the caption has any attrs add them to the button
                                if (cTokens[0].attrs) {
                                    cTokens[0].attrs.forEach(function(a) {
                                        if(a[0] === 'class') {
                                            classes.push(a[1]);
                                        } else {
                                            buttonHtml += attr[0] + '="' + attr[1] + '" ';
                                        }
                                    });
                                }

                                var openBracketLastIndex = cTokens[1].content.lastIndexOf('{');
                                // '{' index > -1, meaning it exists in the string
                                // '}' index > '{' index, meaning it exists in the string in the right place (i.e. '{...}')
                                if (openBracketLastIndex > -1 && cTokens[1].content.lastIndexOf('}') > openBracketLastIndex) {
                                    classNotParsed = cTokens[1].content.slice(0, openBracketLastIndex).trim();
                                } else {
                                    classNotParsed = cTokens[1].content;
                                }

                                buttonHtml += ' class="btn btn-primary ' + classes.join(' ') + '">' +  classNotParsed + '</button>';
                                buttonDDHtml += ' class="btn btn-primary dropdown-toggle ' + classes.join(' ') + '"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>';

                                // Build unordered list
                                var lists = [], isValid = true;
                                for (var i=1 ;i < linkTokens[0].children.length;i=i+3) {
                                    if (linkTokens[0].children[i].type === 'link_open' &&
                                        linkTokens[0].children[i+1].type === 'text' &&
                                        linkTokens[0].children[i+2].type === 'link_close') {

                                        var link = linkTokens[0].children[i], listHTML = '<li><a ';
                                        for (var j=0; j< link.attrs.length; j++) {
                                            listHTML +=  link.attrs[j][0] + '="' + link.attrs[j][1] + '" ';
                                        }

                                        listHTML += ">" + linkTokens[0].children[i+1].content + "</a></li>";
                                        lists.push(listHTML);
                                        // If the next element in the list is of type text skip it
                                        if (linkTokens[0].children[i+3] &&      linkTokens[0].children[i+3].type === 'text') {
                                          i++;
                                        }
                                    } else {
                                        isValid = false;
                                        break;
                                    }
                                }

                                if (isValid) {
                                    var ullistHTML = '<ul class="dropdown-menu">' + lists.join('') + '</ul>';
                                    html = '<div class="btn-group markdown-dropdown">' + buttonHtml + buttonDDHtml + ullistHTML + "</div>";
                                }
                            }
                        }
                    }
                }
                return html;
            }
        });

        // Dependent on 'markdown-it-container' and 'markdown-it-attrs' plugins
        // Injects `image` tag
        md.use(mdContainer, 'image', {
            /*
             * Checks whether string matches format ":::image [CAPTION](LINK){ATTR=VALUE .CLASSNAME}"
             * String inside '{}' is Optional, specifies attributes to be applied to prev element
             */
            validate: function(params) {
                return params.trim().match(/image\s+(.*$)/i);
            },

            render: function (tokens, idx) {

                // Get token string after regeexp matching to determine actual internal markdown
                var m = tokens[idx].info.trim().match(/image\s+(.*)$/i);

                // If this is the opening tag i.e. starts with "::: image "
                if (tokens[idx].nesting === 1 && m.length > 0) {

                    // Extract remaining string before closing tag and get its parsed markdown attributes
                    var attrs = md.parseInline(m[1]), html = "";
                    if (attrs && attrs.length == 1 && attrs[0].children) {

                        // Check If the markdown is a link
                        if (attrs[0].children[0].type == "link_open") {
                            var imageHTML = "<img ", openingLink = attrs[0].children[0];
                            var enlargeLink, posTop = true;

                            // Add all attributes to the image
                            openingLink.attrs.forEach(function(attr) {
                                if (attr[0] == "href") {
                                    imageHTML += 'src="' + attr[1] + '"';
                                } else if (attr[0] == "link") {
                                    enlargeLink = attr[1];
                                } else if (attr[0] == "pos") {
                                    posTop = attr[1].toLowerCase() == 'bottom' ? false : true;
                                } else {
                                    imageHTML +=  attr[0] + '="' + attr[1] + '"';
                                }
                               imageHTML += " ";
                            });

                            html += imageHTML + "/>";

                            var captionHTML = "";

                            // If the next attribute is not a closing link then iterate
                            // over all the children until link_close is encountered rednering their markdown
                            if (attrs[0].children[1].type != 'link_close') {
                                for(var i=1; i<attrs[0].children.length; i++) {
                                    // If there is a caption then add it as a "div" with "caption" class
                                    if (attrs[0].children[i].type == "text") {
                                       captionHTML += md.renderInline(attrs[0].children[i].content);
                                    } else if (attrs[0].children[i].type !== 'link_close'){
                                       captionHTML += md.renderer.renderToken(attrs[0].children,i,{});
                                    } else {
                                        break;
                                    }
                                }
                            }

                            // Add caption html
                            if (posTop) {
                                html = '<figcaption class="embed-caption">' + captionHTML + "</figcaption>" + html;
                            } else {
                                html = html + '<figcaption class="embed-caption">' + captionHTML + "</figcaption>";
                            }

                            // If link is specified, then wrap the image and figcaption inside anchor tag
                            if (enlargeLink) {
                                html = '<a href="' + enlargeLink + '" target="_blank">' + html + '</a>' ;
                            }

                            // Encapsulate the iframe inside a paragraph tag
                            html = '<figure class="embed-block" style="display:inline-block;">' + html + "</figure>";
                        }
                    }

                    // if attrs was empty or it didn't find any link simply render the internal markdown
                    if (html === "") {
                        html = md.render(m[1]);
                    }


                    return html;
                } else {
                  // closing tag
                  return '';
                }
            }
        });

        md.use(mdContainer, 'video', {
            /*
             * Checks whether string matches format ":::video (LINK){ATTR=VALUE .CLASSNAME}"
             * String inside '{}' is Optional, specifies attributes to be applied to prev element
             */
            validate: function(params) {
                return params.trim().match(/video\s+(.*$)/i);
            },

            render: function (tokens, idx) {
                // Get token string after regeexp matching to determine actual internal markdown
                var m = tokens[idx].info.trim().match(/video\s+(.*)$/i);

                // If this is the opening tag i.e. starts with "::: video "
                if (tokens[idx].nesting === 1 && m.length > 0) {

                    // Extract remaining string before closing tag and get its parsed markdown attributes
                    var attrs = md.parseInline(m[1]), html = "";

                    if (attrs && attrs.length == 1 && attrs[0].children) {
                        // Check If the markdown is a link
                        if (attrs[0].children[0].type == "link_open") {
                            var videoHTML="<video controls ", openingLink = attrs[0].children[0];
                            var srcHTML="", videoClass="", flag = true, posTop = true;

                            // Add all attributes to the video
                            openingLink.attrs.forEach(function(attr) {
                                if (attr[0] == "href") {
                                    if(attr[1] == ""){
                                        flag= false;
                                        return "";
                                    }
                                    srcHTML += '<source src="' + attr[1] + '" type="video/mp4">';
                                }
                                else if ( (attr[0] == "width" || attr[0] == "height") && attr[1]!=="") {
                                    videoClass +=  attr[0]+ "="+ attr[1] +" ";
                                }
                                else if ( (attr[0] == "loop" || attr[0] == "preload" || attr[0] == "muted" || attr[0] == "autoload") && attr[1]=="") {
                                    videoClass +=  attr[0]+ " ";
                                }
                                else if ( (attr[0] == "pos") && attr[1]!=="") {
                                    posTop =  attr[1].toLowerCase() == 'bottom' ? false : true;
                                }
                            });

                            var captionHTML="";
                            // If the next attribute is not a closing link then iterate
                            // over all the children until link_close is encountered rednering their markdown
                            if (attrs[0].children[1].type != 'link_close') {
                                for(var i=1; i<attrs[0].children.length; i++) {
                                    // If there is a caption then add it as a "div" with "caption" class
                                    if (attrs[0].children[i].type == "text") {
                                       captionHTML += md.renderInline(attrs[0].children[i].content);
                                    } else if (attrs[0].children[i].type !== 'link_close'){
                                       captionHTML += md.renderer.renderToken(attrs[0].children,i,{});
                                    } else {
                                        break;
                                    }
                                }
                            }

                            if(captionHTML.trim().length && flag && posTop){
                                html +=  "<figure><figcaption>"+captionHTML+ "</figcaption>" + videoHTML + videoClass +">"+ srcHTML +"</video></figure>" ;
                            }else if(captionHTML.trim().length && flag){
                                html +=  "<figure>"+ videoHTML + videoClass +">"+ srcHTML +"</video><figcaption>"+captionHTML+ "</figcaption></figure>" ;
                            } else if(flag)
                                html += videoHTML + videoClass +">"+ srcHTML +"</video>";
                            else
                                return '';
                        }
                    }
                    // if attrs was empty or it didn't find any link simply render the internal markdown
                    if (html === "") {
                        html = md.render(m[1]);
                    }
                    return html;
                } else {
                  // closing tag
                  return '';
                }
            }
        });

        md.use(mdContainer, 'div', {

            /*
             * Checks whetehr string matches format ":::div CONTENT \n:::"
             * string inside `{}` is optional, specifies attributes to be applied to element
             */
            validate: function (params) {
                return params.trim().match(/div(.*)$/i);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/div(.*)$/i);

                // opening tag
                if (tokens[idx].nesting === 1) {

                    // if the next tag is a paragraph, we can change the paragraph into a div
                    var attrs = md.parse(m[1]);
                    if (attrs && attrs.length > 0 && attrs[0].type === "paragraph_open") {
                        var html = md.render(m[1]).trim();

                        // this will remove the closing and opening p tag.
                        return "<div" + html.slice(2, html.length-4);
                    }

                    // otherwise just add the div tag
                    return "<div>\n" + md.render(m[1]).trim();
                }
                // the closing tag
                else {
                    return "</div>\n";
                }
            }
        });
    };

    // Characters to replace Markdown special characters
    module._escapeReplacementsForMarkdown = [
      [ /\*/g, '\\*' ],
      [ /#/g, '\\#' ],
      [ /\//g, '\\/' ],
      [ /\(/g, '\\(' ],
      [ /\)/g, '\\)' ],
      [ /\[/g, '\\[' ],
      [ /\]/g, '\\]' ],
      [ /\{/g, '\\{' ],
      [ /\}/g, '\\}' ],
      [ new RegExp("\<","g"), '&lt;' ],
      [ new RegExp("\>","g"), '&gt;' ],
      [ /_/g, '\\_'  ],
      [ /\!/g, '\\!' ],
      [ /\./g, '\\.' ],
      [ /\+/g, '\\+' ],
      [ /\-/g, '\\-' ],
      [ /\`/g, '\\`' ]];

    /**
     * @function
     * @param {String} text The text in which escaping needs to happen.
     * @desc
     * This private utility function escapes markdown special characters
     * It is used with Mustache to escape value of variables that have markdown characters in them
     * @returns {String} String after escaping
     */
    module._escapeMarkdownCharacters = function(text) {
      return module._escapeReplacementsForMarkdown.reduce(
        function(text, replacement) {
          return text.replace(replacement[0], replacement[1]);
        }, text);
    };

    /**
     * @function
     * @desc
     * A function used by Mustache to encode strings in a template
     * @return {Function} A function that is called by Mustache when it stumbles across
     * {{#encode}} string while parsing the template.
     */
    module._encodeForMustacheTemplate = function() {
        return function(text, render) {
            return module._fixedEncodeURIComponent(render(text));
        };
    };

    /**
     * @function
     * @desc
     * A function used by Mustache to escape Markdown characters in a string
     * @return {Function} A function that is called by Mustache when it stumbles across
     * {{#escape}} string while parsing the template.
     */
    module._escapeForMustacheTemplate = function() {
        return function(text, render) {
            return module._escapeMarkdownCharacters(render(text));
        };
    };

    module._injectHandlebarHelpers = function() {

        // Register a handlebars helper to encode strings in a template
        module._handlebars.registerHelper('encode', function() {
            var args = Array.prototype.slice.call(arguments);
            var text = args.splice(0, args.length - 1).join('');
            return module._fixedEncodeURIComponent(text);
        });

        // Register a handlebars helper to escape Markdown characters in a string
        module._handlebars.registerHelper('escape', function() {
            var args = Array.prototype.slice.call(arguments);
            var text = args.splice(0, args.length - 1).join('');
            return module._escapeMarkdownCharacters(text);
        });

        module._injectExternalHandlerbarHelper(module._handlebars);

        // loop through handlebars defined list of helpers and check against the enum in ermrestJs
        // if not in enum, set helper to false
        // should help defend against new helpers being exposed without us being aware of it
        module._handlebarsHelpersHash = {};
        Object.keys(module._handlebars.helpers).forEach(function (key) {
            module._handlebarsHelpersHash[key] = module._handlebarsHelpersList.includes(key);
        });
    };

    /**
     * @function
     * @desc
     * Gets currDate object once the page loads for future access in templates
     * @return {Object} A date object that contains all properties
     */
    var getCurrDate = function() {
        var date = new Date();

        var dateObj = {};

        // Set date properties
        dateObj.day = date.getDay();
        dateObj.date = date.getDate();
        dateObj.month = date.getMonth() + 1;
        dateObj.year = date.getFullYear();
        dateObj.dateString = date.toDateString();

        // Set Time porperties
        dateObj.hours = date.getHours();
        dateObj.minutes = date.getMinutes();
        dateObj.seconds = date.getSeconds();
        dateObj.milliseconds = date.getMilliseconds();
        dateObj.timestamp = date.getTime();
        dateObj.timeString = date.toTimeString();

        dateObj.ISOString = date.toISOString();
        dateObj.GMTString = date.toGMTString();
        dateObj.UTCString = date.toUTCString();

        dateObj.localeDateString = date.toLocaleDateString();
        dateObj.localeTimeString = date.toLocaleTimeString();
        dateObj.localeString = date.toLocaleString();

        return dateObj;
    };
    module._currDate = getCurrDate();

    /**
     * @function
     * @desc
     * Add utility objects such as date (Computed value) to mustache data obj
     * so that they can be accessed in the template
     */
    module._addErmrestVarsToTemplate = function(obj, catalog) {
        obj.$moment = module._currDate;

        if (catalog) {
            var catalogSnapshot = catalog.id.split('@');
            obj.$catalog = {
                snapshot: catalog.id,
                id: catalogSnapshot[0]
            };

            if (catalogSnapshot.length === 2) obj.$catalog.version = catalogSnapshot[1];
        }
    };

    /**
     * @function
     * @desc
     * Replace variables having  dot with underscore so that they can be accessed in the template
     * @param {Object} keyValues The key-value pair of object.
     * @param {Object} options An object of options which might contain additional functions to be injected
     *
     * @return {Object} obj
     */
    module._addTemplateVars = function(keyValues, catalog, options) {

        var obj = {};
        if (keyValues && isObject(keyValues)) {
            try {
                // recursively replace dot with underscore in column names.
                obj = module._replaceDotWithUnderscore(keyValues);
            } catch (err) {
                // This should not happen since we're guarding against custom type objects.
                obj = keyValues;
                console.log("Could not process the given keyValues in _renderTemplate. Ignoring the _replaceDotWithUnderscore logic.");
                console.log(err);
            }
        }

        // Inject ermrest internal utility objects such as date
        module._addErmrestVarsToTemplate(obj, catalog);

        // Inject other functions provided in the options.functions array if needed
        if (options.functions && options.functions.length) {
            options.functions.forEach(function(f) {
                obj[f.name] = function() {
                    return f.fn;
                };
            });
        }

        return obj;
    };

    /*
     * @function
     * @private
     * @param {String} template The template string to transform
     * @param {Object} obj The key-value pair of object to be used for template tags replacement.
     * @param {Object} [options] Configuration options.
     * @return {string} A string produced after templating
     * @desc Returns a string produced as a result of templating using `Mustache`.
     */
    module._renderMustacheTemplate = function(template, keyValues, catalog, options) {

        options = options || {};

        var obj = module._addTemplateVars(keyValues, catalog, options), content;

        // Inject the encode function in the obj object
        obj.encode = module._encodeForMustacheTemplate;

        // Inject the escape function in the obj object
        obj.escape = module._escapeForMustacheTemplate;

        // If we should validate, validate the template and if returns false, return null.
        if (!options.avoidValidation && !module._validateMustacheTemplate(template, obj, catalog)) {
            return null;
        }

        try {
            content = module._mustache.render(template, obj);
        } catch(e) {
            console.log(e);
            content = null;
        }

        return content;
    };

    /**
     * Returns true if all the used keys have values.
     *
     * NOTE:
     * This implementation is very limited and if conditional Mustache statements
     * of the form {{#var}}{{/var}} or {{^var}}{{/var}} found then it won't check
     * for null values and will return true.
     *
     * @param  {string}   template       mustache template
     * @param  {object}   keyValues      key-value pairs
     * @param  {Array.<string>=} ignoredColumns the columns that should be ignored (optional)
     * @return {boolean} true if all the used keys have values
     */
    module._validateMustacheTemplate = function (template, keyValues, catalog, ignoredColumns) {

        // Inject ermrest internal utility objects such as date
        // needs to be done in the case _validateTemplate is called without first calling _renderTemplate
        module._addErmrestVarsToTemplate(keyValues, catalog);

        var conditionalRegex = /\{\{(#|\^)([^\{\}]+)\}\}/, i, key, value;

        // If no conditional Mustache statements of the form {{#var}}{{/var}} or {{^var}}{{/var}} not found then do direct null check
        if (!conditionalRegex.exec(template)) {

            // Grab all placeholders ({{PROP_NAME}}) in the template
            var placeholders = template.match(/\{\{([^\{\}]+)\}\}/ig);

            // If there are any placeholders
            if (placeholders && placeholders.length) {

                // Get unique placeholders
                placeholders = placeholders.filter(function(item, i, ar) { return ar.indexOf(item) === i; });

                /*
                 * Iterate over all placeholders to set pattern as null if any of the
                 * values turn out to be null or undefined
                 */
                for (i=0; i<placeholders.length;i++) {

                    // Grab actual key from the placeholder {{name}} = name, remove "{{" and "}}" from the string for key
                    key = placeholders[i].substring(2, placeholders[i].length - 2);

                    if (key[0] == "{") key = key.substring(1, key.length -1);

                    // find the value.
                    value = module._getPath(keyValues, key.trim());

                    // TODO since we're not going inside the object this logic of ignoredColumns is not needed anymore,
                    // it was a hack that was added for asset columns.
                    // If key is not in ingored columns value for the key is null or undefined then return null
                    if ((!Array.isArray(ignoredColumns) || ignoredColumns.indexOf(key) == -1) && (value === null || value === undefined)) {
                       return false;
                    }
                }
            }
        }
        return true;
    };

    /*
     * @function
     * @public
     * @param {String} template The template string to transform
     * @param {Object} keyValues The key-value pair of object to be used for template tags replacement.
     * @param {Object} catalog The catalog object created by ermrestJS representing the current catalog from the url
     * @param {Object} [options] Configuration options.
     * @return {string} A string produced after templating
     * @desc Calls the private function to return a string produced as a result of templating using `Handlebars`.
     */
    module._renderHandlebarsTemplate = function (template, keyValues, catalog, options) {
        return module.renderHandlebarsTemplate(template, keyValues, catalog, options);
    };

    /*
     * @function
     * @private
     * @param {String} template The template string to transform
     * @param {Object} keyValues The key-value pair of object to be used for template tags replacement.
     * @param {Object} catalog The catalog object created by ermrestJS representing the current catalog from the url
     * @param {Object} [options] Configuration options.
     * @return {string} A string produced after templating
     * @desc Returns a string produced as a result of templating using `Handlebars`.
     */
    module.renderHandlebarsTemplate = function(template, keyValues, catalog, options) {

        options = options || {};

        var obj = module._addTemplateVars(keyValues, catalog, options), content, _compiledTemplate;

        // If we should validate, validate the template and if returns false, return null.
        if (!options.avoidValidation && !module._validateHandlebarsTemplate(template, obj, catalog)) {
            return null;
        }

        try {
            // Read template from cache
            _compiledTemplate = module._handlebarsCompiledTemplates[template];

            // If template not found then add it to cache
            if (!_compiledTemplate) {
                var compileOptions = {
                    knownHelpersOnly: true,
                    knownHelpers: module._handlebarsHelpersHash
                };

                module._handlebarsCompiledTemplates[template] = _compiledTemplate = module._handlebars.compile(template, compileOptions);
            }

            // Generate content from the template
            content = _compiledTemplate(obj);
        } catch(e) {
            console.log(e);
            content = null;
        }

        return content;
    };

    // Cache to store all the handlebar templates to reduce compute time
    module._handlebarsCompiledTemplates = {};

    /**
     * Returns true if all the used keys have values.
     *
     * NOTE:
     * This implementation is very limited and if conditional Handlebar statements
     * of the form {{#if }}{{/if}} or {{^if VARNAME}}{{/if}} or {{#unless VARNAME}}{{/unless}} or {{^unless }}{{/unless}} found then it won't check
     * for null values and will return true.s
     *
     * @param  {string}   template       mustache template
     * @param  {object}   keyValues      key-value pairs
     * @param  {Array.<string>=} ignoredColumns the columns that should be ignored (optional)
     * @return {boolean} true if all the used keys have values
     */
    module._validateHandlebarsTemplate = function (template, keyValues, catalog, ignoredColumns) {
        var conditionalRegex = /\{\{(((#|\^)([^\{\}]+))|(if|unless|else))([^\{\}]+)\}\}/, i, key, value;

        // Inject ermrest internal utility objects such as date
        // needs to be done in the case _validateTemplate is called without first calling _renderTemplate
        module._addErmrestVarsToTemplate(keyValues, catalog);

        // If no conditional handlebars statements of the form {{#if VARNAME}}{{/if}} or {{^if VARNAME}}{{/if}} or {{#unless VARNAME}}{{/unless}} or {{^unless VARNAME}}{{/unless}} not found then do direct null check
        if (!conditionalRegex.exec(template)) {

            // Grab all placeholders ({{PROP_NAME}}) in the template
            var placeholders = template.match(/\{\{([^\{\}\(\)\s]+)\}\}/ig);

            // These will match the placeholders that are encapsulated in square brackets {{[string with space]}} or {{{[string with space]}}}
            var specialPlaceholders = template.match(/\{\{((\[[^\{\}]+\])|(\{\[[^\{\}]+\]\}))\}\}/gi);

            // If there are any placeholders
            if (placeholders && placeholders.length) {

                // Get unique placeholders
                placeholders = placeholders.filter(function(item, i, ar) { return ar.indexOf(item) === i && item !== 'else'; });

                /*
                 * Iterate over all placeholders to set pattern as null if any of the
                 * values turn out to be null or undefined
                 */
                for (i=0; i<placeholders.length;i++) {

                    // Grab actual key from the placeholder {{name}} = name, remove "{{" and "}}" from the string for key
                    key = placeholders[i].substring(2, placeholders[i].length - 2);

                    if (key[0] == "{") key = key.substring(1, key.length -1);

                    // find the value.
                    value = module._getPath(keyValues, key.trim());

                    // TODO since we're not going inside the object this logic of ignoredColumns is not needed anymore,
                    // it was a hack that was added for asset columns.
                    // If key is not in ingored columns value for the key is null or undefined then return null
                    if ((!Array.isArray(ignoredColumns) || ignoredColumns.indexOf(key) == -1) && (value === null || value === undefined)) {
                       return false;
                    }
                }
            }

            // If there are any placeholders
            if (specialPlaceholders && specialPlaceholders.length) {

                // Get unique placeholders
                specialPlaceholders = specialPlaceholders.filter(function(item, i, ar) { return ar.indexOf(item) === i && item !== 'else'; });

                /*
                 * Iterate over all specialPlaceholders to set pattern as null if any of the
                 * values turn out to be null or undefined
                 */
                for (i=0; i<specialPlaceholders.length;i++) {

                    // Grab actual key from the placeholder {{name}} = name, remove "{{" and "}}" from the string for key
                    key = specialPlaceholders[i].substring(2, specialPlaceholders[i].length - 2);

                    if (key[0] == "{") key = key.substring(1, key.length -1);

                    // Remove [] from the key {{[name]}} = name, remove "[" and "]" from the string for key
                    key = key.substring(1, key.length - 1);

                    // find the value.
                    value = module._getPath(keyValues, key.trim());

                    // TODO since we're not going inside the object this logic of ignoredColumns is not needed anymore,
                    // it was a hack that was added for asset columns.
                    // If key is not in ingored columns value for the key is null or undefined then return null
                    if ((!Array.isArray(ignoredColumns) || ignoredColumns.indexOf(key) == -1) && (value === null || value === undefined)) {
                       return false;
                    }
                }
            }
        }
        return true;
    };

    /**
     * A wrapper for {ERMrest._renderMustacheTemplate}
     * This function will generate formmatted values from the given data,
     * if you don't want the funciton to format the data, make sure to have
     * options.formatted = true
     * options.templateEngine: "mustache" or "handlbars"
     *
     * @param  {string} template - template to be rendered
     * @param  {object} keyValues - formatted key value pairs needed for the template
     * @param  {ERMrest.Table} table - the table representing the keyValues data
     * @param  {string} context -
     * @param  {Array.<Object>=} options optioanl parameters
     * @return {string} Returns a string produced as a result of templating using options.templateEngine or `Mustache` by default.
     */
    module._renderTemplate = function (template, keyValues, table, context, options) {

        var obj = {};

        if (typeof template !== 'string') return null;

        // to avoid computing keyValues mutliple times, or if we don't want the formatted values
        // TODO: remove this from render template and enforce keyValues be formatted, also remove context param
        if (table && (options === undefined || !options.formatted)) {
            keyValues = module._getFormattedKeyValues(table, context, keyValues);
        }

        options = options || {};

        if (options.templateEngine === module.HANDLEBARS) {
            // render the template using Handlebars
            return module.renderHandlebarsTemplate(template, keyValues, table.schema.catalog, options);
        }

        // render the template using Mustache
        return module._renderMustacheTemplate(template, keyValues, table.schema.catalog, options);
    };

    /**
     * A wrapper for {ERMrest._validateMustacheTemplate}
     * it will take care of adding formmatted and unformatted values.
     * options.formmatted=true: to avoid formatting key values
     * options.ignoredColumns: list of columns that you want validator to ignore
     * options.templateEngine: "mustache" or "handlbars"
     *
     * @param  {ERMrest.Table} table
     * @param  {object} data
     * @param  {string} template
     * @param  {string} context
     * @param  {Array.<string>=} ignoredColumns the columns that should be ignored (optional)
     * @return {boolean} True if the template is valid.
     */
    module._validateTemplate = function (template, data, table, context, options) {

        var ignoredColumns;
        if (typeof options !== undefined && Array.isArray(options.ignoredColumns)) {
            ignoredColumns = options.ignoredColumns;
        }

        // to avoid computing data multiple times, or if we don't want the formatted values
        // TODO: remove this from render template, change `data` to `keyValues` for consistency with _renderTemplate, and enforce keyValues be formatted, also remove context param
        if (options === undefined || !options.formatted) {
            // make sure to add formatted columns too.
            if (ignoredColumns !== undefined) {
                ignoredColumns.forEach(function (col) {
                    ignoredColumns.push("_" + col);
                });
            }

            data = module._getFormattedKeyValues(table, context, data);
        }

        if (options.templateEngine === module.HANDLEBARS) {
            // call the actual Handlebar validator
            return module._validateHandlebarsTemplate(template, data, table.schema.catalog, ignoredColumns);
        }

        // call the actual mustache validator
        return module._validateMustacheTemplate(template, data, table.schema.catalog, ignoredColumns);
    };

    /**
     * Given a markdown_pattern template and data, will return the appropriate
     * presentation value.
     *
     * @param  {String} template the handlebars/mustache template
     * @param  {Object} data     the key-value pair of data
     * @param  {ERMrest.Table} table    the table object
     * @param  {String} context  context string
     * @param  {Object} options
     * @return {Object}          An object with `isHTML` and `value` attributes.
     */
    module._processMarkdownPattern = function (template, data, table, context, options) {
        var res = module._renderTemplate(template, data, table, context, options);

        if (res === null || res.trim() === '') {
            res = module._getNullValue(table, context, [table, table.schema]);
            return {isHTML: false, value: res, unformatted: res};
        }

        var utils = module._formatUtils;
        return {isHTML: true, value: utils.printMarkdown(res, options), unformatted: res};
    };

    // module._constraintNames[catalogId][schemaName][constraintName] will return an object.
    module._constraintNames = {};
    var consIndex = 0;

    /**
     * Creaes a map from catalog id, schema name, and constraint names to the actual object.
     *
     * @private
     * @param  {string} catalogId      catalog id
     * @param  {string} schemaName     schema name
     * @param  {string} constraintName the constraint name of the object
     * @param  {string} obj            the object that we want to store
     * @param  {string} subject        one of module._constraintTypes
     */
    module._addConstraintName = function (catalogId, schemaName, constraintName, obj, subject) {
        if (!(catalogId in module._constraintNames)) {
            module._constraintNames[catalogId] = {};
        }

        if (!(schemaName in this._constraintNames[catalogId])) {
            module._constraintNames[catalogId][schemaName] = {};
        }

        module._constraintNames[catalogId][schemaName][constraintName] = {
            "subject": subject,
            "object": obj,
            "code": "c" + (consIndex++)
        };
    };

    /**
     * Return an object given catalog id, schema name, and constraint name.
     *
     * @private
     * @param  {string} catalogId      catalog id
     * @param  {string} schemaName     schema name
     * @param  {string} constraintName the constraint name of the object
     * @param  {string} subject        one of module._constraintTypes
     * @return {object}                the constraint object. It will have .subject (any of module._constraintTypes) and .object (actual object)
     */
    module._getConstraintObject = function (catalogId, schemaName, constraintName, subject) {
        var result;
        if ((catalogId in module._constraintNames) && (schemaName in module._constraintNames[catalogId])){
            result = module._constraintNames[catalogId][schemaName][constraintName];
        }
        return (result === undefined || (subject !== undefined && result.subject !== subject)) ? null : result;
    };

    /**
     * Return an object containing window.location properties ('host', 'hostname', 'hash', 'href', 'port', 'protocol', 'search').
     *
     * @private
     * @param  {string} url     URL to be parsed
     * @return {object}         The location object
     */
    module._parseUrl = function(url) {
        var m = url.match(/^(([^:\/?#]+:)?(?:\/\/(([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
            r = {
                hash: m[8] || "",                    // #asd
                host: m[3] || "",                    // localhost:257
                hostname: m[4] || "",                // localhost
                href: m[0] || "",                    // http://localhost:257/deploy/?asd=asd#asd
                origin: m[1] || "",                  // http://localhost:257
                pathname: m[6] || (m[1] ? "/" : ""), // /deploy/
                port: m[5] || "",                    // 257
                protocol: m[2] || "",                // http:
                search: m[7] || ""                   // ?asd=asd
            };
        if (r.protocol.length == 2) {
            r.protocol = "file:///" + r.protocol.toUpperCase();
            r.origin = r.protocol + "//" + r.host;
        }
        r.href = r.origin + r.pathname + r.search + r.hash;
        return m && r;
    };

    /**
     * Given an object will make sure it's safe for header.
     * @param  {object} obj JavaScript object or JSON object
     * @return {string} A safe string for http header
     */
    module._encodeHeaderContent = function (obj) {
        return unescape(module._fixedEncodeURIComponent(JSON.stringify(obj)));
    };

    /**
     *  version is a 64-bit integer representing microseconds since the Unix "epoch"
     *  The 64-bit integer is encoded using a custom base32 encoding scheme
     *  @returns {String} the version decoded to it's time since epoch in milliseconds
     */
    module.versionDecodeBase32 = function (version) {
        // use 5-bit value as index to find symbol
        // e.g. b32_symbols[15] == 'F'
        var b32Symbols = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

        // reverse mapping symbol -> 5-bit value
        var b32Values = {};
        for (var i=0; i<b32Symbols.length; i++) {
            var symbol = b32Symbols[i];
            b32Values[symbol] = i;
        }

        // """Decode 64-bit integer as approximate float value."""

        // map to canonical symbols w/o separators
        var s = version.toUpperCase()
            .replaceAll('-', '')
            .replaceAll('O', '0')
            .replaceAll('I', '1')
            .replaceAll('L', '1');

        if (s.length > 13) {
            // throw error maybe?
            throw new Error("Invalid Version String", s.length + " symbols exceedlimit of 13");
            // raise ValueError('%d symbols exceeds limit of 13' % len(s))
        } else if (s.length < 13) {
            // normalize to full 13-symbol format as general case
            s = '0'.repeat(13 - s.length) + s;
        }

        // interpret first symbol as 2's complement signed value
        var accum = parseFloat(b32Values[s[0]]);
        if (accum >= 16) accum -= 32;

        // interpret remaining symbols as unsigned values
        for (var k=1; k<s.length; k++) {
            var char = s[k];
            accum = accum * 32 + b32Values[char];
        }

        // remove least significant pad bit and convert to milliseconds for precision
        return (accum / 2.0)/1000;
    };

    /**
     * Given a header value, will encode and truncate if its length is more than the allowed length.
     * These are the allowed and expected values in a header:
     * - cid
     * - pid
     * - wid
     * - schema_table: schema:table
     * - filter
     * - facet
     * - referrer: for related entities the main entity, for recordset facets: the main entity
     *    - filter
     *    - facet
     *    - schema_table
     * - source: the source object of facet
     * @param  {object} header The header content
     * @return {object}
     */
    module._certifyContextHeader = function (header) {
        var MAX_LENGTH = 6500;
        var encode = module._encodeHeaderContent;
        var res = encode(header), prevRes, facetRes;

        if (res.length < MAX_LENGTH) {
            return res;
        }

        // the minimal required attributes for log
        var obj = {
            cid: header.cid,
            wid: header.wid,
            pid: header.pid,
            action: header.action,
            schema_table: header.schema_table,
            t: 1 // indicates that this request has been truncated
        };

        prevRes = res = encode(obj);
        if (res.length >= MAX_LENGTH) {
            return {};
        }

        // truncate facet or filter
        // if it's a facet that has `and` in the first level,
        // it will remove only the array element that is needed. otherwise
        // the whole facet/filter will be removed.
        var truncateFacet = function (obj, header, key) {
            var prevRes = encode(obj);
            var h = key ? header[key] : header;

            if (h.filter) {
                // add the filter
                if (key) {
                    obj[key].filter = h.filter;
                } else {
                    obj.filter = h.filter;
                }

                // encode and test the length
                res = encode(obj);
                if (res.length >= MAX_LENGTH) {
                    // it was lengthy so just return the obj without filter
                    return {truncated: true, res: prevRes};
                }

                // return result with filter
                return {truncated: false, res: res};
            }

            // this function only expects facet and filter. it will ignore other variables
            if (!h.facet) {
                return {truncated: false, res: prevRes};
            }

            // only optimized for just one type of facet that we currently support: {and: []}
            // otherwise just treat it as a object
            if (!Array.isArray(h.facet.and)) {

                // add the facet
                if (key) {
                    obj[key].facet = h.facet;
                } else {
                    obj.facet = h.facet;
                }

                // encode and test the length
                res = encode(obj);
                if (res.length >= MAX_LENGTH) {
                    return {truncated: true, res: prevRes};
                }

                // return result with facet
                return {truncated: true, res: res};
            }

            if (key) {
                obj[key].facet = {and: []};
            } else {
                obj.facet = {and: []};
            }

            // add fitlers in the and array one by one until getting to the limit.
            for (var i = 0; i < h.facet.and.length; i++) {
                if (key) {
                    obj[key].facet.and.push(h.facet.and[i]);
                } else {
                    obj.facet.and.push(h.facet.and[i]);
                }

                res = encode(obj);
                if (res.length >= MAX_LENGTH) {
                    return {truncated: true, res: prevRes};
                }
                prevRes = res;
            }

            // this means that the object had other attributes (apart from filter and facet)
            // which is getting truncated
            return {truncated: true, res: res};
        };

        // referrer: schema_table, facet (filter)
        if (header.referrer) {
            obj.referrer = {
                schema_table: header.referrer.schema_table
            };
            res = encode(obj);
            if (res.length >= MAX_LENGTH) {
                return prevRes;
            }

            // take care of facet and fitler in referrer
            facetRes = truncateFacet(obj, header, "referrer");
            if (facetRes.truncated) {
                return facetRes.res;
            }
            prevRes = facetRes.res;
        }

        // .source
        if (header.source) {
            obj.source = header.source;
            res = encode(obj);
            if (res.length >= MAX_LENGTH) {
                return prevRes;
            }
        }

        // take care of facet and fitler
        return truncateFacet(obj, header).res;
    };

    // for more information on url length limit refer to the following issue:
    // https://github.com/informatics-isi-edu/chaise/issues/1669
    module.URL_PATH_LENGTH_LIMIT = 4000;
    var isNode =  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
    if (!isNode) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode, // Internet Explorer 6-11
        isEdge = !isIE && !!window.StyleMedia; // Edge
        if(isIE || isEdge) {
            module.URL_PATH_LENGTH_LIMIT = 2000;
        }
    }

    module._constraintTypes = Object.freeze({
        KEY: "k",
        FOREIGN_KEY: "fk"
    });

    module._isEntryContext = function(context) {
        return module._entryContexts.indexOf(context) !== -1;
    };

    /**
     * @desc List of annotations that ERMrestJS supports.
     * @private
     */
    module._annotations = Object.freeze({
        APP_LINKS: "tag:isrd.isi.edu,2016:app-links",
        ASSET: "tag:isrd.isi.edu,2017:asset",
        CHAISE_CONFIG: "tag:isrd.isi.edu,2019:chaise-config",
        CITATION: "tag:isrd.isi.edu,2018:citation",
        COLUMN_DISPLAY: "tag:isrd.isi.edu,2016:column-display",
        DISPLAY: "tag:misd.isi.edu,2015:display",
        EXPORT: "tag:isrd.isi.edu,2016:export",
        EXPORT_CONTEXTED: "tag:isrd.isi.edu,2019:export",
        FOREIGN_KEY: "tag:isrd.isi.edu,2016:foreign-key",
        GENERATED: "tag:isrd.isi.edu,2016:generated",
        HIDDEN: "tag:misd.isi.edu,2015:hidden", //TODO deprecated and should be deleted.
        IGNORE: "tag:isrd.isi.edu,2016:ignore", //TODO should not be used in column and foreign key
        IMMUTABLE: "tag:isrd.isi.edu,2016:immutable",
        KEY_DISPLAY: "tag:isrd.isi.edu,2017:key-display",
        NON_DELETABLE: "tag:isrd.isi.edu,2016:non-deletable",
        REQUIRED: "tag:isrd.isi.edu,2018:required",
        TABLE_ALTERNATIVES: "tag:isrd.isi.edu,2016:table-alternatives",
        TABLE_DISPLAY: "tag:isrd.isi.edu,2016:table-display",
        VISIBLE_COLUMNS: "tag:isrd.isi.edu,2016:visible-columns",
        VISIBLE_FOREIGN_KEYS: "tag:isrd.isi.edu,2016:visible-foreign-keys"
    });

    /**
     * @desc List of contexts that ERMrestJS supports.
     * @private
     */
    module._contexts = Object.freeze({
        COMPACT: 'compact',
        COMPACT_BRIEF: 'compact/brief',
        COMPACT_BRIEF_INLINE: 'compact/brief/inline',
        COMPACT_SELECT: 'compact/select',
        CREATE: 'entry/create',
        DETAILED: 'detailed',
        EDIT: 'entry/edit',
        ENTRY: 'entry',
        FILTER: 'filter',
        DEFAULT: '*',
        ROWNAME :'row_name'
    });

    module._dataFormats = Object.freeze({
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm:ss",
        DATETIME:  {
            display: "YYYY-MM-DD HH:mm:ss",
            return: "YYYY-MM-DDTHH:mm:ssZ", // the format that the database returns when there are no fractional seconds to show
            submission: "YYYY-MM-DDTHH:mm:ss.SSSZ"
        }
    });

    module._contextArray = ["compact", "compact/brief", "compact/select", "entry/create", "detailed", "entry/edit", "entry", "filter", "*", "row_name", "compact/brief/inline"];

    module._entryContexts = [module._contexts.CREATE, module._contexts.EDIT, module._contexts.ENTRY];

    module._tableKinds = Object.freeze({
        TABLE: "table",
        VIEW: "view"
    });

    /*
     * @desc List of display type for table-display annotation
     * @private
     */
    module._displayTypes = Object.freeze({
        TABLE: 'table',
        MARKDOWN: 'markdown',
        MODULE: 'module'
    });

    module._nonSortableTypes = [
        "json", "jsonb"
    ];

    // types we support for our plotly histogram graphs
    module._histogramSupportedTypes = [
        'int2', 'int4', 'int8', 'float', 'float4', 'float8', 'numeric',
        'serial2', 'serial4', 'serial8', 'timestamptz', 'timestamp', 'date'
    ];

    // these types should be ignored for usage in heuristic for facet
    module._facetHeuristicIgnoredTypes = [
        'markdown', 'longtext', 'serial2', 'serial4', 'serial8', 'jsonb', 'json'
    ];

    // these types are not allowed for faceting (heuristic or annotation)
    module._facetUnsupportedTypes = [
        "json"
    ];

    module._facetUXModes = Object.freeze({
      CHOICE: "choices",
      RANGE: "ranges",
      PRESENCE: "check_presence"
    });

    module._facetUXModeNames = Object.keys(module._facetUXModes).map(function (k) {
        return module._facetUXModes[k];
    });

    module._facetFilterTypes = Object.freeze({
        CHOICE: "choices",
        RANGE: "ranges",
        SEARCH: "search"
    });

    module._facetFilterTypeNames =  Object.keys(module._facetFilterTypes).map(function (k) {
        return module._facetFilterTypes[k];
    });

    module._pseudoColAggregateFns = ["min", "max", "cnt", "cnt_d", "array", "array_d"];
    module._pseudoColEntityAggregateFns = ["array", "array_d"];
    module._pseudoColAggregateNames = ["Min", "Max", "#", "#", "", ""];
    module._pseudoColAggregateExplicitName = ["Minimum", "Maximum", "Number of", "Number of distinct", "List of", "List of distinct"];

    module._systemColumns = ['RID', 'RCB', 'RMB', 'RCT', 'RMT'];

    // NOTE: currently we only ignore the system columns
    module._ignoreDefaultsNames = module._systemColumns;

    module.contextHeaderName = 'Deriva-Client-Context';

    module.HANDLEBARS = "handlebars";

    module._handlebarsHelpersList = [
        // default helpers - NOTE: 'log' and 'lookup' not included
        "blockHelperMissing", "each", "if", "helperMissing", "unless", "with",
        // ermrestJS helpers
        "eq", "ne", "lt", "gt", "lte", "gte", "and", "or", "ifCond",
        "escape", "encode", "formatDate", "encodeFacet"
    ];

    module._operationsFlag = Object.freeze({
        DELETE: "DEL",      //delete
        CREATE: "CRT",   //create
        UPDATE: "UPDT",   //update
        READ: "READ"        //read
    });

    module._specialPresentation = Object.freeze({
        NULL: "*No Value*",
        EMPTY_STR: "*Empty*"
    });

    module._errorStatus = Object.freeze({
        forbidden : "Forbidden",
        itemNotFound : "Item Not Found",
        facetingError: "Invalid Facet Filters",
        customFacetngError: "Invalid Custom Facet Filteres",
        invalidFilter : "Invalid Filter",
        invalidInput : "Invalid Input",
        invalidURI : "Invalid URI",
        noDataChanged : "No Data Changed",
        noConnectionError : "No Connection Error",
        InvalidSortCriteria : "Invalid Sort Criteria",
        invalidPageCriteria : "Invalid Page Criteria"
    });

    module._errorMessage = Object.freeze({
        facetingError : "Given encoded string for facets is not valid.",
        customFacetingError : "Given encoded string for cfacets is not valid.",
        facetOrFilterError: "Given filter or facet is not valid."
    });

    module._facetingErrors = Object.freeze({
        invalidString: "Given encoded string cannot be decoded.",
        invalidFacet: "Facet description is invalid.",
        invalidBooleanOperator: "Only conjunction of facets is supported currently.",
        invalidSource: "Missing or invalid `source` attribute.",
        invalidChoice: "invalid choices value.",
        invalidRange: "invalid ranges value.",
        invalidSearch: "invalid search value.",
        missingConstraints: "No constraints are defined for the facet.",
        onlyOneNullFilter: "Only one null filter is allowed in the facets",
        duplicateFacets: "Cannot define two different sets of facets"
    });

    module._HTTPErrorCodes = Object.freeze({
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN : 403,
        NOT_FOUND: 404,
        TIMEOUT_ERROR: 408,
        CONFLICT : 409,
        PRECONDITION_FAILED: 412,
        INTERNAL_SERVER_ERROR :500,
        BAD_GATEWAY: 502,
        SERVIVE_UNAVAILABLE: 503
    });

    module._warningMessages = Object.freeze({
        NO_PSEUDO_IN_ENTRY: "pseudo-columns are not allowed in entry contexts.",
        INVALID_SOURCE: "given object is invalid. `source` is required and it must be valid",
        DUPLICATE_COLUMN: "ignoring duplicate column definition.",
        DUPLICATE_KEY: "ignoring duplicate key definition.",
        DUPLICATE_FK: "ignoring duplicate foreign key definition.",
        DUPLICATE_PC: "ignoring duplicate pseudo-column definition.",
        INVALID_COLUMN: "column name must be a string.",
        INVALID_AGG: "given aggregate function is invalid.",
        NO_SCALAR_AGG_IN_ENT: "scalar aggreagte functions are not allowed in entity mode",
        FK_NOT_RELATED: "given foreignkey is not inbound or outbound related to the table.",
        INVALID_FK: "given foreignkey definition is invalid.",
        AGG_NOT_ALLOWED: "aggregate functions are not allowed here.",
        MULTI_SCALAR_NEED_AGG: "aggregate functions are required for scalar inbound-included paths.",
        MULTI_ENT_NEED_AGG: "aggregate functions are required for entity inbound-included paths in non-detailed contexts.",
        NO_AGG_IN_ENTRY: "aggregate functions are not allowed in entry contexts.",
        NO_PATH_IN_ENTRY: "pseudo columns with path are not allowed in entry contexts (only single outbound path is allowed).",
        INVALID_SELF_LINK: "given source is not a valid self-link."
    });

    module._permissionMessages = Object.freeze({
        TABLE_VIEW: "Table is a view.",
        TABLE_GENERATED: "Table is generated.",
        TABLE_IMMUTABLE: "Table is immutable.",
        NO_CREATE: "No permissions to create.",
        NO_UPDATE: "No permissions to update.",
        DISABLED_COLUMNS: "All columns are disabled."
    });

    module._defaultColumnComment = Object.freeze({
        RID: "Persistent, citable resource identifier",
        RCB: "Record creator",
        RMB: "Record last modifier",
        RCT: "Record creation timestamp",
        RMT: "Record last modified timestamp"
    });
