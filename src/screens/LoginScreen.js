import React, { useState, useEffect, useRef } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
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
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/authActions'
import LottieView from 'lottie-react-native';
import Dialog from "react-native-dialog";
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState()
  const [userPassword, setUserPassword] = useState()
  const [visible, setVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState()
  const forgotEmailInputRef = useRef(null)

  const dispatch = useDispatch();

  const setDialogVisibility = (status) => {
    setVisible(status);
  };


  const onLoginPressed = () => {

    auth().signInWithEmailAndPassword(userEmail, userPassword)
      .then(user => {
        //user bilgilerini çek ve redux'a at 
        firestore().collection('users')
          .doc(`user-${auth().currentUser?.uid}`)
          .collection("user")
          .doc("information")
          .get().then((response) => {
            //verileri redux'a at
            console.log("reduxa atılacak veri: ", response._data)
            dispatch(loginSuccess(response._data))
            navigation.replace("MyTabs")
          })

      }).catch(err => {
        console.log(err)
        alert(err)
      })

  }

  const sendConfirmationEmail = () => {
    console.log("mail gönderilecek hesap:", forgotEmail)
    auth().sendPasswordResetEmail(forgotEmail)
      .then((user) => {
        showToast('success', 'Successful', `We've sent you an email with a link to reset your password. Please check your inbox `)
      }).catch(function (e) {
        console.log(e)
        showToast('error', 'Error', `Error: ${e.message}`)
      })
    setDialogVisibility(false)
  }

  const showToast = (type, text1, text2) => {
    Toast.show({
      type, text1, text2
    });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <LottieView
        source={require('../assets/crypto.json')}
        autoPlay
        loop={true}
        speed={1}
        style={{ marginBottom: 200 }}
        onAnimationFinish={() => {
          console.log('Animation Finished!')
          // this.props.navigation.replace('Home');
        }}
      />
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
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setDialogVisibility(true)}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Dialog.Container
          visible={visible}
          onBackdropPress={() => setDialogVisibility(false)}
          onRequestClose={() => setDialogVisibility(false)}
        >
          <Dialog.Title>Forgot Password</Dialog.Title>
          <Dialog.Description>
            Please enter your email address to reset your password
          </Dialog.Description>
          <Dialog.Input label="Email" onChangeText={(email) => setForgotEmail(email)} />
          <Dialog.Button label="Send confirmation email" onPress={() => sendConfirmationEmail()} />

        </Dialog.Container>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
