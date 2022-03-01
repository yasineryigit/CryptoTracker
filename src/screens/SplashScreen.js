import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebase'

export default function SplashScreen() {

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("MyTabs")
                console.log(`User logged in successfully ${user.email}`)
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
                source={require('../assets/splash.json')}
                autoPlay
                loop={true}
                speed={0.5}
                onAnimationFinish={() => {
                    console.log('Animation Finished!')
                    // this.props.navigation.replace('Home');
                }}
            />

        </View>
    );
}