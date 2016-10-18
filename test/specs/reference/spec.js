require('./../../utils/starter.spec.js').runTests({
    description: 'In reference,',
    testCases: [
        "/reference/tests/01.reference.js",
        "/reference/tests/02.related_reference.js",
        "/reference/tests/03.reference_sort.js",
        "/reference/tests/04.paging.js",
        "/reference/tests/05.reference_values.js",
        "/reference/tests/06.permissions.js",
        "/reference/tests/07.contextualize.js",
        "/reference/tests/08.alternative_tables.js",
        "/reference/tests/09.app_linking.js",
        "/reference/tests/10.update.js"
    ],
    schemaConfigurations: [
        "/reference/conf/reference.conf.json",
        "/reference/conf/reference_2.conf.json",
        "/reference/conf/reference_altTables.conf.json",
        "/reference/conf/update.conf.json"
    ]
});
