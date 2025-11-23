// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/contracts/koilen/KoilenServiceTestPublic.sol";

contract DeployKoilenServiceTestPublic is Script {
    function run() external {
        address deployer = msg.sender;

        console.log("Deploying KoilenServiceTestPublic...");
        console.log("Deployer:", deployer);

        vm.startBroadcast();

        // Test Contract EVVM address (placeholder - no real validation)
        address testEvvm = address(0x0000000000000000000000000000000000000000);

        // Deploy contract
        KoilenServiceTestPublic koilen = new KoilenServiceTestPublic(
            testEvvm,
            deployer // admin
        );

        console.log("KoilenServiceTestPublic deployed at:", address(koilen));
        console.log("Admin:", deployer);

        vm.stopBroadcast();

        // Log deployment info
        console.log("\n=== Deployment Summary ===");
        console.log("Contract:", address(koilen));
        console.log("Admin:", deployer);
        console.log("EVVM:", testEvvm);

        console.log("\n=== Event Costs (KOIL) ===");
        console.log("NORMAL:", koilen.getEventCost(KoilenServiceTestPublic.EventType.NORMAL) / 1 ether);
        console.log("TEMP_HIGH:", koilen.getEventCost(KoilenServiceTestPublic.EventType.TEMP_HIGH) / 1 ether);
        console.log("TEMP_LOW:", koilen.getEventCost(KoilenServiceTestPublic.EventType.TEMP_LOW) / 1 ether);
        console.log("HUMIDITY_HIGH:", koilen.getEventCost(KoilenServiceTestPublic.EventType.HUMIDITY_HIGH) / 1 ether);
        console.log("HUMIDITY_LOW:", koilen.getEventCost(KoilenServiceTestPublic.EventType.HUMIDITY_LOW) / 1 ether);
        console.log("DOOR_OPEN:", koilen.getEventCost(KoilenServiceTestPublic.EventType.DOOR_OPEN) / 1 ether);
        console.log("POWER_FAILURE:", koilen.getEventCost(KoilenServiceTestPublic.EventType.POWER_FAILURE) / 1 ether);
        console.log("SENSOR_ERROR:", koilen.getEventCost(KoilenServiceTestPublic.EventType.SENSOR_ERROR) / 1 ether);

        console.log("\n=== Next Steps ===");
        console.log("1. Verify contract on Etherscan");
        console.log("2. Register client with:");
        console.log("   cast send", address(koilen));
        console.log("   'registerClient(string,uint256)'");
        console.log("   'KoilenTest' 10000000000000000000000");
        console.log("   --account defaultKey --rpc-url $SEPOLIA_RPC_URL");
        console.log("\n3. Register branch and sensor");
        console.log("4. Update dashboard contract address");
    }
}
