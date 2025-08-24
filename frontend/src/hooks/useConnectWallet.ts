import { ethers } from "ethers";
import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useConnectWallet = () => {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return { connect, address };
};
