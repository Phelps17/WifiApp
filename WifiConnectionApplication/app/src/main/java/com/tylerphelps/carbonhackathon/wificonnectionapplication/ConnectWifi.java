package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;

import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.text.format.Formatter;
import android.util.Log;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

import static android.content.Context.ACCOUNT_SERVICE;
import static android.content.Context.WIFI_SERVICE;


class ConnectWifi {

    private static final int RETURN_USER_CONNECT_CODE = 0;
    private static final int NEW_USER_CONNECT_CODE = 1;
    private static String baseUrl;
    private static RequestQueue queue;

    static void connectToNetwork(String networkSSID, String networkPass, final double lat, final double lon, final Activity activity){
        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + networkSSID + "\"";   // Please note the quotes. String should contain ssid in quotes
        conf.preSharedKey = "\""+ networkPass +"\"";
        WifiManager wifiManager = (WifiManager)activity.getApplicationContext().getSystemService(WIFI_SERVICE);
        wifiManager.setWifiEnabled(true);

        if(isSaved(wifiManager, conf, lat, lon, activity)) {
            int wifiId = findId(wifiManager,conf);
            wifiManager.removeNetwork(wifiId);
        }
        int netId = wifiManager.addNetwork(conf);
        wifiManager.enableNetwork(netId, true);
        wifiManager.setWifiEnabled(false);
        wifiManager.setWifiEnabled(true);
        Handler handler = new Handler();

        handler.postDelayed(new Runnable() {
            public void run() {
                WifiManager wifiMgr = (WifiManager) activity.getApplicationContext().getSystemService(WIFI_SERVICE);
                WifiInfo wifiInfo = wifiMgr.getConnectionInfo();
                int ip = wifiInfo.getIpAddress();
                String ipAddress = Formatter.formatIpAddress(ip);
                sendDeviceInfo(lat,lon,activity,ipAddress,getMacAddr());
            }
        }, 5000);
        activity.finishAffinity();
    }

    private static int findId(WifiManager manager, WifiConfiguration wifi) {
        List<WifiConfiguration> networks = manager.getConfiguredNetworks();
        for (int i = 0; i < networks.size(); i++) {
            if (networks.get(i).SSID.equals(wifi.SSID)) {
                return i;
            }
        }
        return -1;
    }

    private static boolean isSaved(WifiManager manager, WifiConfiguration wifi, double lat, double lon, Activity activity) {
        List<WifiConfiguration> networks = manager.getConfiguredNetworks();
        for (int i = 0; i < networks.size(); i++) {
            if (networks.get(i).SSID.equals(wifi.SSID)) {
                sendConnectionMessage(RETURN_USER_CONNECT_CODE, lat, lon, activity);
                return true;
            }
        }
        sendConnectionMessage(NEW_USER_CONNECT_CODE, lat, lon, activity);
        return false;
    }

    private static void sendDeviceInfo(double lat, double lon, Activity activity, String ip, String mac) {
        baseUrl = "http://74.208.84.27:4000/location/devices";
        queue = Volley.newRequestQueue(activity);
        JSONObject body = new JSONObject();

        try {
            body.put("latitude", lat);
            body.put("longitude", lon);
            body.put("ip", ip);
            body.put("mac", mac);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // prepare the Request
        final JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, baseUrl, body,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response) {
                        //Log.d("response", response.toString());

                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }
        );

        // add it to the RequestQueue
        queue.add(request);
    }

    private static void sendConnectionMessage(int connectionCode, double lat, double lon, Activity activity) {
        baseUrl = "http://74.208.84.27:4000/location/connections";
        queue = Volley.newRequestQueue(activity);
        JSONObject body = new JSONObject();

        try {
            body.put("latitude", lat);
            body.put("longitude", lon);
            body.put("code", connectionCode);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // prepare the Request
        final JsonObjectRequest request = new JsonObjectRequest(Request.Method.PUT, baseUrl, body,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response) {
                        //Log.d("response", response.toString());

                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }
        );

        // add it to the RequestQueue
        queue.add(request);
    }

    public static String getMacAddr() {
        try {
            List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface nif : all) {
                if (!nif.getName().equalsIgnoreCase("wlan0")) continue;

                byte[] macBytes = nif.getHardwareAddress();
                if (macBytes == null) {
                    return "";
                }

                StringBuilder res1 = new StringBuilder();
                for (byte b : macBytes) {
                    res1.append(String.format("%02X:",b));
                }

                if (res1.length() > 0) {
                    res1.deleteCharAt(res1.length() - 1);
                }
                return res1.toString();
            }
        } catch (Exception ex) {
        }
        return "02:00:00:00:00:00";
    }
}
