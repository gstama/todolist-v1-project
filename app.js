const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/util/date.js');
const config = require(__dirname + '/config.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(config.mongoConnectURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemsSchema);

app.get('/', (req, res, next) => {
  let day = date.getDate();

  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      if (items.length === 0) {
        const defaultItem1 = new Item({
          name: 'Welcome to your todo list!',
        });
        const defaultItem2 = new Item({
          name: 'Hit the + button to add a new item.',
        });
        const defaultItem3 = new Item({
          name: '<-- Hit this to delete an item.',
        });

        const defaultItems = [defaultItem1, defaultItem2, defaultItem3];

        Item.insertMany(defaultItems, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully saved default items to database');
          }
        });
        res.redirect('/');
      }
      res.render('list', {
        listTitle: day,
        items: items,
      });
    }
  });
});

app.post('/', (req, res, next) => {
  if (req.body.list === 'Work List') {
    workItems.push(req.body.newItem);
    res.redirect('/work');
  } else {
    const item = new Item({
      name: req.body.newItem,
    });
    item.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully added new item.');
      }
    });
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
