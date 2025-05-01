import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null;
  #products = [
    {
      name: '',
      price: 0,
      category: '',
      image: '',
      id: '',
      spiciness: 0,
      vegeterian: false,
      nuts: false,
    }
  ];
  #filteredProducts = [];
  #productsGridInner = null;
  #filters = {};

  constructor(products) {
    this.#products = products || this.#products;
    this.#filteredProducts = [...this.#products];
    this.#filters = {};

    this.#render();
  }

  updateFilter(filters) {
    this.#filters = {
      ...this.#filters,
      ...filters,
    };

    this.#filterProducts();
    this.#renderProducts();
  }

  #filterProducts() {
    this.#filteredProducts = this.#products.filter((product) => {
      return (
        (!this.#filters.noNuts || !product?.nuts) &&
        (!this.#filters.vegeterianOnly || product?.vegeterian) &&
        (this.#filters.maxSpiciness === undefined || product.spiciness <= this.#filters.maxSpiciness) &&
        (!this.#filters.category || product.category === this.#filters.category)
      )
    })
  }

  #render() {
    this.elem = createElement(this.#createTemplate());

    this.#productsGridInner = this.elem.querySelector('.products-grid__inner');

    this.#renderProducts();
  }

  #renderProducts() {
    this.#productsGridInner.innerHTML = '';
    this.#filteredProducts.forEach((product) => {
      const productCard = new ProductCard(product);
      this.#productsGridInner.append(productCard.elem);
    })
  }

  #createTemplate() {
    return `
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `;
  }
}
