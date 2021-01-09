const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Made a new campground');
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
      .populate({
        path:'reviews',
        populate: {
          path: 'author' // for each of the reviews on the campground
        }
      }).populate('author'); // for the ONE campground
  if(!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
  //want to prepopulate
  const { id } = req.params;
  const campground = await Campground.findById(id);
   if(!campground) {
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
  // everything is under campground, check the input html
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'successfully updated campground')
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully Deleted Campground')
  res.redirect('/campgrounds');
}