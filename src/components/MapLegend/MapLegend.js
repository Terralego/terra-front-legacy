import React from 'react';

import './MapLegend.scss';

const MapLegend = ({ title, legend = [], style, Component = null }) => (
  <div className="legend" style={style}>
    <p className="legend__title">{title || 'Legend'}</p>
    <ul className="legend__list">
      {legend.map(item => (
        <li key={`${item.label}_${item.minLabel}`} className="legend__item">
          <span className="legend__color" style={{ background: item.color }} />
          <span className="legend__label--min">{item.minLabel}</span>
          <span className="legend__label">{item.label}</span>
        </li>
      ))}
    </ul>
    {Component}
  </div>
);

export default MapLegend;
