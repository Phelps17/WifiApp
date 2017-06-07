package com.tylerphelps.carbonhackathon.wificonnectionapplication;

import android.content.DialogInterface;
import android.os.Handler;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;


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
        Handler handler = new Handler();

        handler.postDelayed(new Runnable() {
            public void run() {
                TextView message = (TextView)findViewById(R.id.status);
                message.setText("Unable to find Wifi Connection");
                Handler handler1 = new Handler();
                handler1.postDelayed(new Runnable() {
                    public void run() {
                        finish();
                        }
                }, 4000);
            }
        }, 10000);
        super.onStart();

    }

    protected void onStop() {
        lsc.disconnect();
        super.onStop();
    }
}
