// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Counter.sol";

contract CounterTest is Test {
    Counter counter;

    function setUp() public {
        counter = new Counter();
    }

    // Test setting a number in the mapping
    function testSetNumber() public {
        uint256 testKey = 1;
        uint256 testValue = 123;

        counter.setNumber(testKey, testValue);
        assertEq(counter.numbers(testKey), testValue, "setNumber did not set the correct value");
    }

    // Test incrementing a number in the mapping
    function testIncrement() public {
        uint256 testKey = 2;
        uint256 initialValue = 456;

        counter.setNumber(testKey, initialValue);
        counter.increment(testKey);
        assertEq(counter.numbers(testKey), initialValue + 1, "increment did not increase the number as expected");
    }

    // Test incrementing a number in the mapping that hasn't been set
    function testIncrementUnsetKey() public {
        uint256 testKey = 3;

        counter.increment(testKey);
        assertEq(counter.numbers(testKey), 1, "increment on an unset key should set the value to 1");
    }
}
