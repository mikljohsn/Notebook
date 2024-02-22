import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import {useState} from 'react';

const DetailPage = ({ navigation, route, saveList, setList, list = [], data}) => {
    const [editedMessage, setEditedMessage] = useState(route.params?.message);

 /*  const message = route.params?.message ?? 'No message';
  const [text, setText] = useState(message);
 */
 /*  function onSavePressed(){
    navigation.navigate('Home', {key: text.length, value: text.value});
  } */
    


  function onSavePressed(){
    navigation.navigate('Home', {key: route.params.item.id, value: editedMessage});
  }



  const handleSaveNote = () => {
    const updatedList = (list).map(note => {
        if (note.value === route.params?.message) {
          return { ...note, value: editedMessage };
        }
        return note;
      });
      setList(updatedList);
      saveList();
      navigation.goBack();
      //navigation.navigate('Home', {key: route.params.item.id, value: editedMessage})
    };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        value={editedMessage}
        onChangeText={setEditedMessage}
      />
      <Button title="Save" onPress={handleSaveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default DetailPage;
