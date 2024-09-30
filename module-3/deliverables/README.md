# 🏗 Althemy dApp

This repository contains a dApp that mimic the functionality of a forgery. There are few rules in this dApp:

- Iron, Copper and Silver are the only materials that can be used to create a forgery.
- Gold can be forged by burning Iron and Copper
- Platinum can be forged by burning Copper and Silver
- Palladium can be forger by burning Iron and Silver
- Rhodium can be forged by burning Iron, Copper and Silver
- Gold Platinum, Palladium and Rhodium cannot be forged into another
- Everything can be traded to Iron, Copper and Silver

There is a cool down of 1 minute between each forging.

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

1. Install the dependencies

```
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.
