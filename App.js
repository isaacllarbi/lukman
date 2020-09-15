/**
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  View,
  StatusBar,
} from 'react-native';
import iid from '@react-native-firebase/iid';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

async function getInstanceId() {
  const id = await iid().get();
  const token = await iid().getToken();
  await firestore().collection('new_project_iids')
    .doc(id)
    .set({ id: token, uid: "Isaac" });
}

async function addNewProject() {
  await firestore()
    .collection('projects')
    .add({ uid: "Isaac", name: 'Ghana Water' });
}

const App = () => {

  useEffect(() => {
    //To handle notification in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Button style={styles.button} onPress={() => getInstanceId()} title="Send IID token to firestore"></Button>
          <Button style={styles.button} onPress={() => addNewProject()} title="Add a new project"></Button>

        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    color: '#322ada'
  },

});

export default App;
