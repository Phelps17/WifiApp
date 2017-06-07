package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.util.Log;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
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
        baseUrl = "http://74.208.84.27:4000/location";
        queue = Volley.newRequestQueue(activity);
        JSONObject body = new JSONObject();
        try {
            body.put("latitude", lat);
            body.put("longitude", lon);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        // prepare the Request
        final JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST, baseUrl, body,
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

        int socketTimeout = 3000;
        RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
        request.setRetryPolicy(policy);

        // add it to the RequestQueue
        queue.add(request);
    }
}
