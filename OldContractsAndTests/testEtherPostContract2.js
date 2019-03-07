// Step 1: import the contract ABI
const Etherpost = require('Embark/contracts/Etherpost');
const bs58 = require('bs58');
 
const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
const address = bs58.encode(bytes)
// console.log(address)
// => 16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS


let accounts;

// Step 2: deploy the contract
config({
	contracts: {
		"Etherpost": {
		}
	}
}, (_err, web3_accounts) => {
	accounts = web3_accounts
	console.log(accounts[0])
});

// Return bytes32 hex string from IPFS hash
function getBytes32FromIpfsHash(ipfsHash) {
	return "0x" + bs58.decode(ipfsHash).slice(2).toString('hex')
}

// Return base58 encoded ipfs hash from bytes32 hex string
function getIpfsHashFromBytes32(bytes32Hex) {
	// Add default ipfs values for first 2 bytes: function: 0x12=sha2, size: 0x20=256 bits
	// Cut off leading "0x"
	const hex = "1220" + bytes32Hex.slice(2)
	const hashBytes = Buffer.from(hex, 'hex');
	const str = bs58.encode(hashBytes)
	return str
}

it('Lets us store a hash', async () => {
	let testHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	// ATT: We slice off the first two bytes because they represent the hashing algorithm,
	// which we assume to be static here and now so we can store the hash in a bytes32.
	await Etherpost.methods.upload(getBytes32FromIpfsHash(testHash)).send({ from: accounts[0] })
	let uploads = await Etherpost.methods.getUploads(accounts[0]).call()
	// console.log('upload as bytes', uploads[0])
	// console.log('upload', getIpfsHashFromBytes32(uploads[0]))
	assert.equal(uploads.length, 1)
	assert.equal(getIpfsHashFromBytes32(uploads[0]), testHash)
})

it('Lets us store a hash from multiple users', async () => {
	let testHash1 = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ222'
	let testHash2 = 'Qmb5caR1BdGcXikgn4T6BhZzRpHLceDahtVb9qQhzLs333'
	// ATT: We slice off the first two bytes because they represent the hashing algorithm,
	// which we assume to be static here and now so we can store the hash in a bytes32.
	// let owner = accounts[0];
	await Etherpost.methods.upload(getBytes32FromIpfsHash(testHash1)).send({ from: accounts[1] })
	await Etherpost.methods.upload(getBytes32FromIpfsHash(testHash2)).send({ from: accounts[2] })
	// console.log('AC0:', accounts[0])
	// console.log('AC1:', accounts[1])
	let uploads1 = await Etherpost.methods.getUploads(accounts[1]).call()
	let uploads2 = await Etherpost.methods.getUploads(accounts[2]).call()
	// console.log('uploads1', uploads1)
	// console.log('uploads2', uploads2)
	// console.log('upload', getIpfsHashFromBytes32(uploads1[0]))

	assert.equal(uploads1.length + uploads2.length, 2)
	assert.equal(getIpfsHashFromBytes32(uploads1[0]), testHash1)
	assert.equal(getIpfsHashFromBytes32(uploads2[0]), testHash2)
})

it('Lets us store multiple hashes from the same user', async () => {
	let testHash1 = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ444'
	let testHash2 = 'Qmb5caR1BdGcXikgn4T6BhZzRpHLceDahtVb9qQhzLs555'
	// ATT: We slice off the first two bytes because they represent the hashing algorithm,
	// which we assume to be static here and now so we can store the hash in a bytes32.
	// let owner = accounts[0];
	await Etherpost.methods.upload(getBytes32FromIpfsHash(testHash1)).send({ from: accounts[0] })
	await Etherpost.methods.upload(getBytes32FromIpfsHash(testHash2)).send({ from: accounts[0] })
	// console.log('AC0:', accounts[0])
	// console.log('AC1:', accounts[1])
	let uploads = await Etherpost.methods.getUploads(accounts[0]).call()
	// console.log('uploads1', uploads1)
	// console.log('uploads2', uploads2)
	// console.log('upload', getIpfsHashFromBytes32(uploads1[0]))

	assert.equal(uploads.length, 3)
	assert.equal(getIpfsHashFromBytes32(uploads[1]), testHash1)
	assert.equal(getIpfsHashFromBytes32(uploads[2]), testHash2)
})


it('Retrieve all hashes from one users', async () => {
	let uploads = await Etherpost.methods.getUploads(accounts[0]).call()
	let l = uploads.length
	for (i=0; i<uploads.length; i++){
		console.log('i=', i, getIpfsHashFromBytes32(uploads[i]))
	}
	// console.log('upload as bytes', uploads3[0])
	// console.log('upload as bytes', uploads3[1])
	// console.log('upload as bytes', uploads3)
	// console.log('upload', getIpfsHashFromBytes32(uploads3[0]))
	
	assert.equal(l, 3)
})

// it('Retrieve all hashes from all users', async () => {
// 	let uploads = await Etherpost.methods.getUploads(accounts[0]).call()
// 	// console.log('upload as bytes', uploads3[0])
// 	// console.log('upload as bytes', uploads3[1])
// 	// console.log('upload as bytes', uploads3)
// 	// console.log('upload', getIpfsHashFromBytes32(uploads3[0]))
	
// 	assert.equal(uploads3.length, 5)
// 	assert.equal(getIpfsHashFromBytes32(uploads3[3]), testHash3)
// 	assert.equal(getIpfsHashFromBytes32(uploads3[4]), testHash4)
// })
