import React, { useState } from "react";
import "./ClassicMode.css";

function ClassicMode({ crypto, cryptos }) {
  const [guess, setGuess] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [message, setMessage] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleInputChange = (e) => {
    if (isCorrect) return;
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
    setHighlightedIndex(0);
  };

  const handleSelectCrypto = (cryptoName) => {
    if (isCorrect) return;
    const selectedCrypto = cryptos.find((c) => c.name === cryptoName);

    if (selectedCrypto) {
      const updatedCryptos = [selectedCrypto, ...selectedCryptos];
      setSelectedCryptos(updatedCryptos);

      if (selectedCrypto.name === crypto.name) {
        setMessage(`¡Correcto! Era ${crypto.name}`);
        setIsCorrect(true);
      } else {
        setMessage("Incorrecto, sigue intentando.");
      }
    }

    setGuess("");
    setFilteredCryptos([]);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (filteredCryptos.length === 0 || isCorrect) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        prev < filteredCryptos.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      handleSelectCrypto(filteredCryptos[highlightedIndex].name);
    }
  };

  return (
    <div>
      <h2>Selecciona una Criptomoneda</h2>

      <input
        type="text"
        value={guess}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Maneja las teclas
        placeholder="Escribe el nombre de una moneda"
        disabled={isCorrect}
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
        {selectedCryptos.map((selectedCrypto, index) => (
          <div
            key={index}
            className={`crypto-item ${
              selectedCrypto.name === crypto.name ? "correct" : ""
            }`}
          >
            <div className="crypto-info">
              <img src={selectedCrypto.image} alt={selectedCrypto.name} />
              <h4>{selectedCrypto.name}</h4>
            </div>

            <div className="stat-box">
              <div>
                <p>Valor</p>
                <p>${selectedCrypto.current_price.toLocaleString("es-AR")}</p>
              </div>

              <span
                className={`arrow ${
                  selectedCrypto.current_price < crypto.current_price
                    ? "up"
                    : "down"
                }`}
              >
                {selectedCrypto.current_price < crypto.current_price
                  ? "↑"
                  : "↓"}
              </span>
            </div>

            <div className="stat-box">
              <div>
                <p>Capitalización</p>
                <p>${selectedCrypto.market_cap.toLocaleString("es-AR")}</p>
              </div>

              <span
                className={`arrow ${
                  selectedCrypto.market_cap < crypto.market_cap ? "up" : "down"
                }`}
              >
                {selectedCrypto.market_cap < crypto.market_cap ? "↑" : "↓"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassicMode;
