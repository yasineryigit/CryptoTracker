import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function App() {


  const [symbols, setSymbols] = useState(['btcusdt', 'ethusdt', 'shibusdt'])
  const [coinDatas, setCoinDatas] = useState([]);


  useEffect(() => {


    symbols.forEach((symbol) => {

      console.log("Arama yapılacak coin:", symbol)
      var ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

      ws.onopen = () => {
        console.log("websocket'e bağlantı açıldı: ", symbol)
      };

      ws.onmessage = (e) => {
        console.log("incoming data:", JSON.parse(e.data))

        const response = JSON.parse(e.data)
        found = false
        coinDatas.forEach((coinData) => {
          console.log("we are inside foreach")
          if (coinData.s === response.s) {//eldeki coinDatas listesine daha önce eklenmişse fiyatı güncelle
            found = true
            console.log("daha önce eklenmiş")
            coinDatas.filter(item => item.s !== coinData.s)//bulunan objeyi çıkar 
            setCoinDatas(prevCoinDatas => [...prevCoinDatas, response])//yerine gelen objeyi ekle
          }
        })
        if (!found) {//eldeki coinDatas listesine daha önce eklenmemişse
          console.log("daha önce eklenmemiş")
          setCoinDatas(prevCoinDatas => [...prevCoinDatas, response])//yerine gelen objeyi ekle
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
