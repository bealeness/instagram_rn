import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button  } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let posts = [];
        if(props.usersFollowingLoaded == props.following.length) {
            for (let i = 0; i < props.following.length; i++) {
                const user = props.users.find(el => el.uid === props.following[i]);
                if(user != undefined) {
                    posts = [...posts, ...user.posts]; //concatenating the users posts to the feed posts
                }
            }
            posts.sort(function(x, y) {
                return x.creation - y.creation;
            })
            setPosts(posts);
        }

    }, [props.usersFollowingLoaded]) //will trigger useEffect 

    return (
        <View style={ styles.container }>
            <View style={ styles.containerGallery }>
                <FlatList 
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style={ styles.containerImage }>
                            <Text style={ styles.containerText }>{ item.user.username }</Text>
                            <Image
                                style={ styles.image } 
                                source={{ uri: item.downloadURL }}
                            />
                            <Text
                                style={ styles.containerText }
                                onPress={() => props.navigation.navigate('Comment',
                                { postId: item.id, uid: item.user.uid }) //navigate to the comment page of the post with corresponding id
                            }
                            >View comments...
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: 'green'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3,
        borderWidth: 3,
        marginTop: 10,
        backgroundColor: 'white' 
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    containerText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 25
    }
})

export default connect(mapStateToProps, null) (Feed);