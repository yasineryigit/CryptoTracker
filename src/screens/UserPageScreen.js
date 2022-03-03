import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import Background from '../components/Background'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux'
import { logoutSuccess } from '../redux/authActions'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


export default function UserPageScreen() {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const myState = useSelector(state => state)
    const [image, setImage] = useState()
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [userFirstName, setUserFirstName] = useState()
    const [userLastName, setUserLastName] = useState()


    useEffect(() => {
        //tüm information'ları çek ve state'e at, göster
        firestore().collection('users')
            .doc(`user-${auth().currentUser?.uid}`)
            .collection("user")
            .doc("information")
            .get().then((response) => {
                //verileri redux'a at
                console.log("reduxa atılacak veri: ", response._data)
                //setUserFirstName(response._data.userFirstName)
                //setUserLastName(response._data.userLastName)
                if (typeof response._data.profileImage !== 'undefined' && response._data.profileImage !== null) {//if the user already have a profile image
                    setImage(response._data.profileImage)
                } else {//if user has no profile image before
                    setImage(null)
                }
            })

    }, [])

    const onClickLogout = async () => {
        auth().signOut()
            .then(() => {
                dispatch(logoutSuccess())
                navigation.replace("StartScreen")
            }).catch((err) => {
                console.log(err)
            })
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            submitImage(imageUri)
            console.log("imageUri içindeki :", imageUri);
        });
    };

    const submitImage = async (image) => {
        const imageUrl = await uploadImage(image);
        console.log('Image Url: ', imageUrl);

        firestore()
            .collection('users')
            .doc(`user-${auth().currentUser?.uid}`)
            .collection("user")
            .doc("information")
            .update({
                profileImage: imageUrl,
            }).then((response) => {

                console.log("Photo putted into firestore")

            }).catch((error) => {
                console.log("error while putting image into firestore", error)
            })
    }

    const uploadImage = async (image) => {
        if (image == null) {
            return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setUploading(true);
        setTransferred(0);

        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );

            setTransferred(
                Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
                100,
            );
        });

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            setUploading(false);
            //setImage(null);

            Alert.alert(
                'Image uploaded!',
                'Your image has been uploaded successfully!',
            );
            return url;

        } catch (e) {
            console.log(e);
            return null;
        }

    };

    return (
        <ScrollView>
            <View style={{
                flex: 1,
                padding: 20,
                width: '100%',
                maxWidth: 340,
                marginVertical: 100,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <TouchableOpacity onPress={() => choosePhotoFromLibrary()}>
                    {image != null ?
                        <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                        :
                        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/16/16467.png" }} style={{ width: 250, height: 250 }} />}
                </TouchableOpacity>

                <Header>{auth().currentUser?.email}</Header>
                <Header>{myState.userFirstName} {myState.userLastName}</Header>


                <Button
                    mode="contained"
                    onPress={() => {
                        onClickLogout()
                    }}
                >
                    <Icon name="sign-out-alt" size={20} color="#ffffff" />
                    Logout
                </Button>
            </View>
        </ScrollView>



    );
}