import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [crypto, setCrypto] = useState(null);
  const [guess, setGuess] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [message, setMessage] = useState('');
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    // Verificar si los datos ya están en localStorage
    const storedCryptos = localStorage.getItem('cryptos');
    
    if (storedCryptos) {
      // Si los datos están en localStorage, los usas
      const parsedCryptos = JSON.parse(storedCryptos);
      setCryptos(parsedCryptos);
      const randomCrypto = parsedCryptos[Math.floor(Math.random() * parsedCryptos.length)];
      setCrypto(randomCrypto);
    } else {
      // Si no, haces la petición a la API
      axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc', // Ordena por capitalización de mercado
          per_page: 50,  // Obtener las 50 principales
          page: 1,
        }
      })
      .then(response => {
        const cryptoData = response.data.map(coin => ({
          name: coin.name,
          image: coin.image,
        }));
        setCryptos(cryptoData);
        const randomCrypto = cryptoData[Math.floor(Math.random() * cryptoData.length)];
        setCrypto(randomCrypto);
        // Guardar los datos en localStorage para evitar multiples peticiones
        localStorage.setItem('cryptos', JSON.stringify(cryptoData));
      })
      .catch(error => console.error('Error fetching data from CoinGecko:', error));
    }
  }, []);

  const handleGuess = (cryptoName) => {
    setAttempts(attempts + 1);
    const correct = cryptoName.toLowerCase() === crypto.name.toLowerCase();

    setSelectedCryptos([ ...selectedCryptos, { name: cryptoName, correct } ]);

    if (correct) {
      setMessage(`¡Correcto! Era ${crypto.name}`);
      setRevealed(100);
    } else {
      setMessage('Incorrecto, sigue intentando.');
      setRevealed(revealed + 20);
    }

    setGuess('');
    setFilteredCryptos([]);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setGuess(input);

    const filtered = cryptos.filter((c) =>
      c.name.toLowerCase().includes(input.toLowerCase()) &&
      !selectedCryptos.some((selected) => selected.name === c.name)
    );

    const sortedFiltered = filtered.sort((a, b) => {
      if (a.name.toLowerCase().startsWith(input.toLowerCase())) return -1;
      if (b.name.toLowerCase().startsWith(input.toLowerCase())) return 1;
      return 0;
    });

    setFilteredCryptos(sortedFiltered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredCryptos.length > 0) {
      handleGuess(filteredCryptos[0].name);
    }
  };

  const handleSelectCrypto = (cryptoName) => {
    handleGuess(cryptoName);
  };

  return (
    <div className="App">
      <div>
        <h1>Adivina la Crypto</h1>
        {crypto && (
          <div className="logo-container">
            <img
              src={crypto.image}
              alt="Crypto Logo"
              className="crypto-logo"
              style={{ filter: `blur(${10 - revealed / 10}px)` }}
            />
          </div>
        )}
      </div>
      <input
        type="text"
        value={guess}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu respuesta"
      />
      {filteredCryptos.length > 0 && (
        <ul className="dropdown">
          {filteredCryptos.map((c) => (
            <li key={c.name} onClick={() => handleSelectCrypto(c.name)}>
              {c.name}
            </li>
          ))}
        </ul>
      )}
      <p>{message}</p>
      <div className="selected-list">
        {selectedCryptos.map((crypto) => (
          <div
            key={crypto.name}
            className={`selected-item ${crypto.correct ? 'correct' : 'incorrect'}`}
          >
            {crypto.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
