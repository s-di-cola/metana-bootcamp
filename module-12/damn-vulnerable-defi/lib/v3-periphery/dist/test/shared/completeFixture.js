"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const externalFixtures_1 = require("./externalFixtures");
const ethers_1 = require("ethers");
const completeFixture = async ([wallet], provider) => {
    const { weth9, factory, router } = await (0, externalFixtures_1.v3RouterFixture)([wallet], provider);
    const tokenFactory = await hardhat_1.ethers.getContractFactory('TestERC20');
    const tokens = [
        (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))), // do not use maxu256 to avoid overflowing
        (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
        (await tokenFactory.deploy(ethers_1.constants.MaxUint256.div(2))),
    ];
    const nftDescriptorLibraryFactory = await hardhat_1.ethers.getContractFactory('NFTDescriptor');
    const nftDescriptorLibrary = await nftDescriptorLibraryFactory.deploy();
    const positionDescriptorFactory = await hardhat_1.ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
        libraries: {
            NFTDescriptor: nftDescriptorLibrary.address,
        },
    });
    const nftDescriptor = (await positionDescriptorFactory.deploy(tokens[0].address, 
    // 'ETH' as a bytes32 string
    '0x4554480000000000000000000000000000000000000000000000000000000000'));
    const positionManagerFactory = await hardhat_1.ethers.getContractFactory('MockTimeNonfungiblePositionManager');
    const nft = (await positionManagerFactory.deploy(factory.address, weth9.address, nftDescriptor.address));
    tokens.sort((a, b) => (a.address.toLowerCase() < b.address.toLowerCase() ? -1 : 1));
    return {
        weth9,
        factory,
        router,
        tokens,
        nft,
        nftDescriptor,
    };
};
exports.default = completeFixture;
