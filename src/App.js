import { useState } from 'react';
import { Route } from "wouter";

import Navbar from "./components/layout/Navbar";
import Landing from "./views/Landing";
import Marketplace from './views/Marketplace';
import Page from './components/three/Page';
import Game from './components/three/Game';
import './App.css';
import { Character } from "./components/three/Character";
import Site from "./components/three/Site";

const pixis = {
  1103970: "images/pixis/blue.png",
  416430: "images/pixis/green.png",
  310452: "images/pixis/oracle.png",
  327482: "images/pixis/pink.png",
  325185: "images/pixis/red.png",
  358574: "images/pixis/yellow.png",
  227675: "images/pixis/blue.png",
  911738: "images/pixis/green.png",
  1738986: "images/pixis/pink.png"
}
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
          <Marketplace contractNFT={contractNFT} />
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
      <Page
          title="Pixi Land"
          items={[
            [
              "The pixis live in the forest...",
              "...and they are always on the move!"
            ],
            [
              <Character image="img/nft/blue.png" />,
              <Character image="img/nft/blue.png" hp={30} />,
              <Character image="img/nft/green.png" />
            ],
            [
              <Character image="img/nft/pink.png" />,
              <Character image="img/nft/red.png" />,
              <Character image="img/nft/yellow.png" />
            ],
            [
              "There are even special pixis...",
              "...with magical powers!"
            ],
            <Character image="img/nft/oracle.png" hp={100} />,

          ]}
        />
      </Route>
    </>
  );
}

export default App;
