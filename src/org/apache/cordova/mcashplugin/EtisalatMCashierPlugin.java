package org.apache.cordova.mcashplugin;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog.Builder;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.tlc.etisalat.mcashiertlcsdk.McashierSDKController;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
/**
 * This class echoes a string called from JavaScript.
 */
public class EtisalatMCashierPlugin extends CordovaPlugin implements McashierSDKController.McashierListener {

    private McashierSDKController mcashierSDKController;
    private final String[] permissions = {
            Manifest.permission.ACCESS_NETWORK_STATE,
            Manifest.permission.ACCESS_FINE_LOCATION
    };

    /**
     * Cordova Plugin Handler
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        initSDK();

        switch (action) {
            case "connectwisepad":
                connectNewWisepad(callbackContext);
                break;
            case "reconnectwisepad":
                reconnectWisepad(callbackContext);
                break;
            case "disconnectwisepad":
                disconnectWisepad(callbackContext);
                break;
            case "getwisepadinfo":
                getWisepadInfo(callbackContext);
                break;
            case "calleula":
                callEula(callbackContext);
                break;
            case "readeid":
                try {
                    readEid(callbackContext, args.getString(0));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "cardtrans":
                try {
                    initCardTrans(callbackContext, args.getString(0), args.getString(1));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "cashtrans":
                try {
                    initCashTrans(callbackContext, args.getString(0), args.getString(1), args.getString(2));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "voidtrans":
                try {
                    initVoidTrans(callbackContext, args.getString(0), args.getString(1), args.getString(2));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case "permissions":
                getPermissions();
                break;
            case "eulaToken":
                getEulaToken(callbackContext);
                break;
        }

        return true;
    }

    /**
     * Initialize the Mcashier SDK.
     */
    private void initSDK() {
        if(mcashierSDKController == null) {
            mcashierSDKController = McashierSDKController.getInstance(this.cordova.getActivity(), this);
            mcashierSDKController.constructBBDeviceController(this.cordova.getActivity());
        }
    }

    /**
     * Get and return the SDK Token.
     * @return eulaToken.
     */
    private void getEulaToken(CallbackContext callbackContext) {
        String eulaToken = mcashierSDKController.getSDKTOken();
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, eulaToken));
    }

    private CallbackContext msisdnCallback;
    private CallbackContext eidCallback;
    private CallbackContext transactionCallback;

    /**
     * Initialize Permissions.
     */
    private void getPermissions() {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) { // 16
            for(String permission : permissions) {
                if(ContextCompat.checkSelfPermission(this.cordova.getActivity().getApplicationContext(), permission) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this.cordova.getActivity(), permissions, 1);
                    return;
                }
            }
        }
    }

    /**
     * Initiate Card Transaction from SDK.
     * @param amount
     * @param sessionID
     */
    private void initCardTrans(CallbackContext callbackContext, String amount, String sessionID) {
        transactionCallback = callbackContext;
        mcashierSDKController.setWisepadAmount(amount, sessionID, "token_pass");
    }

    /**
     * Initiate Cash Transaction from SDK.
     * @param amount
     * @param password
     * @param sessionID
     */
    private void initCashTrans(CallbackContext callbackContext, String amount, String password, String sessionID) {
        transactionCallback = callbackContext;
        mcashierSDKController.setCashAmount(amount, password, sessionID, "token_pass");
    }

    /**
     * Initiate Void Transaction from SDK
     * @param newSessionID
     * @param password
     * @param oldSessionID
     */
    private void initVoidTrans(CallbackContext callbackContext, String newSessionID, String password, String oldSessionID) {
        transactionCallback = callbackContext;
        mcashierSDKController.initVoid(newSessionID, password, oldSessionID);
    }

    /**
     * Connect new wisepad device.
     * @param callbackContext
     */
    private void connectNewWisepad(CallbackContext callbackContext) {
        callbackContext.success();
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.connectNewWisepad()
        );
    }

    /**
     * Reconnect existing wisepad device.
     * @param callbackContext
     */
    private void reconnectWisepad(CallbackContext callbackContext) {
        callbackContext.success();
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.connectToExistingWisepad()
        );
    }

    /**
     * Disconnect wisepad device.
     * @param callbackContext
     */
    private void disconnectWisepad(CallbackContext callbackContext) {
        callbackContext.success();
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.disconnectWisepad()
        );
    }

    /**
     * Get Info from wisepad.
     * @param callbackContext
     */
    private void getWisepadInfo(CallbackContext callbackContext) {
        callbackContext.success();
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.getWisepadInfo()
        );
    }

    /**
     * Initiate EULA Msisdn Registration from SDK.
     * @param callbackContext
     */
    private void callEula(CallbackContext callbackContext) {
        msisdnCallback = callbackContext;
        //callbackContext.success();
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.eulaSDK()
        );
    }

    /**
     * Initiate EID Reading from SDK.
     * @param callbackContext
     */
    private void readEid(CallbackContext callbackContext, String sessionID) {
        eidCallback = callbackContext;
        this.cordova.getActivity().runOnUiThread(() ->
                mcashierSDKController.startEIDReading(sessionID)
        );
    }

    /**
     * Callback interface method for success device connection.
     */
    @Override
    public void onDeviceConnected() {
//        this.cordova.getActivity().runOnUiThread(()->
//                alert(this.cordova.getActivity(), "Wisepad Connected").create().show()
//        );
    }

    /**
     * Callback interface method for success disconnection of wisepad device.
     */
    @Override
    public void onDeviceDisconnected() {
//        this.cordova.getActivity().runOnUiThread(()->
//                alert(this.cordova.getActivity(), "Wisepad Disconnected").create().show()
//        );
    }

    @Override
    public void onSuccessTrans() {
        System.out.println("FIORI_CC:Transaction successful");
        transactionCallback.sendPluginResult(new PluginResult(PluginResult.Status.OK, true));
    }

    @Override
    public void onFailedTrans() {
        System.out.println("FIORI_CC:Transaction Failed");
        transactionCallback.sendPluginResult(new PluginResult(PluginResult.Status.OK, false));
    }

    private final String EIDNUMBER              = "EIDNUMBER";
    private final String EIDCARDNUMBER          = "EIDCARDNUMBER";
    private final String EIDENGNAME             = "EIDENGNAME";
    private final String EIDSEX                 = "EIDSEX";
    private final String EIDTYPE                = "EIDTYPE";
    private final String EIDISSUEDDATE          = "EIDISSUEDDATE";
    private final String EIDEXPIRYDATE          = "EIDEXPIRYDATE";
    private final String EIDENGLISHNATIONALITY  = "EIDENGLISHNATIONALITY";
    private final String EIDCODENATIONALITY     = "EIDCODENATIONALITY";
    private final String EIDBIRTHDATE           = "EIDBIRTHDATE";
    private final String EIDENGLISHBIRTHPLACE   = "EIDENGLISHBIRTHPLACE";
    private final String EIDOCCUPATIONNAME      = "EIDOCCUPATIONNAME";
    private final String EIDCARDPHOTO           = "EIDCARDPHOTO";
    /**
     * Callback interface method for EID Reading.
     * @param hashMap
     */
    @Override
    public void onReturnEIDDetails(HashMap<String, Object> hashMap) {
        this.cordova.getActivity().runOnUiThread(()-> {
            JSONObject json = new JSONObject();
            try {
                json.put(EIDNUMBER              , hashMap.get(EIDNUMBER));
                json.put(EIDCARDNUMBER          , hashMap.get(EIDCARDNUMBER));
                json.put(EIDENGNAME             , hashMap.get(EIDENGNAME));
                json.put(EIDSEX                 , hashMap.get(EIDSEX));
                json.put(EIDTYPE                , hashMap.get(EIDTYPE));
                json.put(EIDISSUEDDATE          , hashMap.get(EIDISSUEDDATE));
                json.put(EIDEXPIRYDATE          , hashMap.get(EIDEXPIRYDATE));
                json.put(EIDENGLISHNATIONALITY  , hashMap.get(EIDENGLISHNATIONALITY));
                json.put(EIDCODENATIONALITY     , hashMap.get(EIDCODENATIONALITY));
                json.put(EIDBIRTHDATE           , hashMap.get(EIDBIRTHDATE));
                json.put(EIDENGLISHBIRTHPLACE   , hashMap.get(EIDENGLISHBIRTHPLACE));
                json.put(EIDOCCUPATIONNAME      , hashMap.get(EIDOCCUPATIONNAME));
                json.put(EIDCARDPHOTO           , hashMap.get(EIDCARDPHOTO));
            } catch (JSONException e) {
                e.printStackTrace();
            }
            System.out.println("[TEST APP] EID Details: "+json.toString());
            eidCallback.sendPluginResult(new PluginResult(PluginResult.Status.OK, json.toString()));
        });
    }

    /**
     * Callback interface method for Eula Registration.
     * @param s
     */
    @Override
    public void onReturnEulaMsisdn(String s) {
        this.cordova.getActivity().runOnUiThread(()->
                msisdnCallback.sendPluginResult(new PluginResult(PluginResult.Status.OK, s))
        );
    }

    /**
     * Simple alert/pop up window to show message.
     * @param activity
     * @param message
     * @return
     */
    private Builder alert(final Activity activity, final String message)  {
        final Builder alert = new Builder(activity);
        alert.setTitle(com.tlc.etisalat.mcashiertlcsdk.R.string.app_name);
        alert.setMessage(message);
        alert.setPositiveButton("Ok", (dialog, which) -> dialog.dismiss());

        return alert;
    }
}
