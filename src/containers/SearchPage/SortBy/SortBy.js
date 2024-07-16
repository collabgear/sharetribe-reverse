import React from "react";
import { string, bool } from "prop-types";

import { useConfiguration } from "../../../context/configurationContext";
import { intlShape, injectIntl } from "../../../util/reactIntl";
import { isMainSearchTypeKeywords } from "../../../util/search";

import SortByPlain from "./SortByPlain";
import SortByPopup from "./SortByPopup";

import css from "./SortBy.module.css";

const SortBy = (props) => {
	const config = useConfiguration();
	const {
		sort,
		showAsPopup,
		selectedFilters,
		isConflictingFilterActive,
		hasConflictingFilters,
		intl,
		mode,
		...rest
	} = props;

	const { relevanceKey, relevanceFilter, queryParamName } = config.search.sortConfig;

	const mobileClassesMaybe =
		mode === "mobile"
			? {
					rootClassName: css.sortBy,
					menuLabelRootClassName: css.sortByMenuLabel,
				}
			: {
					className: css.sortByDesktop,
					menuLabelRootClassName: css.sortByMenuLabel,
				};

	// Ensure that keywords is included to activeFilter list when needed
	const isMainSearchKeywords = isMainSearchTypeKeywords(config);
	const hasKeyworsFilter = config.search.defaultFilters.find((df) => df.key === relevanceFilter);
	const isKeywordsFilterEnabled = isMainSearchKeywords || hasKeyworsFilter;

	const activeOptions = isKeywordsFilterEnabled
		? Object.keys({ keywords: "", ...selectedFilters })
		: Object.keys(selectedFilters);

	const isRelevanceOptionActive = activeOptions.includes(relevanceFilter);

	const options = config.search.sortConfig.options.reduce((selected, option) => {
		const isRelevance = option.key === relevanceKey;
		const isConflictingFilterSetAndActive = hasConflictingFilters && !isConflictingFilterActive;

		// Some default options might be mapped with translation files
		const translationKeyLongMaybe = option?.labelTranslationKeyLong
			? { longLabel: intl.formatMessage({ id: option?.labelTranslationKeyLong }) }
			: {};
		const translatedOption = option?.labelTranslationKey
			? {
					key: option.key,
					label: intl.formatMessage({ id: option.labelTranslationKey }),
					...translationKeyLongMaybe,
				}
			: option;
		// Omit relevance option if mainSearchType is not 'keywords'
		// Note: We might change this in the future, if multiple transaction types are allowed
		return isRelevance && !isKeywordsFilterEnabled
			? selected
			: [
					...selected,
					{
						...translatedOption,
						disabled:
							(isRelevance && (!isRelevanceOptionActive || isConflictingFilterSetAndActive)) ||
							(!isRelevance && isConflictingFilterActive),
					},
				];
	}, []);
	const defaultValue = "createdAt";
	const isRelevanceSortActive = isRelevanceOptionActive && !sort;
	const relevanceValue =
		isRelevanceSortActive && selectedFilters[relevanceFilter]?.length > 0 ? relevanceKey : null;
	const initialValue =
		hasConflictingFilters && !isConflictingFilterActive
			? relevanceKey
			: sort || relevanceValue || defaultValue;
	const componentProps = {
		urlParam: queryParamName,
		label: intl.formatMessage({ id: "SortBy.heading" }),
		options,
		initialValue,
		...mobileClassesMaybe,
		...rest,
	};
	return showAsPopup ? <SortByPopup {...componentProps} /> : <SortByPlain {...componentProps} />;
};

SortBy.defaultProps = {
	sort: null,
	showAsPopup: false,
};

SortBy.propTypes = {
	sort: string,
	showAsPopup: bool,
	isConflictingFilterActive: bool.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(SortBy);
