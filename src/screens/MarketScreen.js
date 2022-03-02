import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { getAllCoins } from '../api/apiCalls';
import ListItem from '../components/ListItem';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import ModalPicker from '../components/ModalPicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';


export default function MarketScreen() {

    const [allCoins, setAllCoins] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState('')
    const [isRunning, setIsRunning] = useState(true);
    const funRef = useRef(null);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {

            if (isRunning) {
                funRef.current = setInterval(() => { // Save reference to interval.
                    getAllCoins().then((response) => {
                        setAllCoins(response.data)
                        console.log("marketscreen interval working")
                    }).catch((error) => {
                    })
                }, 1000);
            }
            return () => {
                clearInterval(funRef.current); // Stop the interval.
            };
        }, [])
    );

    const changeModalVisibility = (bool) => {
        setIsModalVisible(bool)
    }

    const setData = (option, index) => {
        console.log("Seçilen option & index :", option, index)
        switch (index) {
            case 0:
                console.log("Kaydedilecek coin:", selectedCoin)
                saveSelectedCoin()
                break;
            case 1:
                break;
            default:
                break;
        }
    }


    useEffect(() => {

        //console.log("allCoins:", allCoins)

    }, [allCoins])

    const ListHeader = () => (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Markets</Text>
            </View>
            <View style={styles.divider} />
        </>
    )

    const saveSelectedCoin = async () => {
        let favoritedCoinIds = [];
        try {
            const jsonValue = await AsyncStorage.getItem('favorites')
            if (jsonValue !== null) { //if saved value is not null then push into it
                favoritedCoinIds = JSON.parse(jsonValue)
                let found = favoritedCoinIds.find(x => x === selectedCoin.id) ? true : false
                if (!found) {
                    favoritedCoinIds.push(selectedCoin.id)
                } else {
                    showToast('info', 'Has been already added', `${selectedCoin.name} has already been added to your favorites`)
                }

            } else {//if saved value is null then push array
                favoritedCoinIds.push(selectedCoin.id)

            }
            console.log("kaydedilecek array:", favoritedCoinIds)
            await AsyncStorage.setItem('favorites', JSON.stringify(favoritedCoinIds))
            saveFavoritedCoinIdToFirebase(selectedCoin.id)
            showToast('success', 'Successful', `${selectedCoin.name} added to your favorites successfully`)

        } catch (e) {
            console.log("error while async storage:", e)
        }
    }

    const saveFavoritedCoinIdToFirebase = (id) => {
        const favoritedKey = `favorite-${uuid.v4()}`
        firestore().collection('users')
            .doc(`user-${auth().currentUser?.uid}`)
            .collection('favorites')
            .add({
                id
            }).then(() => {
                console.log(id, " added")
            })
    }


    const showToast = (type, text1, text2) => {
        Toast.show({
            type, text1, text2
        });
    }

    return (

        <View style={styles.container}>

            <FlatList
                keyExtractor={(item) => item.id}
                data={allCoins}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ListItem
                        name={item.name}
                        symbol={item.symbol}
                        currentPrice={item.current_price}
                        price_change_percentage_24h={item.price_change_percentage_24h}
                        logoUrl={item.image}
                        onPress={() => {
                            navigation.navigate("DetailsScreen", { selectedCoin: item })
                        }}
                        onLongPress={() => {
                            changeModalVisibility(true)
                            setSelectedCoin(item)
                        }}
                    />
                )}
                ListHeaderComponent={<ListHeader />}
            />

            <Modal
                transparent={true}
                animationType='fade'
                visible={isModalVisible}
                nRequestClose={() => changeModalVisibility(false)}
            >
                <ModalPicker
                    changeModalVisibility={changeModalVisibility}
                    options={['Add to favorites', 'Cancel']}
                    setData={setData}

                />

            </Modal>

        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleWrapper: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    largeTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginTop: 16,
    },
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});