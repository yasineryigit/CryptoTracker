import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ListItem from './src/components/ListItem';

export default function App() {


  const [coins, setCoins] = useState([])


  useEffect(() => {


    var ws = new WebSocket(`wss://stream.binance.com:9443/ws/!miniTicker@arr`);

    ws.onopen = () => {

    };

    ws.onmessage = (e) => {
      console.log("incoming data:", JSON.parse(e.data))

      const response = JSON.parse(e.data)

      response.sort(function (a, b) {
        return a.s.localeCompare(b.s);
      });

      console.log("gelen response: ", response)
      setCoins(response)


    };

    ws.onerror = (e) => {
      console.log(`Error: ${e.message}`);
    };
    ws.onclose = (e) => {
      console.log("Closed:", e.code, e.reason);
      ws.close();
    };



  }, [])

  const ListHeader = () => (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.largeTitle}>Markets</Text>
      </View>
      <View style={styles.divider} />
    </>
  )


  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        keyExtractor={(item) => item.s}
        data={coins}
        renderItem={({ item }) => (
          <ListItem
            symbol={item.s}
            currentPrice={item.c}
          />
        )}
        ListHeaderComponent={<ListHeader />}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginHorizontal: 16,
    marginTop: 16,
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
});