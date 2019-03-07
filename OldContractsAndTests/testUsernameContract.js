// Step 1: import the contract ABI
const Username = require('Embark/contracts/Username');
// const bs58 = require('bs58');

let accounts;

// Step 2: deploy the contract
config({
  contracts: {
	"Username": {
	  args: []
	}
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
  // console.log(accounts[0])
  // console.log(accounts[1])
});


it('Allows username to be registered', async () => {
	let nickname = 'simmo'
	result = await Username.methods.register(nickname).send({ from: accounts[0] })
	assert.equal(result.status, true)
})

it('Allows retrieval of username from Eth Address', async () => {
	result = await Username.methods.getName(accounts[0]).call()
	assert.equal(result, 'simmo')
})

it('Allows username from another address to be registered', async () => {
	let nickname = 'joe'
	result = await Username.methods.register(nickname).send({ from: accounts[1] })
	assert.equal(result.status, true)
})

it('Allows retrieval of new username from Eth Address', async () => {
	result = await Username.methods.getName(accounts[1]).call()
	assert.equal(result, 'joe')
})

it('Gets correct number of users', async () => {
	result = await Username.methods.numberOfUsers().call()
	assert.equal(result, 2)
})

it('Adds another name and gets correct number of users', async () => {
	let nickname = 'blogs'
	result = await Username.methods.register(nickname).send({ from: accounts[2] })
	result = await Username.methods.numberOfUsers().call()
	assert.equal(result, 3)
})

it('Is address available and not already registered?', async () => {
	result = await Username.methods.isAddressAvailable(accounts[0]).call()
	assert.equal(result, false)
})

it('Is address not available - ie already registered?', async () => {
	result = await Username.methods.isAddressAvailable(accounts[9]).call()
	assert.equal(result, true)
})

it('Is name available and not already registered?', async () => {
	result = await Username.methods.isNameAvailable('simmo').call()
	assert.equal(result, false)
})

it('Is name not available - ie already registered?', async () => {
	result = await Username.methods.isNameAvailable('mr_nobody').call()
	assert.equal(result, true)
})

it('Does not allow duplicate names', async () => {
	var hasError = true;
	try {
		let nickname = 'simmo'
		await Username.methods.register(nickname).send({ from: accounts[3] })
		hasError = false;
	}	catch(err) { }
	assert.equal(true, hasError, "Function not throwing error on duplicate names")
})

it('Does not allow registration from already registered address', async () => {
	var hasError = true;
	try {
		let nickname = 'simmo2'
		await Username.methods.register(nickname).send({ from: accounts[0] })
		hasError = false;
	}	catch(err) { }
	assert.equal(true, hasError, "Function not throwing error on duplicate addresses")
})


