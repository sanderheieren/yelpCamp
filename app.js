const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('./models/campground');

const uri = 'mongodb+srv://sanderheieren:sander123@yelp-camp.s8lwq.mongodb.net/yelp-camp?retryWrites=true&w=majority'

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('mongodb datebase connection established sucsessfulyl');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home.ejs')
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds', { campgrounds })
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  //want to prepopulate
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground })

})



app.listen(3000, () => {
  console.log('serving on port 3000');
})