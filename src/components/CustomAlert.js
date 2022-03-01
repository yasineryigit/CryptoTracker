import React, { useState } from 'react';

import { Modal, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { theme } from '../core/theme'

export default function CustomAlert({
    displayMode,
    displayMsg,
    source,
    visibility,
    buttonVisibility,
    dismissAlert,
    onOkButtonClick
}) {
    return (
        <View>
            <Modal
                visible={visibility}
                animationType={'fade'}
                transparent={true}
                animationType="slide">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View
                        style={{
                            alignItems: 'center',
                            backgroundColor: 'white',
                            height: 200,
                            width: '90%',
                            borderWidth: 1,
                            borderColor: '#fff',
                            borderRadius: 7,
                            elevation: 10,
                        }}>
                        <View style={{ alignItems: 'center', margin: 10 }}>
                            {displayMode == 'success' ? (
                                <>
                                    <LottieView
                                        source={source}
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
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="cancel" color={'red'} size={80} />
                                </>
                            )}
                            <Text style={{ fontSize: 18, marginTop: 5 }}>{displayMsg}</Text>
                        </View>

                        {
                            buttonVisibility &&
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={()=>{
                                    dismissAlert(false)
                                    onOkButtonClick()
                                }}
                                style={{
                                    width: '95%',
                                    borderRadius: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'absolute',
                                    backgroundColor: theme.colors.primary,
                                    borderColor: '#ddd',
                                    borderBottomWidth: 0,
                                    borderRadius: 5,
                                    bottom: 0,
                                    marginBottom: 10,
                                    
                                }}>
                                <Text style={{ color: 'white', margin: 15 }}>OK</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </Modal>
        </View>
    );
}