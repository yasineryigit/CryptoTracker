import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView , StyleSheet} from 'react-native';
import { getNewsByName } from '../api/apiCalls';
import News from '../components/News';

export default function NewsScreen() {

    const [news, setNews] = useState([])


    useEffect(() => {

        getNewsByName('cryptocurrency').then((response) => {
            setNews(response.data.articles)
        })
    }, [])



    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <>
                <View style={styles.titleWrapper}>
                    <Text style={styles.largeTitle}>News</Text>
                </View>
                <View style={styles.divider} />
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