import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

export const getFavoritesFromFirestore = () => {

}


export const addToFavorites = async (selectedCoin) => {
    //daha önce eklenmemişse firebase'e at
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

