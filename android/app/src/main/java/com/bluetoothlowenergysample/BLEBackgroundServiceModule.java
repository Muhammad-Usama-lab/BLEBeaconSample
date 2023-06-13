package com.bluetoothlowenergysample;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BLEBackgroundServiceModule extends ReactContextBaseJavaModule {
  public BLEBackgroundServiceModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "BLEBackgroundService";
  }

  @ReactMethod
  public void startBLEScan() {
    // Call the startBLEScan function from your BLEBackgroundService.js
    // BLEBackgroundServiceModule.startBLEScanJS();
  }
}
