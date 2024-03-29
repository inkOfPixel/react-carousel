import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn, pct } from '../helpers';
import s from './Slide.scss';

const Slide = class Slide extends React.PureComponent {
  static propTypes = {
    carouselStore: PropTypes.object,
    children: CarouselPropTypes.children,
    className: PropTypes.string,
    classNameHidden: PropTypes.string,
    classNameVisible: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    innerClassName: PropTypes.string,
    innerTag: PropTypes.string,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    slideSize: PropTypes.number.isRequired,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    tag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    carouselStore: null,
    children: null,
    className: null,
    classNameHidden: null,
    classNameVisible: null,
    innerClassName: null,
    innerTag: 'div',
    onBlur: null,
    onClick: null,
    onFocus: null,
    style: {},
    tabIndex: null,
    tag: 'li',
  }

  constructor(props) {
    super(props);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.state = {
      focused: false,
    };
  }

  isVisible() {
    const { currentSlide, index, visibleSlides } = this.props;
    return index >= currentSlide && index < currentSlide + visibleSlides;
  }

  handleOnFocus(ev) {
    const { onFocus } = this.props;

    this.setState({
      focused: true,
    }, () => {
      if (onFocus !== null) { onFocus.call(this, ev); }
    });
  }

  handleOnClick() {
    const {
      carouselStore,
      index,
      onClick,
      totalSlides,
      visibleSlides,
    } = this.props;
    if (totalSlides - index <= visibleSlides) {
      if (onClick !== null) { onClick.call(this, index); }
    } else {
      carouselStore.setStoreState({
        currentSlide: index,
      }, onClick !== null && onClick.call(this, index));
    }
  }

  handleOnBlur(ev) {
    const { onBlur } = this.props;

    this.setState({
      focused: false,
    }, () => {
      if (onBlur !== null) { onBlur.call(this, ev); }
    });
  }

  renderFocusRing() {
    if (this.state.focused) return <div className={[s.focusRing, 'carousel__slide-focus-ring'].join(' ')} />;
    return null;
  }

  render() {
    const {
      carouselStore,
      children,
      className,
      classNameHidden,
      classNameVisible,
      currentSlide,
      index,
      innerClassName,
      innerTag: InnerTag,
      onBlur,
      onFocus,
      orientation,
      slideSize,
      style,
      tabIndex,
      tag: Tag,
      totalSlides,
      visibleSlides,
      onClick,
      ...props
    } = this.props;

    const tempStyle = {};

    if (orientation === 'horizontal') {
      tempStyle.width = pct(slideSize);
    } else {
      tempStyle.height = pct(slideSize);
    }

    const newStyle = Object.assign({ height: '100%', overflow: 'hidden' }, tempStyle, style);

    const isVisible = this.isVisible();

    const newClassName = cn([
      s.slide,
      orientation === 'horizontal' && s.slideHorizontal,
      'carousel__slide',
      this.state.focused && 'carousel__slide--focused',
      isVisible && classNameVisible,
      isVisible && 'carousel__slide--visible',
      !isVisible && classNameHidden,
      !isVisible && 'carousel__slide--hidden',
      className,
    ]);

    const newInnerClassName = cn([
      s.slideInner,
      'carousel__inner-slide',
      innerClassName,
    ]);

    const defaultTabIndex = this.isVisible() ? 0 : -1;
    const newTabIndex = typeof tabIndex === 'number' ? tabIndex : defaultTabIndex;

    return (
      <Tag
        ref={(el) => { this.tagRef = el; }}
        tabIndex={newTabIndex}
        aria-selected={this.isVisible()}
        role="option"
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        className={newClassName}
        style={newStyle}
        {...props}
      >
        <InnerTag
          ref={(el) => { this.innerTagRef = el; }}
          className={newInnerClassName}
          onClick={this.handleOnClick}
        >
          {this.props.children}
          {this.renderFocusRing()}
        </InnerTag>
      </Tag>
    );
  }
};

export default Slide;
