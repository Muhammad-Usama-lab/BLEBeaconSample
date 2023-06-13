/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import {LogBox} from 'react-native';
import BLEBackgroundService from './backgroundTasks/BLEBackgroundService';

LogBox.ignoreLogs(['new NativeEventEmitter']);

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  console.log('notification', notification);
});
const config = {
  minimumFetchInterval: 15,
  stopOnTerminate: false,
  startOnBoot: true,
  enableHeadless: true,
  requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
};

// const handleTask = async task => {
//   console.log('task started:', task);
//   BLEBackgroundService.startBLEScanJS();
// };

const callback = async value => {
  BackgroundFetch.finish(value);
  console.log('task stopped:', value);
};

const headLessTask = async () => {
  console.log('headless task initialized:');
  await BackgroundFetch.registerHeadlessTask(
    BLEBackgroundService.startBLEScanJS,
  );
};

const initialize = async () => {
  const status = await BackgroundFetch.configure(
    config,
    event => {
      console.log('config event triggered:', event);
      // BLEBackgroundService.runTimer();
      BLEBackgroundService.startBLEScanJS(event);
      BackgroundFetch.finish(event);
    },
    callback,
  );
  console.log('status', status);
  if (status === 2) await headLessTask();
  BackgroundFetch.start();
};

// Configure the Background Fetch event handler

AppRegistry.registerComponent(appName, () => App);
initialize();
