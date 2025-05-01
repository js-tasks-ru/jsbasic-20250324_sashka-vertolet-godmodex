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

  #updateSlider() {
    const valueInPercents = (this.#value / this.#segments) * 100;

    this.#sliderThumb.style.left = `${valueInPercents}%`;
    this.#sliderProgress.style.width = `${valueInPercents}%`;
    this.#sliderThumbValue.textContent = this.#value;
  }

  #onSliderClick = (event) => {
    const sliderRectLeft = this.elem.getBoundingClientRect().left;
    const left = event.clientX - sliderRectLeft;
    const leftRelative = left / this.elem.offsetWidth;
    const approximateValue = leftRelative * this.#segments;
    this.#value = Math.round(approximateValue);

    this.#updateSlider();
    this.#updateActiveStep();
    this.#dispatchSliderChangeEvent();
  }

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.#sliderProgress = this.elem.querySelector('.slider__progress');
    this.#sliderThumb = this.elem.querySelector('.slider__thumb');
    this.#sliderThumbValue = this.#sliderThumb.querySelector('.slider__value');
    this.#sliderSteps = this.elem.querySelector('.slider__steps');

    this.#updateSlider();

    this.elem.addEventListener('click', this.#onSliderClick);
  }

  #createSliderStepsTemplate() {
    let template = '';
    for (let i = 0; i < this.#steps; i += 1) {
      if (i === this.#value) {
        template += `<span class="slider__step-active"></span>`;
      } else {
        template += `<span></span>`;
      }
    }

    return template;
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