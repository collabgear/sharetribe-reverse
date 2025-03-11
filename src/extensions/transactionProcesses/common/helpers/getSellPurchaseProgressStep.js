import {
  states,
  transitions,
} from '../../sellPurchase/transactions/transactionProcessSellPurchase';
import {
  SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_MEET_MANAGER,
  SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PENDING_PAYMENT,
  SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PLACE_MACHINE,
  SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_REVIEW,
  SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,
  SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_REVIEW,
} from '../constants';

// These states map 1:1 to the steps
// Notice: There are other states need to handle more complex
const customerStateToStep = {
  [states.PENDING_PAYMENT]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PENDING_PAYMENT,
  [states.PAYMENT_EXPIRED]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PENDING_PAYMENT,

  [states.PURCHASE_CONFIRMED_BY_BUYER]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_MEET_MANAGER,
  [states.PURCHASE_EXPIRED]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_MEET_MANAGER,

  [states.COMPLETED]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_REVIEW,
  [states.REVIEWED_BY_PROVIDER]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_REVIEW,
  [states.REVIEWED]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_REVIEW,
  [states.REVIEWED_BY_CUSTOMER]: SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_REVIEW,
};
const providerStateToStep = {
  [states.PENDING_PAYMENT]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,
  [states.PENDING_PAYMENT]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,
  [states.PURCHASE_CONFIRMED_BY_BUYER]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,
  [states.PAYMENT_EXPIRED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,
  [states.PURCHASE_EXPIRED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER,

  [states.PURCHASED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  [states.CANCELED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  [states.STRIPE_INTENT_CAPTURED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  [states.SELLER_HANDLE_DISPUTED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  [states.OPERATOR_HANDLE_DISPUTED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,
  [states.REFUND_DISABLED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING,

  [states.COMPLETED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_REVIEW,
  [states.REVIEWED_BY_PROVIDER]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_REVIEW,
  [states.REVIEWED]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_REVIEW,
  [states.REVIEWED_BY_CUSTOMER]: SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_REVIEW,
};

const getCustomerProgressStep = ({ processState, transaction }) => {
  if (customerStateToStep[processState]) {
    return customerStateToStep[processState];
  }
  const { metadata: { buyerMarkMetManager } = {}, lastTransition } = transaction.attributes;

  switch (processState) {
    case states.REFUND_BEFORE_CAPTURE:
      return [
        transitions.BUYER_REFUND_BEFORE_SELLER_CONFIRMED,
        transitions.SELLER_REFUND_BEFORE_SELLER_CONFIRMED,
      ].includes(lastTransition)
        ? SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PENDING_PAYMENT
        : SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_MEET_MANAGER;

    case states.PURCHASED:
    case states.STRIPE_INTENT_CAPTURED:
    case states.REFUND_DISABLED:
    case states.SELLER_HANDLE_DISPUTED:
    case states.OPERATOR_HANDLE_DISPUTED:
    case states.CANCELED:
      return buyerMarkMetManager
        ? SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_PLACE_MACHINE
        : SELL_PURCHASE_PROGRESS_BAR_STEP_CUSTOMER_MEET_MANAGER;
    default:
      return null;
  }
};
const getProviderProgressStep = ({ processState, transaction }) => {
  if (providerStateToStep[processState]) {
    return providerStateToStep[processState];
  }

  const { lastTransition } = transaction.attributes;

  switch (processState) {
    case states.REFUND_BEFORE_CAPTURE:
      return [
        transitions.BUYER_REFUND_BEFORE_SELLER_CONFIRMED,
        transitions.SELLER_REFUND_BEFORE_SELLER_CONFIRMED,
      ].includes(lastTransition)
        ? SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_INTRO_MANAGER
        : SELL_PURCHASE_PROGRESS_BAR_STEP_SELLER_CONFIRM_MEETING;
    default:
      return null;
  }
};

export const getSellPurchaseProgressStep = ({ isCustomer, ...rest }) => {
  return isCustomer ? getCustomerProgressStep(rest) : getProviderProgressStep(rest);
};
