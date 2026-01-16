import React from 'react';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Mappage des crypto-monnaies avec leurs icônes
const cryptoIcons = {
  BITCOIN: <FontAwesome5 name="bitcoin" size={30} color="#F7931A" />,
  ETHEREUM: <MaterialCommunityIcons name="ethereum" size={30} color="#3C3C3D" />,
  CARDANO: <MaterialCommunityIcons name="currency-btc" size={30} color="#3D65A7" />,
  XRP: <MaterialIcons name="account-balance-wallet" size={30} color="#00A9D3" />,
  SOLANA: <FontAwesome5 name="circle" size={30} color="#00FF00" />,
  LITECOIN: <FontAwesome5 name="bitcoin" size={30} color="#B0B0B0" />,
  DOGECOIN: <FontAwesome5 name="dog" size={30} color="#BA9F77" />,
  AVALANCHE: <MaterialCommunityIcons name="weather-sunny" size={30} color="#E84142" />,
  RAVENCOIN: <MaterialCommunityIcons name="currency-usd" size={30} color="#4B4B4B" />,
  ATOM: <MaterialCommunityIcons name="atom" size={30} color="#000000" />,
};

export default cryptoIcons;
