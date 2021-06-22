import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase';

require('firebase/firestore');

export default function Search(props) {
    const [ users, setUsers ] = useState([]);
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('username', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{ id, ...data }
                });
            setUsers(users);
        })
    }

    return (

        <View style={{ marginTop: 20 }}>
            <TextInput 
                placeholder="Type here..." 
                onChangeText={ (search) => fetchUsers(search) } 
            />
            <FlatList 
                style={{ marginTop: 20 }}
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", { uid: item.id} )}
                    >
                        <Text style={{ marginTop: 20, fontSize: 20 }}>{ item.username }</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}