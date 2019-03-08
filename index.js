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

// Alternative IPFS running web-only
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
    web3 = new Web3(await new Web3.providers.HttpProvider("http://localhost:8555"))
    
    // Set up contract interface
    state.contractInstance = new web3.eth.Contract(contractABI, "0x04D45b51fe4f00b4478F8b0719Fa779f14c8A194")
    // state.contractInstance = new web3.eth.Contract(contractABI, "0x60Bca9DA83FA632d1eE6DeC4CD767eD6141a14A2")
    // state.contractInstance = new web3.eth.Contract(contractABI, "0x6Da0B2D119929C9DE701437A1Dc42DC0435b12E2")
    // state.contractInstance = new web3.eth.Contract(contractABI, "0x87e574a978D49665D01DB26fc124cfF2Ff13E693")
    console.log('contract:', state.contractInstance)

    // Unlock account
    const accounts = await web3.eth.getAccounts()
    // web3.eth.personal.unlockAccount(accounts[0], async function (error, result) {
    //   if (error) {
    //     console.error('unlock account error:', error)
    //   }
    //   else {
    //     web3.eth.defaultAccount = accounts[0]
    //     // console.log('account number:', web3.eth.defaultAccount)
    //   }
    // })

    web3.eth.personal.unlockAccount(accounts[0], "test password!", 600)
      .then(web3.eth.defaultAccount = accounts[0])
      .then(console.log('Account unlocked!'))
      .then(console.log('default account - account[0]:', web3.eth.defaultAccount))

    console.log('web3.eth.defaultAccount:', web3.eth.defaultAccount)

    // web3.eth.getAccounts(accounts => console.log(accounts[0]))

    // Get Username from EthAddress
    state.username = await state.contractInstance.methods.getName(web3.eth.defaultAccount).call()
    console.log("app.use - username is:", state.username)

    //Retrieve all images from EthAddress
    state.imageHashes = await state.contractInstance.methods.getUploads(web3.eth.defaultAccount).call()
    console.log("app.use - state.imageHash are:", state.imageHashes)

    // Convert to object with other required info included
    state.imageObjects = state.imageHashes.map(getImageObject)
    console.log('app.use - state.imageObjects:', state.imageObjects)
    
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
        console.log('hash', result[0].hash)
        let newIpfsHash = getBytes32FromIpfsHash(result[0].hash)
        console.log('bytes32Hash:', newIpfsHash)
        let imageObj = {ipfsHash: newIpfsHash, claps: 0, comments: []}
        state.imageObjects.push(imageObj)
        state.ipfsUrl = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log('STATE.IPFSURL:' + state.ipfsUrl)
        state.contractInstance.methods.upload(newIpfsHash).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
          console.log("Success!", receipt)
          // state.message = await getUploads(state)
          emitter.emit('render')
        })
      })
    }
    reader.readAsArrayBuffer(file)
  })

  emitter.on('getPostsFromUsername', async function (_username) {
    let userAddress = await state.contractInstance.methods.getAddressFromName(_username).call()
    let uploads = await state.contractInstance.methods.getUploads(userAddress).call()
    let l = uploads.length
    console.log('userAddress:', userAddress, 'uploads:', uploads, 'l:', l)
    emitter.emit('render')   
  })

  emitter.on('addClap', async function (_ipfsHash) {
    console.log('_ipfsHash:', _ipfsHash)
    console.log('bytes32ipfsHash:', getBytes32FromIpfsHash(_ipfsHash))
    let newBytes32Hash = 
    await state.contractInstance.methods.clap(getBytes32FromIpfsHash(_ipfsHash)).send({ from: web3.eth.defaultAccount })
    .on('error', console.error)
    .on('receipt', async receipt => {
      console.log("Success - clap added", receipt)
      emitter.emit('render')
    })
  })

  emitter.on('addComment', async function (_imageHash, _comment) {
    _commentHash = getBytes32FromIpfsHash(_comment)
    await state.contractInstance.methods.comment(_imageHash, _commentHash).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
        console.log("Success!", receipt)
        emit('render')
    })
  })

  emitter.on('registerUser', async function (_username) {
    console.log('Emitter-registerUser _username:', _username)
    state.username = await state.contractInstance.methods.register(_username).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
      console.log("Success - user registered", receipt)
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
        console.log('hash', result[0].hash)
        let newIpfsHash = getBytes32FromIpfsHash(result[0].hash)
        console.log('bytes32Hash:', newIpfsHash)
        state.ipfsUrl = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log('STATE.IPFSURL:' + state.ipfsUrl)
        state.contractInstance.methods.upload(newIpfsHash).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
          console.log("Success!", receipt)
          // state.message = await getUploads(state)
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

// Return uploads from smart contract for given user
function getUploadsForUser(state, user) {
    return new Promise(function (resolve, reject) {
        state.contractInstance.methods.getUploads(user).call().then(function (response) {
            resolve(response);
        });
    });
}

// Takes necessary inputs and returns object for each image that includes the full url, the clap count and the array of comments.
// This is used in main.js 'return html', where it is passed to the image.js & comment.js rendering modules.
function getImageObject(_bytes32ipfsHash) {
  let ipfsHash = getIpfsHashFromBytes32(_bytes32ipfsHash)
  // console.log('func-getImageObj-bytes32Hash:', ipfsHash)
  let ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`
  // console.log('func-getImageObj-ipfsUrl:', ipfsUrl)
  let claps = getClaps(_bytes32ipfsHash)
  // console.log('func-getImageObj-claps:', claps)
  let comments = getComments(_bytes32ipfsHash)
  // console.log('func-getImageObj-comments:', comments)
  return {bytes32hash: _bytes32ipfsHash, ipfsHash: ipfsHash, ipfsUrl: ipfsUrl, claps: claps, comments: comments}
}

async function getClaps(_bytes32ipfsHash) {
  let claps = await sstate.contractInstance.methods.getClaps(_bytes32ipfsHash).call()
  return claps
}

async function getComments(_bytes32ipfsHash) {
  let comments = await state.contractInstance.methods.getCcomments(_bytes32ipfsHash).call()
  return comments
}

// Return clap count from smart contract for given upload ipfsHash
// function getClaps(state, ipfsHash) {
//     return new Promise(function (resolve, reject) {
//         state.etherPostContract.methods.getClapCount(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
//             resolve(response);
//         });
//     });
// }

// // Return comments from smart contract for given upload ipfsHash
// function getComments(state, ipfsHash) {
//     return new Promise(function (resolve, reject) {
//         state.contractInstance.methods.getComments(getBytes32FromIpfsHash(ipfsHash)).call().then(function (response) {
//             resolve(response);
//         });
//     });
// }
