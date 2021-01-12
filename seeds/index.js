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
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //My userID, sanhei
      author: '5ff8aa889eb26f6c7c73de18',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.Dignissimos quo corporis deserunt dicta odit blanditiis, atque assumenda id quia.Optio voluptas corporis quam eius ea aut perspiciatis, voluptates obcaecati sed.Facere ipsam quae id sequi exercitationem numquam, accusamus doloribus consectetur unde adipisci repellendus iste esse distinctio suscipit at nesciunt maiores rerum harum perspiciatis.Voluptatem quidem distinctio sunt, aut magnam facilis.',
      price,
      geometry: {
        type: "Point", 
        coordinates:[cities[random1000].longitude, cities[random1000].latitude]
      },
      images: [
    {
      url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
      filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
    },
    {
      url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
     filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
   }
  ]
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})