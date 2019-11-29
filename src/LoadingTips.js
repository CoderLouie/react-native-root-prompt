import React, { Component } from 'react';

import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';


import Container, { positions, durations } from './Container';

class LoadingTips extends Container {
  static displayName = 'PromptLoadingTips';

  static propTypes = {
    ...super.propTypes,

    indicatorSize: PropTypes.string,
    indicatorColor: PropTypes.string,

    textColor: PropTypes.string,
    textFont: PropTypes.number,
    textStyle: Text.propTypes.style,
  }
  static defaultProps = {
    ...super.defaultProps,

    indicatorSize: 'large',
    indicatorColor: '#FFF',

    position: positions.CENTER,
    duration: durations.LONG,
  }

  constructor(props) {
    super(props);

    this.data = {
      showText: (typeof props.children === 'string' && props.children.length > 0),
    }
  }

  _containerStyle(props) {
    const { showText } = this.data;
    return [
      { padding: 25, borderRadius: 10 },
      showText && { paddingTop: 10, paddingBottom: 15 },
    ];
  }
  _renderChildren(props) {
    const { showText } = this.data;
    return (

      <View style={styles.containerStyle} >
        {
          <ActivityIndicator animating={true}
            color={props.indicatorColor}
            size={props.indicatorSize}
            style={{ marginVertical: showText ? 10 : 0 }} />
        }
        {
          showText ?
            <Text style={[
              styles.textStyle,
              { lineHeight: 16 },
              props.textStyle,
              props.textColor && { color: props.textColor },
              props.textFont && { fontSize: props.textFont, lineHeight: props.textFont + 2 },
            ]}>
              {this.props.children}
            </Text> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    width: 40,
    height: 40,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  }
});

export default LoadingTips;