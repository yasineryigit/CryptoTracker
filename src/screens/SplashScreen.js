import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authActions'

export default function SplashScreen() {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {

        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                firestore().collection('users')
                    .doc(`user-${auth().currentUser?.uid}`)
                    .collection("user")
                    .doc("information")
                    .get().then((response) => {
                        //verileri redux'a at
                        console.log("reduxa atılacak veri: ", response._data)
                        dispatch(loginSuccess(response._data))
                        navigation.replace("MyDrawer", { screen: "MyTabs" })
                        console.log(`User logged in successfully ${user.email}`)
                    })

            } else {
                navigation.replace("StartScreen")

            }
        })

        return unsubscribe
    }, [])

    return (

        <View
            style={{
                flex: 1,
                backgroundColor: '#ffffff'
            }}
        >


            <LottieView
                source={require('../assets/loading4.json')}
                autoPlay
                loop={true}
                speed={1}
                onAnimationFinish={() => {
                    console.log('Animation Finished!')
                    // this.props.navigation.replace('Home');
                }}
            />

        </View>
    );
}