import React from "react";
import classNames from "classnames";
import { array, node, string } from "prop-types";

import css from "./Track.module.css";

const Track = (props) => {
	const { rootClassName, className, children, handles, valueToPosition } = props;
	const positionFromIndex = (index) => valueToPosition(handles[index]);

	const classes = classNames(rootClassName || css.root, className);
	return (
		<div className={classes}>
			<div className={css.track} />

			{handles.reduce((ranges, h, index) => {
				return index < handles.length - 1
					? [
							...ranges,
							<div
								key={`range_${index}-${index + 1}`}
								className={css.range}
								style={{
									left: `${valueToPosition(h)}px`,
									width: `${positionFromIndex(index + 1) - valueToPosition(h)}px`,
								}}
							/>,
						]
					: ranges;
			}, [])}

			{children}
		</div>
	);
};

Track.defaultProps = {
	rootClassName: null,
	className: null,
	children: null,
	handles: [],
};

Track.propTypes = {
	rootClassName: string,
	className: string,
	children: node,
	handles: array,
};

export default Track;
