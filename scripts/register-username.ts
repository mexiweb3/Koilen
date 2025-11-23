#!/usr/bin/env tsx
/**
 * EVVM Name Service - Username Registration Script
 *
 * This script helps you register usernames on the EVVM Name Service
 *
 * Process:
 * 1. Pre-registration: Commit to a username hash (prevents front-running)
 * 2. Wait 30 minutes
 * 3. Registration: Reveal and complete registration
 */

import { createWalletClient, createPublicClient, http, parseEther, keccak256, encodePacked } from 'viem';
import { sepolia, arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import prompts from 'prompts';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

dotenv.config();

// Contract ABIs (minimal - only what we need)
const NAME_SERVICE_ABI = [
  {
    name: 'preRegistrationUsername',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'hashPreRegisteredUsername', type: 'bytes32' },
      { name: 'nonce', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
      { name: 'priorityFee_EVVM', type: 'uint256' },
      { name: 'nonce_EVVM', type: 'uint256' },
      { name: 'priorityFlag_EVVM', type: 'bool' },
      { name: 'signature_EVVM', type: 'bytes' }
    ],
    outputs: []
  },
  {
    name: 'registrationUsername',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'username', type: 'string' },
      { name: 'clowNumber', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
      { name: 'priorityFee_EVVM', type: 'uint256' },
      { name: 'nonce_EVVM', type: 'uint256' },
      { name: 'priorityFlag_EVVM', type: 'bool' },
      { name: 'signature_EVVM', type: 'bytes' }
    ],
    outputs: []
  },
  {
    name: 'isUsernameAvailable',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_username', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'getPriceOfRegistration',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'username', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'hashUsername',
    type: 'function',
    stateMutability: 'pure',
    inputs: [
      { name: '_username', type: 'string' },
      { name: '_randomNumber', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bytes32' }]
  }
] as const;

// Deployed contract addresses from your deployment
const CONTRACTS = {
  sepolia: {
    nameService: '0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3',
    evvm: '0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5'
  },
  arbitrumSepolia: {
    nameService: '', // Add if you deploy on Arbitrum
    evvm: ''
  }
};

async function main() {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   EVVM Name Service - Username Registration          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `));

  // Select network
  const { network } = await prompts({
    type: 'select',
    name: 'network',
    message: 'Select network:',
    choices: [
      { title: 'Ethereum Sepolia', value: 'sepolia' },
      { title: 'Arbitrum Sepolia', value: 'arbitrumSepolia' }
    ]
  });

  const chain = network === 'sepolia' ? sepolia : arbitrumSepolia;
  const rpcUrl = network === 'sepolia'
    ? process.env.RPC_URL_ETH_SEPOLIA
    : process.env.RPC_URL_ARB_SEPOLIA;

  if (!rpcUrl) {
    console.error(chalk.red('❌ RPC URL not found in .env file'));
    process.exit(1);
  }

  // Get private key
  const { privateKey } = await prompts({
    type: 'password',
    name: 'privateKey',
    message: 'Enter your private key (will not be stored):',
    validate: (value) => value.startsWith('0x') && value.length === 66 ? true : 'Invalid private key format'
  });

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl)
  });

  console.log(chalk.green(`\n✅ Connected as: ${account.address}`));

  // Select action
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { title: 'Register a new username (2-step process)', value: 'register' },
      { title: 'Check if username is available', value: 'check' },
      { title: 'Get registration price', value: 'price' }
    ]
  });

  const nameServiceAddress = CONTRACTS[network as keyof typeof CONTRACTS].nameService as `0x${string}`;

  if (action === 'check') {
    const { username } = await prompts({
      type: 'text',
      name: 'username',
      message: 'Enter username to check:',
      validate: (value) => value.length >= 4 ? true : 'Username must be at least 4 characters'
    });

    const isAvailable = await publicClient.readContract({
      address: nameServiceAddress,
      abi: NAME_SERVICE_ABI,
      functionName: 'isUsernameAvailable',
      args: [username]
    });

    if (isAvailable) {
      console.log(chalk.green(`\n✅ Username "${username}" is available!`));
    } else {
      console.log(chalk.red(`\n❌ Username "${username}" is already taken.`));
    }
  } else if (action === 'price') {
    const { username } = await prompts({
      type: 'text',
      name: 'username',
      message: 'Enter username to check price:',
      validate: (value) => value.length >= 4 ? true : 'Username must be at least 4 characters'
    });

    const price = await publicClient.readContract({
      address: nameServiceAddress,
      abi: NAME_SERVICE_ABI,
      functionName: 'getPriceOfRegistration',
      args: [username]
    });

    console.log(chalk.cyan(`\n💰 Registration price: ${price.toString()} wei`));
    console.log(chalk.cyan(`   (${(Number(price) / 1e18).toFixed(4)} KOIL tokens)`));
  } else if (action === 'register') {
    console.log(chalk.yellow(`
⚠️  Username Registration Process:

   Step 1: Pre-registration (commit to username hash)
           - Prevents front-running attacks
           - Creates a 30-minute reservation

   Step 2: Registration (reveal username)
           - Must be done after 30 minutes
           - Completes the registration
    `));

    const { step } = await prompts({
      type: 'select',
      name: 'step',
      message: 'Which step are you on?',
      choices: [
        { title: 'Step 1: Pre-registration (create reservation)', value: 'preregister' },
        { title: 'Step 2: Registration (complete registration)', value: 'finalize' }
      ]
    });

    if (step === 'preregister') {
      const { username } = await prompts({
        type: 'text',
        name: 'username',
        message: 'Enter desired username:',
        validate: (value) => {
          if (value.length < 4) return 'Username must be at least 4 characters';
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) return 'Username must start with a letter and contain only letters and numbers';
          return true;
        }
      });

      // Check availability
      const isAvailable = await publicClient.readContract({
        address: nameServiceAddress,
        abi: NAME_SERVICE_ABI,
        functionName: 'isUsernameAvailable',
        args: [username]
      });

      if (!isAvailable) {
        console.log(chalk.red(`\n❌ Username "${username}" is already taken.`));
        process.exit(1);
      }

      // Generate random number for hash
      const randomNumber = BigInt(Math.floor(Math.random() * 1000000000));

      // Calculate hash
      const usernameHash = keccak256(encodePacked(['string', 'uint256'], [username, randomNumber]));

      console.log(chalk.cyan(`\n📝 Pre-registration details:`));
      console.log(chalk.gray(`   Username: ${username}`));
      console.log(chalk.gray(`   Random number: ${randomNumber.toString()}`));
      console.log(chalk.gray(`   Hash: ${usernameHash}`));
      console.log(chalk.yellow(`\n⚠️  IMPORTANT: Save these details! You'll need them in 30 minutes.`));

      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: 'Have you saved the username and random number?',
        initial: false
      });

      if (!confirm) {
        console.log(chalk.red('\n❌ Cancelled. Please save the details before proceeding.'));
        process.exit(0);
      }

      console.log(chalk.cyan(`\n📤 Sending pre-registration transaction...`));
      console.log(chalk.yellow(`   Note: This is a simplified version. For production, you need to implement signature generation.`));

      // Note: In a real implementation, you would need to:
      // 1. Generate proper signatures for both NameService and EVVM
      // 2. Handle nonces correctly
      // 3. Set proper gas limits

      console.log(chalk.yellow(`\n⚠️  To complete this registration, you need to:`));
      console.log(chalk.gray(`   1. Use cast or a custom script to call preRegistrationUsername`));
      console.log(chalk.gray(`   2. Parameters:`));
      console.log(chalk.gray(`      - user: ${account.address}`));
      console.log(chalk.gray(`      - hashPreRegisteredUsername: ${usernameHash}`));
      console.log(chalk.gray(`      - Use appropriate signatures and nonces`));
      console.log(chalk.gray(`   3. Wait 30 minutes`));
      console.log(chalk.gray(`   4. Run this script again with Step 2`));

    } else {
      console.log(chalk.yellow(`\n⚠️  For Step 2 (final registration), you'll need:`));
      console.log(chalk.gray(`   - The exact username from Step 1`));
      console.log(chalk.gray(`   - The random number from Step 1`));
      console.log(chalk.gray(`   - At least 30 minutes must have passed`));
    }
  }

  console.log(chalk.green(`\n✅ Done!`));
}

main().catch((error) => {
  console.error(chalk.red('\n❌ Error:'), error);
  process.exit(1);
});
