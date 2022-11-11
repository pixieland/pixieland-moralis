import { useState } from 'react';
import { Route } from "router";
import Navbar from "./components/layout/Navbar";
import Landing from "./views/Landing";
import Marketplace from './views/Marketplace';
import Page from './components/three/Page';
import Game from './components/three/Game';
import React from 'react';
import './App.css';
import Pixiland from './components/three/Pixiland'

function App() {
  const [ethaddress, setETHAddress] = useState("");
  const [ethProvider, setEthProvider] = useState(null);
  const [contractNFT, setContractNFT] = useState(null);

  return (
    <>
      <Route path="/marketplace">
        <>
        <Navbar
          ethaddress={ethaddress}
          setETHAddress={setETHAddress}
          setEthProvider={setEthProvider}
          setContractNFT={setContractNFT} />
          <Marketplace ethaddress={ethaddress} contractNFT={contractNFT} />
        </>
      </Route>
      <Route path="/">
        <>
        <Navbar
          ethaddress={ethaddress}
          setETHAddress={setETHAddress}
          setEthProvider={setEthProvider} />
          <Landing />
        </>
      </Route>
      <Route path="/game">
         <Pixiland />
      </Route>
    </>
  ); 
  
}


export default App;
