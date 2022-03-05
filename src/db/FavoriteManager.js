import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import moment from 'moment';


export const addToFavorites = async (selectedCoin) => {
    //daha önce eklenmemişse firebase'e at
    const id = selectedCoin.id
    firestore()
        .collection('users')
        .doc(`user-${auth().currentUser?.uid}`)
        .collection('favorites').get().then((response) => {
            let found = false;

            response.docs.forEach((doc) => {
                if (doc._data.id === id) {
                    found = true;
                }
            })

            if (!found) {

                firestore().collection('users')
                    .doc(`user-${auth().currentUser?.uid}`)
                    .collection('favorites')
                    .doc(id)
                    .set({
                        id,
                        favoritedTime: moment().format(),
                    }).then(() => {
                        console.log(id, " added")
                    })

                //favoritedCount'u arttır
                adjustFavoritedCountInFirestore(id, +1)

                showToast('success', 'Successful', `${selectedCoin.name} added to your favorites successfully`)
            } else {
                showToast('success', 'Has been already added', `${selectedCoin.name} has been already added to your favorites successfully`)

            }
        })
}

export const removeFromFavorites = async (selectedCoin) => {
    //firebase'den sil
    const id = selectedCoin.id
    firestore()
        .collection('users')
        .doc(`user-${auth().currentUser?.uid}`)
        .collection('favorites')
        .doc(id).delete().then(() => {
            console.log(id, " deleted")
            //favoritedCount'u azalt
            adjustFavoritedCountInFirestore(id, -1);

        })
    showToast('error', 'Successful', `${selectedCoin.name} has been removed from your favorites`)
}


const showToast = (type, text1, text2) => {
    Toast.show({
        type, text1, text2
    });
}

const adjustFavoritedCountInFirestore = (id, index) => {

    firestore().collection('coins')
        .doc(id)
        .get()
        .then((response) => {
            var favoritedCount = 0;
            //console.log("coinin güncel favori sayısı:", response)
            if (typeof response._data !== 'undefined' && typeof response._data.favoritedCount !== 'undefined') {
                favoritedCount = response._data.favoritedCount
            }
            favoritedCount += index;
            firestore().collection('coins')
                .doc(id)
                .set({ favoritedCount })
                .then((response) => {
                    //console.log("updated")
                })
        })
}


