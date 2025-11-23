// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {KoilenService} from "../src/contracts/koilen/KoilenService.sol";

/**
 * @title Deploy Koilen Service on MATE Metaprotocol
 * @notice Deploys KoilenService integrated with MATE Metaprotocol (EVVM ID 2)
 *
 * MATE Metaprotocol Addresses (Sepolia - Updated Nov 17th):
 * - EVVM: 0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366
 * - NameService: 0x8038e87dc67D87b31d890FD01E855a8517ebfD24
 * - Staking: 0x8eB2525239781e06dBDbd95d83c957C431CF2321
 * - EVVM ID: 2
 */
contract DeployKoilenServiceMATE is Script {
    // MATE Metaprotocol addresses (updated Nov 17th)
    address constant MATE_EVVM = 0xF817e9ad82B4a19F00dA7A248D9e556Ba96e6366;
    address constant MATE_NAME_SERVICE = 0x8038e87dc67D87b31d890FD01E855a8517ebfD24;

    // Admin and backend addresses
    address constant ADMIN_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89;
    address constant BACKEND_ADDRESS = 0x69c13cbfFC6Fb9FF93F9371853Da50f737055b89;

    function run() external {
        console.log("===========================================================");
        console.log("Deploying Koilen Service on MATE Metaprotocol");
        console.log("===========================================================");
        console.log("");
        console.log("MATE Metaprotocol Integration:");
        console.log("  EVVM (MATE):", MATE_EVVM);
        console.log("  NameService (MATE):", MATE_NAME_SERVICE);
        console.log("  EVVM ID: 2");
        console.log("");
        console.log("Configuration:");
        console.log("  Admin:", ADMIN_ADDRESS);
        console.log("  Backend:", BACKEND_ADDRESS);
        console.log("");

        vm.startBroadcast();

        KoilenService koilenService = new KoilenService(
            MATE_EVVM,
            MATE_NAME_SERVICE,
            ADMIN_ADDRESS,
            BACKEND_ADDRESS
        );

        vm.stopBroadcast();

        console.log("===========================================================");
        console.log("Deployment Successful on MATE Metaprotocol!");
        console.log("===========================================================");
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
        console.log("MATE Metaprotocol Details:");
        console.log("  Integrated with MATE NameService for identity validation");
        console.log("  Running on EVVM ID 2 (MATE Metaprotocol)");
        console.log("  Gasless transactions ready via MATE Fishers");
        console.log("");
        console.log("Next steps:");
        console.log("1. Get $MATE tokens from faucet: https://evvm.dev");
        console.log("2. Register identities in MATE NameService");
        console.log("3. Register clients with registerClient()");
        console.log("4. Register sensors and start logging events");
        console.log("");
        console.log("Etherscan verification:");
        console.log("https://sepolia.etherscan.io/address/", address(koilenService));
        console.log("");
        console.log("MATE Metaprotocol: https://evvm.org");
    }
}
