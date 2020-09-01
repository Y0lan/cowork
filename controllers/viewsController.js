const moment = require('moment');

const Space = require('./../models/spaceModel');
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
    title: 'My account',
  });
};

exports.getSubscriptionsPlans = (req, res) => {
  res.status(200).render('subscriptions', {
    title: 'Subscribe',
  });
};

const getSubscriptionFromUser = (user) => {

  if(user.subscription_type === 'none') {
    return {subscriptionIsValid: false, subscription: 'You are not a member.'}
  }

  if (user.subscription_type === 'resident_committed') {
    const remainingTime = moment(Date.now())
      .add(8, 'months')
      .diff(moment(user.member_since));
    if (remainingTime <= 0)
      return {
        subscriptionIsValid: false,
        subscription: 'You have no time left. Please subscribe',
      };
  }
   //TODO refacto en fonction
  else {
    const remainingTime = moment(Date.now())
      .add(1, 'months')
      .diff(moment(user.member_since));
    if (remainingTime <= 0)
      return {
        subscriptionIsValid: false,
        subscription: 'You have no time left. Please subscribe',
      };
  }


  const messageForEachSubscriptionTypes = {
    month: `You are a member since ${moment(user.member_since).format(
      'DD/MM/YYYY'
    )}`,
    year: `You are a member since ${moment(user.member_since).format(
      'DD/MM/YYYY'
    )}`,
    resident: `You are a resident since ${moment(user.member_since).format(
      'DD/MM/YYYY'
    )}`,
    resident_committed: `You are a resident since ${moment(
      user.member_since
    ).format('DD/MM/YYYY')}. 
    You have committed for 8 months, so you have ${moment
      .duration(
        moment(Date.now()).add(8, 'months').diff(moment(user.member_since))
      )
      .humanize()} left`,
  };
  return {
    subscriptionIsValid: true,
    subscription: messageForEachSubscriptionTypes[`${user.subscription_type}`],
  };
};

exports.getMySubscription = (req, res) => {
  const { subscriptionIsValid, subscription } = getSubscriptionFromUser(
    req.user
  );
  res.status(200).render('overview', {
    title: 'My subscription',
    subscription,
    subscriptionIsValid,
  });
};
