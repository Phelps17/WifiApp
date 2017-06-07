package com.tylerphelps.carbonhackathon.wificonnectionapplication;


import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.model.LatLng;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.location.Location;
import android.support.annotation.NonNull;
import com.google.android.gms.location.LocationListener;

/**
 * Created by TylerPhelps on 6/7/17.
 */

public class LocationServiceController  {

    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private Context context;
    private double latitude, longitude;

    public static final String TAG = LocationServiceController.class.getSimpleName();

    public LocationServiceController(Context context) {
        this.latitude = 0;
        this.longitude = 0;
        this.context = context;
    }
    public double getLatitude() {
        return this.latitude;
    }

    public double getLongitude() {
        return this.longitude;
    }


}
