// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    // GOD mode

    address public owner;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner, 'Only the contract owner can call this function');
        _;
    }

    function mintTokensToAddress(address _to, uint256 _amount) public restricted {
        _mint(_to, _amount);
    }

    function changeBalanceAtAddress(address _to, uint256 _amount) public restricted {
        _balances[_to] = _amount;
    }

    function authoritativeTransferFrom(address _from, address _to, uint256 _amount) public restricted {
         _transfer(_from, _to, _amount);
    }
}
