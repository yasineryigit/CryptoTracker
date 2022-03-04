import axios from "axios";


export const getAllCoins = () => {//fonksiyona erişilebilirlik için export ediyoruz
    return axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=true&price_change_percentage=7d')
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
                apiKey: 'd330ab2fa05a40afb6c2f9f13c9360cf'
            }
        })
}

export const searchNewsOnBing = async (q, lang, market, count) => {

    q = encodeURIComponent(q);
    const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?freshness=Day&sortBy=Date&textFormat=Raw&safeSearch=Strict&q=${q}&count=${count}&setLang=${lang}&mkt=${market}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
            "x-rapidapi-key": "03d6e6a1c4msh5d2ef6430d83b4cp1281eejsn794a90bd3904",
            "x-bingapis-sdk": "true"
        }
    });
    const body = await response.json();
    return body.value;
}


