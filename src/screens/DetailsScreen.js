import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Chart from '../components/Chart'
import { getNewsByName } from '../api/apiCalls';
import News from '../components/News';
import moment from 'moment';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';


export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const selectedCoin = props.route.params.selectedCoin;
    const [formattedData, setFormattedData] = useState(null)
    const [news, setNews] = useState([])
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState('')


    useEffect(() => {

    }, [])

    useFocusEffect(
        React.useCallback(() => {
            console.log("details screen focused")
            console.log("formatlanacak selectedCoin:", selectedCoin);
            getComments()
            setFormattedData(formatMarketData(selectedCoin));
            getNewsByName(selectedCoin.name + ' coin').then((response) => {
                setNews(response.data.articles)
            })

            return () => {
                console.log("details screen focused")
            };
        }, [])
    );


    useEffect(() => {
        console.log("formattedData:", formattedData)

    }, [formattedData])

    useEffect(() => {
        console.log("gelen news:", news)
    }, [news])

    useEffect(() => {
        console.log("eldeki comments:", comments)

    }, [comments])


    const getComments = () => {
        const id = selectedCoin.id
        const subscriber = firestore()
            .collection('coins')
            .doc(id)
            .collection('comments')
            .onSnapshot(documentSnapshot => {
                let comments = []
                //console.log("favorites documentSnapshot", documentSnapshot)
                documentSnapshot._docs.forEach(item => {
                    comments.push(item._data)
                });

                comments.sort(function (a, b) {
                    var dateA = new Date(a.commentDate), dateB = new Date(b.commentDate)
                    return dateA - dateB
                });
                setComments(comments)
            })
        return () => subscriber();
    }

    const sendComment = () => {
        const id = selectedCoin.id
        firestore().collection('coins')
            .doc(id)
            .collection('comments')
            .doc(`comment-${uuid.v4()}`)
            .set({
                comment,
                commentDate: moment().format("DD-MM-YYYY hh:mm:ss"),
                userEmail: auth().currentUser?.email
            }).then(() => {
                console.log(comment, " added")
                setComment('')
                showToast('success', 'Successful', `Comment shared on ${selectedCoin.name} `)
            })
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

    const showToast = (type, text1, text2) => {
        Toast.show({
            type, text1, text2
        });
    }

    return (
        <SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
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

                <View style={styles.titleWrapper}>
                    <Text style={styles.largeTitle}>Comments</Text>

                    <TextInput
                        label="Comment"
                        returnKeyType="next"
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                    />

                    <Button
                        mode="contained"
                        onPress={sendComment}
                        style={{ marginTop: 24 }}
                    >
                        Add Comment
                    </Button>

                    {
                        comments ?
                            comments.map((comment) => (
                                <View key={comment.commentDate}>
                                    <View style={styles.upperTitles}>
                                        <View>
                                            <Text style={{ ...styles.title, fontWeight: 'bold', marginVertical: 4 }}>{comment.comment}</Text>
                                            <Text>{comment.userEmail}</Text>
                                        </View>

                                        <Text>{moment(comment.commentDate).fromNow()}</Text>


                                    </View>
                                    <View style={styles.divider} />
                                </View>

                            )) : null
                    }
                </View>




            </ScrollView>

        </SafeAreaView>
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
    titleWrapper: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    largeTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },
})