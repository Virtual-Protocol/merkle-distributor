const fs = require('fs');
const { utils, BigNumber } = require('ethers');

function toNode(index, account, amount) {
  return Buffer.from(
    utils.solidityKeccak256(['uint256', 'address', 'uint256'], [index, account, amount]).substr(2),
    'hex'
  );
}

function verifyProof(index, account, amount, proof, root) {
  let pair = toNode(index, account, amount);
  for (const item of proof) {
    pair = combinedHash(pair, Buffer.from(item.slice(2), 'hex'));
  }
  return pair.equals(Buffer.from(root.slice(2), 'hex'));
}

function combinedHash(first, second) {
  if (!first) return second;
  if (!second) return first;
  return Buffer.from(
    utils.keccak256(
      Buffer.concat(
        first.compare(second) <= 0 ? [first, second] : [second, first]
      )
    ).slice(2),
    'hex'
  );
}

function main() {
  const json = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const root = json.merkleRoot;
  const claims = json.claims;
  let allValid = true;
  for (const [account, { index, amount, proof }] of Object.entries(claims)) {
    const valid = verifyProof(
      index,
      account,
      BigNumber.from(amount),
      proof,
      root
    );
    console.log(`Account: ${account}, Index: ${index}, Amount: ${amount}, Proof valid: ${valid}`);
    if (!valid) allValid = false;
  }
  if (allValid) {
    console.log('All proofs are valid!');
  } else {
    console.log('Some proofs are invalid!');
  }
}

main(); 