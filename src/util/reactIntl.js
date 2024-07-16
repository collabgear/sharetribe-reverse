import {
	createIntl,
	createIntlCache,
	FormattedDate,
	FormattedDateTimeRange,
	FormattedMessage,
	injectIntl,
	IntlProvider,
	useIntl,
} from "react-intl";
import { func, shape } from "prop-types";
// Note: we import React Intl directly from dist directory, because
// by default the library assumes the usage of ES modules
// and that don't work with server-side rendering.
// https://github.com/formatjs/formatjs/issues/1499#issuecomment-570151879

const intlShape = shape({
	formatDate: func.isRequired,
	formatDateTimeRange: func.isRequired,
	formatMessage: func.isRequired,
	formatNumber: func.isRequired,
	formatPlural: func.isRequired,
	formatRelativeTime: func.isRequired,
	formatTime: func.isRequired,
});
export {
	createIntl,
	createIntlCache,
	FormattedDate,
	FormattedDateTimeRange,
	FormattedMessage,
	injectIntl,
	IntlProvider,
	intlShape,
	useIntl,
};
