import axios from "axios";


export const getAllCoins = () => {//fonksiyona erişilebilirlik için export ediyoruz
    return axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=7d')
}

export const getCoin = (id) => {//fonksiyona erişilebilirlik için export ediyoruz
    return axios.get('https://api.coingecko.com/api/v3/coins/' + id)
}

export const getNewsByName = name => {
    return axios.get('https://newsapi.org/v2/everything',
        {
            params: {
                q: name,
                sortBy: 'publishedAt',
                language: 'en',
                apiKey: 'ddc5379d1c5b452e8f7b9f55a3b76cda'
            }
        })
}


