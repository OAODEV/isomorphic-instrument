// Export based on environment.
if ( typeof module !== "undefined" && typeof module.exports !== "undefined" ) {
    module.exports = exports;
} else {
    if ( typeof define === "function" && define.amd ) {
        define([], function() {
            return exports;
        });

        var exports = {};
    } else {
        window.exports = exports;
    }
}
