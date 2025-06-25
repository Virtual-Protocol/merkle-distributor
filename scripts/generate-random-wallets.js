const fs = require('fs');
const { utils } = require('ethers');

const NUM_WALLETS = 8000;
const MIN_AMOUNT = 1_000_000; // minimum token amount
const MAX_AMOUNT = 10_000_000; // maximum token amount

function getRandomAddress() {
  // Generate a random 32-byte private key and get the corresponding address
  const randomBytes = utils.randomBytes(32);
  return utils.computeAddress(randomBytes);
}

function getRandomAmount() {
  // Random integer between MIN_AMOUNT and MAX_AMOUNT
  return Math.floor(Math.random() * (MAX_AMOUNT - MIN_AMOUNT + 1)) + MIN_AMOUNT;
}

function main() {
  const data = {};
  for (let i = 0; i < NUM_WALLETS; i++) {
    let address;
    do {
      address = getRandomAddress();
    } while (data[address]); // ensure uniqueness
    data[address] = getRandomAmount();
  }
  fs.writeFileSync('random-wallets.json', JSON.stringify(data, null, 2));
  console.log('Generated random-wallets.json with', NUM_WALLETS, 'wallets.');
}

main(); 