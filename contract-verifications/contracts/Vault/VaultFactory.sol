//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Vault.sol";

contract VaultFactory {
    Vault[] public vaults;
    mapping(address => address) public tokenToValut;

    function createNewVault(address _token) public {
        // Vault vault = new Vault{salt: keccak256(abi.encode(_token))}(_token);
        // vaults.push(vault);
        // tokenToValut[_token] = address(vault);
    }

    function getVaultForToken(
        address _token
    ) public view returns (address pool) {
        pool = tokenToValut[_token];
    }
}
