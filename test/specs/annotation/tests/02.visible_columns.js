exports.execute = function (options) {

    describe('For determining order of visible columns, ', function () {
        var schemaName = "visible_columns_schema", schema;

        beforeAll(function (done) {
            schema = options.catalog.schemas.get(schemaName);
            done();
        });

        // Test Cases:
        // Helper function to add 'expect' based on test cases and the specified table
        function runTestCases(table, cases) {
            var columns = schema.tables.get(table).columns;

            Object.keys(cases).forEach(function (key) {
                expect(columns._contextualize(key).names()).toEqual(cases[key]);
            });
        }

        // Test Cases:

        it('should use the defined order in annotations based on its context.', function () {
            runTestCases('table_with_all_contexts', {
                "entry": ['column_1', 'column_2'],
                "edit": ['column_1', 'column_3'],
                "create": ['column_2', 'column_3'],
                "record": ['column_1'],
                "filter": ['column_2'],
                "compact": ['column_3'],
                "*": []
            });
        });

        it('should use `entry` context when context is `edit` or `create` and they are not present in annotation.', function () {
            runTestCases('table_with_entry_filter_compact_star', {
                "edit": ['column_1'], 'create': ['column_1']
            });
        });

        it('should use default (`*`) context for any context not matched by a more specific context name.', function () {
            runTestCases('table_with_entry_filter_compact_star', {
                "record": ['column_2'], 'not_a_context': ['column_2']
            });
        });

        it('should use the default order when context not matched by a more specific context name and default (`*`) context is not present.', function () {
            var expected = ['column_1', 'column_2'];
            runTestCases('table_without_annotation', {
                "entry": expected,
                "edit": expected,
                "create": expected,
                "record": expected,
                "filter": expected,
                "compact": expected,
                "*": expected
            });
        });

        it('should ignore the column names that do not correspond to any column in the table.', function () {
            runTestCases('table_with_entry_filter_compact_star', {
                "filter": ["column_2"]
            });
        });

        it('should ignore repetitive column names and just consider the first one.', function () {
            runTestCases('table_with_entry_filter_compact_star', {
                "compact": ["column_2", "column_1"]
            });
        });


    });
};