require('./../../utils/starter.spec.js').runTests({
    description: 'In sample spec, ',
    testCases: [
        "/sample/tests/01.sample.js",
        "/sample/tests/02.http_retries.js"
    ],
    schemaConfigurations: [
        "/sample/conf/product.conf.json"
    ]
});
