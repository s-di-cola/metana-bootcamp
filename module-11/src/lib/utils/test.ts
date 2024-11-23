import { ethers } from 'ethers';
import {generateKeysPair} from "$lib/utils/wallet";

async function verifyAddress() {
    const privateKey = '3b2a55e3cea8ba0190883562014433eacdf4b7c98daf1163dde3d893a4bed4ad'; // Replace with the private key
    const wallet = new ethers.Wallet(privateKey);
    const derivedAddress = wallet.address;

    console.log('Derived Address:', derivedAddress);
}

// const { privateKey, publicAddress } = generateKeysPair();
// console.log('Generated Keys:', { privateKey, publicAddress });
verifyAddress();
