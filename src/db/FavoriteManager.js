import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';


export const addToFavorites = async (selectedCoin) => {
    //daha önce eklenmemişse firebase'e at

    firestore()
        .collection('users')
        .doc(`user-${auth().currentUser?.uid}`)
        .collection('favorites').get().then((response) => {
            let found = false;

            response.docs.forEach((doc) => {
                if (doc._data.id === selectedCoin.id) {
                    found = true;
                }
            })

            if (!found) {
                const id = selectedCoin.id
                firestore().collection('users')
                    .doc(`user-${auth().currentUser?.uid}`)
                    .collection('favorites')
                    .doc(id)
                    .set({
                        id
                    }).then(() => {
                        console.log(id, " added")
                    })
                showToast('success', 'Successful', `${selectedCoin.name} added to your favorites successfully`)
            } else {
                showToast('success', 'Has been already added', `${selectedCoin.name} has been already added to your favorites successfully`)

            }
        })
}

export const removeFromFavorites = async (selectedCoin) => {
    //firebase'den sil
    firestore()
        .collection('users')
        .doc(`user-${auth().currentUser?.uid}`)
        .collection('favorites')
        .doc(selectedCoin.id).delete().then(() => {
            console.log(selectedCoin.id, " deleted")
        })
    showToast('error', 'Successful', `${selectedCoin.name} has been removed from your favorites`)
}


const showToast = (type, text1, text2) => {
    Toast.show({
        type, text1, text2
    });
}

