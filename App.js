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

        setMyMap(new Map(myMap.set(response.s.toLowerCase(), response.p)))


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

  useEffect(() => {

    for (let [key, value] of myMap) {
      console.log(key + " - " + value);
    }
  }, [myMap])


  return (
    <ScrollView>
      <Text style={{ fontSize: 25, marginVertical: 20 , marginLeft:5}}>
        Crypto Tracker
      </Text>

      <View>
        {
          [...myMap].map((entry) => {
            let key = entry[0]
            let value = entry[1]
            return <Text style={{fontWeight:'bold', fontSize:25}} key={key}> {key.toUpperCase()} :  {value}</Text>
          })
        }
      </View>

    </ScrollView>
  );
}
