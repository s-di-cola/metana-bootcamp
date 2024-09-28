// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./IAlchemyTokens.sol";


contract AlchemyTokens is IAlchemyTokens, ERC1155, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;

    EnumerableSet.UintSet private _restrictedTokens;

    uint256 public lastMinted;

    constructor() ERC1155 Ownable(msg.sender) {
        _restrictedTokens.add(uint256(Token.PLATINUM));
        _restrictedTokens.add(uint256(Token.PALLADIUM));
        _restrictedTokens.add(uint256(Token.RHODIUM));
    }

    modifier withCoolDown() {
        require(lastMinted + 1 minutes < block.timestamp, "You can mint only once in a minute");
        _;
    }

    function isRestricted(uint256 _id) public view returns (bool) {
        return _restrictedTokens.contains(_id);
    }

    function checkBalance(address _account, uint256[] memory _ids, uint256 _amount) private view {
        address[] memory accounts = new address[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            accounts[i] = _account;
        }
        uint256[] memory balances = balanceOfBatch(accounts, _ids);
        for (uint256 i = 0; i < _ids.length; i++) {
            require(balances[i] >= _amount, "Insufficient balance");
        }
    }

    function createAmountArray(uint256 _amount, uint256 _length) private pure returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](_length);
        for (uint256 i = 0; i < _length; i++) {
            amounts[i] = _amount;
        }
        return amounts;
    }

    function mintIron(address _account, uint256 _amount) external withCoolDown onlyOwner {
        _mint(_account, uint256(Token.IRON), _amount, "");
        lastMinted = block.timestamp;
    }

    function mintCopper(address _account, uint256 _amount) external withCoolDown onlyOwner {
        _mint(_account, uint256(Token.COPPER), _amount, "");
        lastMinted = block.timestamp;
    }

    function mintSilver(address _account, uint256 _amount) external withCoolDown onlyOwner {
        _mint(_account, uint256(Token.SILVER), _amount, "");
        lastMinted = block.timestamp;
    }

    function mintGold(address _account, uint256 _amount) external onlyOwner {
        uint256[] memory ids = new uint256[](2);
        ids[0] = uint256(Token.IRON);
        ids[1] = uint256(Token.COPPER);

        checkBalance(_account, ids, _amount);

        _mint(_account, uint256(Token.GOLD), _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintPlatinum(address _account, uint256 _amount) external onlyOwner {
        uint256[] memory ids = new uint256[](2);
        ids[0] = uint256(Token.COPPER);
        ids[1] = uint256(Token.SILVER);

        checkBalance(_account, ids, _amount);

        _mint(_account, uint256(Token.PLATINUM), _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintPalladium(address _account, uint256 _amount) external onlyOwner {
        uint256[] memory ids = new uint256[](2);
        ids[0] = uint256(Token.SILVER);
        ids[1] = uint256(Token.GOLD);

        checkBalance(_account, ids, _amount);

        _mint(_account, uint256(Token.PALLADIUM), _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintRhodium(address _account, uint256 _amount) external onlyOwner {
        uint256[] memory ids = new uint256[](3);
        ids[0] = uint256(Token.IRON);
        ids[1] = uint256(Token.COPPER);
        ids[2] = uint256(Token.SILVER);

        checkBalance(_account, ids, _amount);

        _mint(_account, uint256(Token.RHODIUM), _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 3));
    }

    function burn(address _account, uint256 _id, uint256 _amount) external onlyOwner {
        _burn(_account, _id, _amount);
    }
}
