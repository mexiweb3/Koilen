#!/usr/bin/env tsx
/**
 * Koilen Client Setup Script
 *
 * Configures a complete client hierarchy:
 * Client → Branch → Sensor
 *
 * Each entity is registered in NameService with proper metadata
 */

import prompts from 'prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';

console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   KOILEN CLIENT SETUP                                 ║
║   Cliente → Sucursal → Sensor                         ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`));

// Deployed contracts
const CONTRACTS = {
  nameService: '0x3Eb1A06faff55B618eA90b20169f37B73B0dDea3',
  evvm: '0x7A2D55Cd7946A2565afB5f9bF14E2E0749bF10E5',
  koilenService: '0x927e11039EbDE25095b3C413Ef35981119e3f257',      // Production (with NameService)
  koilenServiceTest: '0x0EA04c33d1e50dba7cE53f51CCA5Af3B0De65642'   // Testing (no NameService)
};

const EVVM_ID = 1074;
const RPC_URL = 'https://0xrpc.io/sep';

interface EntityData {
  username: string;
  randomNumber: bigint;
  hash: string;
}

/**
 * Helper function to generate hash for username
 */
function generateHash(username: string, randomNumber: bigint): string {
  const cmd = `cast keccak "$(cast abi-encode 'f(string,uint256)' '${username}' ${randomNumber})"`;
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

/**
 * Check if username is available
 */
function checkAvailability(username: string): boolean {
  try {
    const result = execSync(
      `cast call ${CONTRACTS.nameService} "isUsernameAvailable(string)" "${username}" --rpc-url ${RPC_URL}`,
      { encoding: 'utf-8' }
    ).trim();
    // 0x0...01 = available, 0x0...00 = not available
    return result.endsWith('01');
  } catch (error) {
    console.error(chalk.red('Error checking availability:', error));
    return false;
  }
}

async function main() {
  console.log(chalk.yellow('📋 Este script te ayudará a configurar:\n'));
  console.log(chalk.gray('   1. Cliente (ej: "RestaurantChain")'));
  console.log(chalk.gray('   2. Sucursal (ej: "RestaurantChain_BuenosAires")'));
  console.log(chalk.gray('   3. Sensor (ej: "RestaurantChain_BuenosAires_Fridge1")\n'));

  // ═══════════════════════════════════════════════════════════════════
  // PASO 1: CONFIGURAR CLIENTE
  // ═══════════════════════════════════════════════════════════════════

  console.log(chalk.cyan('═══════════════════════════════════════════════'));
  console.log(chalk.cyan('PASO 1: CONFIGURAR CLIENTE'));
  console.log(chalk.cyan('═══════════════════════════════════════════════\n'));

  const { clientName } = await prompts({
    type: 'text',
    name: 'clientName',
    message: 'Nombre del cliente (ej: RestaurantChain):',
    validate: (value) => {
      if (value.length < 4) return 'Mínimo 4 caracteres';
      if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
        return 'Debe empezar con letra y solo letras/números';
      }
      return true;
    }
  });

  console.log(chalk.gray(`\n🔍 Verificando disponibilidad de "${clientName}"...`));

  if (!checkAvailability(clientName)) {
    console.log(chalk.red(`\n❌ El username "${clientName}" ya está registrado.`));
    process.exit(1);
  }

  console.log(chalk.green(`✅ "${clientName}" está disponible!\n`));

  const { clientOwner } = await prompts({
    type: 'text',
    name: 'clientOwner',
    message: 'Dirección del dueño del cliente (0x...):',
    validate: (value) => /^0x[a-fA-F0-9]{40}$/.test(value) ? true : 'Dirección inválida'
  });

  const { clientEmail } = await prompts({
    type: 'text',
    name: 'clientEmail',
    message: 'Email de contacto:',
    initial: ''
  });

  const { clientLocation } = await prompts({
    type: 'text',
    name: 'clientLocation',
    message: 'Ubicación principal:',
    initial: ''
  });

  const { initialCredits } = await prompts({
    type: 'number',
    name: 'initialCredits',
    message: 'Créditos iniciales (KOIL tokens):',
    initial: 1000
  });

  // ═══════════════════════════════════════════════════════════════════
  // PASO 2: CONFIGURAR SUCURSAL
  // ═══════════════════════════════════════════════════════════════════

  console.log(chalk.cyan('\n═══════════════════════════════════════════════'));
  console.log(chalk.cyan('PASO 2: CONFIGURAR SUCURSAL'));
  console.log(chalk.cyan('═══════════════════════════════════════════════\n'));

  const { branchName } = await prompts({
    type: 'text',
    name: 'branchName',
    message: `Nombre de la sucursal (ej: ${clientName}_BuenosAires):`,
    initial: `${clientName}_`,
    validate: (value) => {
      if (value.length < 4) return 'Mínimo 4 caracteres';
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        return 'Debe empezar con letra y solo letras/números/guión bajo';
      }
      return true;
    }
  });

  console.log(chalk.gray(`\n🔍 Verificando disponibilidad de "${branchName}"...`));

  if (!checkAvailability(branchName)) {
    console.log(chalk.red(`\n❌ El username "${branchName}" ya está registrado.`));
    process.exit(1);
  }

  console.log(chalk.green(`✅ "${branchName}" está disponible!\n`));

  const { branchOwner } = await prompts({
    type: 'text',
    name: 'branchOwner',
    message: 'Dirección del dueño de la sucursal (0x...):',
    initial: clientOwner,
    validate: (value) => /^0x[a-fA-F0-9]{40}$/.test(value) ? true : 'Dirección inválida'
  });

  const { branchLocation } = await prompts({
    type: 'text',
    name: 'branchLocation',
    message: 'Ubicación de la sucursal:',
    initial: ''
  });

  // ═══════════════════════════════════════════════════════════════════
  // PASO 3: CONFIGURAR SENSOR
  // ═══════════════════════════════════════════════════════════════════

  console.log(chalk.cyan('\n═══════════════════════════════════════════════'));
  console.log(chalk.cyan('PASO 3: CONFIGURAR SENSOR'));
  console.log(chalk.cyan('═══════════════════════════════════════════════\n'));

  const { sensorName } = await prompts({
    type: 'text',
    name: 'sensorName',
    message: `Nombre del sensor (ej: ${branchName}_Fridge1):`,
    initial: `${branchName}_`,
    validate: (value) => {
      if (value.length < 4) return 'Mínimo 4 caracteres';
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        return 'Debe empezar con letra y solo letras/números/guión bajo';
      }
      return true;
    }
  });

  console.log(chalk.gray(`\n🔍 Verificando disponibilidad de "${sensorName}"...`));

  if (!checkAvailability(sensorName)) {
    console.log(chalk.red(`\n❌ El username "${sensorName}" ya está registrado.`));
    process.exit(1);
  }

  console.log(chalk.green(`✅ "${sensorName}" está disponible!\n`));

  const { sensorOwner } = await prompts({
    type: 'text',
    name: 'sensorOwner',
    message: 'Dirección del dueño del sensor (0x...):',
    initial: branchOwner,
    validate: (value) => /^0x[a-fA-F0-9]{40}$/.test(value) ? true : 'Dirección inválida'
  });

  const { sensorModel } = await prompts({
    type: 'text',
    name: 'sensorModel',
    message: 'Modelo del sensor:',
    initial: 'DHT22'
  });

  const { sensorSerial } = await prompts({
    type: 'text',
    name: 'sensorSerial',
    message: 'Número de serie:',
    initial: ''
  });

  // ═══════════════════════════════════════════════════════════════════
  // RESUMEN Y CONFIRMACIÓN
  // ═══════════════════════════════════════════════════════════════════

  console.log(chalk.cyan('\n╔═══════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║                RESUMEN DE CONFIGURACIÓN                ║'));
  console.log(chalk.cyan('╚═══════════════════════════════════════════════════════╝\n'));

  console.log(chalk.yellow('📊 CLIENTE:'));
  console.log(chalk.gray(`   Username: ${clientName}`));
  console.log(chalk.gray(`   Dueño: ${clientOwner}`));
  console.log(chalk.gray(`   Email: ${clientEmail || 'N/A'}`));
  console.log(chalk.gray(`   Ubicación: ${clientLocation || 'N/A'}`));
  console.log(chalk.gray(`   Créditos: ${initialCredits} KOIL\n`));

  console.log(chalk.yellow('🏢 SUCURSAL:'));
  console.log(chalk.gray(`   Username: ${branchName}`));
  console.log(chalk.gray(`   Dueño: ${branchOwner}`));
  console.log(chalk.gray(`   Ubicación: ${branchLocation || 'N/A'}`));
  console.log(chalk.gray(`   Cliente padre: ${clientName}\n`));

  console.log(chalk.yellow('📡 SENSOR:'));
  console.log(chalk.gray(`   Username: ${sensorName}`));
  console.log(chalk.gray(`   Dueño: ${sensorOwner}`));
  console.log(chalk.gray(`   Modelo: ${sensorModel}`));
  console.log(chalk.gray(`   Serie: ${sensorSerial || 'N/A'}`));
  console.log(chalk.gray(`   Sucursal padre: ${branchName}\n`));

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: '¿Confirmas esta configuración?',
    initial: true
  });

  if (!confirm) {
    console.log(chalk.red('\n❌ Operación cancelada.'));
    process.exit(0);
  }

  // ═══════════════════════════════════════════════════════════════════
  // GENERAR COMANDOS
  // ═══════════════════════════════════════════════════════════════════

  console.log(chalk.cyan('\n╔═══════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║            COMANDOS PARA EJECUTAR                      ║'));
  console.log(chalk.cyan('╚═══════════════════════════════════════════════════════╝\n'));

  // Generate random numbers and hashes
  const clientRandom = BigInt(Math.floor(Math.random() * 1000000000));
  const branchRandom = BigInt(Math.floor(Math.random() * 1000000000));
  const sensorRandom = BigInt(Math.floor(Math.random() * 1000000000));

  console.log(chalk.yellow('⚠️  IMPORTANTE: Guarda estos números aleatorios!\n'));
  console.log(chalk.gray(`Cliente Random: ${clientRandom}`));
  console.log(chalk.gray(`Sucursal Random: ${branchRandom}`));
  console.log(chalk.gray(`Sensor Random: ${sensorRandom}\n`));

  console.log(chalk.yellow('═══════════════════════════════════════════════════════'));
  console.log(chalk.yellow('PROCESO COMPLETO DE REGISTRO'));
  console.log(chalk.yellow('═══════════════════════════════════════════════════════\n'));

  console.log(chalk.cyan('📝 Los siguientes pasos requieren usar cast con tu wallet.\n'));
  console.log(chalk.gray('Por ahora, este script te muestra el resumen de configuración.'));
  console.log(chalk.gray('Próximamente: integración completa con firmas EIP-191.\n'));

  // Save configuration to file
  const config = {
    timestamp: new Date().toISOString(),
    evvmId: EVVM_ID,
    client: {
      username: clientName,
      owner: clientOwner,
      email: clientEmail,
      location: clientLocation,
      credits: initialCredits,
      randomNumber: clientRandom.toString()
    },
    branch: {
      username: branchName,
      owner: branchOwner,
      location: branchLocation,
      parent: clientName,
      randomNumber: branchRandom.toString()
    },
    sensor: {
      username: sensorName,
      owner: sensorOwner,
      model: sensorModel,
      serial: sensorSerial,
      branch: branchName,
      client: clientName,
      randomNumber: sensorRandom.toString()
    }
  };

  const configFile = `koilen-client-${clientName.toLowerCase()}.json`;
  const fs = await import('fs');
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

  console.log(chalk.green(`\n✅ Configuración guardada en: ${configFile}\n`));

  console.log(chalk.yellow('📋 PRÓXIMOS PASOS MANUALES:\n'));
  console.log(chalk.gray('1. Registrar cada identidad en NameService (proceso de 2 pasos)'));
  console.log(chalk.gray('2. Agregar metadata a cada identidad'));
  console.log(chalk.gray('3. Registrar cliente en KoilenService'));
  console.log(chalk.gray('4. Registrar sucursal en KoilenService'));
  console.log(chalk.gray('5. Registrar sensor en KoilenService\n'));

  console.log(chalk.cyan('Ver KOILEN_CLIENT_SETUP.md para comandos detallados.'));
}

main().catch((error) => {
  console.error(chalk.red('\n❌ Error:'), error);
  process.exit(1);
});
