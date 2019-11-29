import React, { Component } from 'react';

import RootSiblings from 'react-native-root-siblings';
import Tips from './Tips';
import LoadingTips from './LoadingTips';
import ImageTips from './ImageTips';
import { positions, durations } from './Container';


let lastToast = null;
let lastComponent = null;

let defaultOptions = {}

class Prompt extends Component {
  static displayName = 'Prompt';

  static setDefaultOptions = (options) => {

    defaultOptions = options;
  }

  //convenience method
  static showTips = function (message, options) {

    let opts = Object.assign({}, options);

    this.show(message, opts, Tips);
  }

  static showLoading = function (message, options) {

    let opts = Object.assign({}, options);

    this.show(message, opts, LoadingTips);
  }

  static showSuccess = function (message, options) {

    let opts = Object.assign({}, options, { image: defaultOptions.imageSuccess ? defaultOptions.imageSuccess : require('../asset/success.png') });

    this.show(message, opts, ImageTips);
  }

  static showFail = function (message, options) {

    let opts = Object.assign({}, options, { image: defaultOptions.imageFail ? defaultOptions.imageFail : require('../asset/error.png') });

    this.show(message, opts, ImageTips);
  }

  static showInfo = function (message, options) {

    let opts = Object.assign({}, options, { image: defaultOptions.imageInfo || require('../asset/info.png') });

    this.show(message, opts, ImageTips);
  }

  static showWarn = function (message, options) {

    let opts = Object.assign({}, options, { image: defaultOptions.imageWarn || require('../asset/warn.png') });

    this.show(message, opts, ImageTips);
  }

  static hide = function () {
    if (lastToast != null) {
      lastToast.destroy();
    }
  }


  //raw method
  static show = (message, options, Component = Tips) => {

    if (lastToast != null) {
      lastToast.destroy();
    }

    let opts = Object.assign({}, defaultOptions, options);

    let onHidden = opts.onHidden;

    let hidenFunc = function () {
      lastToast && lastToast.destroy();
      onHidden && onHidden();
    }

    opts.onHidden = hidenFunc;
    let toast = new RootSiblings(<Component
      {...opts}
      visible={true}
    >
      {message}
    </Component>);

    lastToast = toast;
    lastComponent = Component;
    return toast;
  };

  static hide = toast => {
    if (toast instanceof RootSiblings) {
      toast.destroy();
    }

    if (lastToast != null) {
      lastToast.destroy();
    }
  };


  _toast = null;

  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
    debugger;
    this._toast = new RootSiblings(<lastComponent
      {...this.props}
      duration={0}
    />);
  };

  componentWillReceiveProps = nextProps => {
    this._toast.update(<lastComponent
      {...nextProps}
      duration={0}
    />);
  };

  componentWillUnmount = () => {
    this._toast.destroy();
  };

  render() {
    return null;
  }
}

export {
  RootSiblings as Manager,
  positions,
  durations,
};
export default Prompt;
