/**
 * The structure of table and contexts used:
 * main -> f1 -> f2
 * - detailed context visible columns:
 * 0: main_table_id_col (none pseudo) (ReferenceColumn)
 * 1: col  (ReferenceColumn)
 * 2: id (entity mode) - uAu3dAKI_aHyAYkDdaYMjw   (KeyPseudoColumn)
 * 3: main_fk1 (entity mode) - xRrChcQgxGIr0CNyYQtQ0Q (ForeignKeyPseudoColumn)
 * 4: main_fk1 - o7Gpk7dRlnzNv3_JjhqDIg (PseudoColumn)
 * 5: main_fk1 -> outbound_1_fk1 (entity mode) - CaEhWBd7gSjuYCLun-8D-A  (PseudoColumn)
 * 6: main_fk1 -> outbound_1_fk1 - 1EC_6-rbhKc3tIjczjq1fQ (PseudoColumn)
 * 7: inbound_1_fk1 (entity mode) - GUABhSm2h_kaHHPGkzYWeA (InboundForeignKeyPseudoColumn)
 * 8: association (entity mode) - gNTPCP0bGB0GRwFKEATipw (InboundForeignKeyPseudoColumn)
 * 9: association -> inbound_2_fk1 (entity mode) - nGwW9Kpx5sLf8cpX-24WNQ (PseudoColumn)
 * 10: main -> association (entity mode) - 0utuimdZvz8kTU4GI7tzWw (to check users can ignore p&b logic) (InboundForeignKeyPseudoColumn)
 * 11: same as 8 with `cnt` aggregate (PseudoColumn)
 * 12: same as 9 with `cnt_d` aggregate (PseudoColumn)
 * 13: same as 10 in non-entity mode with `min` aggregate (PseudoColumn)
 * 14: col - max (PseudoColumn)
 * 15: same as 8 with `array` in non entity mode
 * 16: same as 8 with `array` in entity mode
 * 17: inbound for testing long aggregate request (PseudoColumn)
 * 18: asset (AssetPseudoColumn)
 * 19: asset_filename (ReferenceColumn)
 *
 * Only the followin indeces are PseudoColumn:
 * 4 (outbound len 1, scalar)
 * 5 (outbound len 2)
 * 6 (outbound len 2, scalar)
 * 9 (inbound, outbound, outbound, entity)
 * 11(association, agg cnt)
 * 12(same as 9, agg cnt_d)
 * 13(inbound, scalar, agg min)
 * 14(col - agg max)
 * 15 (same as 8, agg array)
 * 16 (inbound, agg cnt)
 * 17 (inbound, agg cnt, entity)
 *
 * For entry:
 * 0: main_table_id_col
 * 1: col
 * 3: main_fk1
 * 4: asset
 *
 * - related entities:
 * 0: inbound_3_outbound_1_fk1 (length 1)
 * 1: inbound_3 association
 * 1: inbound_3_outbound_1 (association -> fk)
 */


exports.execute = function (options) {
    describe('PseudoColumn, ', function () {

        var catalog_id = process.env.DEFAULT_CATALOG,
            schemaName = "pseudo_column_schema",
            tableName = "main",
            invalidAnnotTableName = "table_w_invalid_pseudo_cols",
            entityId = "01",
            entryContext = "entry",
            detailedContext = "detailed";

        var mainEntityUri = options.url + "/catalog/" + catalog_id + "/entity/" +
            schemaName + ":" + tableName + "@sort(main_table_id_col)";

        var invalidEntityUri = options.url + "/catalog/" + catalog_id + "/entity/" +
            schemaName + ":" + invalidAnnotTableName + "/main_table_id_col=01";

        var chaiseURL = "https://dev.isrd.isi.edu/chaise";
        var recordURL = chaiseURL + "/record";
        var record2URL = chaiseURL + "/record-two";
        var viewerURL = chaiseURL + "/viewer";
        var searchURL = chaiseURL + "/search";
        var recordsetURL = chaiseURL + "/recordset";

        var appLinkFn = function (tag, location) {
            var url;
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

        // you should use this function only after options.entities value is populated
        // (in any of jasmine blocks)
        var findRID = function (currTable, keyName, keyValue) {
            return options.entities[schemaName][currTable].filter(function (e) {
                return e[keyName] == keyValue;
            })[0].RID;
        };

        // some of the values are depending on RID
        var detailedExpectedValue;

        var detailedExpectedNames = [
             'main_table_id_col', 'col', '06fr6g_9dDm8WuAmEirSRg', 'xRrChcQgxGIr0CNyYQtQ0Q',
             'o7Gpk7dRlnzNv3_JjhqDIg', 'CaEhWBd7gSjuYCLun-8D-A', '1EC_6-rbhKc3tIjczjq1fQ',
             'GUABhSm2h_kaHHPGkzYWeA', 'gNTPCP0bGB0GRwFKEATipw', 'nGwW9Kpx5sLf8cpX-24WNQ',
             '0utuimdZvz8kTU4GI7tzWw', 'PEQDZ38621T5Y9J3P2Te2Q', 'plpeoINYqVjmca9rYYtFuw',
             'OpHtewN91L9_3b1Vq-jkOg', 'LHC_G9Tm_jYXQXyNNrZIGA', 'H3B-cJhnO5kI08bThBIMxw',
             'ZJll4WjE6eMk_g5e9WE1rg', 'MJVZnQ5mBRdCFPfjIOMvkA', "asset", "asset_filename"
        ];

        var detailedPseudoColumnIndices = [
            4, 5, 6, 9, 11,12, 13, 14, 15, 16, 17
        ];

        var detailedColumnTypes = [
            "", "", "isKey", "isForeignKey", "isPathColumn", "isPathColumn",
            "isPathColumn", "isInboundForeignKey", "isInboundForeignKey", "isPathColumn",
            "isInboundForeignKey", "isPathColumn", "isPathColumn", "isPathColumn", "isPathColumn",
            "isPathColumn", "isPathColumn", "isPathColumn", "isAsset", ""
        ];

        var mainRef, mainRefDetailed, invalidRef, mainRefEntry,
            detailedCols, detailedColsWTuple, mainTuple, mainPage;

        beforeAll(function (done) {
            options.ermRest.appLinkFn(appLinkFn);
            options.ermRest.resolve(mainEntityUri, {cid: "test"}).then(function (response) {
                mainRef = response;
                mainRefDetailed = response.contextualize.detailed;
                detailedCols = mainRefDetailed.columns;
                mainRefEntry = response.contextualize.entry;
                return options.ermRest.resolve(invalidEntityUri, {cid: "test"});
            }).then(function (response) {
                invalidRef = response;
                done();
            }).catch(function (err){
                console.dir(err);
                done.fail();
            });

            detailedExpectedValue = [
                '01', '<p>01: col val 01</p>\n',
                '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:main/main_table_id_col=01">01</a>',
                '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:outbound_1/RID=' + findRID('outbound_1', 'id','01') + '">01</a>',
                '<p>01: 10</p>\n', '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:outbound_1_outbound_1/RID=' + findRID('outbound_1_outbound_1', 'id', '01') + '">01</a>',
                '01', '', '', '', '', '', '', '', '', '', '', '', '', ''
            ];
        });

        describe("columns list, ", function () {
            it ("should ignore the invalid column objects.", function () {
                checkReferenceColumns([{
                    "ref": invalidRef.contextualize.compact,
                    "expected": []
                }]);
            });

            it ("should avoid duplicates (based on source, entity, and aggregate).", function () {
                checkReferenceColumns([{
                    "ref": invalidRef.contextualize.compactSelect,
                    "expected": [
                        "col", "col", "col", "col", "col", // normal, min, max, cnt, cnt_d
                        ["pseudo_column_schema", "table_w_invalid_pseudo_cols_key1"].join("_"),
                        ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"].join("_"),
                        [{"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]}, "main_table_id_col"], // entity false
                        [{"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]}, "main_table_id_col"], // cnt
                        [{"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]}, "main_table_id_col"], // cnt_d
                        [{"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]}, "main_table_id_col"], // min
                        [{"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]}, "main_table_id_col"]  // max
                    ]
                }]);
            });

            it ("should ignore the column objects that the generated hash is one of table's columns.", function () {
                checkReferenceColumns([{
                    "ref": invalidRef.contextualize.compactBrief,
                    "expected": []
                }]);
            });

            it ("should ignore the column objects that their equivalent Column, Key, ForeignKey, or InboundforeignKey exists.", function () {
                checkReferenceColumns([{
                    "ref": mainRef.contextualize.compactSelect,
                    "expected": [
                        "col",
                        "main_table_id_col",
                        ["pseudo_column_schema", "main_key1"].join("_"),
                        ["pseudo_column_schema", "main_fk1"].join("_")
                    ]
                }, {
                    "ref": mainRef.contextualize.compactBrief,
                    "expected": [
                        "col",
                        "main_table_id_col", // this is the normal column
                        ["pseudo_column_schema", "main_key1"].join("_"),
                        ["pseudo_column_schema", "main_fk1"].join("_")
                    ]
                }]);
            });

            it ("should allow entity non-aggregate pseudo column with path in detailed context.", function () {
                checkReferenceColumns([{
                    "ref": invalidRef.contextualize.detailed,
                    "expected": [
                        [
                            {"outbound": ["pseudo_column_schema", "table_w_invalid_pseudo_cols_fk1"]},
                            {"inbound": ["pseudo_column_schema", "inbound_1_fk1"]},
                            "id"
                        ]
                    ]
                }]);
            });

            it ("in entry context, should ignore the pseudoColumns that are not supported.", function () {
                expect(mainRefEntry.columns.length).toBe(4, "length missmatch.");
                checkReferenceColumns([{
                    "ref": mainRefEntry,
                    "expected": [
                        "main_table_id_col", "col", ["pseudo_column_schema", "main_fk1"].join("_"), "asset"
                    ]
                }]);
            });

            it ("should create the correct columns for valid list of sources.", function () {
                expect(mainRefDetailed.columns.length).toBe(20, "length missmatch");
                checkReferenceColumns([{
                    "ref": mainRefDetailed,
                    "expected": [
                        "main_table_id_col", "col", ["pseudo_column_schema", "main_key1"].join("_"),
                        ["pseudo_column_schema", "main_fk1"].join("_"),
                        [{"outbound": ["pseudo_column_schema", "main_fk1"]}, "id"],
                        [
                            {"outbound": ["pseudo_column_schema", "main_fk1"]},
                            {"outbound": ["pseudo_column_schema", "outbound_1_fk1"]},
                            "id"
                        ],
                        [
                            {"outbound": ["pseudo_column_schema", "main_fk1"]},
                            {"outbound": ["pseudo_column_schema", "outbound_1_fk1"]},
                            "id"
                        ],
                        ["pseudo_column_schema", "inbound_1_fk1"].join("_"),
                        ["pseudo_column_schema", "main_inbound_2_association_fk1"].join("_"),
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_2_association_fk2"]},
                            {"outbound": ["pseudo_column_schema", "inbound_2_fk1"]},
                            "id",
                        ],
                        ["pseudo_column_schema", "main_inbound_2_association_fk1"].join("_"),
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_2_association_fk2"]},
                            "id"
                        ],
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_2_association_fk2"]},
                            {"outbound": ["pseudo_column_schema", "inbound_2_fk1"]},
                            "id",
                        ],
                        [{"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]}, "id"],
                        "col",
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_2_association_fk2"]},
                            "id"
                        ],
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_2_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_2_association_fk2"]},
                            "id"
                        ],
                        [{"inbound": ["pseudo_column_schema", "inbound_4_long_table_name_fk"]}, "foreign key column name to main"],
                        "asset",
                        "asset_filename"
                    ]
                }]);
            });
        });

        describe("integration with other APIs, ", function () {
            describe ("reading a reference with path columns, ", function () {
                it("read should handle path columns.", function (done) {
                    mainRefDetailed.read(1).then(function (page) {
                        mainPage = page;
                        mainTuple = page.tuples[0];
                        expect(page.tuples[0].values).toEqual(jasmine.arrayContaining(detailedExpectedValue));
                        done();
                    }).catch(function (err) {
                        console.log(err);
                        done.fail();
                    });
                });

                describe("sort and paging, ", function () {
                    describe("for one-to-one pseudoColumns, ", function () {
                        it ("sort in entity mode should apply the same logic as ForeignKeyPseudoColumn (use row-order if available).", function (done) {
                            // pseudo_column_schema_main_fk1
                            checkSort(mainRefDetailed, [{"column": detailedExpectedNames[3],"descending": false}], "10", done);
                        });

                        it ("otherwise should not sort based on row-order.", function (done) {
                            // pseudo_column_schema_main_fk1 with entity:false
                            checkSort(mainRefDetailed, [{"column": detailedExpectedNames[4],"descending": false}], "01", done);
                        });

                        var nextPage;
                        it ("next should be able to handle sorting based on pathColumns.", function (done) {
                            mainRefDetailed.sort([{"column": detailedExpectedNames[4],"descending": false}]).read(1).then(function (res) {
                                return res.next.read(1);
                            }).then(function (res) {
                                nextPage = res;
                                expect(res.tuples[0].values[0]).toEqual("10");
                                done();
                            }).catch(function (err) {
                                console.log(err);
                                done.fail();
                            });
                        });

                        it ("previous should be able to handle sorting based on pathColumns.", function (done) {
                            nextPage.previous.read(1).then(function (res) {
                                expect(res.tuples[0].values[0]).toEqual("01");
                                done();
                            }).catch(function (err) {
                                console.log(err);
                                done.fail();
                            });
                        });
                    });
                });

            });

            describe(".related, ", function () {
                var related;
                beforeAll(function () {
                    related = mainRefDetailed.related(mainTuple);
                });

                it ("should not add duplicate sources, and create the list as expected.", function () {
                    expect(related.length).toBe(3);
                });

                it ("related reference displayname should use the pseudo-column's displayname (markdown_name).", function () {
                    var names = [
                        "<strong>length 1 inbound</strong>",
                        "<strong>association</strong>",
                        "<strong>length 3 inbound</strong>"
                    ];

                    for (var i = 0; i < 3; i++) {
                        expect(related[i].displayname.value).toBe(names[i], "missmatch for index="+  i);
                    }
                });

                it ("if it's related with length one should have the expected attributes.", function () {
                    expect(related[0].derivedAssociationReference).toBeUndefined();
                });

                it ("If it's association should have the expected attributes.", function () {
                    expect(related[1].derivedAssociationReference).toBeDefined("undefined");
                    expect(related[1].derivedAssociationReference.table.name).toBe("main_inbound_3_association");
                });


                it ("other attributes must be as expected.", function () {

                });
            });

            it("generateColumnsList, passing tuple should not change the column list.", function () {
                detailedColsWTuple = mainRefDetailed.generateColumnsList(mainTuple);
                areSameColumnList(detailedColsWTuple, detailedCols);
            });

            it ("faceting should be able to handle these new type of columns.", function () {
                var facetColumns = mainRef.facetColumns;
                // since it's going to use the heuristic and in compact we don't
                // allow inbound fk without aggregate, this won't be exactly the same list.

                // NOTE faceting will change the last column of more specific pseudo-columns
                // (ForeignKey, InboundforeignKey, etc.) to the shortestkey.
                expect(facetColumns.length).toBe(11, "length missmatch.");
                expect(facetColumns.map(function (fc) {
                    return fc.dataSource;
                })).toEqual(
                    [
                        "main_table_id_col", "col", "main_table_id_col", // the key
                        [{"outbound": ["pseudo_column_schema", "main_fk1"]}, "RID"],
                        [{"outbound": ["pseudo_column_schema", "main_fk1"]}, "id"], //entity:false
                        [
                            {"outbound": ["pseudo_column_schema", "main_fk1"]},
                            {"outbound": ["pseudo_column_schema", "outbound_1_fk1"]},
                            "id"
                        ],
                        [
                            {"outbound": ["pseudo_column_schema", "main_fk1"]},
                            {"outbound": ["pseudo_column_schema", "outbound_1_fk1"]},
                            "id"
                        ],
                        "asset_filename",
                        [{"inbound": ["pseudo_column_schema", "inbound_3_outbound_1_fk1"]}, "RID"],
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_3_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_3_association_fk2"]},
                            "RID"
                        ],
                        [
                            {"inbound": ["pseudo_column_schema", "main_inbound_3_association_fk1"]},
                            {"outbound": ["pseudo_column_schema", "main_inbound_3_association_fk2"]},
                            {"outbound": ["pseudo_column_schema", "inbound_3_fk1"]},
                            "id"
                        ]
                    ],
                    "array missmatch."
                );
            });
        });

        describe("column APIs, ", function () {
            it ("should create the right type of ReferenceColumn.", function () {
                detailedColumnTypes.forEach(function (type, i) {
                    if (type === "") {
                        expect(detailedColsWTuple[i].isPseudo).toBe(false,  "type missmatch for index=" + i);
                    } else {
                        expect(detailedColsWTuple[i][type]).toBe(true, "type missmatch for index=" + i);
                    }
                });
            });

            describe("for more specific pseudo-columns (ReferenceColumn, Key, ForeignKey, InboundforeignKey, Asset), ", function () {
                it ("comment, should come from the comment defined on the sourceObject.", function () {
                    var expectedComments = {
                        "1": "new comment",
                        "2": "main table key",
                        "3": "main fk cm",
                        "7": "inbound cm",
                        "8": "association table cm",
                        "18": "asset cm"
                    };

                    for (var i in expectedComments) {
                        expect(detailedColsWTuple[i].comment).toBe(expectedComments[i],"missmatch for index=" + i);
                    }
                });

                it ("displayname, should come from the markdown_name defined on the sourceObject.", function () {
                    var expectedComments = {
                        "1": "new name",
                        "2": "main table key",
                        "3": "main fk",
                        "7": "inbound",
                        "8": "<strong>association table</strong>",
                        "18": "<strong>asset</strong>"
                    };

                    for (var i in expectedComments) {
                        expect(detailedColsWTuple[i].displayname.value).toBe(expectedComments[i],"missmatch for index=" + i);
                    }
                });
            });

            describe ('isPathColumn, .', function () {
                it ("should be true for pseudo column", function () {
                    detailedPseudoColumnIndices.forEach(function (i) {
                        expect(detailedColsWTuple[i].isPathColumn).toBe(true, "missmatch for with tuple and index =" + i);
                    });
                });

                it ("otherwise should not be defined.", function () {
                    detailedColsWTuple.forEach(function (col, i) {
                        if (detailedPseudoColumnIndices.indexOf(i) !== -1) return;
                        expect(detailedColsWTuple[i].isPathColumn).toBeUndefined("missmatch for with tuple and index = " + i);
                    });
                });
            });

            describe ('hasPath, ', function () {
                it ('should be true if source has path.', function () {
                    detailedPseudoColumnIndices.forEach(function (i) {
                        if (i === 14) return;
                        expect(detailedColsWTuple[i].hasPath).toBe(true, "missmatch for index =" + i);
                    });
                });

                it ('otherwise it should be false.', function () {
                    expect(detailedColsWTuple[14].hasPath).toBe(false, "missmatch for index =" + i);
                });
            });

            describe ('hasAggregate, ', function () {
                it ("should return false if pseudo-column doesn't have aggregate function.", function () {
                    for (var i = 4; i <= 6; i++) {
                        expect(detailedColsWTuple[i].hasAggregate).toBe(false, "missmatch for index =" + i);
                    }
                });

                it ("otherwise should return true.", function () {
                    for (var i = 11; i <= 15; i++) {
                        expect(detailedColsWTuple[i].hasAggregate).toBe(true, "missmatch for index =" + i);
                    }
                });
            });

            describe('isUnique, ', function () {
                it ('should return true if source has path of all outbound fks.', function () {
                    for (var i = 4; i <= 6; i++) {
                        expect(detailedColsWTuple[i].isUnique).toBe(true, "missmatch for index =" + i);
                    }
                });

                it ('should return false if it has aggregate', function () {
                    for (var i = 11; i <= 15; i++) {
                        expect(detailedColsWTuple[i].isUnique).toBe(false, "missmatch for index =" + i);
                    }
                });

                it ('otherwise should return false.', function () {
                    expect(detailedColsWTuple[9].isUnique).toBe(false, "missmatch for index =" + i);
                });
            });

            describe('isEntityMode, ', function () {
                it ("should return true if column is not-null and part of simple key, and entity is not false.", function () {
                    var i;
                    expect(detailedColsWTuple[5].isEntityMode).toBe(true, "missmatch for index=5");
                    expect(detailedColsWTuple[9].isEntityMode).toBe(true, "missmatch for index=5");
                });

                it ("otherwise it should return true", function () {
                    expect(detailedColsWTuple[4].isEntityMode).toBe(false, "missmatch for index=4");
                    expect(detailedColsWTuple[6].isEntityMode).toBe(false, "missmatch for index=6");
                });
            });

            describe ("displayname, ", function () {
                it ("if `markdown_name` is defined, should use it.", function () {
                    checkDisplayname(detailedColsWTuple[6], "<strong>Outbound Len 2</strong>", true, "for index=6");

                    checkDisplayname(detailedColsWTuple[17], "<strong>Count Agg</strong>", true, "for index=15");
                });

                describe("if it has aggreagte.", function () {
                    it ('should append the aggregate function to the displayname.', function () {
                        var aggregateDisplaynames = [
                            '# id', '# id', 'Min id', 'Max col name', 'id'
                        ];
                        for (var i = 11; i <= 15; i++) {
                            expect(detailedColsWTuple[i].displayname.value).toBe(aggregateDisplaynames[i-11], "missmatch for index =" + i);
                        }
                    });
                });

                it ("if it's in entity mode, should return the table's name.", function () {
                    expect(detailedColsWTuple[5].displayname.value).toBe("outbound_1_outbound_1");
                });

                it ("if it's in scalar mode, should return the column's name.", function () {
                    expect(detailedColsWTuple[4].displayname.value).toBe("id");
                });
            });

            describe("comment, ", function () {
                it ('if `comment` is defined, should use it.', function () {
                    expect(detailedColsWTuple[6].comment).toBe("outbound len 2 cm", "missmatch for index=6");
                    expect(detailedColsWTuple[17].comment).toBe("has long values", "missmatch for index=6");
                });

                it ("if it has aggregate, should append the aggregate function to the column comment.", function () {
                    var aggregateComments = [
                        'Number of id', 'Number of distinct id', 'Minimum id', 'Maximum col name', "List of id"
                    ];
                    for (var i = 11; i <= 15; i++) {
                        expect(detailedColsWTuple[i].comment).toBe(aggregateComments[i-11], "missmatch for index =" + i);
                    }
                });

                it ("if it's in entity mode, should return the table's comment.", function () {
                    expect(detailedColsWTuple[5].comment).toBe("outbound_1_outbound_1 comment");
                });

                it ("if it's in scalar mode, should return the column's comment.", function () {
                    expect(detailedColsWTuple[4].comment).toBe("id of outbound_1");
                });
            });

            describe(".table, ", function () {
                it ("should return the column's table.", function () {
                    expect(detailedColsWTuple.map(function (col) {
                        return col.table.name;
                    })).toEqual([
                        'main', 'main', 'main', 'outbound_1', 'outbound_1',
                        'outbound_1_outbound_1', 'outbound_1_outbound_1',
                        'inbound_1', 'inbound_2', 'inbound_2_outbound_1',
                        'main_inbound_2_association', 'inbound_2',
                        'inbound_2_outbound_1', 'main_inbound_2_association',
                        'main', 'inbound_2', 'inbound_2',
                        'inbound 4 long table name', 'main', 'main'
                    ]);
                });
            });

            describe("sortable, ", function () {
                describe("if it's unique (one-to-one) path should apply the same logic as foreignkey. ", function () {
                    it ("use the column_order defined on last foreignkey.", function () {
                        checkSortable(detailedColsWTuple[5], true, ["col"]);
                    });

                    it ("use the column's column_order if none-entity or row_order is not defined.", function () {
                        checkSortable(detailedColsWTuple[4], true, ["id"], "index=4");
                        checkSortable(detailedColsWTuple[6], true, ["id"], "index=5");
                    });
                });

                it ("otherwise should not be sortable.", function () {
                    checkSortable(detailedColsWTuple[9], false, [], "index=9");
                    for (var i = 11; i <= 15; i++) {
                        checkSortable(detailedColsWTuple[i], false, [], "index=" + i);
                    }
                });
            });

            describe ("formatPresentation, ", function () {
                it ("in entity mode should return null.", function () {
                    detailedPseudoColumnIndices.forEach(function (i) {
                        expect(detailedColsWTuple[i].formatPresentation({"id":"1", "col":"1"}, "entry").value).toEqual("", "missmatch for index=" + i);
                    });
                });

                it ("if aggregate is defined should return null.", function () {
                    for (var i = 11; i <= 15; i++) {
                        expect(detailedColsWTuple[i].formatPresentation({"id":"1", "col":"1"}, "detailed").value).toEqual("", "missmatch for index=" + i);
                    }
                });

                it ("if it's not a one-to-one path, should return null.", function () {
                    expect(detailedColsWTuple[9].formatPresentation({"main_table_id_col":"1", "col":"1"}, "detailed").value).toEqual("", "missmatch for index=" + i);
                });

                describe("if it's a one-to-one path", function () {
                    it ("if in entity mode, should apply the foreignkey logic.", function () {
                        expect(detailedColsWTuple[5].formatPresentation(
                            {"col": "A value", "id": "101"},
                            "detailed"
                        ).value).toEqual('<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:outbound_1_outbound_1/id=101">101</a>', "index=5 missmatch.");
                    });

                    it ("otherwise should apply the underlying column logic.", function () {
                        expect(detailedColsWTuple[4].formatPresentation(
                            {"col": "A value", "id": "101"},
                            "detailed"
                        ).value).toEqual('<p>101: A value</p>\n', "index=4 missmatch.");

                        expect(detailedColsWTuple[6].formatPresentation(
                            {"col": "A value", "id": "101"},
                            "detailed"
                        ).value).toEqual('101', "index=6 missmatch.");
                    });
                });
            });

            describe("getAggregatedValue, ", function () {
                it ("should throw an error if column doesn't have aggregate.", function (done) {
                    detailedColsWTuple[9].getAggregatedValue(mainPage).then(function () {
                        done.fail("expected function to throw error");
                    }).catch(function (e) {
                        expect(e.message).toBe("this function should only be used when `hasAggregate` is true.", "error message missmatch.");
                        done();
                    });
                });

                it ("page should be given.", function (done) {
                    detailedColsWTuple[11].getAggregatedValue().then(function () {
                        done.fail("expected function to throw error");
                    }).catch(function (e) {
                        expect(e.message).toBe("page is required.", "error message missmatch.");
                        done();
                    });
                });

                it ("should return a list of values the same size as the given array.", function (done) {
                    detailedColsWTuple[11].getAggregatedValue(mainPage).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        expect(val[0].value).toEqual("5", "missmatch for column index=11");
                        return detailedColsWTuple[12].getAggregatedValue(mainPage);
                    }).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        expect(val[0].value).toEqual("5", "missmatch for column index=12");
                        return detailedColsWTuple[13].getAggregatedValue(mainPage);
                    }).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        expect(val[0].value).toEqual("1", "missmatch for column index=13");
                        done();
                    }).catch(function (e) {
                        console.log(e);
                        done.fail();
                    });
                });

                it ("should handle aggregate from the same table.", function (done) {
                    detailedColsWTuple[14].getAggregatedValue(mainPage).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        expect(val[0].value).toEqual("col val 01");
                        done();
                    }).catch(function (e) {
                        console.log(e);
                        done.fail();
                    });
                });

                it ("should handle array aggregate in scalar mode.", function (done) {
                    detailedColsWTuple[15].getAggregatedValue(mainPage).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        expect(val[0].value).toEqual('<p>01, 02, 03, 04, 05</p>\n', "value missmatch.");
                        expect(val[0].isHTML).toBe(true, "isHTML missmatch.");
                        done();
                    }).catch(function (e) {
                        done.fail(e);
                    });
                });

                it ("should handle array aggregate in entity mode.", function (done) {
                    detailedColsWTuple[16].getAggregatedValue(mainPage).then(function (val) {
                        expect(val.length).toBe(1, "length missmatch.");
                        var value = [
                            '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:inbound_2/RID=' + findRID("inbound_2","id","01") + '">01 with inbound_2 col 01</a>',
                            '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:inbound_2/RID=' + findRID("inbound_2","id","02") + '">02 with inbound_2 col 02</a>',
                            '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:inbound_2/RID=' + findRID("inbound_2","id","03") + '">03 with inbound_2 col 03</a>',
                            '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:inbound_2/RID=' + findRID("inbound_2","id","04") + '">04 with inbound_2 col 04</a>',
                            '<a href="https://dev.isrd.isi.edu/chaise/record/pseudo_column_schema:inbound_2/RID=' + findRID("inbound_2","id","05") + '">05 with inbound_2 col 05</a>'
                        ];
                        expect(val[0].value).toEqual("<p>" + value.join(", ") + "</p>\n", "value missmatch.");
                        expect(val[0].isHTML).toBe(true, "isHTML missmatch.");
                        done();
                    }).catch(function (e) {
                        done.fail(e);
                    });
                });

                it ("should handle big page of data.", function (done) {
                    mainRefDetailed.read(22).then(function (page) {
                        return detailedColsWTuple[17].getAggregatedValue(page);
                    }).then(function (val) {
                        // the whole intention of test was testing the logic of url limitation,
                        // the values is not important. since all of them are just one row, it will
                        // all be 1s.
                        expect(val.length).toBe(22);
                        val.forEach(function (v, i) {
                            expect(v.value).toBe("1", "missmatch for value of index=" + i);
                        });
                        done();
                    }).catch(function (e) {
                        console.log(e);
                        done.fail();
                    });
                });
            });

            describe("reference, ", function () {
                it ("should return the main reference if source doesn't have path", function () {
                    expect(detailedColsWTuple[14].reference.location.ermrestUri).toBe(mainRefDetailed.location.ermrestUri, "missmatch for index=" + i);
                });

                it ("should be generated based on mainTuple.", function () {
                    checkReference(
                        detailedColsWTuple[6].reference,
                        "outbound_1_outbound_1",
                        {"and": [
                            {"source": [
                                {"inbound":[ 'pseudo_column_schema', 'outbound_1_fk1' ]},
                                {"inbound":[ 'pseudo_column_schema', 'main_fk1' ]},
                                "fk1"],
                            "choices": ["01"]}
                        ]},
                        "index=6"
                    );

                    checkReference(
                        detailedColsWTuple[9].reference,
                        "inbound_2_outbound_1",
                        {"and": [
                            {"source": [
                                {"inbound":[ 'pseudo_column_schema', 'inbound_2_fk1' ]},
                                {"inbound":[ 'pseudo_column_schema', 'main_inbound_2_association_fk2' ]},
                                {"outbound":[ 'pseudo_column_schema', 'main_inbound_2_association_fk1' ]},
                                "main_table_id_col"],
                            "choices": ["01"]}
                        ]},
                        "index=9"
                    );
                });

                it ("if mainTuple is not passed, should return an unfiltered referene.", function () {
                    checkReference(detailedCols[6].reference, "outbound_1_outbound_1", undefined, "index=6");

                    checkReference(detailedCols[9].reference, "inbound_2_outbound_1", undefined, "index=9");
                });
            });

            describe("foreignKeys, ", function () {
                it ("if there's no path it should return an empty array.", function () {
                    checkForeignKeys(detailedColsWTuple[14], [], "index="+ i);
                });

                it ("otherwise it should return a list of objects that have fk and its direction", function () {
                    checkForeignKeys(detailedColsWTuple[9], [
                        {"const": ["pseudo_column_schema", "main_inbound_2_association_fk1"].join("_"), "isInbound": true},
                        {"const": ["pseudo_column_schema", "main_inbound_2_association_fk2"].join("_"), "isInbound": false},
                        {"const": ["pseudo_column_schema", "inbound_2_fk1"].join("_"), "isInbound": false},
                    ]);
                });
            });

            it ("name, should return a deterministic and unique hash.", function () {
                expect(detailedColsWTuple.map(function (col) {
                    return col.name;
                })).toEqual(detailedExpectedNames);
            });

            it ("default, should throw error as this column should not be used in entity mode.",  function () {
                detailedPseudoColumnIndices.forEach(function (i) {
                    expect(function () {
                        var def = detailedColsWTuple[i].default;
                    }).toThrow("can not use this type of column in entry mode.", "missmatch for index=" + i);
                });
            });

            it ("nullok, should throw error as this column should not be used in entity mode.", function () {
                detailedPseudoColumnIndices.forEach(function (i) {
                    expect(function () {
                        var nullok = detailedColsWTuple[i].nullok;
                    }).toThrow("can not use this type of column in entry mode.", "missmatch for index=" + i);
                });
            });
        });

    });

    function areSameColumnList(cols1, cols2) {
        expect(cols1.length).toEqual(cols2.length, "didn't have the same length.");
        for (var i = 0; i < cols1.length; i++) {
            expect(cols1[i].name).toEqual(cols2[i].name, "missmatch in column with index=" + i);
        }
    }

    function checkReferenceColumns(tesCases) {
        tesCases.forEach(function (test) {
            var expected;
            expect(test.ref.columns.map(function (col) {
                // the name for pseudoColumns is a hash, this way of testing it is easier to read
                if (col.isPathColumn) {
                    return col.sourceObject.source;
                }
                if (col.isPseudo && (col.isKey || col.isForeignKey || col.isInboundForeignKey)) {
                    return col._constraintName;
                }
                return  col.name;
            })).toEqual(test.expected);
        });
    }

    function checkSort(ref, sortObject, expectedID, done) {
        ref.sort(sortObject).read(1).then(function (page) {
            expect(page.tuples[0].values[0]).toEqual(expectedID);
            done();
        }).catch(function (err) {
            console.log(err);
            done.fail();
        });
    }

    function checkDisplayname(col, value, isHTML, colStr) {
        expect(col.displayname.value).toBe(value, "value missmatch" + (colStr? (" for " + colStr) : "") + ".");
        expect(col.displayname.isHTML).toBe(isHTML, "isHTML missmatch" + (colStr? (" for " + colStr) : "") + ".");
    }

    function checkSortable (col, sortable, sortColumns, colStr) {
        expect(col.sortable).toBe(sortable, "sortable missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(col._sortColumns.length).toBe(sortColumns ? sortColumns.length : 0, "sortColumns length missmatch" + (colStr ? (" for " + colStr) : "."));
        if (sortColumns) {
            expect(col._sortColumns.map(function (col) {
                return col.column.name;
            })).toEqual(sortColumns, "_sortColumn missmatch" +  (colStr ? (" for " + colStr) : "."));
        }
    }

    function checkForeignKeys (col, fks, colStr) {
        expect(col.foreignKeys.length).toBe(fks.length, "length missmatch"  +  (colStr ? (" for " + colStr) : "."));
        expect(col.foreignKeys.map(function (fk) {
            return {"const": fk.obj._constraintName, "isInbound": fk.isInbound};
        })).toEqual(fks, "fks missmatch" + (colStr ? (" for " + colStr) : "."));
    }

    function checkRelatedReference (ref, table, facets, origFKR, origColumnName, displayname, parentDisplayname, colStr) {
        expect(ref.origFKR.toString()).toEqual(origFKR, "origFKR missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(ref.table.name).toEqual(table, "table missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(ref.location.facets.decoded).toEqual(facets, "facets missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(ref.origColumnName).toEqual(origColumnName, "origColumnName missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(ref.displayname.value).toEqual(displayname, "displayname missmatch" + (colStr ? (" for " + colStr) : "."));
        expect(ref.parentDisplayname.value).toEqual(parentDisplayname, "parentDisplayname missmatch" + (colStr ? (" for " + colStr) : "."));
    }

    function checkReference (ref, table, facets, colStr) {
        expect(ref.table.name).toEqual(table, "table missmatch" + (colStr ? (" for " + colStr) : "."));
        if (facets) {
            expect(ref.location.facets.decoded).toEqual(facets, "facets missmatch" + (colStr ? (" for " + colStr) : "."));
        } else {
            expect(ref.location.facets).toBeUndefined("facets missmatch" + (colStr ? (" for " + colStr) : "."));
        }
    }

};