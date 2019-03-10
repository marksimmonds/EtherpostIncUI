// import choo's template helper
var html = require('choo/html')

// export module
module.exports = function (_commentHash) {

	console.log('comment.js -> _commentHash:', _commentHash)


	// UNABLE TO CONVERT URL TO TEXT!!!
	// Have tried this function, but still not working

	async function fetchAsync (url) {
		let response = await fetch(url)
		return await response.text()
		console.log('comment.js -> response.text:', await response.text())
		return response.text()
	}
	
	// ===== COMMENT HTML TESTER =====
	// return html `
	// 	<p>TEST COMMENT</p>
	// 	`

	// ===== COMMENT HTML PROPER =====
	return html ` 	
		<p>${_commentHash}</p>
		`
}
