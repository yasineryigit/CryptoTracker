import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getNewsByName } from '../api/apiCalls';
import News from '../components/News';

export default function CoinNewsScreen(props) {

    const [news, setNews] = useState([])
    const selectedCoin = props.route.params.selectedCoin;
    
    useEffect(() => {
        getNewsByName(selectedCoin.name + ' coin').then((response) => {
            setNews(response.data.articles)
        })
    }, [])


    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <>
                <View style={styles.titleWrapper}>
                    <Text style={styles.largeTitle}>{selectedCoin.name} News</Text>
                </View>
            </>
            <News news={news} />
        </ScrollView>
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

});