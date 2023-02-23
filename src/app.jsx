import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { createGlobalStyle } from "styled-components";
import "./app.css";

export function App() {
  const [apiInfo, setApiInfo] = useState(null);
  const [ticket, setTicket] = useState(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!dataFetchedRef.current) {
      fetch("/api/v1/screener")
        .then((data) => data.json())
        .then((data) => setApiInfo(data))
      dataFetchedRef.current = true;
    }
  }, []);

  const colors = [
    '#16a085',
    '#27ae60',
    '#2c3e50',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#FB6964',
    '#342224',
    '#472E32',
    '#BDBB99',
    '#77B1A9',
    '#73A857'
  ];

  const GlobalStyle = createGlobalStyle`
    body {
      background-color: #DFDBE5;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'%3E%3Cpath fill='%2ffffff' fill-opacity='0.2' d='M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'%3E%3C/path%3E%3C/svg%3E");
      margin: 0;
      font-family: Montserrat, sans-serif;
      font-weight: 400;
      height: 100vh;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      transition: all .9s ease;
    }
  `

  return (
    <>
      <GlobalStyle />
      <div className="App">
        {!apiInfo && <LoadingSpinner />}
        {apiInfo && (
          <div className="stock-container" id="stock-container">
            <div className="stock-text">
              <span id="stock">{ticket?.name}</span>
            </div>

            {/* Price */}
            <div className="stock-price">
              <span id="buy">{ticket && ('Buy:')} {ticket?.buyPrice}</span>
              <br />
              <span id="sold">{ticket && ('Sold:')} {ticket?.soldPrice}</span>
              <br />
              <span id="cut">{ticket && ('Cut:')} {ticket?.cutOff}</span>
            </div>

            {/* Button */}
            <div className="button-container">
              <button id="new-stock" className="button" onClick={() => setTicket(apiInfo[Math.floor(Math.random() * apiInfo.length)])}>New Stock</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
