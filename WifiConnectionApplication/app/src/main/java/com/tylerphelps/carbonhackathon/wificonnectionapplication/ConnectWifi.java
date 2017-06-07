package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;

import static android.content.Context.WIFI_SERVICE;

/**
 * Created by lna207 on 6/7/17.
 */

public class ConnectWifi {
    public static boolean connectToNetwork(String networkSSID, String networkPass, Context context){
        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + networkSSID + "\"";   // Please note the quotes. String should contain ssid in quotes
        conf.preSharedKey = "\""+ networkPass +"\"";
        WifiManager wifiManager = (WifiManager)context.getApplicationContext().getSystemService(WIFI_SERVICE);
        int netId = wifiManager.addNetwork(conf);
        wifiManager.disconnect();
        wifiManager.enableNetwork(netId, true);
        return wifiManager.reconnect();
    }
}
