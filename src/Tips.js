import React, { Component } from 'react';

import {
  Text,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';


import Container, { positions, durations } from './Container';

class Tips extends Container {
  static displayName = 'PromptTips';

  static propTypes = {
    ...super.propTypes,

    textColor: PropTypes.string,
    textFont: PropTypes.number,
    textStyle: Text.propTypes.style,
  }
  static defaultProps = {
    ...super.defaultProps,

    position: positions.TOP,
    duration: durations.SHORT,
  }

  _renderChildren(props) {
    return (
      <Text style={[
        styles.textStyle,
        props.textStyle,
        props.textColor && { color: props.textColor },
        props.textFont && { fontSize: props.textFont, lineHeight: props.textFont + 2 },
      ]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  }
});

export default Tips;