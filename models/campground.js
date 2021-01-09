const mongoose = require('mongoose');
const Reivew = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review" // an object id from a review model
  }]
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
      await Reivew.deleteMany({
        _id: {
          $in: doc.reviews
        }
      })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);