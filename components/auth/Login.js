import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }

        //bind the function to the constructor
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
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
                    title="Sign In"
                />
            </View>
        )
    }
}

export default Login;