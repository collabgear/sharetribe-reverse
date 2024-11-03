import React, { Component } from 'react';
import { arrayOf, func, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { injectIntl, intlShape } from '../../../util/reactIntl';

import { FieldTextInput } from '../../../components';

import FilterPlain from '../FilterPlain/FilterPlain';
import FilterPopup from '../FilterPopup/FilterPopup';

import css from './KeywordFilter.module.css';

// When user types, we wait for new keystrokes a while before searching new content
const DEBOUNCE_WAIT_TIME = 600;
// Short search queries (e.g. 2 letters) have a longer timeout before search is made
const TIMEOUT_FOR_SHORT_QUERIES = 2000;

const getKeywordQueryParam = (queryParamNames) =>
  Array.isArray(queryParamNames)
    ? queryParamNames[0]
    : typeof queryParamNames === 'string'
      ? queryParamNames
      : 'keywords';

class KeywordFilter extends Component {
  constructor(props) {
    super(props);

    this.shortKeywordTimeout = null;
    this.mobileInputRef = React.createRef();
  }

  componentWillUnmount() {
    window.clearTimeout(this.shortKeywordTimeout);
  }

  render() {
    const {
      rootClassName,
      className,
      id,
      name,
      label,
      initialValues,
      contentPlacementOffset,
      onSubmit,
      queryParamNames,
      intl,
      showAsPopup,
      ...rest
    } = this.props;

    const classes = classNames(rootClassName || css.root, className);

    const urlParam = getKeywordQueryParam(queryParamNames);
    const hasInitialValues =
      !!initialValues && !!initialValues[urlParam] && initialValues[urlParam].length > 0;
    const labelForPopup = hasInitialValues
      ? intl.formatMessage(
          { id: 'KeywordFilter.labelSelected' },
          { labelText: initialValues[urlParam] }
        )
      : label;

    const labelClass = hasInitialValues ? css.labelPlainSelected : css.labelPlain;
    const labelForPlain = <span className={labelClass}>{label}</span>;

    const filterText = intl.formatMessage({ id: 'KeywordFilter.filterText' });
    const placeholder = intl.formatMessage({ id: 'KeywordFilter.placeholder' });

    // pass the initial values with the name key so that
    // they can be passed to the correct field
    const namedInitialValues = { [name]: initialValues[urlParam] };

    const handleSubmit = (values) => {
      const usedValue = values ? values[name] : values;
      onSubmit({ [urlParam]: usedValue });
    };

    const debouncedSubmit = debounce(handleSubmit, DEBOUNCE_WAIT_TIME, {
      leading: false,
      trailing: true,
    });
    // Use timeout for shart queries and debounce for queries with any length
    const handleChangeWithDebounce = (values) => {
      // handleSubmit gets values as params.
      // If this field ("keyword") is short, create timeout
      const hasKeywordValue = values && values[name];
      const keywordValue = hasKeywordValue ? values && values[name] : '';
      if (!hasKeywordValue || (hasKeywordValue && keywordValue.length >= 3)) {
        if (this.shortKeywordTimeout) {
          window.clearTimeout(this.shortKeywordTimeout);
        }
        return debouncedSubmit(values);
      }
      this.shortKeywordTimeout = window.setTimeout(
        () =>
          // if mobileInputRef exists, use the most up-to-date value from there
          this.mobileInputRef && this.mobileInputRef.current
            ? handleSubmit({ ...values, [name]: this.mobileInputRef.current.value })
            : handleSubmit(values),
        TIMEOUT_FOR_SHORT_QUERIES
      );
    };

    // Uncontrolled input needs to be cleared through the reference to DOM element.
    const handleClear = () => {
      if (this.mobileInputRef && this.mobileInputRef.current) {
        this.mobileInputRef.current.value = '';
      }
    };

    return showAsPopup ? (
      <FilterPopup
        className={classes}
        rootClassName={rootClassName}
        popupClassName={css.popupSize}
        name={name}
        label={labelForPopup}
        isSelected={hasInitialValues}
        id={`${id}.popup`}
        showAsPopup
        labelMaxWidth={250}
        contentPlacementOffset={contentPlacementOffset}
        onSubmit={handleSubmit}
        initialValues={namedInitialValues}
        keepDirtyOnReinitialize
        {...rest}
      >
        <FieldTextInput
          className={css.field}
          name={name}
          id={`${id}-input`}
          type="text"
          label={filterText}
          placeholder={placeholder}
          autoComplete="off"
        />
      </FilterPopup>
    ) : (
      <FilterPlain
        className={className}
        rootClassName={rootClassName}
        label={labelForPlain}
        isSelected={hasInitialValues}
        id={`${id}.plain`}
        liveEdit
        onSubmit={handleChangeWithDebounce}
        onClear={handleClear}
        initialValues={namedInitialValues}
        {...rest}
      >
        <fieldset className={css.fieldPlain}>
          <label className={css.fieldPlainLabel} htmlFor={`${id}-input`}>
            {filterText}
          </label>
          <FieldTextInput
            name={name}
            id={`${id}-input`}
            className={css.fieldPlainInput}
            inputRef={this.mobileInputRef}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
          />
        </fieldset>
      </FilterPlain>
    );
  }
}

KeywordFilter.defaultProps = {
  rootClassName: null,
  className: null,
  initialValues: null,
  contentPlacementOffset: 0,
};

KeywordFilter.propTypes = {
  rootClassName: string,
  className: string,
  id: string.isRequired,
  name: string.isRequired,
  queryParamNames: arrayOf(string).isRequired,
  label: string.isRequired,
  onSubmit: func.isRequired,
  initialValues: shape({
    keyword: string,
  }),
  contentPlacementOffset: number,

  // form injectIntl
  intl: intlShape.isRequired,
};

export default injectIntl(KeywordFilter);
