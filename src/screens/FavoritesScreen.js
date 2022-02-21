import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCoin } from '../api/apiCalls';

export default function FavoritesScreen() {

    const [savedFavorites, setSavedFavorites] = useState([])
    const [coinDatas, setCoinDatas] = useState([])
    const timer = useRef();

    useEffect(() => {
        getFavorites()


        timer.current = setInterval(() => {
            setCoinDatas([]);
            savedFavorites.forEach((savedFavorite) => {
                if (savedFavorite === "null") {
                    getCoin(savedFavorite).then((response) => {
                        console.log("gelen response:", response.data)
                        setCoinDatas(prevCoinDatas => [...prevCoinDatas, response.data]);
                    })
                } else {
                    console.log("null'ü atladım")
                }

            })

        }, 4000);//her saniye, o kodu okutan kişileri getir

    }, [])


    useEffect(() => {

        console.log("coinDatas:", coinDatas)

    }, [coinDatas])

    const getFavorites = async () => {
        try {
            var savedFavorites = await AsyncStorage.getItem('favorites')
            const myArray = savedFavorites.split(",");
            console.log("Splited array: ", myArray)
            setSavedFavorites(myArray)
        } catch (e) {
            console.log("error:", e)
        }
    }

    return (
        <View style={styles.container}>
            <Text>This is favorites screen</Text>
            <Text>Favorited coins:</Text>
            {
                savedFavorites.map((savedFavorite) => (
                    <Text key={savedFavorite}>{savedFavorite}</Text>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5
    }
})
