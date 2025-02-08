// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts-08/token/ERC20/IERC20.sol";
import "openzeppelin-contracts-08/token/ERC20/ERC20.sol";
import "openzeppelin-contracts-08/access/Ownable.sol";

// Original DexTwo contract that we're attacking
contract DexTwo is Ownable {
    address public token1;
    address public token2;

    constructor() {}

    function setTokens(address _token1, address _token2) public onlyOwner {
        token1 = _token1;
        token2 = _token2;
    }

    function add_liquidity(address token_address, uint256 amount) public onlyOwner {
        IERC20(token_address).transferFrom(msg.sender, address(this), amount);
    }

    function swap(address from, address to, uint256 amount) public {
        require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
        uint256 swapAmount = getSwapAmount(from, to, amount);
        IERC20(from).transferFrom(msg.sender, address(this), amount);
        IERC20(to).approve(address(this), swapAmount);
        IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
    }

    function getSwapAmount(address from, address to, uint256 amount) public view returns (uint256) {
        return ((amount * IERC20(to).balanceOf(address(this))) / IERC20(from).balanceOf(address(this)));
    }

    function approve(address spender, uint256 amount) public {
        SwappableTokenTwo(token1).approve(msg.sender, spender, amount);
        SwappableTokenTwo(token2).approve(msg.sender, spender, amount);
    }

    function balanceOf(address token, address account) public view returns (uint256) {
        return IERC20(token).balanceOf(account);
    }
}

// Original token contract used by DexTwo
contract SwappableTokenTwo is ERC20 {
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

// Our attack contract - the vulnerability in DexTwo exists because:
// 1. It doesn't validate which tokens can be swapped (no checks on token1/token2)
// 2. Price calculation in getSwapAmount uses relative balance:
//    swapAmount = (amount * TO_TOKEN.balanceOf(dex)) / FROM_TOKEN.balanceOf(dex)
//
// The attack works because:
// 1. We create this simple token
// 2. Transfer just 1 token to DexTwo
// 3. When we swap 1 of our token for token1:
//    swapAmount = (1 * 100) / 1 = 100
//    - amount = 1 (we're swapping 1 AttackToken)
//    - TO_TOKEN.balanceOf(dex) = 100 (token1's balance)
//    - FROM_TOKEN.balanceOf(dex) = 1 (our token's balance)
//    This drains their entire token1 balance!
// 4. Same works for token2
contract AttackToken is ERC20 {
    constructor() ERC20("Attack Token", "ATK") {
        _mint(msg.sender, 1000);
    }
}
