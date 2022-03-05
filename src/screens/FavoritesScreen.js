import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCoins, getCoin } from '../api/apiCalls';
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
    const [allCoins, setAllCoins] = useState([])
    const [favoritedCoinDatas, setFavoritedCoinDatas] = useState([])
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
            if (isRunning) {
                console.log("favoritesscreen focused")
                getFavorites()//güncel takip listesini al
                funRef.current = setInterval(() => { // Save reference to interval.
                    fetchAllCoins()
                    console.log("favoritesscreen interval working")
                }, 1000);
            }
            return () => {
                console.log("favoritesscreen unfocused")
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
                console.log("Silinecek coin:", selectedCoin)
                removeFromFavorites(selectedCoin)
                break;
            case 1:
                break;
            default:
                break;
        }
    }


    useEffect(() => {
        console.log("favoritedCoinDatas:", favoritedCoinDatas)

        if (favoritedCoinDatas.length > 0) {
            let render = true
            favoritedCoinDatas.forEach((favoritedCoin) => {
                console.log("data type: ", typeof favoritedCoin.current_price)
                if (typeof favoritedCoin.current_price === 'undefined') {
                    console.log("undefined var")
                    render = false
                }
            })
            setRenderList(render)
            console.log("render: ", render)
        }
    }, [favoritedCoinDatas])


    useEffect(() => {//add datas of favorited coins
        var list = []
        var isSync = false
        allCoins.forEach((coin, coinIndex) => {
            favoritedCoinDatas.forEach((favoritedCoinData, favoritedCoinDataIndex) => {
                if (coin.id === favoritedCoinData.id && favoritedCoins.length === favoritedCoinDatas.length) {//if allcoins are already setted into favoritedCoinDatas in state
                    isSync = true
                    console.log("im updating")
                    setFavoritedCoinDatas(favoritedCoinDatas => {
                        let newArr = [...favoritedCoinDatas]; // copying the old datas array
                        newArr[favoritedCoinDataIndex] = allCoins[coinIndex]; // replace e.target.value with whatever you want to change it to
                        return newArr
                    })
                }
            })

            if (!isSync && favoritedCoins.find(favoritedCoin => favoritedCoin.id === coin.id) ? true : false) {//if allcoins are not setted into favoritedCoinDatas, push them into array and set it 
                console.log("im adding")
                var favoritedCoinObject = favoritedCoins.filter(obj => { return obj.id === coin.id })
                coin.favoritedTime = favoritedCoinObject[0].favoritedTime
                list.push(coin)
            }
        })
        if (list.length > 0) {//if there is data in list, set it to favoritedCoinDatas 
            list.sort((a, b) => moment(a.favoritedTime).diff(moment(b.favoritedTime)))
            setFavoritedCoinDatas(list)
        }

    }, [allCoins, favoritedCoins])


    const fetchAllCoins = () => {

        getAllCoins(25, 1).then((response) => {
            console.log("gelen response:", response.data)
            setAllCoins(response.data)
        })
    }

    const getFavorites = async () => {
        //firebase'den güncel takip listesini çek ve state'e at

        const subscriber = firestore()
            .collection('users')
            .doc(`user-${auth().currentUser?.uid}`)
            .collection('favorites')
            .onSnapshot(documentSnapshot => {
                const ids = []
                console.log("favorites documentSnapshot", documentSnapshot)
                documentSnapshot.forEach(documentSnapshot => {
                    //console.log("favorited coin from firestore", documentSnapshot._data.id);
                    ids.push({
                        id: documentSnapshot._data.id,
                        favoritedTime: documentSnapshot._data.favoritedTime
                    })
                });

                if (ids.length !== 0) {
                    console.log("favoritedCoins are exists")
                    setFavoritedCoins(ids)
                    setNotifyEmptyList(false)
                } else {
                    console.log("favoritedCoins is empty")
                    setNotifyEmptyList(true)
                }
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
                    renderList ? (<FlatList
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