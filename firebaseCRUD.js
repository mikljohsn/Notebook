import {database, storage} from './firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from 'react';
import { updateDoc, doc, collection, addDoc, setDoc } from 'firebase/firestore';


//TODO - add the rest of the functions from the DetailPage.js file and App.js and make it work

export const launchCamera = async () => {
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

  export const handleSaveNote = () => {
    onSave(editedMessage);
    navigation.goBack();
  };

  export const hentBillede = async () => {
    const resultat = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!resultat.canceled){
      console.log("Fået billede..." + resultat);
      setImagePath(resultat.assets[0].uri); //sætter stien til billedet i state
    }
  };
  
  export const uploadBillede = async () => {
    const res = await fetch(imagePath);
    const blob = await res.blob();
  
    const storageRef = ref(storage, `${noteId}.jpg`);
    await uploadBytes(storageRef, blob)

    console("Billede uploaded")
  };
  
  export const downloadBillede = async () => {
    await getDownloadURL(ref(storage, `${noteId}.jpg`))
    .then((url) => {
      setImagePath(url);
    });
  }