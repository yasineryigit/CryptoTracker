import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function App() {


  var coins = { btcusdt: 0, ethusdt: 0, shibusdt: 0 };

  useEffect(() => {

    for (var key in coins) {
      console.log("key " + key + " has value " + coins[key]);

      var ws = new WebSocket(`wss://stream.binance.com:9443/ws/${key}@trade`);

      ws.onopen = () => {

      };

      ws.onmessage = (e) => {
        console.log("incoming data:", JSON.parse(e.data))

        const response = JSON.parse(e.data)

        coins[response.s.toLowerCase()] = response.p

        console.log("izleme listem:", coins)

      };

      ws.onerror = (e) => {
        console.log(`Error: ${e.message}`);
      };
      ws.onclose = (e) => {
        console.log("Closed:", e.code, e.reason);
        ws.close();
      };
    }
  }, [])


  return (
    <ScrollView>
      <Text>
        crypto tracker
      </Text>
      <Text>{coins[0]}</Text>


    </ScrollView>
  );
}
