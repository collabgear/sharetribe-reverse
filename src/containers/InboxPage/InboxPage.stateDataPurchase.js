import {
	CONDITIONAL_RESOLVER_WILDCARD,
	ConditionalResolver,
	TX_TRANSITION_ACTOR_CUSTOMER as CUSTOMER,
	TX_TRANSITION_ACTOR_PROVIDER as PROVIDER,
} from "../../transactions/transaction";

// Get UI data mapped to specific transaction state & role
export const getStateDataForPurchaseProcess = (txInfo, processInfo) => {
	const { transactionRole } = txInfo;
	const { processName, processState, states } = processInfo;
	const _ = CONDITIONAL_RESOLVER_WILDCARD;

	return new ConditionalResolver([processState, transactionRole])
		.cond([states.INQUIRY, _], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.PENDING_PAYMENT, CUSTOMER], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.PENDING_PAYMENT, PROVIDER], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.CANCELED, _], () => {
			return { processName, processState, isFinal: true };
		})
		.cond([states.PURCHASED, PROVIDER], () => {
			return { processName, processState, actionNeeded: true, isSaleNotification: true };
		})
		.cond([states.DELIVERED, CUSTOMER], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.DISPUTED, _], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.COMPLETED, _], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.REVIEWED_BY_PROVIDER, CUSTOMER], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.REVIEWED_BY_CUSTOMER, PROVIDER], () => {
			return { processName, processState, actionNeeded: true };
		})
		.cond([states.REVIEWED, _], () => {
			return { processName, processState, isFinal: true };
		})
		.default(() => {
			// Default values for other states
			return { processName, processState };
		})
		.resolve();
};
