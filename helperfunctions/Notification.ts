import notifee, {EventType} from '@notifee/react-native';
export async function displayNotification(beacon: string) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    soundURI: './sound.mp3',
    vibration: false,
  });
  const title =
      beacon === 'Beacon 1'
        ? 'Clotee Brand ○ Promotion 📢'
        : 'Clays Brand ○ Promotion 📣',
    body =
      beacon === 'Beacon 2'
        ? '35% OFF at Shoes | Clays near you. 🥾'
        : '50% OFF at Clothee Shop near you. 🛍';

  // Display a notification
  await notifee.displayNotification({
    title,
    body: body,
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
