package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import static android.content.Context.ACCOUNT_SERVICE;
import static android.content.Context.WIFI_SERVICE;

/**
 * Created by lna207 on 6/7/17.
 */

class ConnectWifi {

    private static final int RETURN_USER_CONNECT_CODE = 0;
    private static final int NEW_USER_CONNECT_CODE = 1;
    private static String baseUrl;
    private static RequestQueue queue;

    static void connectToNetwork(String networkSSID, String networkPass, double lat, double lon, Activity activity){
        WifiConfiguration conf = new WifiConfiguration();
        conf.SSID = "\"" + networkSSID + "\"";   // Please note the quotes. String should contain ssid in quotes
        conf.preSharedKey = "\""+ networkPass +"\"";
        WifiManager wifiManager = (WifiManager)activity.getApplicationContext().getSystemService(WIFI_SERVICE);
        if(!isSaved(wifiManager, conf)) {
            int netId = wifiManager.addNetwork(conf);
            wifiManager.enableNetwork(netId, true);
            wifiManager.setWifiEnabled(false);
            wifiManager.setWifiEnabled(true);

            sendConnectionMessage(NEW_USER_CONNECT_CODE, lat, lon, activity);
        }
        else {
            sendConnectionMessage(RETURN_USER_CONNECT_CODE, lat, lon, activity);
        }
        activity.finishAffinity();
    }

    private static boolean isSaved(WifiManager manager, WifiConfiguration wifi) {
        List<WifiConfiguration> networks = manager.getConfiguredNetworks();
        return networks.contains(wifi);
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
}
