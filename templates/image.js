// import choo's template helper
var html = require('choo/html')

// export module

module.exports = function (image) {
  if (state.ipfsUrl) {
    image = html `
    <div id="">
      <a href="${state.ipfsUrl}"><img src="${state.ipfsUrl}" /></a><br>
      <form onsubmit="${addComment}" method="POST">
        <label for="addComment">let '${state.username}' know what you think:</label>
        <input type="text" id="addComment" name="addComment">
      </form>
      <form action="/button-type">
        <button type="button" name="addClap" for="addComment" id="addComment" onclick="${addClap}">Show some love!</button><br>
      </form>
      <a href="${state.ipfsUrl}"><img src="${state.ipfsUrl}" /></a>
    </div>
    `
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
}
