import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCoin } from '../api/apiCalls';
import ListItem from '../components/ListItem';
import { useFocusEffect } from '@react-navigation/native';


export default function FavoritesScreen() {

    const [savedFavorites, setSavedFavorites] = useState([])
    const [coinDatas, setCoinDatas] = useState([...savedFavorites])
    const [renderList, setRenderList] = useState(false)
    const timer = useRef();

    useFocusEffect(
        React.useCallback(() => {

            console.log("favoritesscreen focused")
            getFavorites()

            return () => {

                console.log("favoritesscreen unfocused")
                setCoinDatas([])
                setSavedFavorites([])
                setRenderList(false)
            };
        }, [])
    );


    useEffect(() => {
        console.log("coinDatas:", coinDatas)

        if (coinDatas.length > 0) {
            let render = true
            coinDatas.forEach((coinData) => {
                console.log("data type: ", typeof coinData.market_data)
                if (typeof coinData.market_data === 'undefined') {
                    console.log("undefined var")
                    render = false
                }
            })
            setRenderList(render)
            console.log("render: ", render)
        }
    }, [coinDatas])

    useEffect(() => {
        timer.current = setInterval(() => {
            fetchCoins()
        }, 3000)

        return () => {
            clearInterval(timer.current)
        }
    }, [savedFavorites])



    const fetchCoins = () => {

        savedFavorites.forEach((savedFavorite) => {
            getCoin(savedFavorite).then((response) => {
                console.log("gelen response:", response.data)

                index = coinDatas.findIndex(coinData => coinData.id === response.data.id);
                /*
                let newArr = [...coinDatas]; // copying the old datas array
                console.log("eldeki array: ", newArr)
                console.log("güncellenecek index: ", newArr[index])
                newArr[index] = response.data; // replace e.target.value with whatever you want to change it to
                console.log("coinDatas updated:", newArr)
                setCoinDatas(newArr);
*/
                setCoinDatas(coinDatas => {
                    let newArr = [...coinDatas]; // copying the old datas array
                    newArr[index] = response.data; // replace e.target.value with whatever you want to change it to
                    return newArr
                })


            })

        })

    }

    const getFavorites = async () => {
        try {
            var savedFavorites = await AsyncStorage.getItem('favorites')
            const myArrayWithNull = savedFavorites.split(",");
            let myArray = myArrayWithNull.filter(item => item !== 'null');
            console.log("Splited array: ", myArray)
            myArray.forEach((item) => {
                body = {
                    id: item,
                }
                setCoinDatas(prevCoinDatas => [...prevCoinDatas, body]);

            })
            setSavedFavorites(myArray)
        } catch (e) {
            console.log("error:", e)
        }
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

            {
                renderList &&
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={coinDatas}
                    renderItem={({ item }) => (
                        <ListItem
                            name={item.name}
                            symbol={item.symbol}
                            currentPrice={item.market_data.current_price.usd}
                            price_change_percentage_24h={item.market_data.price_change_percentage_24h}
                            logoUrl={item.image.thumb}
                            onPress={() => { }
                            }
                        />
                    )}
                    ListHeaderComponent={<ListHeader />}
                />
            }
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