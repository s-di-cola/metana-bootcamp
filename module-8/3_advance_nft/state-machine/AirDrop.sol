// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";

contract AirDrop is ERC721, Ownable {
    using BitMaps for BitMaps.BitMap;

    enum State {
        NOT_STARTED,
        PRESALE,
        PUBLIC_SALE,
        SOLD_OUT
    }
    struct Claim {
        uint256 block;
        bytes32 claim;
        bool isRevealed;
    }

    uint256 public immutable deployTime;
    State public state;
    bytes32 public markleRoot;
    uint256 public constant MAX_SUPPLY = 15;
    uint256 public currentSupply;
    uint256 public presaleStartTime;

    mapping(address => Claim) public commitments;
    BitMaps.BitMap private claimed;

    event PresaleStarted(uint256 timestamp);
    event PublicSaleStarted(uint256 timestamp);
    event SoldOut(uint256 timestamp);
    event PreSaleMint(address indexed to, uint256 indexed tokenId);
    event Committed(address indexed user, bytes32 commitment);
    event PublicMint(address indexed to, uint256 indexed tokenId);

    constructor(bytes32 root) ERC721("AirDrop", "AD") Ownable(msg.sender) {
        state = State.NOT_STARTED;
        markleRoot = root;
        deployTime = block.timestamp;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }

    modifier updateState() {
        if (state == State.PRESALE && block.timestamp > presaleStartTime + 1 days) {
            state = State.PUBLIC_SALE;
            emit PublicSaleStarted(block.timestamp);
        }
        if (currentSupply == MAX_SUPPLY) {
            state = State.SOLD_OUT;
            emit SoldOut(block.timestamp);
        }
        _;
    }

    function startPresale() external onlyOwner inState(State.NOT_STARTED) {
        require(block.timestamp > deployTime + 1 hours, "Presale can only start 1 hour after contract deployment");
        state = State.PRESALE;
        presaleStartTime = block.timestamp;
        emit PresaleStarted(block.timestamp);
    }

    function preSaleClaim(uint256 tokenId, bytes32[] memory proof) public inState(State.PRESALE) updateState {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, tokenId));
        require(MerkleProof.verify(proof, markleRoot, leaf), "Invalid proof");
        require(!claimed.get(tokenId), "Already claimed");

        claimed.setTo(tokenId, true);
        _safeMint(msg.sender, tokenId);
        currentSupply += 1;
        emit PreSaleMint(msg.sender, tokenId);
    }

    function commitToPublicSale(bytes32 commit) external payable inState(State.PUBLIC_SALE) updateState {
        require(msg.value == 1 ether, "Need to pay 1 ETH");
        require(commitments[msg.sender].block == 0, "Already committed");
        require(commitments[msg.sender].isRevealed == false, "Already revealed");
        require(currentSupply < MAX_SUPPLY, "Max supply reached");

        commitments[msg.sender] = Claim({
            block: block.number,
            claim: commit,
            isRevealed: false
        });
        emit Committed(msg.sender, commit);
    }

    function revealPublicSale(bytes32 secret) external inState(State.PUBLIC_SALE) updateState {
        require(commitments[msg.sender].block != 0, "Not committed");
        require(commitments[msg.sender].isRevealed == false, "Already revealed");
        require(keccak256(abi.encodePacked(msg.sender, secret)) == commitments[msg.sender].claim, "Invalid secret");
        require(block.number - commitments[msg.sender].block >= 10, "Not enough blocks passed");
        require(currentSupply < MAX_SUPPLY, "Max supply reached");

        commitments[msg.sender].isRevealed = true;
        uint256 tokenId = uint256(keccak256(abi.encodePacked(msg.sender, secret, blockhash(commitments[msg.sender].block)))) % MAX_SUPPLY;

        while (claimed.get(tokenId)) {
            tokenId = (tokenId + 1) % MAX_SUPPLY;
        }
        claimed.setTo(tokenId, true);
        _safeMint(msg.sender, tokenId);
        currentSupply += 1;
        emit PublicMint(msg.sender, tokenId);
    }
}
