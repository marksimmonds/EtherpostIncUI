// import choo's template helper
var html = require('choo/html')

// import template
var imageHtml = require('./image.js')

// export module
module.exports = function (state, emit, getImageObj) {

  console.log('main.js -> state:', state)


  // Get Uploads (returns an array)
  function upload(e) {
    e.preventDefault()
    var file = document.getElementById('file').files[0];
    console.log('main.js -> func upload -> file:', file)
    emit('upload', file)
  }


  // get Uploads from username (contract comms goes in index)
  function getPostsFromUsername(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    username = data.get('username')
    console.log('main.js -> getUploadsFromUsername -> username:', username)
    emit('getPostsFromUsername', username)
  }


  //try register user with just emit, contract comms goes in index.js
  function registerUser(e) {
    e.preventDefault()
    var data = new FormData(e.currentTarget)
    // console.log('main.js -> registerUser -> data:', data)
    username = data.get("registerUser")
    console.log('main.js -> registerUser -> username:', username)
    emit('registerUser', username)
  }


  function addComment(e) {
    console.log('main.js -> addComment -> e', e)
    e.preventDefault()
    var bytes32hash = e.target.name;
    var comment = e.target.addComment.value;
    console.log('main.js -> added a comment')
    emit('addComment', bytes32hash, comment)
  }


  function addClap(e){
    console.log('main.js -> addClap -> e', e)
    e.preventDefault()
    var bytes32hash = e.target.name;
    console.log('main.js -> added a clap')
    emit('addClap', bytes32hash)
  }


  // If EthAddress has a user associated, HTML is changed to suit....
  function getUserHtml() {
    // console.log('main.js -> func getUserHtml -> state.username:', state.username)
    if (state.username) {
      userHtml = html `
        <p class="font-weight-bold">Welcome back ${state.username}!</p>
        <br />
        `
    } else {
      userHtml = html `
        <form onsubmit="${registerUser}" method="POST">
          <label for="registerUser">You haven\'t registered yet - come join the fun. Register a username: </label>
          <input type="text" id="registerUser" name="registerUser">
        </form>
        <br />
        `
    }
    return userHtml
  }


  // Main HTML code
  return html `
  <div class="container-fluid">
    ${getUserHtml()}

    <form onsubmit="${upload}" method="post">
      <div      class="form-group">

        <label  for="file">Upload:</label><br>
        <input  type="file" 
                id="file" 
                name="file">
        <input  class="btn btn-primary"
                type="submit" 
                value="Add">
      </div>
    </form>

    <br />

    <form   onsubmit="${getPostsFromUsername}" 
            method="post">
      <div class="form-group">
        <label for="file">Show posts from other users:</label><br>
        <input  type="username" 
                id="username" 
                name="username">
        <input  class="btn btn-primary"
                type="submit" 
                value="Go Get 'em">
      </div>
    </form>

    <br />

    <!---
      ${console.log('main.js -> return html -> state.imageHashes:', state.imageHashes)}
      ${console.log('main.js -> return html -> state.username:', state.username)}
      ${console.log('main.js -> return html -> state:', state)}
    --->
    
    ${state.imageObjects.map(image => imageHtml(image, addClap, addComment, state))}
  </div>
  `
}
