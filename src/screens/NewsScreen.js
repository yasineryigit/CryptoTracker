import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getNewsByName, searchNewsOnBing } from '../api/apiCalls';
import News from '../components/News';

export default function NewsScreen() {

    const [news, setNews] = useState([])

    useEffect(() => {

        searchNewsOnBing("cryptocurrency", "en", "en-US", 30).then((response) => {
            console.log("bing news:", response)
            response = response.filter(news => typeof news.image !== 'undefined')
            setNews(response)
        })
    }, [])





    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <>
                <View style={styles.titleWrapper}>
                    <Text style={styles.largeTitle}>News</Text>
                </View>
            </>
            {news ? <News news={news} /> : <Text>No news found</Text>}
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