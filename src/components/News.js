import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

export default function News(props) {

    const navigation = useNavigation();
    
    useEffect(() => {
        console.log("news props:", props)
    }, [])

    return (
        props.news.map((news) => (
            <TouchableOpacity key={news.url} onPress={() => {
                console.log("clicked")
                //openNewsInWebView(news.url)
                navigation.navigate("WebViewScreen", { selectedNewsUrl: news.url })
                //Linking.openURL(news.url).catch(err => console.error("Couldn't load page", err));

            }}>
                <View style={styles.divider} />
                <View style={styles.titlesWrapper}>
                    <View style={styles.upperTitles}>
                        <View style={styles.upperLeftTitle}>
                            <Image source={{ uri: news.urlToImage }} style={styles.image} />
                            <Text style={styles.title}>{news.title}</Text>
                        </View>
                    </View>
                    <View style={styles.lowerTitles}>
                        <Text style={styles.subtitle}>{news.content.slice(0, 200).concat('...')}</Text>
                    </View>
                    <Text style={{ marginTop: 8 }}> {moment(news.publishedAt).fromNow()}</Text>
                </View>


            </TouchableOpacity>
        ))


    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginVertical: 16,

    },
    image: {
        width: 40,
        height: 40,
        marginRight: 4,
        borderRadius: 40
    },
    upperLeftTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lowerTitles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },
    upperTitles: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    titlesWrapper: {
        marginHorizontal: 8,
        marginVertical: 8
    },
    title: {
        fontSize: 18,
        flex: 1,
        flexWrap: 'wrap'
    },
    subtitle: {
        fontSize: 14,

    },

})
