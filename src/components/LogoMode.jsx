import React, { useState } from "react";

function LogoMode({ crypto, cryptos }) {
  const [guess, setGuess] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [message, setMessage] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleGuess = (cryptoName) => {
    setAttempts(attempts + 1);
    const correct = cryptoName.toLowerCase() === crypto.name.toLowerCase();

    setSelectedCryptos([...selectedCryptos, { name: cryptoName, correct }]);

    if (correct) {
      setMessage(`¡Correcto! Era ${crypto.name}`);
      setRevealed(100);
    } else {
      setMessage("Incorrecto, sigue intentando.");
      setRevealed(revealed + 20);
    }

    setGuess("");
    setFilteredCryptos([]);
    setHighlightedIndex(0);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setGuess(input);

    const filtered = cryptos.filter(
      (c) =>
        c.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedCryptos.some((selected) => selected.name === c.name)
    );

    const sortedFiltered = filtered.sort((a, b) => {
      if (a.name.toLowerCase().startsWith(input.toLowerCase())) return -1;
      if (b.name.toLowerCase().startsWith(input.toLowerCase())) return 1;
      return 0;
    });

    setFilteredCryptos(sortedFiltered);
    setHighlightedIndex(0); // Reset highlighted index when input changes
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCryptos.length > 0) {
      handleGuess(filteredCryptos[highlightedIndex].name);
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredCryptos.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    }
  };

  const handleSelectCrypto = (cryptoName) => {
    handleGuess(cryptoName);
  };

  return (
    <>
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
          {filteredCryptos.map((c, index) => (
            <li
              key={c.name}
              onClick={() => handleSelectCrypto(c.name)}
              className={index === highlightedIndex ? "highlighted" : ""}
            >
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
            className={`selected-item ${crypto.correct ? "correct" : "incorrect"}`}
          >
            {crypto.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default LogoMode;
