import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./components/NavBar.jsx";
import LogoMode from "./components/LogoMode";
import ClassicMode from "./components/ClassicMode";
import ChartMode from "./components/ChartMode";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HigherLower from "./components/HigherLower.jsx";

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [crypto, setCrypto] = useState(null);

  useEffect(() => {
    const storedCryptos = localStorage.getItem("cryptos");
    /*if (storedCryptos) {
      const parsedCryptos = JSON.parse(storedCryptos);
      setCryptos(parsedCryptos);
      const randomCrypto =
        parsedCryptos[Math.floor(Math.random() * parsedCryptos.length)];
      setCrypto(randomCrypto);
    } else {
      */axios
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
            current_price: coin.current_price, 
            market_cap: coin.market_cap, 
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
    //}
  }, []);


  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/Logo"
            element={<LogoMode crypto={crypto} cryptos={cryptos} />}
          />
          <Route
          path="/Classic"
          element={<ClassicMode crypto={crypto} cryptos={cryptos} />}
          />
          <Route
          path="/Chart"
          element={<ChartMode crypto={crypto} cryptos={cryptos} />}
          />
          <Route
          path="/HigherLower"
          element={<HigherLower crypto={crypto} cryptos={cryptos} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
