// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    mapping(uint256 => uint256) public numbers;
    uint256 public counter;

    function setNumber(uint256 key, uint256 newNumber) public {
        numbers[key] = newNumber;
        counter++;
    }

    function increment(uint256 key) public {
        numbers[key]++;
    }
}
