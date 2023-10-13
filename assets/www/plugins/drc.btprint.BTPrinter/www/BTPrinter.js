cordova.define("drc.btprint.BTPrinter.BTPrinter", function(require, exports, module) {
//cordova.define("drc.btprint.BTPrinter", function(require, exports, module) {
var exec = require('cordova/exec');

exports.printDocument = function (arg0, arg1, success, error) {
    exec(success, error, 'BTPrinter', 'printDocument', [arg0,arg1]);
};

exports.printTestDocument = function (arg0, arg1,success, error) {
    exec(success, error, 'BTPrinter', 'printTestDocument', [arg0,arg1]);
};
exports.addNumbers = function (arg0, arg1,success, error) {
    exec(success, error, 'BTPrinter', 'addNumbers', [arg0,arg1]);
};

exports.requestPermission = function (arg0, arg1,success, error) {
    exec(success, error, 'BTPrinter', 'requestPermission', [arg0,arg1]);
};

//});

});
