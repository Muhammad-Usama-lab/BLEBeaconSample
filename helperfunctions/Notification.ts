import notifee, {EventType} from '@notifee/react-native';
export async function displayNotification(beacon: string) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: `${beacon} 🔔`,
    body: 'Background service running properly' || 'Detected a beacon nearby',
    data: {beacon},

    android: {
      channelId,
      largeIcon:
        'https://www.mokosmart.com/wp-content/uploads/2020/07/H2-beacon.jpg',
      // smallIcon: "", // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
