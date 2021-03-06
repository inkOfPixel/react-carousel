import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './ButtonNext.scss';

const ButtonNext = class ButtonNext extends React.PureComponent {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    step: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  }

  static setDisabled(disabled, currentSlide, visibleSlides, totalSlides) {
    if (disabled !== null) return disabled;
    return currentSlide >= totalSlides - visibleSlides
      || totalSlides <= visibleSlides;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      disabled: ButtonNext.setDisabled(
        props.disabled,
        props.currentSlide,
        props.visibleSlides,
        props.totalSlides,
      ),
    };
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: ButtonNext.setDisabled(
        nextProps.disabled,
        nextProps.currentSlide,
        nextProps.visibleSlides,
        nextProps.totalSlides,
      ),
    });
  }

  handleOnClick() {
    const {
      currentSlide, onClick, step, carouselStore,
    } = this.props;
    const newCurrentSlide = currentSlide + step;
    carouselStore.setStoreState({
      currentSlide: newCurrentSlide,
    }, onClick !== null && onClick.call(this, newCurrentSlide));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, step, totalSlides, visibleSlides,
      ...props
    } = this.props;

    const newClassName = cn([
      s.buttonNext,
      'carousel__next-button',
      className,
    ]);

    return totalSlides > visibleSlides ? (
      <button
        type="button"
        aria-label="next"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={this.state.disabled}
        {...props}
      >
        {this.props.children}
      </button>
    ) : null;
  }
};

export default ButtonNext;
