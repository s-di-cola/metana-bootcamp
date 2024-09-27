// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Contract is ERC1155 {
    uint256 public constant IRON = 0;
    uint256 public constant COPPER = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant GOLD = 3;
    uint256 public constant PLATINUM = 4;
    uint256 public constant PALLADIUM = 5;
    uint256 public constant RHODIUM = 6;

    uint256 public lastMinted;

    constructor() ERC1155("https://change-me.com/{id}") {}

    modifier withCoolDown() {
        require(lastMinted + 1 minutes < block.timestamp, "You can mint only once in a minute");
        _;
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

    function mintIron(address _account, uint256 _amount) external withCoolDown {
        _mint(_account, IRON, _amount, "");
        lastMinted = block.timestamp;
    }

    function mintCopper(address _account, uint256 _amount) external withCoolDown {
        _mint(_account, COPPER, _amount, "");
        lastMinted = block.timestamp;
    }

    function mintSilver(address _account, uint256 _amount) external withCoolDown {
        _mint(_account, SILVER, _amount, "");
        lastMinted = block.timestamp;
    }

    function mintGold(address _account, uint256 _amount) external {
        uint256[] memory ids = new uint256[](2);
        ids[0] = IRON;
        ids[1] = COPPER;

        checkBalance(_account, ids, _amount);

        _mint(_account, GOLD, _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintPlatinum(address _account, uint256 _amount) external {
        uint256[] memory ids = new uint256[](2);
        ids[0] = COPPER;
        ids[1] = SILVER;

        checkBalance(_account, ids, _amount);

        _mint(_account, PLATINUM, _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintPalladium(address _account, uint256 _amount) external {
        uint256[] memory ids = new uint256[](2);
        ids[0] = SILVER;
        ids[1] = GOLD;

        checkBalance(_account, ids, _amount);

        _mint(_account, PALLADIUM, _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 2));
    }

    function mintRhodium(address _account, uint256 _amount) external {
        uint256[] memory ids = new uint256[](3);
        ids[0] = IRON;
        ids[1] = COPPER;
        ids[2] = SILVER;

        checkBalance(_account, ids, _amount);

        _mint(_account, RHODIUM, _amount, "");
        _burnBatch(_account, ids, createAmountArray(_amount, 3));
    }
}
