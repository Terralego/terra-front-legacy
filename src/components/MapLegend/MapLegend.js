import React from 'react';

import styles from './MapLegend.module.scss';

const MapLegend = ({ title, legend, style }) => (
  <div className={styles.legend} style={style}>
    <p className={styles.title}>{title || 'Legend'}</p>
    <ul className={styles.legendList}>
      {legend.map(item => (
        <li key={item.label} className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: item.color }} />
          <span className={styles.legendText}>{item.label}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default MapLegend;
