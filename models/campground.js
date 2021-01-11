const mongoose = require('mongoose');
const Reivew = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
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