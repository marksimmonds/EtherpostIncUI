// import choo's template helper	
var html = require('choo/html')

// export module
module.exports = function (_imageObj) {
	console.log('image.js-imagejOb:', _imageObj)

	var bytes32hash = _imageObj.bytes32hash
	var ipfsHash = _imageObj.ipfsHash
	var ipfsUrl = _imageObj.ipfsUrl
	var comments = _imageObj.comments
	var claps = _imageObj.claps

	// var username = state.username

	// console.log('index.js-image:', bytes32hash, ipfsHash, ipfsUrl, comments, claps )
	// console.log('index.js-username:', username )

	let image
  if (ipfsUrl) {
    image = html `
    <body>
    	<a href="${ipfsUrl}">
    	<img src="${ipfsUrl}" />
    	</a>
  	  <form action="/button-type">
	      <button type="button" name="addClap" for="addComment" id="addComment" onclick="${2+2}">Show some love!</button><br>
	    </form>
    	<form onsubmit="${2+2}" method="POST">
	      <label for="addComment">let '${3+3}' know what you think:</label>
	      <input type="text" id="addComment" name="addComment">
	    </form>
    </body>
    `
  }
  
  return image
}
//  imageObj = {ipfsHash: newIpfsHash, claps: 0, comments: []}
// module.exports = function (_imageObj) {
// 	var ipfsHash = _imageObj.hash
// 	var claps = _imageObj.claps
// 	var comment = _imageObj.comment
// 	var imageOwner = _imageObj.taskOwner

//   // create html template
//   return html`
//     <body>
// 	  	Image: ${ipfsHash}<br>
// 	  	Claps: ${claps}
// 			${state.comments.map(comment)}
// 			Owner: ${imageOwner}<br>
//     </body>
//   `
// }


//   <div id="">
//     <a href="${ipfsUrl}"><img src="${ipfsUrl}" /></a><br>${ADDCOMMENT(BYTES32HASH, }
//     <form onsubmit="${addComment}" method="POST">
//       <label for="addComment">let '${state.username}' know what you think:</label>
//       <input type="text" id="addComment" name="addComment">
//     </form>
//     <form action="/button-type">
//       <button type="button" name="addClap" for="addComment" id="addComment" onclick="${addClap(HASH)}">Show some love!</button><br>
//     </form>
//     <a href="${ipfsUrl}"><img src="${ipfsUrl}" /></a>
//   </div>

// FORM WITH INPUT AND BUTTON, GRAB INPUT ON BUTTON CLICK
// }

// - MARK@MARKSIMMONDS.COM