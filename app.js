const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const date = require(__dirname + '/util/date.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model('Item', itemsSchema);

const List = mongoose.model('List', listSchema);

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

app.get('/', (req, res, next) => {
  let day = date.getDate();

  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      if (items.length === 0) {
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
  const item = new Item({
    name: req.body.newItem,
  });

  if (req.body.list === date.getDate()) {
    item.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully added new item.');
      }
    });
    res.redirect('/');
  } else {
    List.findOne({ name: req.body.list }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/' + foundList.name);
      });
    });
  }
});

app.post('/delete', (req, res, next) => {
  if (req.body.listName === date.getDate()) {
    Item.findByIdAndRemove(req.body.checkbox.trim(), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Deletion Successful');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: req.body.listName },
      { $pull: { items: { _id: req.body.checkbox.trim() } } },
      (err, foundList) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/' + req.body.listName);
        }
      }
    );
  }
});

app.get('/:customListName', (req, res, next) => {
  const customListName = _.capitalize(req.params.customListName);
  const list = new List({
    name: customListName,
    items: defaultItems,
  });
  List.findOne({ name: customListName }, (err, foundList) => {
    if (err) {
      console.log(err);
    } else {
      if (foundList) {
        console.log(
          'List with the name: ' + customListName + ' already exists!'
        );
        res.render('list', {
          listTitle: foundList.name,
          items: foundList.items,
        });
      } else {
        list.save((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Custom list created!');
          }
        });
        res.redirect('/' + customListName);
      }
    }
  });
});

app.post('/work', (req, res, next) => {
  workItems.push(req.body.newItem);
  res.redirect('/work');
});

app.get('/about', (req, res, next) => {
  res.render('about');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running!');
});
