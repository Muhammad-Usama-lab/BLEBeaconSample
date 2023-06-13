import {Linking, Platform} from 'react-native';
import OpenSettings from 'react-native-android-open-settings';

export const openLocationSettings = () => {
  if (Platform.OS === 'android') {
    OpenSettings.locationSourceSettings();
  } else if (Platform.OS === 'ios') {
    Linking.openURL('App-Prefs:LOCATION_SERVICES');
  }
};

export const openBluetoothSettings = () => {
  if (Platform.OS === 'android') {
    OpenSettings.bluetoothSettings();
  } else if (Platform.OS === 'ios') {
    Linking.openURL('App-Prefs:LOCATION_SERVICES');
  }
};
