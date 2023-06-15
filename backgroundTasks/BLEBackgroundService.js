// BLEBackgroundService.js
import {BleManager, ScanMode} from 'react-native-ble-plx';
import {displayNotification} from '../helperfunctions/Notification';

import {debounce} from 'lodash';

function areArraysEqual(array1, array2) {
  // Check if the arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }

  // Compare each element of the arrays
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  // All elements are equal, the arrays are the same
  return true;
}

// Function to handle the scanning process
export default {
  startBLEScanJS: async event => {
    console.log('event triggered', event);

    const config = {
      allowDuplicates: false,
      scanMode: ScanMode.LowPower,
    };
    let devices = [],
      uniqueDevices = [];
    const callback = (error, device) => {
      if (device?.name) {
        console.log('device', device?.name);
        // devices.push(device.name);
        // let copy = [...new Set(devices)];
        if (device?.name.includes('Beacon 1')) {
          displayNotification('Beacon 1');
        }
        if (device?.name.includes('Beacon 2')) {
          displayNotification('Beacon 2');
        }
      }
    };

    // fetch('http://192.168.100.14:8001/request')
    //   .then(res => console.log('response'))
    //   .catch(error => console.log('error', error));
    const bleManager = new BleManager();

    let state = await bleManager.state();
    console.log('bleManager state:', state);
    bleManager.onStateChange(state => {
      console.log('newState: ', state);
    });

    bleManager.startDeviceScan(null, config, callback);
    setTimeout(async () => {
      await bleManager.stopDeviceScan();
      console.log('bleManager stopped');
    }, 1000 * 60 * 2);
  },
};
