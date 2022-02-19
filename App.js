import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function App() {


  var ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
  const [coins, setCoins] = useState([])

  useEffect(() => {

    ws.onopen = () => {

    };
    ws.onmessage = (e) => {
      console.log("incoming data:", JSON.parse(e.data))
      //gelen datalardan sadece usdt pariteli olanları al | filter

      
      const coins = JSON.parse(e.data)
      let coinsWithUsdtParity = coins.filter(coin => coin.s.includes("USDT")).sort();
      console.log("filtered array:", coinsWithUsdtParity)
      setCoins(coinsWithUsdtParity);
    };
    ws.onerror = (e) => {
      console.log(`Error: ${e.message}`);
    };
    ws.onclose = (e) => {
      console.log("Closed:", e.code, e.reason);
      ws.close();
    };

  }, [])


  return (
    <ScrollView>
      <Text>
        crypto tracker
      </Text>
      {
        coins.map((coin) => (
          <Text key={coin.s}>{coin.s} : {coin.c}</Text>
        )
        )
      }
    </ScrollView>
  );
}
