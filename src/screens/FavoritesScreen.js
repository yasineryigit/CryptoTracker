import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCoins, getCoin, getFavoritedCoinsByIds } from '../api/apiCalls';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import ModalPicker from '../components/ModalPicker';
import { removeFromFavorites } from '../db/FavoriteManager';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import moment from 'moment';

export default function FavoritesScreen() {

    const [favoritedCoins, setFavoritedCoins] = useState([])
    const [favoritedCoinDatas, setFavoritedCoinDatas] = useState([])
    const [allCoins, setAllCoins] = useState([])
    const [renderList, setRenderList] = useState(false)
    const [isRunning, setIsRunning] = useState(true);
    const funRef = useRef(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState({})
    const [notifyEmptyList, setNotifyEmptyList] = useState(false);
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            console.log("favoritesscreen focused")
            getFavorites()//güncel takip listesini al

            return () => {
                console.log("favoritesscreen unfocused")
                clearInterval(funRef.current); // Stop the interval.
                setIsRunning(false)
            };
        }, [])
    );


    //favoritedCoins her değiştiğinde ona göre verileri getir. Intervali durdurmak için useFocusEffect'e çevrilebilir
    useEffect(() => {
        interval = setInterval(() => {
            if (favoritedCoins.length > 0) {
                console.log("çalıştırmadan önce favoritedCoins:", favoritedCoins)
                //prepare string for request
                let favoritedCoinsString = "";
                favoritedCoins.forEach((favoritedCoin) => {
                    // console.log("eklenecek id:", favoritedCoin.id)
                    favoritedCoinsString = favoritedCoinsString.concat(favoritedCoin.id, ",")
                })
                console.log("kullanılacak favoritedCoinsString:", favoritedCoinsString)
                fetchAllCoins(favoritedCoinsString)
            }
        }, 1000);

        return () => {
            console.log("clear interval triggered")
            clearInterval(interval)
        }

    }, [favoritedCoins])



    useEffect(() => {
        if (favoritedCoins.length > 0 && allCoins.length > 0) {
            const list = []
            // console.log("İşlenecek favoritedCoins:", favoritedCoins)
            //console.log("İşlenecek allCoins:", allCoins)
            allCoins.forEach((coin) => {
                favoritedCoins.forEach((favoritedCoin) => {
                    if (coin.id === favoritedCoin.id) {
                        coin.favoritedTime = favoritedCoin.favoritedTime
                        list.push(coin)
                    }
                })
            })
            // console.log("işleme sonucu list:", list)
            list.sort((a, b) => moment(a.favoritedTime).diff(moment(b.favoritedTime)))
            setFavoritedCoinDatas(list)
        }
    }, [allCoins])


    useEffect(() => {
        console.log("eldeki favoritedCoinDatas: ", favoritedCoinDatas)
        if (favoritedCoinDatas.length != 0) {
            setRenderList(true)
        } else {
            setRenderList(false)
        }
    }, [favoritedCoinDatas])


    const fetchAllCoins = (favoritedCoinsString) => {//favori listesini al ve coinDataları çekip set et

        console.log("merged string:", favoritedCoinsString)
        getFavoritedCoinsByIds(favoritedCoinsString).then((response) => {
            //console.log("arama sonucu response: ", response.data)
            setAllCoins(response.data)
        })
    }



    const getFavorites = () => {
        //firebase'den güncel takip listesini çek ve state'e at
        const subscriber = firestore()
            .collection('users')
            .doc(`user-${auth().currentUser?.uid}`)
            .collection('favorites')
            .onSnapshot(documentSnapshot => {
                const favorites = []
                console.log("favorites documentSnapshot", documentSnapshot)
                documentSnapshot._docs.forEach(doc => {
                    console.log("favorited coin from firestore", doc._data.id);
                    favorites.push({
                        id: doc._data.id,
                        favoritedTime: doc._data.favoritedTime
                    })
                });


                console.log("favoritedCoins güncellenecek:", favorites)
                if (favorites.length != 0) {
                    console.log("setFavoritedCoins | set ediyorum:", favorites)
                    setNotifyEmptyList(false)
                } else {
                    console.log("favoritedCoins is empty")
                    setFavoritedCoinDatas([])
                    setNotifyEmptyList(true)
                }
                setFavoritedCoins(favorites)
            })
        return () => subscriber();
    }

    const ListHeader = () => (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Favorites</Text>
            </View>
            <View style={styles.divider} />
        </>
    )


    const changeModalVisibility = (bool) => {
        setIsModalVisible(bool)
    }

    const setData = (option, index) => {
        console.log("Seçilen option & index :", option, index)
        switch (index) {
            case 0:
                console.log("Silinecek coin:", selectedCoin)
                removeFromFavorites(selectedCoin)
                setFavoritedCoinDatas(favoritedCoinDatas.filter(item => item.id !== selectedCoin.id));//api response'u ile gelen update'i beklemeden direkt state'den temizle
                break;
            case 1:
                break;
            default:
                break;
        }
    }

    return (

        <View style={styles.container} >
            <ListHeader />
            {
                notifyEmptyList ?
                    <View style={styles.notifyEmptyList}>
                        <Text style={styles.notifyEmptyListText}>You don't have any favorites</Text>
                        <LottieView
                            source={require('../assets/empty.json')}
                            autoPlay
                            loop={true}
                            style={{
                                width: 80,
                                height: 80,
                                marginBottom: 8,
                            }}
                            speed={0.5}
                            onAnimationFinish={() => {
                                //console.log('Animation Finished!')
                                // this.props.navigation.replace('Home');
                            }}
                        />
                    </View>
                    :
                    renderList ?
                        (<FlatList
                            keyExtractor={(item) => item.id}
                            data={favoritedCoinDatas}
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
                                        navigation.navigate("MyTopTabs", { selectedCoin: item })
                                    }}
                                    onLongPress={() => {
                                        changeModalVisibility(true)
                                        setSelectedCoin(item)
                                    }}
                                />
                            )}

                        />) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    source={require('../assets/loading.json')}
                                    autoPlay
                                    loop={true}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        marginBottom: 8,
                                    }}
                                    speed={0.5}
                                    onAnimationFinish={() => {
                                        //console.log('Animation Finished!')
                                        // this.props.navigation.replace('Home');
                                    }}
                                />
                            </View>
                        )

            }

            <Modal
                transparent={true}
                animationType='fade'
                visible={isModalVisible}
                nRequestClose={() => changeModalVisibility(false)}
            >
                <ModalPicker
                    changeModalVisibility={changeModalVisibility}
                    options={['Remove from favorites', 'Cancel']}
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
    notifyEmptyList: {
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notifyEmptyListText: {
        marginBottom: 15
    }
});