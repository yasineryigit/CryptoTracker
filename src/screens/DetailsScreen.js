import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Chart from '../components/Chart'
import { getNewsByName } from '../api/apiCalls';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { WebView } from 'react-native-webview';
import Animated from 'react-native-reanimated';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';



export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const selectedCoin = props.route.params.selectedCoin;
    const [formattedData, setFormattedData] = useState(null)
    const [news, setNews] = useState([])
    const [selectedNewsUrl, setSelectedNewsUrl] = useState()

    // bottom sheet variables
    const snapPoints = useMemo(() => ['95%'], []);
    const bottomSheetModalRef = useRef(null);

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


    const openNewsInWebView = (url) => {
        setSelectedNewsUrl(url)
        bottomSheetModalRef.current?.present();
    }


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
        <>
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
                            openNewsInWebView(news.url)


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

            <BottomSheet
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                style={styles.bottomSheet}
            >
              
                    <WebView
                        source={{ uri: 'https://www.npmjs.com/package/@gorhom/bottom-sheet' }}
                        enableScroll={true}
                        
                    />
        

            </BottomSheet>
        </>
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
})