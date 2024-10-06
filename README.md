# Metana-bootcamp

#### Installation

Node.js and npm are required to run the project. To install the project, run the following command:

```
npm install

```

### Module 1: ERC20 Token

This module is about creating an ERC20 token. The ERC20 token is a standard interface for fungible tokens. The interface
is defined in the ERC20.sol file. The token is created in the ERC20Token.sol file.

It leverages the OpenZeppelin library, which is a library for secure smart contract development. The library provides
secure and community-vetted code for the Ethereum ecosystem.

### Module 2: ERC721 Token

This module is about creating an ERC721 token. The ERC721 token is a standard interface for non-fungible tokens.
The deliverable for this module are listed below:

- **1_metana_opensea.sol**: a smart contract that mints up to 10 ERC721 tokens and enables their listing on OpenSea
  testnet.
  The contract is deployed on the Sepolia testnet at
  this [address](https://sepolia.etherscan.io/address/0x18250e558872c6c15ce9855f3133f98566b80165).
  You can view the collection on OpenSea [here](https://testnets.opensea.io/collection/metanaopensea-1).
  The contract allows anyone to mint tokens for free, eliminating the need for a withdrawal function.
  After minting, tokens can be sold on OpenSea, with proceeds going directly to the token owners rather than the
  contract.


- **2_payable_nft**: A system of smart contracts that implements an NFT (ERC721 token) which can be minted by paying
  with a custom ERC20 token. The system consists of three main components:
    1. An ERC20 token contract (reused from module 1) that provides the currency for purchasing NFTs.
    2. An ERC721 contract (ERC721Exchange) that represents the NFTs and includes a minter role for controlled minting.
    3. A Minter contract that facilitates the exchange of ERC20 tokens for newly minted NFTs.

  The deployment process requires multiple steps due to contract interdependencies: first deploying the ERC20 and ERC721
  contracts, then the Minter contract, and finally setting the Minter as the authorized minter in the ERC721 contract.


- **3_staking_nft**: A system of smart contracts that implements NFT staking with ERC20 token rewards. The system
  consists of three main components:
    1. An ERC20 token contract that serves as the reward token and includes controlled minting capabilities.
    2. An ERC721 token contract representing the NFTs, which can be minted using the ERC20 tokens.
    3. A Staker contract that allows users to stake their NFTs, earn ERC20 rewards (10 tokens per 24 hours), and
       withdraw or transfer their staked NFTs at any time.

  The implementation ensures secure communication between contracts, handles decimals correctly in ERC20 transfers, and
  allows users to claim rewards without withdrawing their NFTs. The staking mechanism is time-based and prevents
  exploitation through re-staking. The system also supports the transfer of staked NFTs, maintaining the staking state
  and rewards.

### Module 3: Alchemy dApp

This module contains a dApp that mimics the functionality of a forgery. There are a few rules in this dApp:

- Iron, Copper, and Silver are the only materials that can be used to create a forgery.
- Gold can be forged by burning Iron and Copper.
- Platinum can be forged by burning Copper and Silver.
- Palladium can be forged by burning Iron and Silver.
- Rhodium can be forged by burning Iron, Copper, and Silver.
- Gold, Platinum, Palladium, and Rhodium cannot be forged into another.
- Everything can be traded for Iron, Copper, and Silver.
- There is a cooldown of 1 minute between each forging.

The application is available
at [https://alchemist-q6w3w3pyk-s-di-colas-projects.vercel.app/](https://alchemist-q6w3w3pyk-s-di-colas-projects.vercel.app/)
> **Warning:** The contract is deployed on holesky network
> at [https://holesky.etherscan.io/address/0x90B78FF67D038557B93aF531866e0Ff7FB7bC010](https://holesky.etherscan.io/address/0x90B78FF67D038557B93aF531866e0Ff7FB7bC010).
> Since holesky is not supported by OpenSea, the NFTs are not visible on OpenSea.

> **Note:** The dApp leverages scaffold-eth2, to run the dApp locally, follow the instructions below:
> 1. Install the dependencies
> 2. Run a local network in the first terminal with `yarn chain`
> 3. Deploy the test contract in the second terminal with `yarn deploy` (check the `hardhat.config.ts` file for the
     network configuration)
> 4. Start your NextJS app in the third terminal with `yarn start` (visit your app on `http://localhost:3000`)

### Module 4: Testing

This module contains tests for the ERC20 (sellBack functionality) and Forgery dApp. The tests are written using Hardhat
and viem. The tests can be run using the following command:

``` 
hardhat test
```

Coverage reports can be generated using the following command:

```
hardhat coverage
```

Whereas mutation tests can be run using the following command:

```
sumo test
```

The mutation test coverage shows a mutation score of 93% for the Forgery dApp. The coverage report can be found in the
`coverage` folder.

