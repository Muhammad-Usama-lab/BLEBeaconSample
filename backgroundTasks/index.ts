import {Alert, PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';

const sendNotification = async () => {
  // Your background task logic goes here
  // This function will be executed in the background
  console.log('Background task is running...');
};

type VoidCallback = (result: boolean) => void;

export const requestBackgroundLocationPermission = async () => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      'Background Location permission',
      'Bluetooth Beacon app collects location data to enable identification of nearby bluetooth devices even when the app is closed or not in use.',
      [
        {
          text: 'DENY',
          onPress: () => {
            reject();
          },
        },
        {
          text: 'ACCEPT',
          onPress: () => {
            resolve('OK');
          },
        },
      ],
    );
  })
    .then(async () => {
      const permission =
        Platform.OS === 'android'
          ? [
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]
          : [PERMISSIONS.IOS.LOCATION_ALWAYS];

      const result = await requestMultiple(permission);

      return (
        result['android.permission.ACCESS_BACKGROUND_LOCATION'] === 'granted' &&
        result['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
      );
    })
    .catch(() => {
      return false;
    });
};

export const requestPermissions = async (cb: VoidCallback) => {
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
