import React from 'react';
import { View, StyleSheet } from 'react-native';
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



export function DrawerContent(props) {

    const paperTheme = useTheme();
    const myState = useSelector(state => state)



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
                            onPress={() => {  }}
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
                            onPress={() => { }}
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
                            onPress={() => {  }}
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
                            onPress={() => {  }}
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
                            onPress={() => { }}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Agreement">
                        <TouchableRipple onPress={() => { }}>
                            <View style={styles.preference}>
                                <Text>Privacy Policy</Text>
                            </View>
                        </TouchableRipple>
                        <TouchableRipple onPress={() => { }}>
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