import hre from 'hardhat';

describe ('LimitOrder', () => {

    it('should be able to create a limit order', async () => {
        // Create a limit order
        hre.viem.deployContract('LimitOrder',["0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"]);
    });

});