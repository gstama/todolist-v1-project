const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var today = new Date();
var items = [];

app.get('/', (req, res, next) => {
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  var day = today.toLocaleDateString('en-US', options);

  res.render('list', {
    day: day,
    items: items,
  });
});

app.post('/', (req, res, next) => {
  items.push(req.body.newItem);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started!');
});
