// Step 1: import the contract ABI
const Etherpost = require('Embark/contracts/Etherpost');
const bs58 = require('bs58');
 
const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
const address = bs58.encode(bytes)
// console.log(address)


let accounts;

// Step 2: deploy the contract
config({
	contracts: {
		"Etherpost": {
		}
	}
}, (_err, web3_accounts) => {
	accounts = web3_accounts
	// console.log(accounts[0])
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
		// console.log('i=', i, getIpfsHashFromBytes32(uploads[i]))
	}
	// console.log('upload as bytes', uploads3[0])
	// console.log('upload as bytes', uploads3[1])
	// console.log('upload as bytes', uploads3)
	// console.log('upload', getIpfsHashFromBytes32(uploads3[0]))
	
	assert.equal(l, 3)
})

it('Retrieve all hashes from another user', async () => {
	let uploads = await Etherpost.methods.getUploads(accounts[1]).call()
	let l = uploads.length
	for (i=0; i<uploads.length; i++){
		// console.log('i=', i, getIpfsHashFromBytes32(uploads[i]))
	}
	// console.log('upload as bytes', uploads3[0])
	// console.log('upload as bytes', uploads3[1])
	// console.log('upload as bytes', uploads3)
	// console.log('upload', getIpfsHashFromBytes32(uploads3[0]))
	
	assert.equal(l, 1)
})




// ======== USERNAME REGISTRATION ==============
it('Allows username to be registered', async () => {
	let nickname = 'simmo'
	result = await Etherpost.methods.register(nickname).send({ from: accounts[0] })
	assert.equal(result.status, true)
})


it('Allows retrieval of username from Eth Address', async () => {
	result = await Etherpost.methods.getName(accounts[0]).call()
	// console.log('username:', result)
	assert.equal(result, 'simmo')
})


it('Allows username from another address to be registered', async () => {
	let nickname = 'joe'
	result = await Etherpost.methods.register(nickname).send({ from: accounts[1] })
	assert.equal(result.status, true)
})


it('Allows retrieval of new username from Eth Address', async () => {
	result = await Etherpost.methods.getName(accounts[1]).call()
	assert.equal(result, 'joe')
})


it('Allows retrieval of Eth Address from Username', async () => {
	result = await Etherpost.methods.getAddressFromName('joe').call()
	assert.equal(result, accounts[1])
})


it('Gets correct number of users', async () => {
	result = await Etherpost.methods.numberOfUsers().call()
	assert.equal(result, 2)
})


it('Adds another name and gets correct number of users', async () => {
	let nickname = 'blogs'
	result = await Etherpost.methods.register(nickname).send({ from: accounts[2] })
	result = await Etherpost.methods.numberOfUsers().call()
	assert.equal(result, 3)
})


it('Is address available and not already registered?', async () => {
	result = await Etherpost.methods.isAddressAvailable(accounts[0]).call()
	assert.equal(result, false)
})


it('Is address not available - ie already registered?', async () => {
	result = await Etherpost.methods.isAddressAvailable(accounts[9]).call()
	assert.equal(result, true)
})


it('Is name available and not already registered?', async () => {
	result = await Etherpost.methods.isNameAvailable('simmo').call()
	// result should = false, as name is taken
	assert.equal(result, false)
})


it('Is name not available - ie already registered?', async () => {
	result = await Etherpost.methods.isNameAvailable('mr_nobody').call()
	// result should = true, as name is available
	assert.equal(result, true)
})


it('Does not allow duplicate names', async () => {
	var hasError = true;
	try {
		let nickname = 'simmo'
		await Etherpost.methods.register(nickname).send({ from: accounts[3] })
		hasError = false;
	}	catch(err) { }
	assert.equal(true, hasError, "Function not throwing error on duplicate names")
})


it('Does not allow registration from already registered address', async () => {
	var hasError = true;
	try {
		let nickname = 'simmo2'
		await Etherpost.methods.register(nickname).send({ from: accounts[0] })
		hasError = false;
	}	catch(err) { }
	assert.equal(true, hasError, "Function not throwing error on duplicate addresses")
})


it('Listens to an "LogRegister" event', async () => {
	let nickname = 'veryNewUser'
	result = await Etherpost.methods.register(nickname).send({ from: accounts[3] })
	result = await Etherpost.methods.numberOfUsers().call()
	assert.equal(result, 4)
	let eventMessage = 'not started yet'
  Etherpost.events.LogRegister((err, event) => {
  let eventReturn = ''
	  // we could do anything here, like insert a
	  eventMessage = 'success'
	  // console.log('Success #1!')
	  // console.log('addClap event:', event)
	  // console.log('accounts[1]', accounts[1])
	  if (err) {
	  	eventMessage = 'failure'
	  	// console.log('Failure #1!')
	  } 
	  assert.equal(event.event, 'LogRegister')
	  assert.equal(event.returnValues.usersEthAddress, accounts[3])
	  assert.equal(event.returnValues.username, nickname)
  })
})



// =========== FUNCTIONS BASED ON USERNAME ===============
it('Retrieve all hashes from one user based on username', async () => {
	let user1Address = await Etherpost.methods.getAddressFromName('joe').call()
	// console.log('user1Address getAddressFromName:', user1Address)
	let uploads = await Etherpost.methods.getUploads(user1Address).call()
	let l = uploads.length
	assert.equal(l, 1)
})


it('Returns correct number of images uploaded in total', async () => {
	result = await Etherpost.methods.numberOfImages().call()
	assert.equal(result, 5)
})




// =============== CLAPS =============
it('Adds a claps to an image from multiple users and retrieves number of claps', async () => {
	let testHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	let bytes32testHash = getBytes32FromIpfsHash(testHash)
	// set clap against testHash
	await Etherpost.methods.clap(bytes32testHash).send({ from: accounts[1] })
	await Etherpost.methods.clap(bytes32testHash).send({ from: accounts[2] })
	// retrieve number of claps for ipfsHash
	result = await Etherpost.methods.getClapCount(bytes32testHash).call()
	assert.equal(result, 2)
})


it('Listens to an "addClap" event', async () => {
	let testHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	let bytes32testHash = getBytes32FromIpfsHash(testHash)
	let eventMessage = 'not started yet'
  Etherpost.events.LogClap((err, event) => {
  let eventReturn = ''
	  // we could do anything here, like insert a
	  eventMessage = 'success'
	  // console.log('Success #1!')
	  // console.log('addClap event:', event)
	  // console.log('accounts[1]', accounts[1])
	  if (err) {
	  	eventMessage = 'failure'
	  	// console.log('Failure #1!')
	  } 
	  assert.equal(event.event, 'LogClap')
	  assert.equal(event.returnValues.clapper, accounts[1])
	  assert.equal(event.returnValues.ipfsHash, bytes32testHash)
  })
  await Etherpost.methods.clap(bytes32testHash).send({ from: accounts[1] })
  result = await Etherpost.methods.getClapCount(bytes32testHash).call()
  assert.equal(result, 3)
  assert.equal(eventMessage, 'success')
})




// =========== COMMENTS ===============
it('Adds a comment to an image from another user and retrieves comment', async () => {
	let imageHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	let commentHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ888'
	let bytes32imageHash = getBytes32FromIpfsHash(imageHash)
	let bytes32commentHash = getBytes32FromIpfsHash(commentHash)
	// add comment to ipfsHash (from account 1)
	await Etherpost.methods.addComment(bytes32imageHash, bytes32commentHash).send({ from: accounts[1] })
	// retreive comments array for the ipfsHash in question
	let commentsArray = await Etherpost.methods.getComments(bytes32imageHash).call()
	//confirm length of comments is now 1
	// console.log('commentsArray:', commentsArray)
	assert.equal(commentsArray.length, 1)
	//confirm comment hash of first (and only) comment is as per input
	let retrievedCommentHash = getIpfsHashFromBytes32(commentsArray[0])
	assert.equal(retrievedCommentHash, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ888')
})


it('Adds a second comment to an image from another user and retrieves all comments', async () => {
	let imageHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	let commentHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ999' //another hash used here
	let bytes32imageHash = getBytes32FromIpfsHash(imageHash)
	let bytes32commentHash = getBytes32FromIpfsHash(commentHash)
	// add comment to ipfsHash (from account 2)
	await Etherpost.methods.addComment(bytes32imageHash, bytes32commentHash).send({ from: accounts[2] })
	// retreive comments array for the ipfsHash in question
	let commentsArray = await Etherpost.methods.getComments(bytes32imageHash).call()
	// console.log('commentsArray:', commentsArray)
	//confirm length of comments is now 2
	assert.equal(commentsArray.length, 2)
	//confirm comment hashes of both comments is as per input
	let retrievedCommentHash1 = getIpfsHashFromBytes32(commentsArray[0])
	let retrievedCommentHash2 = getIpfsHashFromBytes32(commentsArray[1])
	assert.equal(retrievedCommentHash1, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ888')
	assert.equal(retrievedCommentHash2, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ999')
})


it('Listens to an "addComment" event', async () => {
	let imageHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ111'
	let commentHash = 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ777' //another hash used here
	let bytes32imageHash = getBytes32FromIpfsHash(imageHash)
	let bytes32commentHash = getBytes32FromIpfsHash(commentHash)
	let eventMessage = 'not started yet'
  Etherpost.events.LogComment((err, event) => {
	  // we could do anything here, like insert a
	  // new bit of HTML or change the state of our app
	  eventMessage = 'success'
	  // console.log('addcomment event:', event)
	  // console.log('Success #1!')
	  if (err) {
	  	eventMessage = 'failure'
	  	// console.log('addcomment event:', event)
	  } 
	  assert.equal(event.event, 'LogComment')
	  assert.equal(event.returnValues.commenter, accounts[2])
	  assert.equal(event.returnValues.imageHash, bytes32imageHash)
	  assert.equal(event.returnValues.commentHash, bytes32commentHash)
  })
  await Etherpost.methods.addComment(bytes32imageHash, bytes32commentHash).send({ from: accounts[2] })
	let commentsArray = await Etherpost.methods.getComments(bytes32imageHash).call()
	// console.log('commentsArray:', commentsArray)
	//confirm length of comments is now 2
	assert.equal(commentsArray.length, 3)
	//confirm comment hashes of both comments is as per input
	let retrievedCommentHash1 = getIpfsHashFromBytes32(commentsArray[0])
	let retrievedCommentHash2 = getIpfsHashFromBytes32(commentsArray[1])
	let retrievedCommentHash3 = getIpfsHashFromBytes32(commentsArray[2])
	assert.equal(retrievedCommentHash1, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ888')
	assert.equal(retrievedCommentHash2, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ999')
	assert.equal(retrievedCommentHash3, 'QmSFQ7KxjCVTNps823VmVu8jkwXdwDA7TJ8UxF5bZxZ777')
	assert.equal(eventMessage, 'success')
	// assert.equal(event.event, 'LogComment')
})

