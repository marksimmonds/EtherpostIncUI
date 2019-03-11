// import choo's template helper
var html = require('choo/html')

// Initialize IPFS
var IPFS = require('ipfs')
var node = new IPFS()

// export module
module.exports = function (commentHash) {

	// console.log('comment.js -> commentHash:', commentHash)

	(async function getText (_commentHash) {
	  return await node.cat(_commentHash).toString('utf8')
	})()

	// let commentText = Promise.all(getText(commentHash))
	// console.log('comment.js -> commentText:', commentText)

	// ===== COMMENT HTML TESTER =====
	// return html `
	// 	<p>TEST COMMENT</p>
	// 	`

	// ===== COMMENT HTML PROPER =====
	return html ` 	
		<li class="list-group-item">${commentHash}</li>
		`
}
