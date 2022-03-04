import React from 'react'
import {Text, View} from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';


const StartScreen = ({ navigation }) => {


  return (
    <Background>
      <LottieView
        source={require('../assets/crypto.json')}
        autoPlay
        loop={true}
        speed={1}
        style={{marginBottom:200}}
        onAnimationFinish={() => {
          console.log('Animation Finished!')
          // this.props.navigation.replace('Home');
        }}
      />

      <Header>Crypto Tracker</Header>
      <Paragraph>
        Free Cryptocurrency Tracker & News
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button> 
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}

export default StartScreen
