// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {KoilenService} from "../src/contracts/koilen/KoilenService.sol";

/**
 * @title Deploy Koilen Service Script
 * @notice Deploys the KoilenService contract to integrate IoT sensors with EVVM
 *
 * Usage:
 * forge script script/DeployKoilenService.s.sol:DeployKoilenService \
 *   --rpc-url $RPC_URL_ETH_SEPOLIA \
 *   --account defaultKey \
 *   --broadcast \
 *   --verify \
 *   --etherscan-api-key $ETHERSCAN_API \
 *   -vvvv
 */
contract DeployKoilenService is Script {
    // Deployed EVVM contracts on Sepolia
    address constant EVVM_ADDRESS = 0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5;
    address constant NAME_SERVICE_ADDRESS = 0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3;

    // Admin address (replace with your admin)
    address constant ADMIN_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89;

    // Backend address (replace with your Koilen backend wallet)
    address constant BACKEND_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89; // TODO: Change this!

    function run() external {
        console.log("==================================================");
        console.log("Deploying Koilen Service");
        console.log("==================================================");
        console.log("");
        console.log("Configuration:");
        console.log("  EVVM:", EVVM_ADDRESS);
        console.log("  NameService:", NAME_SERVICE_ADDRESS);
        console.log("  Admin:", ADMIN_ADDRESS);
        console.log("  Backend:", BACKEND_ADDRESS);
        console.log("");

        vm.startBroadcast();

        KoilenService koilenService = new KoilenService(
            EVVM_ADDRESS,
            NAME_SERVICE_ADDRESS,
            ADMIN_ADDRESS,
            BACKEND_ADDRESS
        );

        vm.stopBroadcast();

        console.log("==================================================");
        console.log("Deployment Successful!");
        console.log("==================================================");
        console.log("");
        console.log("KoilenService deployed at:", address(koilenService));
        console.log("");
        console.log("Event Costs (default):");
        console.log("  NORMAL:", koilenService.eventCosts(KoilenService.EventType.NORMAL));
        console.log("  TEMP_HIGH:", koilenService.eventCosts(KoilenService.EventType.TEMP_HIGH));
        console.log("  TEMP_LOW:", koilenService.eventCosts(KoilenService.EventType.TEMP_LOW));
        console.log("  HUMIDITY_HIGH:", koilenService.eventCosts(KoilenService.EventType.HUMIDITY_HIGH));
        console.log("  HUMIDITY_LOW:", koilenService.eventCosts(KoilenService.EventType.HUMIDITY_LOW));
        console.log("  DOOR_OPEN:", koilenService.eventCosts(KoilenService.EventType.DOOR_OPEN));
        console.log("  POWER_FAILURE:", koilenService.eventCosts(KoilenService.EventType.POWER_FAILURE));
        console.log("  SENSOR_ERROR:", koilenService.eventCosts(KoilenService.EventType.SENSOR_ERROR));
        console.log("");
        console.log("Next steps:");
        console.log("1. Register clients with registerClient()");
        console.log("2. Register branches with registerBranch()");
        console.log("3. Register sensors with registerSensor()");
        console.log("4. Configure backend to call logSensorEvent()");
        console.log("");
        console.log("Etherscan verification:");
        console.log("https://sepolia.etherscan.io/address/" , address(koilenService));
    }
}
