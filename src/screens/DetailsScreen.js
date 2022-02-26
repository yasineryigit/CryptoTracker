import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Chart from '../components/Chart'

export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const selectedCoin = props.route.params.selectedCoin;
    const [formattedData, setFormattedData] = useState(null)



    useEffect(() => {
        console.log("formatlanacak selectedCoin:", selectedCoin);
        setFormattedData(formatMarketData(selectedCoin));
    }, [])

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
            <Text>This is details page</Text>
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
            <Text>News</Text>

        </View>
    );
}
