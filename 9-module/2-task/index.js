import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    const carousel = new Carousel(slides);
    const carouselHolder = document.querySelector('[data-carousel-holder]');
    carouselHolder.append(carousel.elem);

    const ribbonMenu = new RibbonMenu(categories);
    const ribbonMenuHolder = document.querySelector('[data-ribbon-holder]');
    ribbonMenuHolder.append(ribbonMenu.elem);

    const stepSlider = new StepSlider({ steps: 5, value: 3});
    const stepSliderHolder = document.querySelector('[data-slider-holder]');
    stepSliderHolder.append(stepSlider.elem);

    const cartIcon = new CartIcon();
    const cartIconHolder = document.querySelector('[data-cart-icon-holder]');
    cartIconHolder.append(cartIcon.elem);
    const cart = new Cart(cartIcon);

    const nutsCheckbox = document.getElementById('nuts-checkbox');
    const vegeterianChechbox = document.getElementById('vegeterian-checkbox');

    try {
      const response = await fetch('products.json');
      const products = await response.json();

      const productsGrid = new ProductsGrid(products);
      const productsGridHolder = document.querySelector('[data-products-grid-holder]');
      productsGridHolder.innerHTML = '';
      productsGridHolder.append(productsGrid.elem);

      productsGrid.updateFilter({
        noNuts: nutsCheckbox.checked,
        vegeterianOnly: vegeterianChechbox.checked,
        maxSpiciness: stepSlider.value,
        category: ribbonMenu.value
      });

      document.body.addEventListener('product-add', ({ detail: productId }) => {
        const newProduct = products.find(({ id }) => id === productId);
        cart.addProduct(newProduct);
      });

      document.body.addEventListener('slider-change', ({ detail: maxSpiciness }) => {
        productsGrid.updateFilter({ maxSpiciness });
      });

      document.body.addEventListener('ribbon-select', ({ detail: category}) => {
        productsGrid.updateFilter({ category });
      })

      nutsCheckbox.addEventListener('change', () => {
        const noNuts = nutsCheckbox.checked;
        productsGrid.updateFilter({ noNuts });
      });

      vegeterianChechbox.addEventListener('change', () => {
        const vegeterianOnly = vegeterianChechbox.checked;
        productsGrid.updateFilter({ vegeterianOnly });
      });
    } catch (e) {
      console.log(e);
    }
  }
}
