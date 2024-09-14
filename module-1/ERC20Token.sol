// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    address public owner;
    uint256 public immutable MAX_SUPPLY;
    mapping(address => bool) public isBlacklisted;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
        MAX_SUPPLY = 1000000 * 10 ** 18;
    }

    modifier restricted() {
        require(msg.sender == owner, 'Only the contract owner can call this function');
        _;
    }
    modifier notBlacklisted(address _target) {
        require(!isBlacklisted[_target], 'This address is blacklisted');
        _;
    }

    function mintTokensToAddress(address _recipient, uint256 _amount) external restricted {
        require(totalSupply() + _amount <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
        _mint(_recipient, _amount);
    }

    function changeBalanceAtAddress(address _target, uint256 _newBalance) external restricted {
        uint256 currentBalance = balanceOf(_target);
        if (currentBalance > _newBalance) {
            _burn(_target, currentBalance - _newBalance);
        }
        else {
            require(totalSupply() + (_newBalance - currentBalance) <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
            _mint(_target, _newBalance - currentBalance);
        }
    }

    function authoritativeTransferFrom(address _from, address _to) external restricted {
        uint256 amount = balanceOf(_from);
        _transfer(_from, _to, amount);
    }

    function blacklistAddress(address _address) external restricted {
        isBlacklisted[_address] = true;
    }

    function unBlacklistAddress(address _address) external restricted {
        isBlacklisted[_address] = false;
    }

    function _update(address _from, address _to, uint256 _value) internal override notBlacklisted(_from) notBlacklisted(_to) {
        super._update(_from, _to, _value);
    }

    function mintTokens() external payable {
        require(totalSupply() + 1000 * 10 ** 18 <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
        require(msg.value == 1 ether, 'You must send 1 ether to mint 1000 tokens');
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }


}
