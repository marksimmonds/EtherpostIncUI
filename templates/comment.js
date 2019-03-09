// import choo's template helper
var html = require('choo/html')

// export module
module.exports = function (_commentHash) {

	// console.log('comment.js -> _commentHash:', _commentHash)

	let commentUrl = 'https://ipfs.io/ipfs/QmfUGtjWituCi1qjTyQEMwXtnN9TTmYwqFCz6TpbjhQJ7r'
	// // console.log('comment.js -> _commentHash:', _commentHash)
	// // console.log('comment.js -> commentUrl:', commentUrl)

	async function fetchAsync (url) {
		let response = await fetch(url)
		return await response.text()
		console.log('comment.js -> response.text:', await response.text())
		return html `
			<div>
				<p>TEST COMMENT</p>
				<p>${await response.text()}</p>
			</div>
			`
	}

	// comment = await fetchAsync(commentUrl)
	// console.log('comment.js -> comment:', comment)

	// COMMENT HTML TESTER
	return html `
		<p>TEST COMMENT</p>
		`

	// COMMENT HTML PROPER
	// return html ` 	
	// 	<p>'${client.responseText}'</p>
	// 	<p txt='${client.responseText}'></p>
	// 	`
}


	// <p>${_commentHash}</p>
	// <p txt=${_commentHash}></p>
	// <a href="${_commentHash}"><img src=${_commentHash} /></a>

	// <p>${client.responseText}</p>
	// <p txt=${client.responseText}></p>
	// <a href="${client.responseText}"><img src=${client.responseText} /></a>
