import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView, Modal, ActivityIndicator } from 'react-native';
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
import { addToFavorites } from '../db/FavoriteManager';
import { useSelector } from 'react-redux';

export default function MarketScreen() {

    const [allCoins, setAllCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCurrent, setPageCurrent] = useState(1)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState({})
    const [isRunning, setIsRunning] = useState(true);
    const funRef = useRef(null);
    const navigation = useNavigation();
    const myState = useSelector(state => state)

    useFocusEffect(
        React.useCallback(() => {
            console.log("gelen redux verisi:", myState);
            if (isRunning) {
                funRef.current = setInterval(() => { // Save reference to interval.
                    setIsLoading(true)
                    getCoins(25, pageCurrent)
                }, 1000);
            }
            return () => {
                clearInterval(funRef.current); // Stop the interval.
            };
        }, [pageCurrent])
    );

    /*
useEffect(() => {
    console.log("at the beginning, pageCurrent useEffect triggered")
    setIsLoading(true)
    getCoins(25, pageCurrent)
}, [pageCurrent])
*/

    useEffect(() => {

        //console.log("allCoins:", allCoins)

    }, [allCoins])



    const getCoins = (per_page, pageCurrent) => {
        getAllCoins(per_page, pageCurrent).then((response) => {
            setAllCoins(allCoins.concat(response.data))
            setIsLoading(false)
            console.log("marketscreen interval working")
        }).catch((error) => {
        })
    }

    const setData = async (option, index) => {
        console.log("Seçilen option & index :", option, index)
        switch (index) {
            case 0:
                console.log("Kaydedilecek coin:", selectedCoin)
                addToFavorites(selectedCoin)
                break;
            case 1:
                break;
            default:
                break;
        }
    }

    const changeModalVisibility = (bool) => {
        setIsModalVisible(bool)
    }


    const ListHeader = () => (
        <>
            <View style={styles.titleWrapper}>
                <Text style={styles.largeTitle}>Markets</Text>
            </View>
            <View style={styles.divider} />
        </>
    )

    const renderItem = ({ item }) => {
        return (<ListItem
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
        />)
    }

    const renderFooter = () => {
        return (
            isLoading ?
                <View style={{ marginTop: 10, alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View> : null
        )
    }

    const handleLoadMore = () => {
        console.log("güncel pagecurrent: ", pageCurrent)
        if (!isLoading) {
            setPageCurrent(pageCurrent + 1)
            setIsLoading(true)
        }
    }

    const handleRefreshData = () => {
        setIsRefreshing(true)
        getAllCoins(25, 1).then((response) => {
            setAllCoins(response.data)
            setIsRefreshing(false)
            console.log("Yeni datalar geldi: ", response.data.length)
        }).catch((error) => {
        })

    }


    return (
        <View style={styles.container}>

            <FlatList
                keyExtractor={(item) => item.id}
                data={allCoins}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={25}
                renderItem={renderItem}
                refreshing={isRefreshing}
                onRefresh={handleRefreshData}
                ListFooterComponent={renderFooter}
                ListHeaderComponent={<ListHeader />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
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