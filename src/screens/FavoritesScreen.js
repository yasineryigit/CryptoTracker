import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCoins, getCoin } from '../api/apiCalls';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import ModalPicker from '../components/ModalPicker';

export default function FavoritesScreen() {

    const [savedFavorites, setSavedFavorites] = useState([])//@REMOVABLE
    const [allCoins, setAllCoins] = useState([])
    const [favoritedCoins, setFavoritedCoins] = useState([])
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
                setFavoritedCoins([])
                setSavedFavorites([])
                setRenderList(false)
                setNotifyEmptyList(false);
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
                deleteFromFavorites()
                break;
            case 1:
                break;
            default:
                break;
        }
    }



    useEffect(() => {
        console.log("favoritedCoins:", favoritedCoins)

        if (favoritedCoins.length > 0) {
            let render = true
            favoritedCoins.forEach((favoritedCoin) => {
                console.log("data type: ", typeof favoritedCoin.current_price)
                if (typeof favoritedCoin.current_price === 'undefined') {
                    console.log("undefined var")
                    render = false
                }
            })
            setRenderList(render)
            console.log("render: ", render)
        }
    }, [favoritedCoins])


    useEffect(() => {//add datas of favorited coins
        allCoins.forEach((coin, coinIndex) => {
            favoritedCoins.forEach((favoritedCoin, favoritedCoinIndex) => {
                if (coin.id === favoritedCoin.id) {
                    setFavoritedCoins(favoritedCoins => {
                        let newArr = [...favoritedCoins]; // copying the old datas array
                        newArr[favoritedCoinIndex] = allCoins[coinIndex]; // replace e.target.value with whatever you want to change it to
                        return newArr
                    })
                }
            })
        })
    }, [allCoins])


    const fetchAllCoins = () => {

        getAllCoins().then((response) => {
            console.log("gelen response:", response.data)
            setAllCoins(response.data)
        })
    }

    const getFavorites = async () => {

        try {
            var savedFavorites = await AsyncStorage.getItem('favorites')
            console.log("eldeki savedFavorites object:", savedFavorites)
            if (savedFavorites != null && JSON.parse(savedFavorites).length !== 0) {
                console.log("savedfavorites are exists")
                JSON.parse(savedFavorites).forEach((item) => {
                    let body = {
                        id: item,
                    }
                    setFavoritedCoins(prevFavoritedCoins => [...prevFavoritedCoins, body]);//add favoriteObject with only id
                })
                setSavedFavorites(JSON.parse(savedFavorites))//@REMOVABLE
            } else {
                console.log("savedFavorites is empty")
                setNotifyEmptyList(true)
            }
        } catch (e) {
            console.log("error:", e)
        }
    }


    const deleteFromFavorites = async () => {

        try {
            const jsonValue = await AsyncStorage.getItem('favorites')
            if (jsonValue !== null) { //if saved value is not null then push into it
                var filteredFavoriteCoins = favoritedCoins.filter(function (value, index, arr) {
                    return value.id !== selectedCoin.id;
                });
                var filteredJsonValue = JSON.parse(jsonValue).filter(function (value, index, arr) {
                    return value !== selectedCoin.id;
                });
                //console.log("silindikten sonra filteredFavoriteCoins:", filteredFavoriteCoins);
                if (filteredFavoriteCoins.length === 0) {//if there is no favorites, then notify user
                    setNotifyEmptyList(true)
                }
                setFavoritedCoins(filteredFavoriteCoins)//delete from state array
                await AsyncStorage.setItem('favorites', JSON.stringify(filteredJsonValue))//delete from local storage
                showToast('error', 'Successful', `${selectedCoin.id} has been removed from your favorites`)
            }
        } catch (e) {
            console.log("error while async storage:", e)
        }
    }

    const showToast = (type, text1, text2) => {
        Toast.show({
            type, text1, text2
        });
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

        <View style={styles.container}>
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
                        data={favoritedCoins}
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