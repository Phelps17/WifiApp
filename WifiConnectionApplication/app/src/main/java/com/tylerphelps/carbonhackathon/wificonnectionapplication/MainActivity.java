package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;


public class MainActivity extends AppCompatActivity {

    private LocationServiceController lsc;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.lsc = new LocationServiceController(this);
    }

    protected void onStart() {
        lsc.connect();
        super.onStart();
    }

    protected void onStop() {
        lsc.disconnect();
        super.onStop();
    }
}
