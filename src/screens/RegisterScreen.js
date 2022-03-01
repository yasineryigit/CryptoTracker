import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import auth from '@react-native-firebase/auth';


export default function RegisterScreen({ navigation }) {
  const [userFirstName, setUserFirstName] = useState()
  const [userLastName, setUserLastName] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()


  const onSignUpPressed = () => {

    auth().createUserWithEmailAndPassword(userEmail, userPassword)
      .then(userCredentials => {
        const user = userCredentials.user
        navigation.replace("MyTabs")
        console.log(`User created successfully ${user.email}`)

      }).catch(err => {
        console.log(err)
        alert(err)
      })

  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >

      <Background>
        <BackButton goBack={navigation.goBack} />
        <Logo />
        <Header>Create Account</Header>

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


        <Button
          mode="contained"
          onPress={onSignUpPressed}
          style={{ marginTop: 24 }}
        >
          Sign Up
        </Button>


        <View style={styles.row}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>

      </Background>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
