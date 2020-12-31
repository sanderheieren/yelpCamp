const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})