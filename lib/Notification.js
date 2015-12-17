'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _rcUtil = require('rc-util');

var Notice = _react2['default'].createClass({
  displayName: 'Notice',

  getDefaultProps: function getDefaultProps() {
    return {
      onEnd: function onEnd() {},
      duration: 1.5,
      style: {
        right: '50%'
      }
    };
  },

  clearCloseTimer: function clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    this.componentDidMount();
  },

  componentDidMount: function componentDidMount() {
    var _this = this;

    this.clearCloseTimer();
    if (this.props.duration) {
      this.closeTimer = setTimeout(function () {
        _this.close();
      }, this.props.duration * 1000);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.clearCloseTimer();
  },

  close: function close() {
    this.clearCloseTimer();
    this.props.onClose();
  },

  render: function render() {
    var _className;

    var props = this.props;
    var componentClass = props.prefixCls + '-notice';
    var className = (_className = {}, _defineProperty(_className, '' + componentClass, 1), _defineProperty(_className, componentClass + '-closable', props.closable), _defineProperty(_className, props.className, !!props.className), _className);
    return _react2['default'].createElement(
      'div',
      { className: (0, _rcUtil.classSet)(className), style: props.style },
      _react2['default'].createElement(
        'div',
        { className: componentClass + '-content' },
        this.props.children
      ),
      props.closable ? _react2['default'].createElement(
        'a',
        { tabIndex: "0", onClick: this.close, className: componentClass + '-close' },
        _react2['default'].createElement('span', { className: componentClass + '-close-x' })
      ) : null
    );
  }
});

var seed = 0;
var now = Date.now();

function getUuid() {
  return 'rcNotification_' + now + '_' + seed++;
}

var Notification = _react2['default'].createClass({
  displayName: 'Notification',

  getInitialState: function getInitialState() {
    return {
      notices: []
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      prefixCls: 'rc-notification',
      animation: 'fade',
      style: {
        'top': 65,
        left: '50%'
      }
    };
  },

  remove: function remove(key) {
    var notices = this.state.notices.filter(function (notice) {
      return notice.key !== key;
    });
    this.setState({
      notices: notices
    });
  },

  add: function add(notice) {
    var key = notice.key = notice.key || getUuid();
    var notices = this.state.notices;
    if (!notices.filter(function (v) {
      return v.key === key;
    }).length) {
      this.setState({
        notices: notices.concat(notice)
      });
    }
  },

  getTransitionName: function getTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = props.prefixCls + '-' + props.animation;
    }
    return transitionName;
  },

  render: function render() {
    var _className2,
        _this2 = this;

    var props = this.props;
    var noticeNodes = this.state.notices.map(function (notice) {
      var onClose = (0, _rcUtil.createChainedFunction)(_this2.remove.bind(_this2, notice.key), notice.onClose);
      return _react2['default'].createElement(
        Notice,
        _extends({ prefixCls: props.prefixCls }, notice, { onClose: onClose }),
        notice.content
      );
    });
    var className = (_className2 = {}, _defineProperty(_className2, props.prefixCls, 1), _defineProperty(_className2, props.className, !!props.className), _className2);
    return _react2['default'].createElement(
      'div',
      { className: (0, _rcUtil.classSet)(className), style: props.style },
      _react2['default'].createElement(
        _rcAnimate2['default'],
        { transitionName: this.getTransitionName() },
        noticeNodes
      )
    );
  }
});

Notification.newInstance = function (props) {
  props = props || {};
  var div = document.createElement('div');
  document.body.appendChild(div);
  var notification = _react2['default'].render(_react2['default'].createElement(Notification, props), div);
  return {
    notice: function notice(noticeProps) {
      notification.add(noticeProps);
    },
    removeNotice: function removeNotice(key) {
      notification.remove(key);
    },
    component: notification,
    destroy: function destroy() {
      _react2['default'].unmountComponentAtNode(div);
      document.body.removeChild(div);
    }
  };
};

module.exports = Notification;