const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const myVariable = process.env.MYVARIABLE || 'default';

app.get('/', (req, res) => {
  res.send('Hello World! from E, myVar: ' + myVariable);
});

app.listen(port, () => {
  console.log(`App is running... (port: ${port})`);
});
