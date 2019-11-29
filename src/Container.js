import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  ViewPropTypes,

  Platform,

  Dimensions,
  Keyboard,

  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';

import PropTypes from 'prop-types';


const WINDOW = Dimensions.get('window');
const isIPhoneX = Platform.OS === 'ios' && WINDOW.height > 800;

const TOAST_ANIMATION_DURATION = 200;
const TOAST_MAX_WIDTH = 0.8;

const positions = {
  TOP: isIPhoneX ? 44 : 20,
  BOTTOM: isIPhoneX ? -54 : -20,
  CENTER: 0
};
const durations = {
  LONG: 3500,
  SHORT: 2000,
  NEVER: 9007199254740992,
};



class Mask extends Component {
  render() {
    let { props } = this;
    return !!props.mask ?
      <View style={styles.maskStyle}>
        <View style={[styles.maskStyle, props.maskColor && { backgroundColor: props.maskColor }, props.maskOpacity && { opacity: props.maskOpacity }]}></View>
        {this.props.children}
      </View> :
      this.props.children
  }
}

class Container extends Component {
  static displayName = 'PromptContainer';

  static propTypes = {
    mask: PropTypes.bool,
    maskColor: PropTypes.string,
    maskOpacity: PropTypes.number,

    keyboardAvoiding: PropTypes.bool,
    delay: PropTypes.number,

    opacity: PropTypes.number,
    animation: PropTypes.bool,
    duration: PropTypes.number,
    position: PropTypes.number,
    visible: PropTypes.bool,

    ...ViewPropTypes,
    containerStyle: ViewPropTypes.style,
    containerBgColor: PropTypes.string,

    shadow: PropTypes.bool,
    shadowColor: PropTypes.string,

    onPress: PropTypes.func,

    onShow: PropTypes.func,
    onShown: PropTypes.func,
    onHide: PropTypes.func,
    onHidden: PropTypes.func,
  }
  static defaultProps = {
    maskOpacity: 0.4,

    keyboardAvoiding: true,
    delay: 0,

    opacity: 0.8,
    animation: true,
    duration: durations.SHORT,
    position: positions.BOTTOM,
    visible: false,

    shadow: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      opacity: new Animated.Value(0),
      windowWidth: WINDOW.width,
      windowHeight: WINDOW.height,
      keyboardScreenY: WINDOW.height
    };
  }

  componentDidMount = () => {
    Dimensions.addEventListener('change', this._windowChanged);
    if (this.props.keyboardAvoiding) {
      Keyboard.addListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame);
    }
    if (this.state.visible) {
      this._showTimeout = setTimeout(() => this._show(), this.props.delay);
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        this._showTimeout = setTimeout(() => this._show(), this.props.delay);
      } else {
        this._hide();
      }

      this.setState({
        visible: this.props.visible
      });
    }
  };

  componentWillUnmount = () => {
    this._hide();
    Dimensions.removeEventListener('change', this._windowChanged);
    Keyboard.removeListener('keyboardDidChangeFrame', this._keyboardDidChangeFrame);
  };


  _windowChanged = ({ window }) => {
    this.setState({
      windowWidth: window.width,
      windowHeight: window.height
    })
  };

  _keyboardDidChangeFrame = ({ endCoordinates }) => {
    this.setState({ keyboardScreenY: endCoordinates.screenY })
  };

  _animating = false;
  _root = null;
  _hideTimeout = null;
  _showTimeout = null;

  _show = () => {
    clearTimeout(this._showTimeout);
    if (!this._animating) {
      clearTimeout(this._hideTimeout);
      this._animating = true;
      this._root.setNativeProps({
        pointerEvents: 'auto'
      });
      this.props.onShow && this.props.onShow(this.props.siblingManager);
      Animated.timing(this.state.opacity, {
        toValue: this.props.opacity,
        duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
        easing: Easing.out(Easing.ease)
      }).start(({ finished }) => {
        if (finished) {
          this._animating = !finished;
          this.props.onShown && this.props.onShown(this.props.siblingManager);
          if (this.props.duration > 0) {
            this._hideTimeout = setTimeout(() => this._hide(), this.props.duration);
          }
        }
      });
    }
  };

  _hide = () => {
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    if (!this._animating) {
      this._root.setNativeProps({
        pointerEvents: 'none'
      });
      this.props.onHide && this.props.onHide(this.props.siblingManager);
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
        easing: Easing.in(Easing.ease)
      }).start(({ finished }) => {
        if (finished) {
          this._animating = false;
          this.props.onHidden && this.props.onHidden(this.props.siblingManager);
        }
      });
    }
  };

  _containerStyle(props) {
    return [];
  }
  _renderChildren(props) {
    return null;
  }
  render() {
    console.log('2', super.state);
    if (!(this.state.visible || this._animating)) return null;
    let { props } = this;

    const { windowWidth, windowHeight, keyboardScreenY } = this.state;
    const keyboardHeight = Math.max(windowHeight - keyboardScreenY, 0);

    const offset = props.position;
    let position = offset ? {
      [offset < 0 ? 'bottom' : 'top']: offset < 0 ? (keyboardHeight - offset) : offset
    } : {
        top: 0,
        bottom: keyboardHeight
      };
    
    return (
      <Mask mask={props.mask} maskColor={props.maskColor} maskOpacity={props.maskOpacity}>
        <View
          style={[
            styles.defaultStyle,
            position
          ]}
          pointerEvents="box-none"
        >

          <TouchableWithoutFeedback
            onPress={() => {
              typeof this.props.onPress === 'function' ? this.props.onPress() : null
              this.props.hideOnPress ? this._hide() : null
            }}
          >
            <Animated.View
              style={[
                styles.containerStyle,
                { marginHorizontal: windowWidth * ((1 - TOAST_MAX_WIDTH) / 2) },
                ...this._containerStyle(props),
                props.containerStyle,
                props.containerBgColor && { backgroundColor: props.containerBgColor },
                {
                  opacity: this.state.opacity
                },
                props.shadow && { ...styles.shadowStyle, shadowColor: props.backgroundColor },
                props.shadowColor && { shadowColor: props.shadowColor }
              ]}
              pointerEvents="none"
              ref={ele => {
                this._root = ele;
              }}
            >
              {this._renderChildren(props)}
            </Animated.View>
          </TouchableWithoutFeedback>

        </View>
      </Mask>
    );
  }
}


const styles = StyleSheet.create({
  maskStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  defaultStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    padding: 10,
    backgroundColor: '#000',
    opacity: 0.85,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10
  },
});



export {
  positions,
  durations
};
export default Container;