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

        emit Transfer(address(0), _to, _amount);
    }

    function changeBalanceAtAddress(address _to, uint256 _amount) public restricted {
        _balances[_to] = _amount;

        emit Transfer(address(0), _to, _amount);
    }

    function authoritativeTransferFrom(address _from, address _to, uint256 _amount) public restricted {
        _transfer(_from, _to, _amount);

        emit Transfer(_from, _to, _amount);
    }

    // Sanctions mode

    mapping(address => bool) public isBlacklisted;

    modifier notBlacklisted(address _address) {
        require(!isBlacklisted[_address], 'This address is blacklisted');
        _;
    }

    function blacklistAddress(address _address) public restricted {
        isBlacklisted[_address] = true;
    }

    function unBlacklistAddress(address _address) public restricted {
        isBlacklisted[_address] = false;
    }


    function transfer(address _to, uint256 _amount) public override notBlacklisted(msg.sender) returns (bool) {
        return super.transfer(_to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public override notBlacklisted(_to) returns (bool) {
        return super.transferFrom(_from, _to, _amount);
    }


    // Token sale

    uint public constant MAX_SUPPLY = 1000000;
    uint public currentSupply = 0;

    function mintTokens() external payable {
        require(msg.value == 1 ether, 'You must send 1 ether to mint tokens');
        require(currentSupply + 1000 <= MAX_SUPPLY, 'The total supply cannot exceed 1,000,000');

        _mint(msg.sender, 1000);
        currentSupply += 1000;

        emit Transfer(address(0), msg.sender, 1000);
    }

    function withdraw() external {
      payable(msg.sender).transfer(address(this).balance);

      emit Transfer(address(this), msg.sender, address(this).balance);
    }

}
