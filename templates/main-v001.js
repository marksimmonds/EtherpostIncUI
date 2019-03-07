// import choo's template helper
var html = require('choo/html')

// import template
var task = require('./image.js')

// export module
module.exports = function (state, emit) {

  function upload(e) {
    e.preventDefault()
    var file = document.getElementById('file').files[0];
    console.log('file:', file)
    emit('upload', file)
  }

  // Get Uploads (returns an array)
  function getUploadsFromUsername(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    _name = data.get("username")
    console.log('_name:', _name)
    // first get ethAddress from username
    async () => {
      let ethAddress = await state.contractInstance.methods.getAddressFromName(_name).send({ from: web3.eth.defaultAccount })
        .on('error', console.error)
        .on('receipt', async receipt => {
        console.log("getAddressFromName Success!", receipt)
        })
      console.log('ethAddress:', ethAddress)
    // next retrive ipfsHashes array from ethAddress
      let uploadsArray = await state.contractInstance.methods.getUploads(ethAddress).send({ from: web3.eth.defaultAccount })
      .on('error', console.error)
      .on('receipt', async receipt => {
        console.log("getUploads Success!", receipt)
        console.log('uploadsArray:', uploadsArray)
      emit('render')
      })
    }
  }

  // Get Uploads (returns an array)
  function upload(e) {
    e.preventDefault()
    var file = document.getElementById('file').files[0];
    console.log('file:', file)
    emit('upload', file)
  }

  async function getUploadsFromUsername(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    _name = data.get("username")
    console.log('_name:', _name)
    let userAddress = await Etherpost.methods.getAddressFromName(_name).call()
    let uploads = await Etherpost.methods.getUploads(userAddress).call()
    let l = uploads.length
    console.log('userAddress:', userAddress)
    console.log('uploads:', uploads)
    console.log('l:', l)
  }
  //   // first get ethAddress from username
  //   state.contractInstance.methods.getAddressFromName(_name).send({ from: web3.eth.defaultAccount })
  //       .on('error', console.error)
  //       .on('receipt', async receipt => {
  //       console.log("getAddressFromName Success!", receipt)
  //       })
  //   // next retrive ipfsHashes array from ethAddress
  //   state.contractInstance.methods.getUploads(ethAddress).send({ from: web3.eth.defaultAccount })
  //     .on('error', console.error)
  //     .on('receipt', async receipt => {
  //       console.log("getUploads Success!", receipt)
  //       console.log('uploadsArray:', uploadsArray)
  //     emit('render')
  //   })


  function registerUser(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    username = data.get("registerUser")
    console.log('username:', username)
    console.log('defaultAccount:', web3.eth.defaultAccount)
    state.contractInstance.methods.register(username).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
      console.log("Success!", receipt)
      state.username = username
      emit('render')
    })
  }

  function getUsername() {
    let username = state.contractInstance.methods.getName(web3.eth.defaultAccount).call()
    .on('error', console.error)
    .on('receipt', async receipt => {
        console.log("Success!", receipt)
        emit('render')
    })
  }

  function addComment(e) {
    // UNFINISHED!!!
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    comment = data.get("addComment")
    ipfsHash = ''
    // need to get ipfsHash
    //save to file
    // upload to ipfs
    // get bytes32 of hash
    // append to comments mapping
    let commentHash = ''
    let comment = state.contractInstance.methods.comment(imageHash, commentHash).send({ from: web3.eth.defaultAccount, gas: 200000 })
    .on('error', console.error)
    .on('receipt', async receipt => {
        console.log("Success!", receipt)
        emit('render')
    })
  }

  function getUserHtml() {
    if (state.username) {
      userHtml = 'Welcome back ${state.username}!'
    } else {
      userHtml = 'You haven\'t registered yet - come join the fun!.....'
    }
    return userHtml
  }

  function addClap(){
    
  }

  let image
  if (state.ipfsUrl) {
    image = html `
    <a href="${state.ipfsUrl}"><img src="${state.ipfsUrl}" /></a><br>
    <form onsubmit="${addComment}" method="POST">
      <label for="addComment">let '${state.username}' know what you think:</label>
      <input type="text" id="addComment" name="addComment">
    </form>
    <form action="/button-type">
      <button type="button" onclick="alert('This button does nothing.')">Show some love!</button><br>
    </form>
    `
  }




  return html `
  <div>
      <form onsubmit="${registerUser}" method="POST">
        ${getUserHtml()}
        <label for="registerUser">Register your username:</label>
        <input type="text" id="registerUser" name="registerUser">
      </form>

    <form onsubmit="${upload}" method="post">
      <label for="file">Upload:</label><br>
      <input type="file" id="file" name="file">
      <input type="submit" value="Add">
    </form>
    <form onsubmit="${getUploadsFromUsername}" method="post">
      <label for="file">Show Images from User:</label><br>
      <input type="username" id="username" name="username">
      <input type="submit" value="Go Get 'em">
    </form>
    <br>
    ${image}
  </div>`
}