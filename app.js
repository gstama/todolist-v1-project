const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

var today = new Date();
const items = [];
const workItems = [];

app.get('/', (req, res, next) => {
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  let day = today.toLocaleDateString('en-US', options);

  res.render('list', {
    listTitle: day,
    items: items,
  });
});

app.post('/', (req, res, next) => {
  if (req.body.list === 'Work List') {
    workItems.push(req.body.newItem);
    res.redirect('/work');
  } else {
    items.push(req.body.newItem);
    res.redirect('/');
  }
});

app.get('/work', (req, res, next) => {
  res.render('list', { listTitle: 'Work List', items: workItems });
});

app.post('/work', (req, res, next) => {
  workItems.push(req.body.newItem);
  res.redirect('/work');
});

app.get('/about', (req, res, next) => {
  res.render('about');
});

app.listen(3000, () => {
  console.log('Server started!');
});
