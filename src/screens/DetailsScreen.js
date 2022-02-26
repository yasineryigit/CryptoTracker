import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Chart from '../components/Chart'
import { getCoinById } from '../api/apiCalls';
import { useFocusEffect } from '@react-navigation/native';

export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const selectedCoinId = props.route.params.selectedCoinId;
    const [selectedCoin, setSelectedCoin] = useState(null)
    const [formattedData, setFormattedData] = useState(null)
    const funRef = useRef(null);
    const [isRunning, setIsRunning] = useState(true);


    useFocusEffect(
        React.useCallback(() => {
            console.log("details screen focused, arama yapılacak id:", selectedCoinId)
            if (isRunning) {
                funRef.current = setInterval(() => { // Save reference to interval.
                    getCoinById(selectedCoinId).then((response) => {
                        const data = response.data[0]
                        console.log("gelen data: ", data)
                        setSelectedCoin(data)

                    }).catch(err => {
                        console.log("err:", err)
                    })
                }, 4000);
            }
            return () => {
                console.log("details screen unfocused")
                clearInterval(funRef.current); // Stop the interval.
            };
        }, [])
    );

    useEffect(() => {
        if (selectedCoin !== null) {
            console.log("formatlanacak selectedCoin:", selectedCoin);
            setFormattedData(formatMarketData(selectedCoin));
        }
    }, [selectedCoin])

    useEffect(() => {
        console.log("formattedData:", formattedData)

    }, [formattedData])



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
        <View>

            {
                formattedData ?
                    (<Chart
                        currentPrice={formattedData.current_price}
                        logoUrl={formattedData.image}
                        name={formattedData.name}
                        symbol={formattedData.symbol}
                        priceChangePercentage7d={formattedData.price_change_percentage_24h}
                        sparkline={formattedData?.sparkline_in_7d.price}
                    />) : null
            }
            <View style={styles.divider} />
            <Text>News</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#A9ABB1',
        marginHorizontal: 16,
        marginTop: 16,
    },
})
