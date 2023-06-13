// BLEBackgroundService.js
import {BleManager, ScanMode} from 'react-native-ble-plx';
import {displayNotification} from '../helperfunctions/Notification';
import {openBluetoothSettings, openLocationSettings} from '../helperfunctions';
import {ScanCallbackType} from 'react-native-ble-plx';

// Function to handle the scanning process
export default {
  startBLEScanJS: async event => {
    console.log('event triggered', event);

    // fetch('http://192.168.100.14:8001/request')
    //   .then(res => console.log('response'))
    //   .catch(error => console.log('error', error));
    const bleManager = new BleManager();

    let state = await bleManager.state();
    bleManager.onStateChange(state => {
      console.log('newState: ', state);
    });
    console.log('bleManager.state', state);

    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
        scanMode: ScanMode.Balanced,
        // callbackType: ScanCallbackType.AllMatches,
      },
      (error, device) => {
        console.log('error', error);
        // if (error) {
        //   console.log(error?.message);
        //   if (`${error?.message}`.includes('Location services are disabled'))
        //     return openLocationSettings();
        //   if (`${error?.message}`.includes('BluetoothLE is powered off'))
        //     return openBluetoothSettings();
        // }
        if (device?.name) {
          console.log('device', device.name);

          if (device?.name.includes('Beacon 1')) {
            // fetch('http://192.168.100.14:8001/request')
            //   .then(res => console.log('response'))
            //   .catch(error => console.log('error', error));
            displayNotification('Beacon 1');
          }
        }
      },
    );
  },
  runTimer: () => {
    let count = 0;

    let interval = setInterval(() => {
      console.log(++count);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 1000 * 60 * 60);
  },
};
