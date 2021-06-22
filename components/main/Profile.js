import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button  } from 'react-native';
import { SnapshotViewIOSComponent } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false); //boolean defining if the current user is following the user they are viewing

    useEffect(() => {
        const { currentUser, posts } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        else {
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists) {
                    setUser(snapshot.data())
                } else {
                    console.log('Does not exist..')
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{ id, ...data }
                })
                setUserPosts(posts)
            })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true)
        } else {
            setFollowing(false)
        }

    }, [props.route.params.uid, props.following]) //will call function whenever these change

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }

    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if(user===null) {
        return <View />
    }

    const { currentUser, posts } = props;
    console.log({ currentUser, posts })
    return (
        <View style={ styles.container }>
            <View style={ styles.containerInfo }>
                <Text style={ styles.text }>{ user.username }</Text>
                <Text style={ styles.text }>{ user.email }</Text> 

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button 
                                title="Following"
                                style={ styles.button }
                                onPress={() => onUnfollow()}
                            />
                        ) : 
                        (
                            <Button 
                                title="Follow"
                                style={ styles.button }
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) : <Button 
                        title="Logout"
                        style={ styles.button }
                        onPress={() => onLogout()}
                    /> }  

            </View>
            <View style={ styles.containerGallery }>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View style={ styles.containerImage }>
                            <Image
                            style={ styles.image } 
                            source={{ uri: item.downloadURL }}
                        />
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    button: {
        color: "white",
        backgroundColor: "blue"
    },
    text: {
        fontSize: 20,
        paddingTop: 5
    } 
})

export default connect(mapStateToProps, null) (Profile);