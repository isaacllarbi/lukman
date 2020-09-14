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
  console.log('Current Instance ID: ', id);
  const token = await iid().getToken();
  console.log('Current token ', token);

  const ref = await firestore().collection('new_project_iids').doc(id)
  .set({ id: token ,uid:"Isaac"});
  console.log('instance id stored');
}

async function addNewProject() {
  const ref= await firestore().collection('projects').add({ uid:"Isaac",name:'Ghana Water'});
  console.log('New project created at '+ ref.path);
}

const App = () => {

  useEffect(() => {
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
        <Button style={styles.button} onPress={() => getInstanceId()} title="Send text to firestore"></Button>
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
