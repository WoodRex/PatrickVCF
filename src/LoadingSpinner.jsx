import React from "react";
import styled, { keyframes } from 'styled-components';

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

const SpinnerAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const Spinner = styled.div`
  width: 200px;
  height: 200px;
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid #999; 
  border-radius: 50%;
  animation: ${SpinnerAnimation} 1.5s linear infinite;
`
const Container = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export default function LoadingSpinner() {
  return (
    <Container>
      <Spinner />
    </Container>
  );
}