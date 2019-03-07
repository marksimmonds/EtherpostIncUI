// import choo's template helper
var html = require('choo/html')

// export module
//  imageObj = {ipfsHash: newIpfsHash, claps: 0, comments: []}
module.exports = function (_ipfsHash) {

  // create html template
  return html`
    <body>
		  Comment: ${ipfsHash}<br>
    </body>
  `
}
