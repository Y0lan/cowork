const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('./../models/userModel');
const catchAsynchronousError = require('./../utils/catchAsynchronousError');
const AppError = require('./../utils/AppError');

// booking_type:
// - month : 24€
// - year : 240€
// - resident_month: 300€
// - resident_committed : 252€

const getSubscriptionPrice = (subscriptionType) => {
  const prices = {
    month: 24,
    year: 240,
    resident_month: 300,
    resident_committed: 252,
  };
  // Stripe expect cents
  return prices[`${subscriptionType}`] * 100;
};

const getSubscriptionsNames = (subscriptionType) => {
  const names = {
    month: 'Subscription 1 month',
    year: 'Subscription 1 year',
    resident_month: 'Subscription resident 1 month',
    resident_committed: 'Subscription resident 1 month engaged for 8 months',
  };
  return names[`${subscriptionType}`];
};

exports.checkSubscriptionType = (req, res, next) => {
  const available_booking = [
    'month',
    'year',
    'resident_month',
    'resident_committed',
  ];
  if (available_booking.includes(req.params.subscription_type)) {
    return next();
  }
  return next(
    new AppError(
      `booking type ${req.params.subscriptionType} does not exist`,
      400
    )
  );
};

exports.getCheckoutSession = catchAsynchronousError(async (req, res, next) => {
  const quantity = req.body.quantity | 1;
  // TODO implement subscription
  const subscription = req.body.subscription | false;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-subscription`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.subscription_type,
    line_items: [
      {
        name: getSubscriptionsNames(req.params.subscription_type),
        images: [
          'https://www.officelovin.com/wp-content/uploads/2017/10/nakedhub-coworking-11.jpg',
        ],
        amount: getSubscriptionPrice(req.params.subscription_type),
        currency: 'eur',
        quantity,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createSubscriptionCheckout = catchAsynchronousError(async (session) => {
  console.log(session);
  const user = (await User.findOne({ email: session.customer_email }))._id;
  user.subscription_type = session.client_reference_id;
  user.member_since = Date.now();
  await user.save();
});

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(error.message);
  }
  console.log(1);

  if (event.type === 'checkout.session.completed') {
    createSubscriptionCheckout(event.data.object);
    console.log(2);
  }
  res.status(200).json({ received: true });
};
