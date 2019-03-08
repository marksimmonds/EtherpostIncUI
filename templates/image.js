// import choo's template helper	
var html = require('choo/html')

// export module
// THIS IS CALLED IN 'MAIN.JS -> imageUpload()'
module.exports = function (_imageObj, addClap, addComment, state) {

	var ipfsHash = _imageObj.ipfsHash
	var bytes32hash = _imageObj.bytes32hash

	let image
  if (_imageObj.ipfsUrl) {
    image = html `
    <body>
    	<a href="${_imageObj.ipfsUrl}"><img src="${_imageObj.ipfsUrl}" /></a>
    	<input class="favorite styled"
				       type="button"
				       value="Claps makes me feel good"
				       onClick="${addClap}">
		  <p>Claps: <a id="clicks">0</a></p>
			<form name="${bytes32hash}" onsubmit="${addComment}" method="post">
		    <label for="addComment">Comment:</label>
		    <input type="text" id="addComment" name="addComment">
		    <input type="submit" value="Comment">
		  </form>
    </body>
    `
  }
  
  return image
}

// FORM WITH INPUT AND BUTTON, GRAB INPUT ON BUTTON CLICK