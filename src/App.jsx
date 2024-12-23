import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoMode from "./components/LogoMode";
import "./App.css";

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [crypto, setCrypto] = useState(null);

  useEffect(() => {
    const storedCryptos = localStorage.getItem("cryptos");
    if (storedCryptos) {
      const parsedCryptos = JSON.parse(storedCryptos);
      setCryptos(parsedCryptos);
      const randomCrypto =
        parsedCryptos[Math.floor(Math.random() * parsedCryptos.length)];
      setCrypto(randomCrypto);
    } else {
      axios
        .get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
          },
        })
        .then((response) => {
          const cryptoData = response.data.map((coin) => ({
            name: coin.name,
            image: coin.image,
          }));
          setCryptos(cryptoData);
          const randomCrypto =
            cryptoData[Math.floor(Math.random() * cryptoData.length)];
          setCrypto(randomCrypto);
          localStorage.setItem("cryptos", JSON.stringify(cryptoData));
        })
        .catch((error) =>
          console.error("Error fetching data from CoinGecko:", error)
        );
    }
  }, []);

  return (
    <div className="App">
      <LogoMode crypto={crypto} cryptos={cryptos} />
    </div>
  );
}

export default App;
