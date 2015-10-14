/**
 * Tests
 */

define(function( require ) {
    var registerSuite = require( "intern!object" );
    var assert = require( "intern/chai!assert" );

    registerSuite({
        "test": function() {
            assert.strictEqual( true, true, "Tests are working." );
        }
    });
});
