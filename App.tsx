import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import useBLE from './useBLE';
import BackgroundFetch from 'react-native-background-fetch';
import {requestBackgroundLocationPermission} from './backgroundTasks';
// import BLEBackgroundService from './backgroundTasks/BLEBackgroundService';
const App = () => {
  const [scanning, setScanning] = useState(false);
  const [backgroundTask, setBackgroundTask] = useState(false);
  const [preparingToScan, setPreparing] = useState(false);

  const {requestPermissions, scanForPeripherals, devices, color, error} =
    useBLE();

  useEffect(() => {
    if (error) {
      setScanning(false);
    }
  }, [error]);

  const scanForDevices = async () => {
    
    if (!scanning) {
      console.log('scanning started', 'scanning started');

      requestPermissions(async isGranted => {
        if (isGranted) {
          setScanning(true);
          scanForPeripherals();
        }
      });
      setTimeout(() => {
        setScanning(false);
      }, 1000 * 60 * 2);
    }
  };

  const scheduleBackgroundTask = async () => {
    let permission = await requestBackgroundLocationPermission();
    // console.log('backgroundTask', backgroundTask, permission);
    if (!backgroundTask && permission) {
      let response = await BackgroundFetch.scheduleTask({
        taskId: 'com.background.task',
        enableHeadless: true,
        periodic: true,
        forceAlarmManager: true,
        startOnBoot: true,
        stopOnTerminate: false,
        delay: 25000,
      });
      if (response) setBackgroundTask(true);
    } else {
      Alert.alert('Service Already running');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        <Text
          style={{
            fontSize: 30,
            color: 'black',
          }}>
          Beacon
        </Text>
        <View style={{width: '80%', alignSelf: 'center'}}>
          <Text
            style={{
              // textAlign: 'center',
              fontSize: 16,
              color: 'gray',
            }}>
            {` Note: \n\n✓ Make sure bluetooth connection is on\n✓ Make sure device location is on\n✓ Make sure location permission is granter to this app.`}
          </Text>
        </View>

        {/* <Text>Excellent Range: -30 dBm to -50 dBm</Text>
        <Text>Good Range: -51 dBm to -70 dBm</Text>
        <Text>Fair Range: -71 dBm to -85 dBm</Text>
        <Text>Weak Range: -86 dBm to -100 dBm</Text> */}
        {color === '#f0932b' && (
          <Text style={{fontSize: 22, backgroundColor: color || 'white'}}>
            Beacon Detected
          </Text>
        )}
        {color && (
          <Image
            source={{
              uri: 'https://www.mokosmart.com/wp-content/uploads/2020/07/H2-beacon.jpg',
            }}
            style={styles.image}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={scheduleBackgroundTask}
        style={[styles.ctaButton, {backgroundColor: '#3498db'}]}>
        {!backgroundTask ? (
          <Text style={styles.ctaButtonText}>Scan beacon in background</Text>
        ) : (
          <Text style={styles.ctaButtonText}>App initialized </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={scanForDevices} style={styles.ctaButton}>
        {preparingToScan ? (
          <Text style={styles.ctaButtonText}>Preparing to Scan ... </Text>
        ) : !scanning ? (
          <Text style={styles.ctaButtonText}>START RECEIVING SIGNALS</Text>
        ) : (
          <Text style={styles.ctaButtonText}>Scanning ...</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
});

export default App;
