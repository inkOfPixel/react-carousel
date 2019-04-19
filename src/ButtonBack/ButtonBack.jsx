import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './ButtonBack.scss';

export default class ButtonBack extends React.Component {
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

  static setDisabled(props) {
    if (props.disabled !== null) return props.disabled;
    return props.currentSlide === 0 || props.totalSlides <= props.visibleSlides;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      disabled: ButtonBack.setDisabled(props),
    };
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: ButtonBack.setDisabled(nextProps),
    });
  }

  handleOnClick() {
    const {
      carouselStore, currentSlide, onClick, step,
    } = this.props;
    const newCurrentSlide = Math.max(
      currentSlide - step,
      0,
    );
    carouselStore.setStoreState({
      currentSlide: newCurrentSlide,
    }, onClick !== null && onClick.call(this, newCurrentSlide));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, step, totalSlides,
      visibleSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonBack,
      'carousel__back-button',
      className,
    ]);

    return totalSlides <= visibleSlides ? (
      <button
        type="button"
        aria-label="previous"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={this.state.disabled}
        {...props}
      >
        {this.props.children}
      </button>
    ) : null;
  }
}
