require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  // Replace with your deployed contract address
  const distributorAddress = process.env.DISTRIBUTOR_ADDRESS || 'YOUR_DISTRIBUTOR_ADDRESS_HERE'

  // Load ABI
  const abi = JSON.parse(fs.readFileSync('artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json')).abi

  // Set up provider and signer
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // Connect to contract
  const distributor = new ethers.Contract(distributorAddress, abi, signer)

  // Example claim parameters (replace with real values or load from env/args)
  const index = 0 // uint256
  const account = '0x466c7678ca1d26BE2aAfD7aEC4AA8021466fa42a' // address
  const amount = BigInt(1 * 10 ** 18) // uint256, e.g. 1 USDC (6 decimals)
  const merkleProof = [
    '0x20e64a56e06863580dc87d1c467f1ddbcf7c9fce2fb1cdce55178a6adcd44404'
  ]

  // Call claim
  const tx = await distributor.claim(index, account, amount, merkleProof)
  console.log('Claim tx sent:', tx.hash)
  await tx.wait()
  console.log('Claim successful!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
