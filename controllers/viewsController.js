const Space = require('./../models/spaceModel');
const User = require('./../models/userModel');
const catchAsynchronousError = require('../utils/catchAsynchronousError');
const AppError = require('../utils/AppError');
exports.getOverview = catchAsynchronousError(async (req, res, next) => {
  const spaces = await Space.find();
  res.status(200).render('overview', {
    title: 'All Coworking Spaces',
    spaces,
  });
});
exports.getSpace = catchAsynchronousError(async (req, res, next) => {
  const space = await Space.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!space) return next(new AppError('No space exist at this address', 404));

  res.status(200).render('space', {
    title: `${space.name}`,
    space,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'login',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account'
  })
}

exports.getSubscriptionsPlans = (req, res) => {
  res.status(200).render('subscriptions', {
    title: 'Subscribe'
    })
}

const getSubscriptionFromUser = catchAsynchronousError(async id => {
  const user = await User.findById(id);
  const messageForEachSubscriptionTypes = {
    none: 'You are not a member.',
    month: `You are a member since ${user.member_since}`,
    year: `You are a member since ${user.member_since}`,
    resident: `You are a resident since ${user.member_since}`,
    resident_committed: `You are a resident since ${user.member_since}. 
    You have committed for 8 months, so you have ${user.member_since - Date.now()}`
  }
  return messageForEachSubscriptionTypes[`${user.subscription_type}`]
})

exports.getMySubscription = (req, res) => {
  const subscription = getSubscriptionFromUser(req.user.id);
  res.status(200).render('overview',{
    title: 'My subscription',
    subscription
  })
}
