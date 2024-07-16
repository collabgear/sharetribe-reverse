import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bool, func, shape, string } from "prop-types";
import { compose } from "redux";

import {
	Heading,
	IconKeys,
	IconKeysSuccess,
	LayoutSingleColumn,
	NamedLink,
	Page,
	ResponsiveBackgroundImageContainer,
} from "../../components";
import FooterContainer from "../../containers/FooterContainer/FooterContainer";
import TopbarContainer from "../../containers/TopbarContainer/TopbarContainer";
import { useConfiguration } from "../../context/configurationContext";
import { isScrollingDisabled } from "../../ducks/ui.duck";
import { FormattedMessage, injectIntl, intlShape } from "../../util/reactIntl";
import { propTypes } from "../../util/types";
import { parse } from "../../util/urlHelpers";
import PasswordResetForm from "./PasswordResetForm/PasswordResetForm";
import { resetPassword } from "./PasswordResetPage.duck";
import css from "./PasswordResetPage.module.css";

const parseUrlParams = (location) => {
	const params = parse(location.search);
	const { t: token, e: email } = params;
	return { token, email };
};

const ParamsMissingContent = () => {
	const recoveryLink = (
		<NamedLink name="PasswordRecoveryPage">
			<FormattedMessage id="PasswordResetPage.recoveryLinkText" />
		</NamedLink>
	);
	return (
		<div className={css.content}>
			<p>
				<FormattedMessage id="PasswordResetPage.invalidUrlParams" values={{ recoveryLink }} />
			</p>
		</div>
	);
};

const ResetFormContent = (props) => {
	const { handleSubmit, resetPasswordInProgress, resetPasswordError } = props;
	return (
		<div className={css.content}>
			<IconKeys className={css.modalIcon} />
			<Heading as="h1" rootClassName={css.modalTitle}>
				<FormattedMessage id="PasswordResetPage.mainHeading" />
			</Heading>
			<p className={css.modalMessage}>
				<FormattedMessage id="PasswordResetPage.helpText" />
			</p>
			{resetPasswordError ? (
				<p className={css.error}>
					<FormattedMessage id="PasswordResetPage.resetFailed" />
				</p>
			) : null}
			<PasswordResetForm
				className={css.form}
				onSubmit={handleSubmit}
				inProgress={resetPasswordInProgress}
			/>
		</div>
	);
};

const ResetDoneContent = () => {
	return (
		<div className={css.content}>
			<IconKeysSuccess className={css.modalIcon} />
			<Heading as="h1" rootClassName={css.modalTitle}>
				<FormattedMessage id="PasswordResetPage.passwordChangedHeading" />
			</Heading>
			<p className={css.modalMessage}>
				<FormattedMessage id="PasswordResetPage.passwordChangedHelpText" />
			</p>
			<NamedLink name="LoginPage" className={css.submitButton}>
				<FormattedMessage id="PasswordResetPage.loginButtonText" />
			</NamedLink>
		</div>
	);
};

export const PasswordResetPageComponent = (props) => {
	const [state, setState] = useState({ newPasswordSubmitted: false });
	const config = useConfiguration();
	const {
		intl,
		scrollingDisabled,
		location,
		resetPasswordInProgress,
		resetPasswordError,
		onSubmitPassword,
	} = props;

	const { token, email } = parseUrlParams(location);
	const hasParams = !!(token && email);
	const isPasswordSubmitted = state.newPasswordSubmitted && !resetPasswordError;

	const handleSubmit = (values) => {
		const { password } = values;
		setState({ newPasswordSubmitted: false });
		onSubmitPassword(email, token, password).then(() => {
			setState({ newPasswordSubmitted: true });
		});
	};

	return (
		<Page
			title={intl.formatMessage({
				id: "PasswordResetPage.title",
			})}
			scrollingDisabled={scrollingDisabled}
			referrer="origin"
		>
			<LayoutSingleColumn
				mainColumnClassName={css.layoutWrapperMain}
				topbar={<TopbarContainer />}
				footer={<FooterContainer />}
			>
				<ResponsiveBackgroundImageContainer
					className={css.root}
					childrenWrapperClassName={css.contentContainer}
					as="section"
					image={config.branding.brandImage}
					sizes="100%"
					useOverlay
				>
					{!hasParams ? (
						<ParamsMissingContent />
					) : isPasswordSubmitted ? (
						<ResetDoneContent />
					) : (
						<ResetFormContent
							handleSubmit={handleSubmit}
							resetPasswordInProgress={resetPasswordInProgress}
							resetPasswordError={resetPasswordError}
						/>
					)}
				</ResponsiveBackgroundImageContainer>
			</LayoutSingleColumn>
		</Page>
	);
};

PasswordResetPageComponent.defaultProps = {
	resetPasswordError: null,
};

PasswordResetPageComponent.propTypes = {
	scrollingDisabled: bool.isRequired,
	resetPasswordInProgress: bool.isRequired,
	resetPasswordError: propTypes.error,
	onSubmitPassword: func.isRequired,

	// from withRouter
	location: shape({
		search: string,
	}).isRequired,

	// from injectIntl
	intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
	const { resetPasswordInProgress, resetPasswordError } = state.PasswordResetPage;
	return {
		scrollingDisabled: isScrollingDisabled(state),
		resetPasswordInProgress,
		resetPasswordError,
	};
};

const mapDispatchToProps = (dispatch) => ({
	onSubmitPassword: (email, token, password) => dispatch(resetPassword(email, token, password)),
});

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const PasswordResetPage = compose(
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
	injectIntl,
)(PasswordResetPageComponent);

export default PasswordResetPage;
