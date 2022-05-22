import React, { useFocusEffect, useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import InAppReview from 'react-native-in-app-review';
import { openComposer } from "react-native-email-link";
import Share from 'react-native-share';


export function DrawerContent(props) {

    const paperTheme = useTheme();
    const myState = useSelector(state => state)

    useEffect(() => {
        if (InAppReview.isAvailable()) {
            console.log("inapp review available")
        }
    }, [])


    const myCustomShare = async () => {
        const shareOptions = {
            message: 'For Best Cryptocurrency Apps, follow:\n',
            url: 'https://play.google.com/store/apps/developer?id=ossovita'
        }

        try {
            const shareResponse = await Share.open(shareOptions)
        } catch (e) {
            console.log("error:", e)
        }
    }


    const openInAppReview = () => {
        InAppReview.RequestInAppReview()
            .then((hasFlowFinishedSuccessfully) => {
                // when return true in android it means user finished or close review flow
                console.log('InAppReview in android', hasFlowFinishedSuccessfully);

                // when return true in ios it means review flow lanuched to user.
                console.log(
                    'InAppReview in ios has launched successfully',
                    hasFlowFinishedSuccessfully,
                );

                // 1- you have option to do something ex: (navigate Home page) (in android).
                // 2- you have option to do something,
                // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

                // 3- another option:
                if (hasFlowFinishedSuccessfully) {
                    // do something for ios
                    // do something for android
                }

                // for android:
                // The flow has finished. The API does not indicate whether the user
                // reviewed or not, or even whether the review dialog was shown. Thus, no
                // matter the result, we continue our app flow.

                // for ios
                // the flow lanuched successfully, The API does not indicate whether the user
                // reviewed or not, or he/she closed flow yet as android, Thus, no
                // matter the result, we continue our app flow.
            })
            .catch((error) => {
                //we continue our app flow.
                // we have some error could happen while lanuching InAppReview,
                // Check table for errors and code number that can return in catch.
                console.log(error);
            });
    }

    const openWebUrl = async (url) => {

        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);

    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={{
                                    uri: `${myState.userProfileImage}`
                                }}
                                size={50}
                            />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={styles.title}>{myState.userFirstName} {myState.userLastName}</Title>
                                <Caption style={styles.caption}>{auth().currentUser?.email}</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => { }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="mail-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Contact Us"
                            onPress={() => {
                                openComposer({
                                    to: "vuemedya@gmail.com",
                                    subject: "I have a question",
                                    body: "Hi, can you help me with...",
                                });
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="star-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Rate This App"
                            onPress={() => { openInAppReview() }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="send-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Feedback"
                            onPress={() => {
                                openComposer({
                                    to: "vuemedya@gmail.com",
                                    subject: "I have a question",
                                    body: "Hi, can you help me with...",
                                });
                            }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="share-social-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Share"
                            onPress={() => { myCustomShare() }}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Agreement">
                        <TouchableRipple onPress={() => { openWebUrl("https://ossovita.blogspot.com/2022/03/crypto-tracker-privacy-policy.html") }}>
                            <View style={styles.preference}>
                                <Text>Privacy Policy</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => { openWebUrl("https://ossovita.blogspot.com/2022/03/crypto-tracker-terms-conditions.html") }}>
                            <View style={styles.preference}>
                                <Text>Terms & Conditions</Text>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});