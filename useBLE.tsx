/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, ScanMode} from 'react-native-ble-plx';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import {displayNotification} from './helperfunctions/Notification';
import {openBluetoothSettings, openLocationSettings} from './helperfunctions';

const bleManager = new BleManager();

type VoidCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
  requestPermissions(cb: VoidCallback): Promise<void>;
  scanForPeripherals(): void;
  devices: Array<string>;
  color: string;
}

const distanceBuffer: [number, number, number] = [-1, -1, -1];

function useBLE(): BluetoothLowEnergyApi {
  // const [distance, setDistance] = useState<number>(-1);
  const [color, setColor] = useState<string>('');
  const [devices, setDevices] = useState<Array<string>>([]);
  const requestPermissions = async (cb: VoidCallback) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonNeutral: 'Ask Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        cb(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);

        const isGranted =
          result['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED;

        cb(isGranted);
      }
    } else {
      cb(true);
    }
  };

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
        scanMode: ScanMode.Balanced,
      },
      (error, device) => {
        if (error) {
          console.log(error?.message);
          if (`${error?.message}`.includes('Location services are disabled'))
            return openLocationSettings();
          if (`${error?.message}`.includes('BluetoothLE is powered off'))
            return openBluetoothSettings();
        }

        if (device?.name) {
          setDevices(p => [...p, `${device?.name}|${device?.rssi}`]);
          if (device?.name.includes('Beacon 1')) {
            setColor('#f0932b');
            displayNotification('Beacon 1');
          }
        }
        // if (device?.name?.includes('T500+Pro')) {
        // console.log('device', device);
        // let distance = 10 ^ ((device.rssi - 52) / (10 * 4));
        // console.log('distance', distance);
        // const currentDistance = Math.pow(10, (-75 - device.rssi!) / (10 * 3));

        // distanceBuffer[numOfSamples % 3] = currentDistance;

        // if (distanceBuffer.includes(-1)) {
        //   setDistance(-1);
        // } else {
        //   const sum = distanceBuffer.reduce((a, b) => a + b);
        //   setDistance(Math.round(sum / distanceBuffer.length));
        // }

        // numOfSamples++;
        // }
      },
    );

  return {
    scanForPeripherals,
    requestPermissions,
    devices,
    color,
  };
}

export default useBLE;
