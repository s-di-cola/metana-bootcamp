# Metana-bootcamp

#### Installation

Node.js and npm are required to run the project. To install the project, run the following command:

```
npm install

```

### Module 1: ERC20 Token


This module is about creating an ERC20 token. The ERC20 token is a standard interface for fungible tokens. The interface is defined in the ERC20.sol file. The token is created in the ERC20Token.sol file.

It leverages the OpenZeppelin library, which is a library for secure smart contract development. The library provides secure and community-vetted code for the Ethereum ecosystem.
### Module 2: ERC721 Token

This module is about creating an ERC721 token. The ERC721 token is a standard interface for non-fungible tokens.
The deliverable for this module are listed below:

 - **1_metana_opensea.sol**: a smart contract that mints an ERC721 token and lists it on OpenSea. 
It is deployed to the Sepolia testnet at this [address](https://sepolia.etherscan.io/address/0x18250e558872c6c15ce9855f3133f98566b80165).
The collection can be seen on OpenSea [here](https://testnets.opensea.io/collection/metanaopensea-1).

 - **2_payable_nft**: a smart contract that can be minted with an ERC20 token (reuses the ERC20 token from module 1).
 - **3_staking_nft**: a smart contract that stakes an ERC721 token and mints 10 ERC20 token as a reward every 24 hours per staked NFT.
