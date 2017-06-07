package com.tylerphelps.carbonhackathon.wificonnectionapplication;


import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

/**
 * Created by TylerPhelps on 6/7/17.
 */

public class LocationServiceController implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    private GoogleApiClient mGoogleApiClient;
    private Context context;
    public static final String TAG = LocationServiceController.class.getSimpleName();

    public void startController() {
        this.mGoogleApiClient = new GoogleApiClient.Builder(this.context)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
    }

    public double getLatitude() {
        return 0;
    }

    public double getLongitude() {
        return 0;
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        Log.i(TAG, "Location Srvice Controller is connected.");
    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.i(TAG, "Location Service Controller connection is supended. Please reconnect.");
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }
}
