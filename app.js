const express = require('express');
const fs = require('fs')

const app = express();
const spaces = JSON.parse(fs.readFileSync(`${__dirname}/data/spaces.json`));
app.get('/api/v1/spaces', (req, res) => {
  res.status(200).json(
      {
          status: 'success',
          results : spaces.length,
          data:
              {
                  spaces
              }
      }
  )
})
const port = 3000;
app.listen(port, () => {
  console.log('cowork.io is under construction...');
});
