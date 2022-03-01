import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/native';


const StartScreen = ({ navigation }) => {

 

  return (
    <Background>
      <Logo />
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
