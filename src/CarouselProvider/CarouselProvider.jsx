import React from 'react';
import PropTypes from 'prop-types';
import Store from '../Store/Store';
import {
  CarouselPropTypes, slideSize, slideTraySize, cn,
} from '../helpers';

const CarouselProvider = class CarouselProvider extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number,
    disableAnimation: PropTypes.bool,
    disableKeyboard: PropTypes.bool,
    hasMasterSpinner: PropTypes.bool,
    interval: PropTypes.number,
    isPageScrollLocked: PropTypes.bool,
    isPlaying: PropTypes.bool,
    lockOnWindowScroll: PropTypes.bool,
    orientation: CarouselPropTypes.orientation,
    playDirection: CarouselPropTypes.direction,
    step: PropTypes.number,
    dragStep: PropTypes.number,
    tag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool,
    dragEnabled: PropTypes.bool,
    visibleSlides: PropTypes.number,
  }

  static childContextTypes = {
    carouselStore: PropTypes.object,
  }

  static defaultProps = {
    className: null,
    currentSlide: 0,
    disableAnimation: false,
    disableKeyboard: false,
    hasMasterSpinner: false,
    interval: 5000,
    isPageScrollLocked: false,
    isPlaying: false,
    lockOnWindowScroll: false,
    orientation: 'horizontal',
    playDirection: 'forward',
    step: 1,
    dragStep: 1,
    tag: 'div',
    touchEnabled: true,
    dragEnabled: true,
    visibleSlides: 1,
  }

  constructor(props, context) {
    super(props, context);
    const options = {
      currentSlide: props.currentSlide,
      disableAnimation: props.disableAnimation,
      disableKeyboard: props.disableKeyboard,
      hasMasterSpinner: props.hasMasterSpinner,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      interval: props.interval,
      isPageScrollLocked: props.isPageScrollLocked,
      isPlaying: props.isPlaying,
      lockOnWindowScroll: props.lockOnWindowScroll,
      masterSpinnerThreshold: 0,
      orientation: props.orientation,
      playDirection: props.playDirection,
      slideSize: slideSize(props.totalSlides, props.visibleSlides),
      slideTraySize: slideTraySize(props.totalSlides, props.visibleSlides),
      step: props.step,
      dragStep: props.dragStep,
      totalSlides: props.totalSlides,
      touchEnabled: props.touchEnabled,
      dragEnabled: props.dragEnabled,
      visibleSlides: props.visibleSlides,
    };
    this.carouselStore = new Store(options);
    this.disableAnimationTimer = null;
  }

  getChildContext() {
    return { carouselStore: this.carouselStore };
  }

  componentWillReceiveProps(nextProps) {
    const newStoreState = {};

    [
      'currentSlide',
      'disableAnimation',
      'disableKeyboard',
      'hasMasterSpinner',
      'interval',
      'isPlaying',
      'lockOnWindowScroll',
      'orientation',
      'playDirection',
      'step',
      'dragStep',
      'totalSlides',
      'touchEnabled',
      'dragEnabled',
      'visibleSlides',
    ].forEach((propName) => {
      if (nextProps[propName] !== this.props[propName]) {
        newStoreState[propName] = nextProps[propName];
      }
    });

    if (
      this.props.totalSlides !== nextProps.totalSlides
      || this.props.visibleSlides !== nextProps.visibleSlides
    ) {
      newStoreState.slideSize = slideSize(nextProps.totalSlides, nextProps.visibleSlides);
      newStoreState.slideTraySize = slideTraySize(nextProps.totalSlides, nextProps.visibleSlides);
    }

    if (Object.keys(newStoreState).length > 0) {
      this.carouselStore.setStoreState(newStoreState);
    }
  }

  componentWillUnmount() {
    this.carouselStore.unsubscribeAllMasterSpinner();
    window.clearTimeout(this.disableAnimationTimer);
  }

  // Utility function for tests.
  // in jest + enzyme tests you can do wrapper.instance().getStore()
  // you can also just do...
  // wrapper.instance().carouselStore
  // I created this method to make it obvious that you have access to carouselStore.
  getStore() {
    return this.carouselStore;
  }

  render() {
    const {
      children,
      className,
      currentSlide,
      disableAnimation,
      disableKeyboard,
      hasMasterSpinner,
      interval,
      isPageScrollLocked,
      isPlaying,
      lockOnWindowScroll,
      orientation,
      playDirection,
      step,
      dragStep,
      tag: Tag,
      totalSlides,
      touchEnabled,
      dragEnabled,
      visibleSlides,
      ...filteredProps
    } = this.props;

    const newClassName = cn([
      'carousel',
      this.props.className,
    ]);

    return <Tag className={newClassName} style={{ height: '100%', position: 'relative' }} {...filteredProps}>{this.props.children}</Tag>;
  }
};

export default CarouselProvider;
