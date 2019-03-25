// import choo
var choo = require('choo')
var html = require('choo/html')

// initialize choo
var app = choo()

// Buffer for files
var buffer = require('buffer')

// Initialize IPFS
var IPFS = require('ipfs')
var node = new IPFS()

// ALTERNATIVE IPFS RUNNING WEB-ONLY
// var IPFS = require('ipfs-http-client')
// var node = new IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

// import template
var main = require('./templates/main.js')

// import web3
var Web3 = require('web3')

// Import contract ABI
var contractABI = require("./dist/contracts/Etherpost.json").abiDefinition

// Import bs58 library (IPFS Hashing algorithm)
const bs58 = require('bs58')

app.use(function (state, emitter) {

  // initialize state
  state.username = ''
  state.userView = state.username // This is the users whose posts are being viewed (will be own posts initially)
  state.imageHashes = []
  state.imageObjects = [] 

  emitter.on('DOMContentLoaded', async () => {
    // Check for web3 instance. Create if necessary.
    // Access MetaMask
    if (window.ethereum) {
        try {
            await window.ethereum.enable()
        } catch (error) {
            console.log('Error:', error)
        }
    }

    // Set up web3 provider
    // web3 = new Web3(await new Web3.providers.HttpProvider("http://localhost:8555"))
    web3 = new Web3(await new Web3.providers.WebsocketProvider("ws://localhost:8555"))
    
    // Set up contract interface
    state.contractInstance = new web3.eth.Contract(contractABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")
    // state.contractInstance = new web3.eth.Contract(contractABI, "0x321eF1b12d422F6526b9F4D0B11c27be53c80Ee8")
    console.log('index.js -> state.contractInstance:', state.contractInstance)

    // Unlock account
    const accounts = await web3.eth.getAccounts()


    // ===== ALTERNATIVE METHOD FOR OTHER WALLET VERSIONS =====

    // web3.eth.personal.unlockAccount(accounts[0], async function (error, result) {
    //   if (error) {
    //     console.error('unlock account error:', error)
    //   }
    //   else {
    //     web3.eth.defaultAccount = accounts[0]
    //     // console.log('account number:', web3.eth.defaultAccount)
    //   }
    // })


    web3.eth.personal.unlockAccount(accounts[1], "test password!", 600)
      .then(web3.eth.defaultAccount = accounts[1])
      .then(console.log('index.js -> app.use -> Account unlocked:', web3.eth.defaultAccount))


    // =========== SECTION TO RETRIEVE RELEVANT VALUES FROM THE SMART CONTRACT AND INSERT INTO STATE
    // =========== INCLUDES - USERNAME, USERS IMAGES AND DERIVES AN IMAGE OBJECT TO INCLUDE HASH, URL, CLAPS & COMMENTS.

    // Get Username from EthAddress
    // Retrieve all images from EthAddress
    // Derive an object from the imageHash that includes other required info

    // Above commented-out code now covered in this function....
    await updateState(state)
    emitter.emit('render')


    // =========== LISTEN FOR SMART CONTRACT EVENTS

    await state.contractInstance.events.LogClap(async (err, event) => {
      console.log('index.js -> app.use -> addClapEvent: addClap event has occurred')

        if (err) {
          console.log('index.js -> app.use -> addClapEvent -> err:', err)
        } 

        // update entire state variables if event has occurred, and re-render
        await updateState(state)
        emitter.emit('render')
      })


    // addComment Event
    // Listens for event of addComment in smart contract and updates the webpage
    state.contractInstance.events.LogComment(async (err, event) => {
      console.log('index.js -> app.use -> addCommentEvent: addComment event has occurred')

      if (err) {
          console.log('index.js -> app.use -> addClapEvent -> err:', err)
        } 

        // update entire state variables if event has occurred, and re-render
        await updateState(state)
        emitter.emit('render')
      })


    // addUpload Event
    // Listens for event of addUpload in smart contract and updates the webpage
    state.contractInstance.events.LogUpload(async (err, event) => {
      console.log('index.js -> app.use -> addUploadEvent: addComment event has occurred')

      if (err) {
          console.log('index.js -> app.use -> addClapEvent -> err:', err)
        } 

        // update entire state variables if event has occurred, and re-render
        await updateState(state)
        emitter.emit('render')
      })


    // register Event
    // Listens for event of register (a user) in smart contract and updates the webpage
    state.contractInstance.events.LogRegister(async (err, event) => {
    console.log('index.js -> app.use -> addUploadEvent: addComment event has occurred')

    if (err) {
        console.log('index.js -> app.use -> addClapEvent -> err:', err)
      } 
      
      // update entire state variables if event has occurred, and re-render
      await updateState(state)
      emitter.emit('render')
    })



    // Final Emit after DOM has loaded
    emitter.emit('render')
  })


  emitter.on('upload', async function (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const buf = buffer.Buffer(reader.result)
      node.add(buf, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        // console.log('index.js -> app.use -> emitter upload -> hash', result[0].hash)
        let newIpfsHash = getBytes32FromIpfsHash(result[0].hash)
        // console.log('index.js -> app.use -> emitter upload -> bytes32Hash:', newIpfsHash)
        let imageObj = {ipfsHash: newIpfsHash, claps: 0, comments: []}
        state.imageObjects.push(imageObj)
        state.ipfsUrl = `https://ipfs.io/ipfs/${result[0].hash}`
        // console.log('index.js -> app.use -> emitter upload -> state.ipfsUrl:' + state.ipfsUrl)
        state.contractInstance.methods.upload(newIpfsHash).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
          console.log('index.js -> app.use -> emitter upload from contract - Success!', receipt)
          emitter.emit('render')
        })
      })
    }
    reader.readAsArrayBuffer(file)
  })


  // This allows registered users only to get the uploads posted by another registered user by entering the other users username.
  emitter.on('getPostsFromUsername', async function (_username) {
    state.userView = _username
    console.log('index.js -> app.use -> emitter getPostsFromUsername -> state.userView:', state.userView)
    let _userViewEthAddress = await state.contractInstance.methods.getAddressFromName(state.userView).call()
    console.log('index.js -> app.use -> emitter getPostsFromUsername -> _userViewEthAddress:', _userViewEthAddress)
    let uploads = await state.contractInstance.methods.getUploads(_userViewEthAddress).call({from: web3.eth.defaultAccount})
    let l = uploads.length
    console.log('index.js -> app.use -> emitter getPostsFromUsername -> state.userView:', state.userView, `${state.userView}`, 'uploads:', uploads, 'l:', l)
    console.log('index.js -> app.use -> emitter getPostsFromUsername -> userViewEthAddress:', _userViewEthAddress)
    await updateState(state)
    console.log('index.js -> app.use -> emitter getPostsFromUsername -> state updated!', state)
    emitter.emit('render')   
  })


  // Adds a clap to the smart contract (called from 'addClap function in main.js')
  emitter.on('addClap', async function (_imageHash) {
    console.log('index.js -> app.use -> addClap -> _imageHash:', _imageHash)

    await state.contractInstance.methods.clap(_imageHash).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
      console.log('index.js -> emitter addClap -> Success - clap added to contract', receipt)
      emitter.emit('render')
    })
  })


  emitter.on('addComment', async function (_imageHash, _comment) {
    // console.log('index.js -> app.use -> emitter -> addComment -> _imageHash:', _imageHash, '_comment:', _comment)

    // upload comment to IPFS:
    const buf = buffer.Buffer(_comment)
    node.add(buf, (err, result) => {
      if (err) {
          console.error(err)
          return
      }
      // console.log('index.js -> app.use -> emitter -> addComment -> commentHash', result[0].hash)
      let bytes32commentHash = getBytes32FromIpfsHash(result[0].hash)
      // console.log('index.js -> app.use -> emitter -> addComment -> bytes32CommentHash:', bytes32commentHash)

      // Add bytes32commentHash into the contract
      state.contractInstance.methods.comment(_imageHash, bytes32commentHash).send({ from: web3.eth.defaultAccount, gas: 200000 })
      .on('error', console.error)
      .on('receipt', async receipt => {
        console.log('index.js -> app.use -> emitter -> addComment -> Comment added to contract - Success!', receipt)
        emitter.emit('render')
      })
    })
  })  


  emitter.on('registerUser', async function (_username) {
    // console.log('index.js -> app.use -> emitter -> registerUser _username:', _username)
    state.username = await state.contractInstance.methods.register(_username).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
      console.log('index.js -> app.use -> emitter -> registerUser -> Success!', receipt)
      state.userView = _username
      emitter.emit('render')
    })
  })


  emitter.on('getUploads', async function (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const buf = buffer.Buffer(reader.result)
      node.add(buf, (err, result) => {
        if (err) {
            console.error(err)
            return
        }
        // console.log('index.js -> app.use -> emitter -> getUploads -> hash', result[0].hash)
        let newIpfsHash = getBytes32FromIpfsHash(result[0].hash)
        // console.log('index.js -> app.use -> emitter -> getUploads -> bytes32Hash:', newIpfsHash)
        state.ipfsUrl = `https://ipfs.io/ipfs/${result[0].hash}`
        // console.log('index.js -> app.use -> emitter -> getUploads -> state.ipfsUrl:' + state.ipfsUrl)
        state.contractInstance.methods.upload(newIpfsHash).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
          console.log('index.js -> app.use -> emitter -> getUploads -> upload from contract-> Success!', receipt)
          emitter.emit('render')
        })
      })
    }
    reader.readAsArrayBuffer(file)
  })
})


// create a route
app.route('/', main)
// start app
app.mount('div')



// ========= FUNCTIONS ==========

// Retrieves all required values from the Smart Contract and puts them into 'state' variables
async function updateState(state) {
  // Get Username from EthAddress
  state.username = await state.contractInstance.methods.getName(web3.eth.defaultAccount).call()
  console.log('index.js -> func updateState -> state.username:', state.username)

  // Get Eth Address of the Images that we want to view (from the state.userView variable)
  let userViewEthAddress = await state.contractInstance.methods.getAddressFromName(state.userView).call()
  console.log('index.js -> func updateState -> state.userView & EthAddress:', state.userView, userViewEthAddress)

  // Retrieve all images from EthAddress
  state.imageHashes = await state.contractInstance.methods.getUploads(userViewEthAddress).call()
  console.log('index.js -> func updateState -> state.imageHashes:', state.imageHashes)

  // Derive an object from the imageHash that includes other required info
  state.imageObjects = state.imageHashes.map(imageHash => getImageObject(state, imageHash))
  // console.log('index.js -> app.use -> state.imageObjects.length:', state.imageObjects.length)
  // state.imageObjects = [ await getImageObject(state, state.imageHashes[0])]

  for (let i = 0; i < state.imageObjects.length; i++) {
    state.imageObjects[i] = await getImageObject(state, state.imageHashes[i])
    console.log('index.js -> func updateState -> state.imageObjects:', state.imageObjects[i])
    // console.log('index.js -> app.use -> state.imageObjects: -> claps:', state.imageObjects[i].claps)
  }
}


// Takes necessary inputs and returns object for each image that includes the full url, the clap count and the array of comments.
// This is used in main.js 'return html', where it is passed to the image.js & comment.js rendering modules.
async function getImageObject(state, _bytes32ipfsHash) {
  // console.log('index.js -> func getImageObject -> _bytes32ipfsHash:', _bytes32ipfsHash)
  let ipfsHash = getIpfsHashFromBytes32(_bytes32ipfsHash)
  console.log('index.js -> func getImageObject -> bytes32Hash:', ipfsHash)
  let ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
  console.log('index.js -> func getImageObject -> ipfsUrl:', ipfsUrl)
  let claps = await getClaps(state, _bytes32ipfsHash)
  // console.log('index.js -> func getImageObject -> claps:', claps)
  let comments = await getComments(state, _bytes32ipfsHash)
  // console.log('index.js -> func getImageObject -> comments:', comments)
  return {bytes32hash: _bytes32ipfsHash, ipfsHash: ipfsHash, ipfsUrl: ipfsUrl, claps: claps, comments: comments}
}


async function getClaps(state, _bytes32ipfsHash) {
  // console.log('index.js -> func getClaps -> state:', state)
  // console.log('index.js -> func getClaps -> _bytes32ipfsHash:', _bytes32ipfsHash)
  let claps = await state.contractInstance.methods.getClapCount(_bytes32ipfsHash).call()
  return claps
}


async function getComments(state, _bytes32ipfsHash) {
  // console.log('index.js -> func getComments -> state:', state)
  // console.log('index.js -> func getComments -> _bytes32ipfsHash:', _bytes32ipfsHash)
  let commentsBytes32Hashes = await state.contractInstance.methods.getComments(_bytes32ipfsHash).call()
  let commentsIpfsHashes = commentsBytes32Hashes.map(getIpfsHashFromBytes32)
  // let commentsUrls = commentsIpfsHashes.map(async hash => return `https://ipfs.io/ipfs/${hash}`)
  // Promise.all(commentsUrls).then((completed) => completed)
  console.log('index.js -> func getComments -> commentsIpfsHashes:', commentsIpfsHashes)
  // console.log('index.js -> func getComments -> commentsIpfsHashes[0]:', commentsIpfsHashes[0])
  // let commentsText = []
  // for (k = 0; k < commentsIpfsHashes.length; k++) {
  //   commentsText[k] = await getText(commentsIpfsHashes[k])
  // }
  // console.log('index.js -> func getComments -> commentsText', commentsText)
  return commentsIpfsHashes
}


// async function getText (longHash) {
//   await node.cat(longHash).then((file) => {
//     text = file.toString('utf8')
//     // console.log('index.js -> func getText -> text:', text)
//     // TODO: Find the relevant data in the file
//     return (text)
//   })
// }


// Return bytes32 hex string from IPFS hash
function getBytes32FromIpfsHash(ipfsHash) {
  return "0x" + bs58.decode(ipfsHash).slice(2).toString('hex')
}


// Return base58 encoded ipfs hash from bytes32 hex string
function getIpfsHashFromBytes32(bytes32Hex) {
  // console.log('index.js -> func getIpfsHashFromBytes32 -> bytes32Hex:', bytes32Hex)
  // Add default ipfs values for first 2 bytes: function: 0x12=sha2, size: 0x20=256 bits
  // Cut off leading "0x"
  const hex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hex, 'hex')
  const str = bs58.encode(hashBytes)
  return str
}
