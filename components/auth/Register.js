import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase/app';


export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            username: ""
        }

        //bind the function to the constructor
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, username } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        username,
                        email
                    })
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="Username"
                    onChangeText={(username) => this.setState({ username })}
                />
                <TextInput 
                    placeholder="Email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="Password"
                    secureTextEntry={ true }
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button 
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register;
