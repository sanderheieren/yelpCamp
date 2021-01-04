require('dotenv').config()
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review')

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('mongodb database connection established successfully');
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    //important!!
    next();
  }
}

const validateReview = (req,res,next) =>{
  const {error} = reviewSchema.validate(req.body);
    if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
} 

app.get('/', (req, res) => {
  res.render('home.ejs')
});

app.get('/campgrounds', catchAsync(async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds', { campgrounds })
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
  //want to prepopulate
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id/', validateCampground, catchAsync(async (req, res, next) => {
  // everything is under campground, check the input html
  const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  review.save();
  campground.save();
  console.log(review);
  res.redirect(`/campgrounds/${campground._id}`)

}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, something went wrong';
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log('serving on port 3000');
})