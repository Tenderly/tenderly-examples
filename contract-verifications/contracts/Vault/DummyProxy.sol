// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

abstract contract ERC1967ProxyAccess is ERC1967Proxy {}
abstract contract UpgradableBeaconAccess is UpgradeableBeacon {}
abstract contract BeaconProxyAccess is BeaconProxy {}
abstract contract TransparentUpgradeableProxyAccess is TransparentUpgradeableProxy {}