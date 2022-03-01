import React from 'react';
import { View, Text } from 'react-native';
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import Background from '../components/Background'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';

export default function UserPageScreen() {

    const navigation = useNavigation();

    const onClickLogout = async () => {
        auth().signOut()
            .then(() => {
                navigation.replace("StartScreen")
            }).catch((err) => {
                console.log(err)
            })
    }

    return (
        <Background>
            <Logo />
            <Header>{auth().currentUser?.email}</Header>


            <Button
                mode="contained"
                onPress={() => {
                    onClickLogout()
                }}
            >
                <Icon name="sign-out-alt" size={20} color="#ffffff" />
                Logout
            </Button>

        </Background>

    );
}