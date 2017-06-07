package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.support.v4.widget.TextViewCompat;
import android.widget.TextView;

import java.util.List;

import static android.content.Context.ACCOUNT_SERVICE;
import static android.content.Context.WIFI_SERVICE;

/**
 * Created by lna207 on 6/7/17.
 */

public class ConnectWifi {
    public static void connectToNetwork(String networkSSID, String networkPass, Activity activity){
        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + networkSSID + "\"";   // Please note the quotes. String should contain ssid in quotes
        conf.preSharedKey = "\""+ networkPass +"\"";
        WifiManager wifiManager = (WifiManager)activity.getApplicationContext().getSystemService(WIFI_SERVICE);
        if(!isSaved(wifiManager, conf)) {
            int netId = wifiManager.addNetwork(conf);
            wifiManager.enableNetwork(netId, true);
            wifiManager.setWifiEnabled(false);
            wifiManager.setWifiEnabled(true);
        }
        activity.finishAffinity();
    }

    public static boolean isSaved(WifiManager manager, WifiConfiguration wifi) {
        List<WifiConfiguration> networks = manager.getConfiguredNetworks();
        return networks.contains(wifi);
    }
}
