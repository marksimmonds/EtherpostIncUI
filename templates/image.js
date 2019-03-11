// import choo's template helper	
var html = require('choo/html')

// import template
var commentHtml = require('./comment.js')

// export module
// THIS IS CALLED IN 'MAIN.JS -> imageHtml()'
// addClap and addComment are imported functions.
module.exports = function (_imageObj, addClap, addComment, state) {

	var ipfsHash		= _imageObj.ipfsHash
	var ipfsUrl			= _imageObj.ipfsUrl
	var bytes32hash = _imageObj.bytes32hash
	var claps 			= _imageObj.claps
	var comments 		= _imageObj.comments

	// console.log('image.js -> _imageObj:', _imageObj)
	// console.log('image.js -> _imageObj.claps', _imageObj.claps)
	// console.log('image.js -> _imageObj.comments', _imageObj.comments)

	// IMAGE HTML TESTER
	// let image = html `<p>Image goes here</p>`

	// IMAGE HTML PROPER
	let image
  if (ipfsUrl) {
    image = html `
    <body>
    	<div class="container">
    		<div 	class="col-md-4" 
    					style="padding-left: 0px;  
    					padding-right: 300px;">

		    	<a href="${ipfsUrl}"><img src="${ipfsUrl}" /></a>
		    	
		    	<input  class="btn btn-success"
					      	type="button"
					      	name="${bytes32hash}"
					      	value="claps"
					      	onclick="${addClap}">

					<p>${claps}</p>
		  	</div>
		  	<br>
		  </div>

			<ul class="list-group list-group-flush">
		  	${comments.map(commentHtml)}
		  </ul>

			<br>
			<form   class="form-group"
							name="${bytes32hash}" 
							onsubmit="${addComment}" method="post">

		    
		    <label  for="addComment">Add a comment:</label>
		    
		    <input  type="text" 
		    				id="addComment" 
		    				name="addComment">
		    <input  type="submit" 
		    				value="comment">
		  </form>
		  <br>
    </body>
    `
  }

  // console.log('image.js -> addClap:', addClap)
  // console.log({addClap})
  return image
}
