import React from 'react';
import { FormattedMessage } from '../../../util/reactIntl';
import { NamedLink } from '../../../components';

import css from './NoSearchResultsMaybe.module.css';

const NoSearchResultsMaybe = props => {
  const { listingsAreLoaded, totalItems, location, resetAll, currentUser } = props;
  const userRole = currentUser?.attributes?.profile?.publicData?.userType || 'employer';
  const hasNoResult = listingsAreLoaded && totalItems === 0;
  const hasSearchParams = location.search?.length > 0;
  return hasNoResult ? (
    <div className={css.noSearchResults}>
      <FormattedMessage
        id={
          userRole === 'employer' ? "SearchPage.noJobResults" : "SearchPage.noTalentResults"
        }
      />
      <br />
      {hasSearchParams ? (
        <button className={css.resetAllFiltersButton} onClick={e => resetAll(e)}>
          <FormattedMessage id={'SearchPage.resetAllFilters'} />
        </button>
      ) : null}
      { userRole === 'employer' ? (
        <p>
          <NamedLink className={css.createListingLink} name="NewListingPage">
            <FormattedMessage id="SearchPage.createListing" />
          </NamedLink>
        </p>
      ) : null }
    </div>
  ) : null;
};

export default NoSearchResultsMaybe;
