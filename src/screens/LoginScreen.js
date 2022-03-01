import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { auth } from '../../firebase'



export default function LoginScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()

  const onLoginPressed = () => {

    auth.signInWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        const user = userCredentials.user
        navigation.replace("MyTabs")
        console.log(`User logged in successfully ${user.email}`)
      }).catch(err => {
        console.log(err)
        alert(err)
      })

  }


  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>


      <TextInput
        label="Email"
        returnKeyType="next"
        value={userEmail}
        onChangeText={(text) => setUserEmail(text)}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={userPassword}
        onChangeText={(text) => setUserPassword(text)}
        secureTextEntry
      />


      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )



}




const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})