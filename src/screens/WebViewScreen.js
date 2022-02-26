import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

export default function WebViewScreen(props) {
    const selectedNewsUrl = props.route.params.selectedNewsUrl;

    useEffect(() => {
        console.log("coming selectedNewsUrl:", selectedNewsUrl);

    }, [])

    return (
        <WebView source={{ uri: selectedNewsUrl }} />
    );
}
