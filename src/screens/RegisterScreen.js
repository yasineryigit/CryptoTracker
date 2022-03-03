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
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authActions'


export default function RegisterScreen({ navigation }) {
  const [userFirstName, setUserFirstName] = useState()
  const [userLastName, setUserLastName] = useState()
  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()
  const dispatch = useDispatch();


  const onSignUpPressed = () => {

    auth().createUserWithEmailAndPassword(userEmail, userPassword)
      .then(user => {

        firestore().collection('users')
          .doc(`user-${auth().currentUser?.uid}`)
          .collection("user")
          .doc("information")
          .set({
            id: auth().currentUser?.uid,
            userFirstName,
            userLastName
          }).then((response) => {
          
            dispatch(loginSuccess({
              id: auth().currentUser?.uid,
              userFirstName,
              userLastName
            }))
            navigation.replace("MyTabs")
            //verileri redux'a at
            console.log("register response : ", response)
            console.log(`User created successfully ${user.email}`)
          })

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
          label="First Name"
          returnKeyType="next"
          value={userFirstName}
          onChangeText={(text) => setUserFirstName(text)}


        />

        <TextInput
          label="Last Name"
          returnKeyType="next"
          value={userLastName}
          onChangeText={(text) => setUserLastName(text)}

        />

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
