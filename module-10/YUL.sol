// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract BitWise {
    // count the number of bit set in data.  i.e. data = 7, result = 3
    function countBitSet(uint8 data) public pure returns (uint8 result) {
        for (uint256 i = 0; i < 8; i += 1) {
            if (((data >> i) & 1) == 1) {
                result += 1;
            }
        }
    }

    function countBitSetAsm(uint8 data) public pure returns (uint8 result) {
        assembly {
            for {} data {}{                      // until data is all 0s
                data := and(data, sub(data, 1))  // deletes exactly one 1 at every iteration
                result := add(result, 1)
            }
        }
    }
}


contract String {
    function charAt(string memory input, uint index) public pure returns(bytes2 result) {
        assembly{
            let len := mload(input)
            switch and(len, lt(index,len))
            case 0{
                result := 0x0000
            }
            default{
                let char := byte(index,mload(add(input,0x20)))
                mstore8(0x00, char)
                mstore8(0x01, 0x00)
                result := mload(0x00)
            }
        }
    }
}

