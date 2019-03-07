// import choo's template helper
var html = require('choo/html')

// import template
var task = require('./image.js')

// export module
module.exports = function (state, emit) {

  // Get Uploads (returns an array)
  function upload(e) {
    e.preventDefault()
    var file = document.getElementById('file').files[0];
    console.log('file:', file)
    emit('upload', file)
  }

  // get Uploads from username (contract comms goes in index)
  function getPostsFromUsername(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    username = data.get("username")
    console.log('getUploadsFromUsername - main.js - username:', username)
    emit('getPostsFromUsername', username)
  }

  //try register user with just emit, and contract comms goes in index.js
  function registerUser(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    console.log('registerUser - data:', data)
    username = data.get("registerUser")
    console.log('registerUser - username:', username)
    emit('registerUser', username)
  }


  function addComment(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    comment = data.get("addComment")
    ipfsHash = ''
    emit('addComment', ipfsHash, comment)
  }

  function getUserHtml() {
    console.log('main - getUserHtml - state.username:', state.username)
    if (state.username) {
      userHtml = html `
        <p>Welcome back ${state.username}!</p>
        `
    } else {
      userHtml = html `
        <form onsubmit="${registerUser}" method="POST">
          <label for="registerUser">You haven\'t registered yet - come join the fun:</label>
          <input type="text" id="registerUser" name="registerUser">
        </form>
        `
    }
    console.log('state.username:', state.username)
    console.log('userHtml:', userHtml)
    return userHtml
  }

  function addClap(e){
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    console.log('addClap data:', data)
    data = data.get("addClap")
    console.log('added a clap')
    emit('addClap', data)
  }


  return html `
  <div>
    ${getUserHtml()}
    <form onsubmit="${upload}" method="post">
      <label for="file">Upload:</label><br>
      <input type="file" id="file" name="file">
      <input type="submit" value="Add">
    </form>
    <form onsubmit="${getPostsFromUsername}" method="post">
      <label for="file">Show posts from other users:</label><br>
      <input type="username" id="username" name="username">
      <input type="submit" value="Go Get 'em">
    </form>
    <br>
    
  </div>`
}
//     <!---${state.imageObjects.map(imageObj)}--->
    // ${state.imageHashes.map(image)}