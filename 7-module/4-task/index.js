import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  elem = null;
  #steps = 5;
  #value = 0;
  #sliderProgress = null;
  #sliderThumb = null;
  #sliderThumbValue = null;
  #sliderSteps = null;
  #segments = 0;

  constructor({ steps, value = 0 }) {
    this.#steps = steps ?? this.#steps;
    this.#value = value ?? this.#value;
    this.#segments = this.#steps - 1;

    this.#render();
  }

  #getRelativePosition(event) {
    const sliderRectLeft = this.elem.getBoundingClientRect().left;
    const left = event.clientX - sliderRectLeft;
    const leftRelative = left / this.elem.offsetWidth;
    return leftRelative;
  }

  #onThumbPointerDown = (event) => {
    event.preventDefault();
    this.elem.classList.add('slider_dragging');
    document.addEventListener('pointermove', this.#onThumbPointerMove);
    document.addEventListener('pointerup', this.#onThumbPointerUp, { once: true });
  }

  #onThumbPointerMove = (event) => {
    event.preventDefault();
    let leftRelative = this.#getRelativePosition(event);

    if (leftRelative < 0) {
      leftRelative = 0;
    }

    if (leftRelative > 1) {
      leftRelative = 1;
    }

    const leftPercents = leftRelative * 100;

    this.#updateSliderFromPosition(leftPercents, leftRelative);
    this.#updateActiveStep();
  }

  #onThumbPointerUp = () => {
    document.removeEventListener('pointermove', this.#onThumbPointerMove);
    this.elem.classList.remove('slider_dragging');

    this.#updateActiveStep();
    this.#updateSliderFromValue();
    this.#dispatchSliderChangeEvent();
  }

  #dispatchSliderChangeEvent() {
    this.elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.#value,
        bubbles: true
      })
    );
  }

  #updateActiveStep() {
    const prevActiveStep = this.#sliderSteps.querySelector('.slider__step-active');
    prevActiveStep.classList.remove('slider__step-active');
    const currentActiveStep = this.#sliderSteps.children[this.#value];
    currentActiveStep.classList.add('slider__step-active');
  }

  #updateSliderFromValue() {
    const valueInPercents = (this.#value / this.#segments) * 100;

    this.#sliderThumb.style.left = `${valueInPercents}%`;
    this.#sliderProgress.style.width = `${valueInPercents}%`;
    this.#sliderThumbValue.textContent = this.#value;
  }

  #updateSliderFromPosition(leftPercents, leftRelative) {
    this.#sliderThumb.style.left = `${leftPercents}%`;
    this.#sliderProgress.style.width = `${leftPercents}%`;
    this.#value = Math.round(leftRelative * this.#segments);
    this.#sliderThumbValue.textContent = this.#value;
  }

  #onSliderClick = (event) => {
    const leftRelative = this.#getRelativePosition(event);
    const approximateValue = leftRelative * this.#segments;
    this.#value = Math.round(approximateValue);

    this.#updateSliderFromValue();
    this.#updateActiveStep();
    this.#dispatchSliderChangeEvent();
  }

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.#sliderProgress = this.elem.querySelector('.slider__progress');
    this.#sliderThumb = this.elem.querySelector('.slider__thumb');
    this.#sliderThumbValue = this.#sliderThumb.querySelector('.slider__value');
    this.#sliderSteps = this.elem.querySelector('.slider__steps');

    this.#updateSliderFromValue();

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.elem.addEventListener('click', this.#onSliderClick);
    this.#sliderThumb.addEventListener('pointerdown', this.#onThumbPointerDown);
  }

  #createSliderStepsTemplate() {
    return Array(this.#steps)
      .fill()
      .map((_, index) =>
        `<span${index === this.#value ? ' class="slider__step-active"' : ''}></span>`
      )
      .join('');
  }

  #createTemplate() {
    return `
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value">${this.#value}</span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
          ${this.#createSliderStepsTemplate()}
        </div>
      </div>
    `
  }
}