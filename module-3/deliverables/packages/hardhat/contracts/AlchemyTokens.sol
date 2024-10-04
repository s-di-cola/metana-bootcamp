// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IAlchemyTokens.sol";

contract AlchemyTokens is IAlchemyTokens, ERC1155, Ownable {
    using Strings for uint256;

    uint256 public lastMinted;
    mapping(Token => string) private _baseUris;
    mapping(Token => uint256) private _tokensMinted;
    uint8 private constant MAX_TOKENS_PER_TYPE = 5;

    constructor() ERC1155("") Ownable(msg.sender) {
        _baseUris[
        Token.IRON
        ] = "ipfs://QmZ3ae8RvL91RiVxy6MHC7Zw33cNMUZh9jgHanRppN17ci/";
        _baseUris[
        Token.COPPER
        ] = "ipfs://QmdKf3UN7jXusfEMooAtpCSkc6zCMWoiWP4VAPCLiSs2xi/";
        _baseUris[
        Token.SILVER
        ] = "ipfs://QmeV6oHETPxNeKqE72FzyH6kXE5CJeBZ42DcJD41ZPqGBG/";
        _baseUris[
        Token.GOLD
        ] = "ipfs://Qmexv2iLWKCQyojxc3Skgtnd5APVXGcxPjFwUw7nvJqFv3/";
        _baseUris[
        Token.PLATINUM
        ] = "ipfs://QmXSiofayCY1PT78hMxbAXYfYAUR5jvZNBQ6SM3f8CKgyB/";
        _baseUris[
        Token.PALLADIUM
        ] = "ipfs://QmWwM69EMLqe9hHCUcSiJEJxeLYD7F7vDPd6cnh83Cs2Km/";
        _baseUris[
        Token.RHODIUM
        ] = "ipfs://QmbAjYaQGcSbi6682PDchj5cyiGWzXHkihJPKawpyu17Uv/";
    }

    modifier withCoolDown() {
        require(
            lastMinted + 1 minutes < block.timestamp,
            "Can mint only once per minute"
        );
        _;
    }

    function getTokenURI(
        Token tokenType,
        uint256 tokenId
    ) public view returns (string memory) {
        require(tokenId < _tokensMinted[tokenType], "Token does not exist");
        uint256 index = tokenId % MAX_TOKENS_PER_TYPE;
        return
            string(
            abi.encodePacked(
                _baseUris[tokenType],
                index.toString(),
                ".json"
            )
        );
    }

    function _mintToken(
        address account,
        Token token,
        uint256 amount
    ) private onlyOwner withCoolDown {
        _mint(account, uint256(token), amount, "");
        _tokensMinted[token] += amount;
        lastMinted = block.timestamp;
    }

    function mintBasicToken(
        address account,
        Token token,
        uint256 amount
    ) external onlyOwner {
        require(
            token <= Token.SILVER,
            "Can only mint IRON, COPPER, or SILVER"
        );
        _mintToken(account, token, amount);
    }

    function mintCompoundToken(
        address account,
        Token token,
        uint256 amount
    ) external onlyOwner {
        require(
            token > Token.SILVER && token <= Token.RHODIUM,
            "Invalid compound token"
        );
        Token[3] memory requiredTokens;
        uint8 requiredTokenCount = 0;

        if (token == Token.GOLD) {
            requiredTokens = [Token.IRON, Token.COPPER, Token.IRON];
            requiredTokenCount = 2;
        } else if (token == Token.PLATINUM) {
            requiredTokens = [Token.COPPER, Token.SILVER, Token.COPPER];
            requiredTokenCount = 2;
        } else if (token == Token.PALLADIUM) {
            requiredTokens = [Token.IRON, Token.SILVER, Token.IRON];
            requiredTokenCount = 2;
        } else if (token == Token.RHODIUM) {
            requiredTokens = [Token.IRON, Token.COPPER, Token.SILVER];
            requiredTokenCount = 3;
        }


        for (uint8 i = 0; i < requiredTokenCount; i++) {
            require(
                balanceOf(account, uint256(requiredTokens[i])) >= amount,
                "Insufficient balance"
            );
            _burn(account, uint256(requiredTokens[i]), amount);
        }
        _mintToken(account, token, amount);
    }

    function burn(address account, Token token, uint256 amount) external {
        require(
            balanceOf(account, uint256(token)) >= amount,
            "Insufficient balance"
        );
        _burn(account, uint256(token), amount);
    }

    function getTokensMinted(Token token) external view returns (uint256) {
        return _tokensMinted[token];
    }

    function getBaseUri(Token token) external view returns (string memory) {
        return _baseUris[token];
    }
}
