
package drc.btprint.BTPrinter;

import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileOutputStream;

import honeywell.connection.ConnectionBase;
import honeywell.connection.Connection_Bluetooth;
import honeywell.printer.DocumentLP;


public class PrintModule{
    private ConnectionBase conn;
    private byte[] printData = {0};
    private int m_printHeadWidth = 384;
    private DocumentLP docLP;
    private String mac = "";
    private String fileName = "";
    private String response = "";
    String selectedItem = "";

    public String printPDFDocument(String fileName){
        this.fileName = fileName;
      //new Thread(PrintModule.this,"ThreadActivity").start();
      //run();
      return  this.runPrintInThread();
    }

    public PrintModule(String mac) throws  Exception{

            this.mac = mac;
            docLP = new DocumentLP("!");
            conn = Connection_Bluetooth.createClient(this.mac,true);
            conn.setPriority(ConnectionBase.MAX_PRIORITY);
    }

    private String runPrintInThread(){
        String download_path  = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS) + "/" ;
        String file_name = download_path + fileName + ".pdf" ;
        String message = "";
        try{
            //we placed this file in the directory
            File f =   new File(file_name);
            selectedItem = f.getAbsolutePath();
            String s = "";
            s = f.exists() ? "File exists" : "File does not exists";
            Log.i("FIORI" , s );

            //than checking the permission for the timebeing
            s = f.canRead() ? "File readable.." : "Not able to read file.." ;
            Log.i("FIORI",s);

            //byte array initialization
            printData = new byte[]{0} ;
            docLP.writePDF(selectedItem, 832);//832 it was for a working scenario
            printData = getTrimmed(docLP.getDocumentData());

            Log.i("FIORI","Print data is loaded:("+printData.length + " bytes)");
            int bytesWritten = 0;
            int bytesToWrite = 512;//writing 512 bytes at a time.
            int totalBytes = printData.length;
            int remainingBytes = totalBytes;
            int ct = 0;
            Log.i("FIORI","Mac Address:"+this.mac);
            Log.i("FIORI","Header width:"+832);

            Log.i("FIORI","Connection count(1):" + Connection_Bluetooth.activeCount());

            if(!conn.getIsOpen()) {
                conn.open();
                Log.i("FIORI","Connection was closed and is now open!");
            }
          // Thread.sleep(200);
           while (bytesWritten < totalBytes)
            {
                ct++;
                if (remainingBytes < bytesToWrite)
                    bytesToWrite = remainingBytes;

                //write chunk and wait for quarter a second.
                conn.write(printData, bytesWritten, bytesToWrite);
           //     Thread.sleep(50);

                bytesWritten += bytesToWrite;
                remainingBytes = remainingBytes - bytesToWrite;
            }
            Log.i("FIORI","Data is written, loop ran " + ct + " times , byes : " + printData.length );
            conn.close();
            conn = null;
          //  Thread.sleep(200);
            Log.i("FIORI","Connection closed" );

            //delete the file here...
            // file_name
            if(f.delete()){
                Log.i("FIORI","File deleted" );
            }else{
                Log.i("FIORI","Unable to delete the file" );
            }
            Log.i("FIORI","FileNmae:"+file_name);
            message = "Document is sent to printer. Please wait";
        }
        catch(Exception e){
            Log.i("FIORI","Fatal error:" + e.getMessage());
            e.printStackTrace();
            if(e.getMessage().contains("socket might closed or timeout")){
                message = "ERROR : Unable to contact printer. Please turn on the printer and enable bluetooth" ;
            }
            else
                message = "Error Occurred while printing - "+e.getMessage();

        }
        return message;
    }

     public void run() {
        Log.i("FIORI","Thread Started..");

    }

    public byte[] getTrimmed(byte[] src){
        byte[] now;
        now= new byte[src.length-11];
        System.arraycopy(src, 9, now, 0, src.length-11);
        return now;
    }
}
