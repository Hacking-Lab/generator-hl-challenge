const express = require('express');
const app = express();
const path = require('path');
const { join } = require('path');

const port = 3000;

// Serve static files from the 'static' directory
app.use('/', express.static(join(__dirname, 'public')));


// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
