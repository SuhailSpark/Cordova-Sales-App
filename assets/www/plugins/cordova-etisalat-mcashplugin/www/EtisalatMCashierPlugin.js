cordova.define("cordova-etisalat-mcashplugin.EtisalatMCashierPlugin", function(require, exports, module) {
var exec = require('cordova/exec');
var platform = require('cordova/platform');
module.exports = {
	/**
	* Function/Method to connect new wisepad.
	*/
	connectnewdevice: function() {
		exec(null, null, 'EtisalatMCashierPlugin', 'connectwisepad', null);
	},

	/**
	* Function/Method to reconnect with the existing wisepad.
	*/
	connectexistingdevice: function() {
		exec(null, null, 'EtisalatMCashierPlugin', 'reconnectwisepad', null);
	},

	/**
	* Function/Method to disconnect with the wisepad.
	*/
	disconnectdevice: function() {
		exec(null, null, 'EtisalatMCashierPlugin', 'disconnectwisepad', null);
	},

	/**
	* Function/Method to get information with the connected wisepad.
	*/
	getdeviceinfo: function() {
		exec(null, null, 'EtisalatMCashierPlugin', 'getwisepadinfo', null);
	},

	/**
	* Function/Method to initiate card transaction from SDK.
	* 1st parameter String -> Amount.
	* 2nd parameter String -> SessionID.
	*/
	initCardTransaction: function(resultCallback, amount, sessionID) {
         exec(resultCallback, null, 'EtisalatMCashierPlugin', 'cardtrans', [amount, sessionID]);
    },

	/**
	* Function/Method to initiate cash transaction from SDK.
	* 1st parameter String -> Amount.
	* 2nd parameter String -> 4 digit password.
	* 3rd parameter String -> SessionID.
	*/
	initCashTransaction: function(amount, password, sessionID) {
		exec(null, null, 'EtisalatMCashierPlugin', 'cashtrans', [amount, password, sessionID]);
	},

	/**
	* Function/Method to initiate cash transaction from SDK.
	* 1st parameter String -> New SessionID.
	* 2nd parameter String -> 4 digit password.
	* 3rd parameter String -> Card SessionID to be voided.
	*/

    // cordova interface updated for initVoidTransaction
    initVoidTransaction: function(resultCallback,newSessionID, password, oldSessionID) {
    		exec(resultCallback, null, 'EtisalatMCashierPlugin', 'voidtrans', [newSessionID, password, oldSessionID]);
    },

	/**
	* Function/Method for Eula / Msisdn Registration.
	* The {Registered MSISDN} is sent back through the resultCallback function.
	* @Return --> [String: Msisdn]
	*
	* Parameter String -> Callback function.
	*/
	calleula: function(resultCallback) {
		exec(resultCallback, null, 'EtisalatMCashierPlugin', 'calleula', null);
	},

	/**
	* Function/Method for EID Reading.
	* The {EID Details} are sent back through the resultCallback function.
	* @Return --> [JSONObject: EID Details]
	*
	* 1st parameter Callback -> resultCallback.
	* 2nd parameter String -> SessionID.
	*/
	readeid: function(resultCallback, sessionID) {
		exec(resultCallback, null, 'EtisalatMCashierPlugin', 'readeid', [sessionID]);
	},

	/**
    * Function/Method to get eulaToken/SDK Token.
    * @Return --> [String: eulaToken]
    *
    * Parameter Callback -> resultCallback
    */
	geteulatoken: function(resultCallback) {
        exec(resultCallback, null, 'EtisalatMCashierPlugin', 'eulaToken', null);
	},

	/**
	* Function/Method for getting permissions in Android.
	*/
	getpermissions: function() {
		exec(null, null, 'EtisalatMCashierPlugin', 'permissions', null);
	}
};

});
