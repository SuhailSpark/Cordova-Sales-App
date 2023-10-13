package drc.btprint.BTPrinter;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;


import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;

/**
 * This class echoes a string called from JavaScript.
 */
public class BTPrinter extends CordovaPlugin {
	private String mac ;
    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
		cordova.getThreadPool().execute(new Runnable()
		{
			public void run()
			{
				if (action.equals("printDocument")) {
					printDocument(callbackContext,args);
				}
				else if(action.equals("printTestDocument")){
					printTestDocument(callbackContext);
					}
				else if(action.equals("addNumbers")){
					addNumbers(callbackContext,args);
				}
			}
		});//run the print job in a thread , to avoid blocking the UI5 program main thread.
		return true;

    }
	private boolean addNumbers(CallbackContext callbackContext,JSONArray args){

    	System.out.println("Etisalat");

    	try{
			int firstNumber = args.getInt(0);
			int secondNumber = args.getInt(1);
			callbackContext.success(firstNumber+secondNumber);
		}
    	catch(Exception e){
			callbackContext.error("Error:"+e.getMessage());
		}
	return true;

	}
	private void printDocument(CallbackContext callbackContext,JSONArray args){
    	String base64 = "";
		try {
			base64 = args.getString(0);
			mac = args.getString(1);
			Log.i("FIORI","Mac address:"+mac);
			callbackContext.success(writeFile(base64));
		} catch (JSONException e) {
			e.printStackTrace();
			callbackContext.error("Error:"+e.getMessage());
		}

	}
	private boolean printTestDocument(CallbackContext callbackContext){
		callbackContext.success("Document Test prints from here..");
		return true;
	}

	private String writeFile(String base64){
		String download_path  = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/" ;
		Log.i("FIORI",download_path);
		String fileName = getRandomFileName();
		String message = "";
		final File dwldsPath = new File(download_path + fileName + ".pdf");
		byte[] pdfAsBytes = Base64.decode(base64, 0);
		FileOutputStream os;
		try {
			os = new FileOutputStream(dwldsPath, false);
			os.write(pdfAsBytes);
			os.flush();
			os.close();
            Log.i("FIORI","File is now written named:"+fileName);

            drc.btprint.BTPrinter.PrintModule pm;

            pm = new drc.btprint.BTPrinter.PrintModule(this.mac);
            message = pm.printPDFDocument(fileName);

		}
		catch(Exception e){
			return  "Unable to print:"+e.getMessage();
		}
    	return message;
	}


	private String getRandomFileName(){
    	Double d = Math.random();
    	int fileid = (int)( d*10000);
    	return "DRCFile_" + fileid  ;
	}
	private AlertDialog.Builder alert(final Context context, final String message)  {
		final AlertDialog.Builder alert = new AlertDialog.Builder(context);
		alert.setTitle("Print Dialog");
		alert.setMessage(message);
		alert.setPositiveButton("Ok", (dialog, which) -> dialog.dismiss());
		return alert;
	}

}
