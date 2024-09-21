// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    address public staker;

    constructor() ERC20("ERC20Token", "TKN") Ownable(msg.sender) {}

    function setStaker(address _staker) external onlyOwner {
        require(_staker != address(0), "Staker cannot be the zero address");
        staker = _staker;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == staker, "Only the staker can mint this token");
        _mint(_to, _amount);
    }
}
