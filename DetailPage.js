import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, database } from './firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from 'react';
import { updateDoc, doc, collection, addDoc, setDoc } from 'firebase/firestore';


const DetailPage = ({ navigation, route, onSave }) => {
  const [editedMessage, setEditedMessage] = useState(route.params?.note.text);
  const [imagePath, setImagePath] = useState(null);
  const noteId = route.params?.note.id;

  const launchCamera = async () => {
    const result  = await ImagePicker.requestCameraPermissionsAsync();
    if(result.granted === false){
      alert('You need to enable permission to access the camera');
      return;
    } else {
      await ImagePicker.launchCameraAsync({
        quality: 1, //fra 0.0 til 1.0
      })
      .then((response) => {
        console.log("Photo was taken " + response)
        setImagePath(response.assets[0].uri); // where the image is stored not the image itself
      })
    }
  }

  const handleSaveNote = () => {
    onSave(editedMessage);
    navigation.goBack();
  };

  const hentBillede = async () => {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!resultat.canceled){
      console.log("Fået billede..." + resultat);
      setImagePath(resultat.assets[0].uri); //sætter stien til billedet i state
    }
  };
  
  const uploadBillede = async () => {
    const res = await fetch(imagePath);
    const blob = await res.blob();
  
    const storageRef = ref(storage, `${noteId}.jpg`);
    await uploadBytes(storageRef, blob)

    console("Billede uploaded")
  };
  
  const downloadBillede = async () => {
    await getDownloadURL(ref(storage, `${noteId}.jpg`))
    .then((url) => {
      setImagePath(url);
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={editedMessage}
        onChangeText={setEditedMessage}
      />
      <Button title="Save" onPress={handleSaveNote} />
      <Image source={{uri:imagePath}} style={{width:250, height:150}}/>
      <Button title="Hent billede"  onPress={hentBillede}/>
      <Button title="Upload billede" onPress={uploadBillede}/>
      <Button title="Download billede" onPress={downloadBillede}/>
      <Button onPress={launchCamera} title="Take photo"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    margin: 10,
    width: 200,
  },
});

export default DetailPage;
