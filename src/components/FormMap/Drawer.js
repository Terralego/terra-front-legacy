import React from 'react';
import classnames from 'classnames';
import { Button, Icon } from 'antd';

import MapLegend from 'components/MapLegend/MapLegend';
import TerraDrawMapFilters from 'components/TerraDrawMap/TerraDrawMapFilters';
import { mapLegend, mapTitleLegend } from 'components/FormMap/FormMap.config';

import styles from './Drawer.module.scss';

class Drawer extends React.Component {
  state = {
    visible: false,
  }

  drawerToggle = () => {
    this.setState({ visible: !this.state.visible });
  }

  render () {
    return (
      <div
        className={classnames({
          [styles.mapLegendContainer]: true,
          [styles.insertion]: this.state.visible,
        })}
      >
        <div className={styles.mapLegend}>
          <MapLegend
            title={mapTitleLegend.titleLegend}
            legend={mapLegend}
          />
          {this.props.config.sources.map(source => (
            <TerraDrawMapFilters key={`${source.id}_filters`} source={source} setFilter={this.props.setFilter} />
          ))}
        </div>
        <Button
          className={classnames({
            [styles.buttonLegend]: true,
            [styles.buttonLegendInsertion]: this.state.visible,
          })}
          onClick={this.drawerToggle}
        >
          {this.state.visible ? <span>Collapse sidebar <Icon type="double-right" /></span> : <Icon type="double-left" />}
        </Button>
      </div>
    );
  }
}

export default Drawer;
