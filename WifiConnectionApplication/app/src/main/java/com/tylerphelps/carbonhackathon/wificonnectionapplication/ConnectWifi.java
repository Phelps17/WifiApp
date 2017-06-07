package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.support.v4.widget.TextViewCompat;
import android.widget.TextView;

import static android.content.Context.ACCOUNT_SERVICE;
import static android.content.Context.WIFI_SERVICE;

/**
 * Created by lna207 on 6/7/17.
 */

public class ConnectWifi {
    public static boolean connectToNetwork(String networkSSID, String networkPass, Activity activity){
        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + networkSSID + "\"";   // Please note the quotes. String should contain ssid in quotes
        conf.preSharedKey = "\""+ networkPass +"\"";
        WifiManager wifiManager = (WifiManager)activity.getApplicationContext().getSystemService(WIFI_SERVICE);
        int netId = wifiManager.addNetwork(conf);
        wifiManager.disconnect();
        wifiManager.enableNetwork(netId, true);
        wifiManager.reconnect();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        activity.finishAffinity();
        return wifiManager.reconnect();
    }
}
