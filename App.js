import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function App() {


  const [symbols, setSymbols] = useState(['btcusdt', 'ethusdt', 'shibusdt'])
  const [coinDatas, setCoinDatas] = useState([]);


  useEffect(() => {

    symbols.forEach((symbol) => {//izleme listesindeki symbollerin her biri için obje oluşturup diziye atıyoruz
      body = {
        s: symbol,
        p: 0
      }
      setCoinDatas(oldArray => [...oldArray, body]);
    })

    symbols.forEach((symbol) => {

      console.log("Arama yapılacak coin:", symbol)
      var ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

      ws.onopen = () => {

      };

      ws.onmessage = (e) => {
        console.log("incoming data:", JSON.parse(e.data))

        const response = JSON.parse(e.data)

        setCoinDatas(prevCoinDatas => {
          added = false
          prevCoinDatas.forEach((prevCoinData) => {
            if (prevCoinData.s === response.s) {
              prevC
            }else{

            }
          })
          if (condition) {
            return {
              ...prevCoinDatas,
              todos: [...prevCoinDatas.todos, newObj]
            }
          } else {
            return prevCoinDatas
          }
        })


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

    console.log("coinDatas:", coinDatas)

  }, [coinDatas])

  return (
    <ScrollView>
      <Text>
        crypto tracker
      </Text>



    </ScrollView>
  );
}
