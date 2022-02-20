import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function App() {


  const [coins, setCoins] = useState(['btcusdt', 'ethusdt', 'shibusdt'])
  const [myMap, setMyMap] = useState(new Map()); //declaring and 

  useEffect(() => {


    coins.forEach((coin) => {

      console.log("Arama yapılacak coin:", coin)
      var ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}@trade`);

      ws.onopen = () => {

      };

      ws.onmessage = (e) => {
        console.log("incoming data:", JSON.parse(e.data))

        const response = JSON.parse(e.data)

        setMyMap(myMap.set(response.s.toLowerCase(), response.p))


        for (let [key, value] of myMap) {
          console.log(key + " - " + value);
        }

      };

      ws.onerror = (e) => {
        console.log(`Error: ${e.message}`);
      };
      ws.onclose = (e) => {
        console.log("Closed:", e.code, e.reason);
        ws.close();
      };

    })



  }, [])


  return (
    <ScrollView>
      <Text>
        crypto tracker
      </Text>
      
      <View>
        {[...myMap.keys()].map(k => (
          <Text key={k}>myMap.get(k)</Text>
        ))}
      </View>

    </ScrollView>
  );
}
