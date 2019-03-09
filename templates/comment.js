// import choo's template helper
var html = require('choo/html')

// export module
module.exports = function (_commentHash) {

  // create html template
  return html`
    <body>
		  Comment: ${commentHash}<br>
    </body>
  `
}
