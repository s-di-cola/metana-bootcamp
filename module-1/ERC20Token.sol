// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract ERC20Token is ERC20 {

    address public owner;
    int256 public immutable MAX_SUPPLY;
    mapping(address => bool) public isBlacklisted;
    using Address for address payable;
    using Math for uint256;

    event TokensSold(address indexed seller, uint256 amount, uint256 etherAmount);

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = msg.sender;
        MAX_SUPPLY = 1000000 * 10 ** decimals();
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
        _mint(_recipient, _amount);
    }

    function changeBalanceAtAddress(address _target, uint256 _newBalance) external restricted {
        uint256 currentBalance = balanceOf(_target);
        if (currentBalance > _newBalance) {
            _burn(_target, currentBalance - _newBalance);
        }
        else {
            _mint(_target, _newBalance - currentBalance);
        }
    }

    function authoritativeTransferFrom(address _from, address _to) external restricted {
        uint256 amount = balanceOf(_from);
        _transfer(_from, _to, amount);
    }

    function authoritativeTransferFrom(address _from, address _to, uint _amount) external restricted {
        _transfer(_from, _to, _amount);
    }


    function blacklistAddress(address _address) external restricted {
        isBlacklisted[_address] = true;
    }

    function unBlacklistAddress(address _address) external restricted {
        isBlacklisted[_address] = false;
    }

    function _update(address _from, address _to, uint256 _value) internal override notBlacklisted(_from) notBlacklisted(_to) {
        if (_from == address(0)) {
            require(totalSupply() + _value <= MAX_SUPPLY, 'Cannot mint more than the MAX_SUPPLY');
        }
        super._update(_from, _to, _value);
    }

    function mintTokens() external payable {
        require(msg.value == 1 ether, 'You must send 1 ether to mint 1000 tokens');
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function withdraw(uint _amount) external restricted {
        uint256 requiredReserve = (totalSupply() * 5 * 10 ** 17) / (10 ** 21);
        require(address(this).balance - _amount >= requiredReserve, 'Insufficient reserve for potential sellbacks');
        payable(owner).sendValue(_amount);
    }


    function sellBack(uint256 _amount) external notBlacklisted(msg.sender) {
        require(balanceOf(msg.sender) >= _amount, 'You do not have enough tokens to sell');

        // 1. (_amount * 5 * 10**17) calculates the total wei as if each token was worth 0.5 ether
        // 2. Dividing by (10**21) adjusts for both:
        //    a) The fact that we want 0.5 (5 * 10**-1) ether per 1000 tokens
        //    b) The 18 decimal places of ERC20 tokens (so divide by 10**18)
        //    Combined, this is a division by 10**3 * 10**18 = 10**21
        uint256 etherAmount = (_amount * 5 * 10 ** 17) / (10 ** 21);
        require(address(this).balance >= etherAmount, 'The contract does not have enough ether to pay you');

        bool isTransferSuccessful = transferFrom(msg.sender, address(this), _amount);
        require(isTransferSuccessful, 'Transfer to contract failed');

        payable(msg.sender).sendValue(etherAmount);
        emit TokensSold(msg.sender, _amount, etherAmount);
    }
}
