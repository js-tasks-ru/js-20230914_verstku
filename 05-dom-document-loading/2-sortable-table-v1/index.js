export default class SortableTable {
  element;
  subElements = {};
  columnIDs = [];

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  createHeaderCells() {
    return this.headerConfig
      .map(item => `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
        </div>
      `)
      .join('');
  }

  createBodyCells(productData) {
    return this.headerConfig
      .map(item => item.template ?
        item.template() :
        `<div class="sortable-table__cell">${productData[item.id]}</div>`)
      .join('');
  }

  createBodyRows() {
    return this.data
      .map(item => `
        <div class="sortable-table__row">
          ${this.createBodyCells(item)}
        </div>
      `)
      .join('');
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderCells()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBodyRows()}
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.columnIDs = this.getColumnIDs();
  }

  getSubElements(element) {
    const result = {};
    const dataElements = element.querySelectorAll('[data-element]');

    for (const subElement of dataElements) {
      const nameElement = subElement.dataset.element;
      result[nameElement] = subElement;
    }

    return result;
  }

  sort(field, order) {
    const fieldIndex = this.columnIDs.indexOf(field);
    const columnConfig = this.headerConfig[fieldIndex];
    const getRows = this.subElements.body.querySelectorAll('.sortable-table__row');

    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];

    const sortedRows = Array.from(getRows)
      .sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('.sortable-table__cell')[fieldIndex];
      const cellB = rowB.querySelectorAll('.sortable-table__cell')[fieldIndex];



      switch (columnConfig?.sortType) {
        case 'string':
          return direction * cellA.innerHTML.localeCompare(cellB.innerHTML, ['ru', 'en'], { caseFirst: 'upper' });
        case 'number':
          return direction * (cellA.innerHTML - cellB.innerHTML);
      }
    });

    this.subElements.body.append(...sortedRows);
  }

  getColumnIDs() {
    return this.headerConfig.map(item => item.id);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
    this.columnIDs = [];
  }
}

