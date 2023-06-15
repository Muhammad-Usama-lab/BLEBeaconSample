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
  error: any;
}

const distanceBuffer: [number, number, number] = [-1, -1, -1];

function useBLE(): BluetoothLowEnergyApi {
  // const [distance, setDistance] = useState<number>(-1);
  const [color, setColor] = useState<string>('');
  const [error, setError] = useState<any>('');
  const [devices, setDevices] = useState<Array<string>>([]);
  const requestPermissions = async (cb: VoidCallback) => {
    if (Platform.OS === 'android') {
      const apiLevel = await DeviceInfo.getApiLevel();

      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Beacon requires to acess Location ',
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

  const callback = (error: any, device: any) => {
    if (error) {
      setError(error);
      console.log('error', error);
      if (
        `${error?.message}`.includes(
          'Device is not authorized to use BluetoothLE',
        )
      )
        requestPermissions(state => {
          console.log('state', state);
        });
      if (`${error?.message}`.includes('Location services are disabled'))
        return openLocationSettings();
      if (`${error?.message}`.includes('BluetoothLE is powered off'))
        return openBluetoothSettings();
    }

    const beacon2MACAddress = 'E2:64:3B:F1:57:A1';
    const beacon1MACAddress = 'EB:1D:A0:96:17:A0';

    if (device?.name) {
      console.log('device.name', device.name);
      // console.log('device', device);
      let copy = [...devices];
      copy.push(device?.name);
      let unique = [...new Set(copy)];
      console.log('unique', unique);
      setDevices(unique);
      if (device?.id === beacon1MACAddress) {
        setColor('#f0932b');
        displayNotification('Beacon 1');
      } else if (device?.id === beacon2MACAddress) {
        setColor('#f0932b');
        displayNotification('Beacon 2');
      }
    }
  };

  const scanForPeripherals = () => {
    setTimeout(async () => {
      let status = await bleManager.state();
      console.log('status', status);
      await bleManager.stopDeviceScan();
    }, 1000 * 60 * 2);

    return bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
        scanMode: ScanMode.Balanced,
      },
      callback,
    );
  };

  return {
    scanForPeripherals,
    requestPermissions,
    devices,
    color,
    error,
  };
}

export default useBLE;
