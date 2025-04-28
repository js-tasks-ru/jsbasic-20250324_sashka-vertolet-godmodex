import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  elem = null;
  #modalTitle = null;
  #modalBody = null;
  #closeButton = null;

  constructor() {
    this.#render();
  }

  close() {
    document.body.classList.remove('is-modal-open');
    this.elem.remove();
    document.removeEventListener('keydown', this.#onEscPressed);
  }

  setTitle(title) {
    this.#modalTitle.textContent = title;
  }

  setBody(node) {
    this.#modalBody.replaceChildren(node);
  }

  open() {
    document.body.classList.add('is-modal-open');
    document.body.append(this.elem);
    document.addEventListener('keydown', this.#onEscPressed);
  }

  #onCloseButtonClick = () => {
    this.close();
  }

  #onEscPressed = (e) => {
    if (e.code === 'Escape') {
      this.close();
    }
  }

  #render() {
    this.elem = createElement(this.#createTemplate());
    this.#modalTitle = this.elem.querySelector('.modal__title');
    this.#modalBody = this.elem.querySelector('.modal__body');
    this.#closeButton = this.elem.querySelector('.modal__close');

    this.#closeButton.addEventListener('click', this.#onCloseButtonClick);
  }

  #createTemplate() {
    return `
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `
  }
}
