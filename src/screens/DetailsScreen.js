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
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';


export default function DetailsScreen(props) {

    const navigation = useNavigation();
    const myState = useSelector(state => state)
    const selectedCoin = props.route.params.selectedCoin;
    const [formattedData, setFormattedData] = useState(null)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState()
    const [favoritedCount, setFavoritedCount] = useState(0)


    useEffect(() => {

    }, [])

    useFocusEffect(
        React.useCallback(() => {
            console.log("details screen focused")
            console.log("formatlanacak selectedCoin:", selectedCoin);
            getCoinDetails()
            setFormattedData(formatMarketData(selectedCoin));

            return () => {
                console.log("details screen focused")
            };
        }, [])
    );


    useEffect(() => {
        console.log("formattedData:", formattedData)

    }, [formattedData])


    useEffect(() => {
        console.log("eldeki comments:", comments)

    }, [comments])

    const getCoinDetails = () => {
        getComments()
        getFavoritedCountFromFirestore()
    }

    const getFavoritedCountFromFirestore = () => {
        const id = selectedCoin.id
        const subscriber = firestore()
            .collection('coins')
            .doc(id)
            .onSnapshot(documentSnapshot => {
                console.log("gelen favoritedCount document snapshot:", documentSnapshot)
                if (typeof documentSnapshot._data !== 'undefined' && typeof documentSnapshot._data.favoritedCount !== 'undefined') {
                    setFavoritedCount(documentSnapshot._data.favoritedCount)
                }
            })
        return () => subscriber();
    }

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

                comments.sort((a, b) => moment(b.commentDate).diff(moment(a.commentDate)))
                setComments(comments)
            })
        return () => subscriber();
    }

    const sendComment = () => {
        if (comment !== "") {
            const id = selectedCoin.id
            firestore().collection('coins')
                .doc(id)
                .collection('comments')
                .doc(`comment-${uuid.v4()}`)
                .set({
                    comment,
                    commentDate: moment().format(),
                    userEmail: auth().currentUser?.email,
                    userFirstName: myState.userFirstName,
                    userLastName: myState.userLastName
                }).then(() => {
                    console.log(comment, " added")
                    setComment('')
                    showToast('success', 'Successful', `Comment shared on ${selectedCoin.name} `)
                })
        } else {
            showToast('info', 'Write something', `Please fill the comment area before you send `)
        }

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

    const ShowCommentAndFavoritedCount = () => (
        <View style={styles.upperTitles}>
            <Text style={styles.largeTitle}>Comments</Text>
            {
                favoritedCount !== 0 && <View style={styles.upperTitles}>
                    <Icon name="heart" color='red' size={20} />
                    <Text>{favoritedCount}</Text>
                    {
                        (typeof comments !== 'undefined' && comments.length != 0) &&
                        <View style={{ ...styles.upperTitles, marginHorizontal: 5 }}>
                            <Icon name="chatbubble-outline" color='black' size={18} />
                            <Text>{comments.length}</Text></View>
                    }
                </View>
            }
        </View>
    )



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

                    <ShowCommentAndFavoritedCount />

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
                                            <Text>{comment.userFirstName} {comment.userLastName} </Text>
                                        </View>

                                        <Text>{moment(comment.commentDate).fromNow()}</Text>


                                    </View>
                                    <View style={styles.divider} />
                                </View>

                            )) :
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    source={require('../assets/loading.json')}
                                    autoPlay
                                    loop={true}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        marginBottom: 8,
                                    }}
                                    speed={0.5}
                                    onAnimationFinish={() => {
                                        //console.log('Animation Finished!')
                                        // this.props.navigation.replace('Home');
                                    }}
                                />
                            </View>
                    }
                    {
                        (typeof comments !== 'undefined' && comments.length == 0) &&
                        (<View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>There is no comment yet</Text>
                            <Text>Be the first!</Text>
                            <LottieView
                                source={require('../assets/rocket3.json')}
                                autoPlay
                                loop={true}
                                speed={1}
                                style={{
                                    width: 80,
                                    height: 80,
                                    marginBottom: 8,
                                }}
                                onAnimationFinish={() => {
                                    console.log('Animation Finished!')
                                    // this.props.navigation.replace('Home');
                                }}
                            />
                        </View>)
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