import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Chart from '../components/Chart'
import { getNewsByName } from '../api/apiCalls';
import { clearWarnings } from 'react-native/Libraries/LogBox/Data/LogBoxData';


export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const selectedCoin = props.route.params.selectedCoin;
    const [formattedData, setFormattedData] = useState(null)
    const [news, setNews] = useState([])

    useEffect(() => {
        console.log("formatlanacak selectedCoin:", selectedCoin);
        setFormattedData(formatMarketData(selectedCoin));
        getNewsByName(selectedCoin.name + ' coin').then((response) => {
            setNews(response.data.articles)
        })
    }, [])

    useEffect(() => {
        console.log("formattedData:", formattedData)

    }, [formattedData])

    useEffect(() => {
        console.log("gelen news:", news)
    }, [news])



    const formatSparkline = (numbers) => {
        const sevenDaysAgo = moment().subtract(7, 'days').unix();
        let formattedSparkline = numbers.map((item, index) => {
            return {
                x: sevenDaysAgo + (index + 1) * 3600,
                y: item,
            }
        })

        return formattedSparkline;
    }

    const formatMarketData = (data) => {

        const formattedSparkline = formatSparkline(data.sparkline_in_7d.price)

        const formattedItem = {
            ...data,
            sparkline_in_7d: {
                price: formattedSparkline
            }
        }

        return formattedItem;
    }

    return (
        <ScrollView>

            {
                formattedData ?
                    (<Chart
                        currentPrice={formattedData.current_price}
                        logoUrl={formattedData.image}
                        name={formattedData.name}
                        symbol={formattedData.symbol}
                        priceChangePercentage7d={formattedData.price_change_percentage_7d_in_currency}
                        sparkline={formattedData?.sparkline_in_7d.price}
                    />) : null
            }
            <View style={styles.divider} />
            {
                news.map((news) => (
                    <TouchableOpacity key={news.url} onPress={() => {
                        console.log("clicked")
                        Linking.openURL(news.url).catch(err => console.error("Couldn't load page", err));
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
            }

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginTop: 16,
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
        marginRight: 20,
        fontSize: 18,
    },
    subtitle: {
        fontSize: 14,

    },
})