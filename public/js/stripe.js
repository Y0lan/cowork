const stripe = Stripe('pk_test_51HLCw8Clba6dgGKLJWySkLZZR93dJAdLQMIKRx4JhOoXJHN8DQN2XqPzDSgEZYMcm7XFo7thbLpjY2zsBhtd7zJc00snikGMPs');
import { showAlert } from './alerts.js';
import axios from 'axios';

exports.subscribeUser = async subscriptionType => {
  try {
    // get checkout out session from API
    const session = await axios.get(`/api/v1/subscriptions/checkout-session/${subscriptionType}`)
    // use Stripe object to create the checkout form and charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    })

  } catch (error) {
    showAlert('error', error.message)
  }
}
