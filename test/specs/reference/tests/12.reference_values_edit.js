exports.execute = function (options) {

    describe("For determining references are contextualized properly, ", function () {
        var catalog_id = process.env.DEFAULT_CATALOG,
            schemaName = "reference_schema",
            tableName = "reference_values",
            lowerLimit = 3999,
            upperLimit = 4007,
            limit = 7;

        var multipleEntityUri = options.url + "/catalog/" + catalog_id + "/entity/" + schemaName + ":"
            + tableName + "/id::gt::" + lowerLimit + "&id::lt::" + upperLimit;

        var reference, page, tuples;

        beforeAll(function(done) {

            // Fetch the entities beforehand
            options.ermRest.resolve(multipleEntityUri, {cid: "test"}).then(function (response) {
                reference = response;
                expect(reference).toEqual(jasmine.any(Object));
                reference = reference.contextualize.entryEdit;
                return reference.read(limit);
            }).then(function (response) {
                page = response;

                expect(page).toEqual(jasmine.any(Object));
                expect(page._data.length).toBe(limit);

                expect(page.tuples).toBeDefined();
                tuples = page.tuples;
                expect(tuples.length).toBe(limit);

                done();
            }, function (err) {
                console.dir(err);
                done.fail();
            }).catch(function(err) {
                console.dir(err);
                done.fail();
            });

        });

        /*
         * @function
         * @param {string} columName Name of the column.
         * @param {integer} tupleIndex The index of the tuple in {tuples} array.
         * @param {integer} valueIndex The index of the columnValue in the {values} array returned by `tuple.values`.
         * @param {array} expectedValues The expected array of values that should be returned by `tuple.values`.
         * @desc
         * This function checks for the value and isHTML to be false for a particular tuple at the tupleIndex
         * and a particular column value at the specified valuedIndex
         */
        var checkValueAndIsHTML = function(columnName, tupleIndex, valueIndex, expectedValues) {

            it("should check " + columnName + " to be `" + expectedValues[valueIndex] + "`", function() {
                var tuple = tuples[tupleIndex];
                var value = tuple.values[valueIndex];
                var expectedValue = expectedValues[valueIndex];

                // Check value is same as expected
                expect(value).toBe(expectedValue);
            });


            it("should check isHTML for " + columnName + " to be `false`", function() {
                var tuple = tuples[tupleIndex];
                var isHTML = tuple.isHTML[valueIndex];

                // Check isHTML is same as expected; either true or false
                expect(isHTML).toBe(false);
            });

        };

        /*
         * @function
         * @param {integer} tupleIndex The index of the columnValue in the {values} array returned by `tuple.values`.
         * @param {array} expectedValues The expected array of values that should be returned by `tuple.values`.
         * @desc
         * This function calls checkValueAndIsHTML for each column value at the specified tupleIndex
         */
        var testTupleValidity = function(tupleIndex, expectedValues) {

            it("should return 1 values for a tuple", function() {
                var values = tuples[tupleIndex].values;

                expect(values.length).toBe(11);
            });

            checkValueAndIsHTML("id", tupleIndex, 0, expectedValues);
            checkValueAndIsHTML("name", tupleIndex, 1, expectedValues);
            checkValueAndIsHTML("url", tupleIndex, 2, expectedValues);
            checkValueAndIsHTML("image", tupleIndex, 3, expectedValues);
            checkValueAndIsHTML("image_with_size", tupleIndex, 4, expectedValues);
            checkValueAndIsHTML("download_link", tupleIndex, 5, expectedValues);
            checkValueAndIsHTML("iframe", tupleIndex, 6, expectedValues);
            checkValueAndIsHTML("some_markdown", tupleIndex, 7, expectedValues);
            checkValueAndIsHTML("some_markdown_with_pattern", tupleIndex, 8, expectedValues);
            checkValueAndIsHTML("some_gene_sequence", tupleIndex, 9, expectedValues);
        };



        describe('for tuple 0 with row values {"id":4000, "some_markdown": "** date is :**", "name":"Hank", "url": "https://www.google.com", "some_gene_sequence": "GATCGATCGCGTATT"},', function() {
            var values = [
                            "4000",
                            "Hank",
                            "https://www.google.com",
                            null,
                            null,
                            null,
                            null,
                            '**date is :**',
                            '**Name is :**',
                            "GATCGATCGCGTATT",
                            null
                          ];

            testTupleValidity(0, values);
        });

        describe('for tuple 1 with row values {"id":4001, "name":"Harold","some_invisible_column": "Junior"},', function() {

            var values = [
                            "4001",
                            "Harold",
                            null,
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            null,
                            null
                          ];

            testTupleValidity(1, values);
        });

        describe('for tuple 2 with row values {"id":4002, "url": "https://www.google.com"},', function() {

            var values =  [
                            "4002",
                            null,
                            "https://www.google.com",
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            null,
                            null
                          ];

            testTupleValidity(2, values);
        });

        describe('for tuple 3 with row values {"id":4003 ,"some_invisible_column": "Freshmen"},', function() {

            var values = [
                            "4003",
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            null,
                            null
                          ];

            testTupleValidity(3, values);
        });

        describe('for tuple 4 with row values {"id":4004, "name": "weird & HTML < " },', function() {

            var values = [
                            "4004",
                            "weird & HTML < ",
                            null,
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            null,
                            null
                          ];

            testTupleValidity(4, values);
        });

        describe('for tuple 5 with row values {"id":4005, "name": "<a href=\'javascript:alert();\'></a>" , "some_invisible_column": "Senior"},', function() {

            var values = [
                            "4005",
                            "<a href='javascript:alert();'></a>",
                            null,
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            null,
                            null
                          ];

            testTupleValidity(5, values);
        });

        describe('for tuple 6 with row values {"id":4006, "name": "<script>alert();</script>", "some_gene_sequence": "GATCGATCGCGTATT" , "some_invisible_column": "Sophomore"},', function() {

            var values = [
                            "4006",
                            "<script>alert();</script>",
                            null,
                            null,
                            null,
                            null,
                            null,
                            '**This is some markdown** with some `code` and a [link](http://www.example.com)',
                            '**Name is :**',
                            "GATCGATCGCGTATT",
                            null
                          ];

            testTupleValidity(6, values);
        });
        
        
        describe("Testing for EDIT JSON and JSONB Values", function() {
            //Tested these values as formatted values inside it, to get the exact string after JSON.stringify()
            var expectedValues=[{"id":"1001","json_col":true,"jsonb_col":true, "json_col_without_markdownpattern": "\"processed\""},
            {"id":"1002","json_col":{},"jsonb_col":{}, "json_col_without_markdownpattern": "\"Activated\""},
            {"id":"1003","json_col":{"name":"test"},"jsonb_col":{"name":"test"}, "json_col_without_markdownpattern": "\"Analysed\""},
            {"id":"1004","json_col":false,"jsonb_col":false, "json_col_without_markdownpattern": "\"Shipped\""},
            {"id":"1005","json_col":2.9,"jsonb_col":2.9, "json_col_without_markdownpattern": "\"OnHold\""},
            {"id":"1006","json_col":"","jsonb_col":"", "json_col_without_markdownpattern": "\"Complete\""}];

            var catalog_id = process.env.DEFAULT_CATALOG,
                schemaName = "reference_schema",
                tableName = "jsontest_table",
                lowerLimit = 1001,
                upperLimit = 2001,
                limit = 6;

            var multipleEntityUri=options.url + "/catalog/" + catalog_id + "/entity/" + schemaName + ":"+ tableName ;

            var reference, page, tuples,url;
            
            var chaiseURL = "https://dev.isrd.isi.edu/chaise";
            var recordURL = chaiseURL + "/record";
            var record2URL = chaiseURL + "/record-two";
            var viewerURL = chaiseURL + "/viewer";
            var searchURL = chaiseURL + "/search";
            var recordsetURL = chaiseURL + "/recordset";

            var appLinkFn = function (tag, location) {
                
                switch (tag) {
                    case "tag:isrd.isi.edu,2016:chaise:record":
                        url = recordURL;
                        break;
                    case "tag:isrd.isi.edu,2016:chaise:record-two":
                        url = record2URL;
                        break;
                    case "tag:isrd.isi.edu,2016:chaise:viewer":
                        url = viewerURL;
                        break;
                    case "tag:isrd.isi.edu,2016:chaise:search":
                        url = searchURL;
                        break;
                    case "tag:isrd.isi.edu,2016:chaise:recordset":
                        url = recordsetURL;
                        break;
                    default:
                        url = recordURL;
                        break;
                }

                url = url + "/" + location.path;

                return url;
            };


            beforeAll(function(done) {
                
                // Fetch the entities beforehand
                options.ermRest.resolve(multipleEntityUri).then(function (response) {
                    reference = response;
                    expect(reference).toEqual(jasmine.any(Object));
                    reference = reference.contextualize.entryEdit;
                    return reference.read(limit);
                }).then(function (response) {
                    page = response;
                    
                    expect(page).toEqual(jasmine.any(Object));
                    expect(page._data.length).toBe(limit);
                    
                    expect(page.tuples).toBeDefined();
                    tuples = page.tuples;
                    expect(tuples.length).toBe(limit);
                    
                    done();
                }, function (err) {
                    console.dir(err);
                    done.fail();
                }).catch(function(err) {
                    console.dir(err);
                    done.fail();
                });
                options.ermRest.appLinkFn(appLinkFn);
            });
            
            it("JSON and JSONB column should return the expected values in Edit Context", function() {
                
                for( var i=0; i<limit; i++){
                    var values=tuples[i].values;
                    expect(values[0]).toBe(expectedValues[i].id);
                    var json=JSON.stringify(expectedValues[i].json_col,undefined,2);
                    var jsonb=JSON.stringify(expectedValues[i].jsonb_col,undefined,2);
                    expect(values[1]).toBe(json);
                    expect(values[2]).toBe(jsonb);
                    expect(values[3]).toBe(expectedValues[i].json_col_without_markdownpattern);
                }
            });
        });

    });
};
