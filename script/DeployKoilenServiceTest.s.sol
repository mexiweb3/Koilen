// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {KoilenServiceTest} from "../src/contracts/koilen/KoilenServiceTest.sol";

/**
 * @title Deploy Koilen Service Test Script
 * @notice Deploys simplified version for testing (no NameService validation)
 */
contract DeployKoilenServiceTest is Script {
    address constant EVVM_ADDRESS = 0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5;
    address constant ADMIN_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89;
    address constant BACKEND_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89;

    function run() external {
        console.log("==================================================");
        console.log("Deploying Koilen Service TEST VERSION");
        console.log("==================================================");
        console.log("");
        console.log("WARNING: This is a simplified version for testing");
        console.log("         NO NameService validation");
        console.log("         DO NOT use in production!");
        console.log("");
        console.log("Configuration:");
        console.log("  EVVM:", EVVM_ADDRESS);
        console.log("  Admin:", ADMIN_ADDRESS);
        console.log("  Backend:", BACKEND_ADDRESS);
        console.log("");

        vm.startBroadcast();

        KoilenServiceTest koilenServiceTest = new KoilenServiceTest(
            EVVM_ADDRESS,
            ADMIN_ADDRESS,
            BACKEND_ADDRESS
        );

        vm.stopBroadcast();

        console.log("==================================================");
        console.log("Deployment Successful!");
        console.log("==================================================");
        console.log("");
        console.log("KoilenServiceTest deployed at:", address(koilenServiceTest));
        console.log("");
        console.log("Etherscan:");
        console.log("https://sepolia.etherscan.io/address/", address(koilenServiceTest));
    }
}
