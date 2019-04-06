import Slide from './Slide';
import WithStore from '../Store/WithStore';

export default WithStore(Slide, state => ({
  currentSlide: state.currentSlide,
  orientation: state.orientation,
  slideSize: state.slideSize,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
