/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React from 'react';

const PureImage = React.memo(({ src, alt, className, style }) => {
    return <img src={src} alt={alt} className={className} style={style} loading="lazy" />;
});

export default PureImage;
