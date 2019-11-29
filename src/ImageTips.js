import React, { Component } from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';


import Container, { positions, durations } from './Container';

class ImageTips extends Container {
  static displayName = 'PromptImageTips';

  static propTypes = {
    ...super.propTypes,

    image: PropTypes.any,
    imageStyle: PropTypes.any,

    textColor: PropTypes.string,
    textFont: PropTypes.number,
    textStyle: Text.propTypes.style,
  }
  static defaultProps = {
    ...super.defaultProps,

    position: positions.CENTER,
    duration: durations.SHORT,
  }

  constructor(props) {
    super(props);
    this.data = {
      showText: (typeof props.children === 'string' && props.children.length > 0),
      showImage: !!props.image,
    }
  }

  _containerStyle(props) {
    const {showText, showImage} = this.data;
    return [
      showImage && { padding: 30, borderRadius: 10 },
      showImage && showText && { paddingTop: 15, paddingBottom: 15 },
    ];
  }
  _renderChildren(props) {
    const {showText, showImage} = this.data;
    return (

      <View style={styles.containerStyle}>
        {showImage ?
          <Image style={[styles.iconStyle, !showText && { marginBottom: 0 }, props.imageStyle]} source={props.image}></Image>
          : null}
        {
          showText ?
            <Text style={[
              styles.textStyle,
              showImage && { lineHeight: 16 },
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

export default ImageTips;