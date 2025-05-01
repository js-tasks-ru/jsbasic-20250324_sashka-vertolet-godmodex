import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  elem = null;
  #slides = [
    {
      name: '',
      price: 0,
      image: '',
      id: '',
    }
  ];
  #currentSlideIndex = 0;
  #slidesCount = 0;
  #slideWidth = 0;
  #arrowLeft = null;
  #arrowRight = null;
  #carouselInner = null;

  constructor(slides) {
    this.#slides = slides || this.#slides;
    this.#slidesCount = this.#slides.length || this.#slidesCount;
    this.#render();
  }

  #updateCarousel() {
    this.#slideWidth = this.#carouselInner.offsetWidth;
    this.#arrowLeft.style.display = this.#currentSlideIndex === 0 ? 'none' : '';
    this.#arrowRight.style.display = this.#currentSlideIndex === this.#slidesCount - 1 ? 'none' : '';

    const offset = -this.#currentSlideIndex * this.#slideWidth;
    this.#carouselInner.style.transform = `translateX(${offset}px)`;
  }

  #onProductAddClick = (event) => {
    const button = event.target.closest('.carousel__button');
    if (!button) {
      return;
    }

    const slideId = button.closest('.carousel__slide').dataset.id;
    this.elem.dispatchEvent(new CustomEvent("product-add", {
      detail: slideId,
      bubbles: true,
    }));
  }

  #onArrowClick = (direction) => {
    if (direction === 'left' && this.#currentSlideIndex > 0) {
      this.#currentSlideIndex -= 1;
    } else if (direction === 'right' && this.#currentSlideIndex < this.#slidesCount - 1) {
      this.#currentSlideIndex += 1;
    } else {
      return;
    }

    this.#updateCarousel();
  };

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.#carouselInner = this.elem.querySelector('.carousel__inner');
    this.#arrowLeft = this.elem.querySelector('.carousel__arrow_left');
    this.#arrowRight = this.elem.querySelector('.carousel__arrow_right');

    this.#addEventListeners();
    this.#updateCarousel();
  }

  #addEventListeners() {
    this.#arrowLeft.addEventListener('click', () => this.#onArrowClick('left'));
    this.#arrowRight.addEventListener('click', () => this.#onArrowClick('right'));
    this.elem.addEventListener('click', this.#onProductAddClick);
  }

  #createSlideTemplate(slide) {
    return `
      <div class="carousel__slide" data-id="${slide.id}">
        <img src="/assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${slide.price.toFixed(2)}</span>
          <div class="carousel__title">${slide.name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
  }

  #createTemplate() {
    return `
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>

        <div class="carousel__inner">
          ${this.#slides.map((slide) => this.#createSlideTemplate(slide)).join('')}
        </div>
      </div>
    `
  }
}
