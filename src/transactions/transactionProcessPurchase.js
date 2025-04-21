/**
 * Transaction process graph for product orders:
 *   - default-purchase
 */

/**
 * Transitions
 *
 * These strings must sync with values defined in Marketplace API,
 * since transaction objects given by API contain info about last transitions.
 * All the actions in API side happen in transitions,
 * so we need to understand what those strings mean.
 */

export const transitions = {
  // When a customer makes an order for a listing, a transaction is
  // created with the initial request-payment transition.
  // At this transition a PaymentIntent is created by Marketplace API.
  // After this transition, the actual payment must be made on client-side directly to Stripe.
  APPLY_FOR_JOB: 'transition/apply-for-job',

  // A customer can also initiate a transaction with an inquiry, and
  // then transition that with a request.
  INQUIRE_JOB_MESSAGE: 'transition/inquire-job-message',
  APPLY_FOR_JOB_AFTER_INQUIRY: 'transition/apply-for-job-after-inquiry',

  // Approve the job application from the freelancer
  APPROVE_APPLICATION: 'transition/approve-application',

  // Decline the job application from the freelancer
  DECLINE_APPLICATION: 'transition/decline-application',
};

/**
 * States
 *
 * These constants are only for making it clear how transitions work together.
 * You should not use these constants outside of this file.
 *
 * Note: these states are not in sync with states used transaction process definitions
 *       in Marketplace API. Only last transitions are passed along transaction object.
 */

export const states = {
  INITIAL: 'initial',
  JOB_INQUIRY: 'job-inquiry',
  APPLICATION_PENDING: 'application-pending',
  APPLICATION_APPROVED: 'application-approved',
  APPLICATION_DECLINED: 'application-declined',
};

/**
 * Description of transaction process graph
 *
 * You should keep this in sync with transaction process defined in Marketplace API
 *
 * Note: we don't use yet any state machine library,
 *       but this description format is following Xstate (FSM library)
 *       https://xstate.js.org/docs/
 */
export const graph = {
  // id is defined only to support Xstate format.
  // However if you have multiple transaction processes defined,
  // it is best to keep them in sync with transaction process aliases.
  id: 'default-purchase/release-1',

  // This 'initial' state is a starting point for new transaction
  initial: states.INITIAL,

  // States
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.INQUIRE_JOB_MESSAGE]: states.JOB_INQUIRY,
        [transitions.APPLY_FOR_JOB]: states.APPLICATION_PENDING,
      },
    },
    [states.JOB_INQUIRY]: {
      on: {
        [transitions.APPLY_FOR_JOB_AFTER_INQUIRY]: states.APPLICATION_PENDING,
      },
    },

    [states.APPLICATION_PENDING]: {
      on: {
        [transitions.APPROVE_APPLICATION]: states.APPLICATION_APPROVED,
        [transitions.DECLINE_APPLICATION]: states.APPLICATION_DECLINED,
      },
    },

    [states.APPLICATION_APPROVED]: { type: 'final' },
    [states.APPLICATION_DECLINED]: { type: 'final' },
  },
};

// Check if a transition is the kind that should be rendered
// when showing transition history (e.g. ActivityFeed)
// The first transition and most of the expiration transitions made by system are not relevant
export const isRelevantPastTransition = transition => {
  return [
    transitions.APPLY_FOR_JOB,
    transitions.APPLY_FOR_JOB_AFTER_INQUIRY,
  ].includes(transition);
};

// Check if the given transition is privileged.
//
// Privileged transitions need to be handled from a secure context,
// i.e. the backend. This helper is used to check if the transition
// should go through the local API endpoints, or if using JS SDK is
// enough.
export const isPrivileged = transition => {
  return [transitions.APPLY_FOR_JOB, transitions.APPLY_FOR_JOB_AFTER_INQUIRY,].includes(
    transition
  );
};

// Check when transaction is completed (item is received and review notifications sent)
export const isCompleted = transition => {
  const txCompletedTransitions = [ transitions.APPROVE_APPLICATION ];

  return txCompletedTransitions.includes(transition);
};

// Check when transaction is refunded (order did not happen)
// In these transitions action/stripe-refund-payment is called
export const isRefunded = transition => {
  const txRefundedTransitions = [ transitions.DECLINE_APPLICATION ];

  return txRefundedTransitions.includes(transition);
};

// ActivityFeed needs this function.
export const isCustomerReview = transition => {
  return false;
};

// ActivityFeed needs this function.
export const isProviderReview = transition => {
  return false;
};

export const statesNeedingProviderAttention = [states.APPLICATION_PENDING];
