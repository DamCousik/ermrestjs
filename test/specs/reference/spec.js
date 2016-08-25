require('./../../utils/starter.spec.js').runTests({
    description: 'In reference,',
    testCases: [
        "/reference/tests/01.reference.js",
        "/reference/tests/02.related_reference.js",
        "/reference/tests/03.reference_sort.js",
        "/reference/tests/04.paging.js",
        "/reference/tests/05.reference_values.js"
    ],
    schemaConfigurations: [
        "/reference/conf/reference.conf.json",
        "/reference/conf/reference_2.conf.json"
    ]
});
