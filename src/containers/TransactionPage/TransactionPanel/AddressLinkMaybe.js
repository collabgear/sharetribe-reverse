import React from "react";
import classNames from "classnames";

import { ExternalLink } from "../../../components";
import { FormattedMessage } from "../../../util/reactIntl";
import css from "./TransactionPanel.module.css";

// Functional component as a helper to build AddressLinkMaybe
const AddressLinkMaybe = (props) => {
	const { className, rootClassName, linkRootClassName, location, geolocation, showAddress } = props;
	const { address, building } = location || {};
	const { lat, lng } = geolocation || {};
	const hrefToGoogleMaps = geolocation
		? `https://maps.google.com/?q=${lat},${lng}`
		: address
			? `https://maps.google.com/?q=${encodeURIComponent(address)}`
			: null;

	const fullAddress =
		typeof building === "string" && building.length > 0 ? `${building}, ${address}` : address;

	const classes = classNames(rootClassName || css.address, className);
	return showAddress && hrefToGoogleMaps ? (
		<p className={classes}>
			{fullAddress} <br />
			<span className={css.viewOnGoogleMapsWrapper}>
				<ExternalLink className={linkRootClassName} href={hrefToGoogleMaps}>
					<FormattedMessage id="AddressLinkMaybe.viewOnGoogleMaps" />
				</ExternalLink>
			</span>
		</p>
	) : null;
};

export default AddressLinkMaybe;
