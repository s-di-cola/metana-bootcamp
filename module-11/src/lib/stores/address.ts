import {writable} from "svelte/store";
import {browser} from "$app/environment";

type WalletAddress = {
    publicAddress: string;
    privateKey: string;
}

type AddressStore = {
    addresses: WalletAddress[];
    selectedIndex: number;
}

const initialStore: AddressStore = {
    addresses: [],
    selectedIndex: 0
}


const storeAddress = browser ? JSON.parse(localStorage.getItem('walletAddresses') || 'null') : null;
const addressStore = writable<AddressStore>(storeAddress || initialStore);

if (browser) {
    addressStore.subscribe(value => {
        localStorage.setItem('walletAddresses', JSON.stringify(value));
    });
}

export {addressStore}
