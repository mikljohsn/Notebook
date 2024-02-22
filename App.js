import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import DetailPage from "./DetailPage.js";
import {app, database} from './firebase.js';
import { collection, addDoc } from "firebase/firestore";
import { useCollection} from 'react-firebase-hooks/firestore';

export default function App() {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);
  const [values, loading, error] = useCollection(collection(database, "notes")); 
  const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id })); //uses optional chaining to check if values is not null or undefined and spreadspreads the data into a new array (...)
  const Stack = createNativeStackNavigator();

  /* useEffect(() => {
    loadList();
  }, []); */

  function PressMe() {
   try {
    alert("Hello " + text + "!");
    setList([...list, { key: list.length, value: text }]); //only saves locally
    //addDoc(collection(database, "notes"), { text: text });
    setText("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    
  }

  async function saveList() {
    try {
      await AsyncStorage.setItem("@list:key", JSON.stringify(list));
      alert("List saved successfully!");
    } catch (error) {
      console.error("Error saving list:", error);
      alert("Failed to save list.");
    }
  }

  async function loadList() {
    try {
      const savedList = await AsyncStorage.getItem("@list:key");
      if (savedList !== null) {
        setList(JSON.parse(savedList));
        alert("List loaded successfully!");
      } else {
        alert("No list found.");
      }
    } catch (error) {
      console.error("Error loading list:", error);
      alert("Failed to load list.");
    }
  }
  /*   useEffect(() => { 
    const unsubscribe = navigation.addListener('focus', () => {
      updateList(route.params?.key, route.params?.value)
     })
    return unsubscribe;
  }, [navigation, route]); // kør useEffect når navigation eller route ændres

  function updateList(){
    const newList = notes.map(note =>{
      if (note.key === key) {
        return {key: key, value: text};
      } else {
        return note;
      }
    
    })
    setList(newList);
  }; */

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => ( //props is the navigation prop which is passed to the Home component
            <Home
              {...props}
              text={text}
              setText={setText}
              list={list}
              setList={setList}
              PressMe={PressMe}
              loadList={loadList}
              saveList={saveList}
              //data={data} //changed from list to data because of firebase
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="DetailPage">
          {(props) => (
            <DetailPage
              {...props}
              list={list}
              setList={setList}
              saveList={saveList}
            
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({
  navigation,
  route,
  text,
  setText,
  list,
  setList,
  PressMe,
  loadList,
  saveList,
  data,
}) => {
  function goToDetailPage(text) {
    navigation.navigate("DetailPage", { message: text });
  }
  const truncateNote = (note) => {
    return note.length > 30 ? note.substring(0, 30) + "..." : note;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React native week 2 + 3 + 4</Text>
      <TextInput
        style={styles.textinput}
        placeholder="Skriv noget"
        onChangeText={(txt) => setText(txt)}
        value={text}
      />
      <Button title="Submit" onPress={PressMe} color="black" />
      <FlatList
        data={list} //changed from list to data because of firebase
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToDetailPage(item.value)}>
            <Text>{truncateNote(item.value)}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="DetailPage" onPress={goToDetailPage} />
      <View style={styles.buttonContainer}>
        <Button title="Clear List" onPress={() => setList([])} color="red" />
        <Button title="Save List" onPress={saveList} color="green" />
        <Button title="Load List" onPress={loadList} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
  },
});
