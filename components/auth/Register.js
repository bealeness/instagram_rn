import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';

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
                    onPress={() => this.signUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register;
