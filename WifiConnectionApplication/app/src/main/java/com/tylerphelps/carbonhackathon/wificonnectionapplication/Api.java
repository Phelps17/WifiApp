package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by gtr126 on 6/7/17.
 */

public final class Api extends Activity {
    private static String baseUrl;
    private static RequestQueue queue;

    /**
     *
     * @param lat latitude
     * @param lon longitude
     */
    public static void getWifiInfo(double lat, double lon, final Activity activity){
        baseUrl = "http://74.208.84.27:4000/";
        queue = Volley.newRequestQueue(activity);
        String url = baseUrl + "location?latitude="+lat+"&longitude="+lon;
        // prepare the Request
        final JsonObjectRequest getRequest = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>()
                {
                    @Override
                    public void onResponse(JSONObject response) {
                        // display response
                        try {
                            String ssid = response.getString("ssid");
                            String password = response.getString("password");
                            //call chris/stephens procedure to log in
                            //joinWifi(ssid, password);
                            ConnectWifi.connectToNetwork(ssid,password,activity);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.d("Error.Response", error.getLocalizedMessage());
                    }
                }
        );

        // add it to the RequestQueue
        queue.add(getRequest);
    }
}
