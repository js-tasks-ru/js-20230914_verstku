export default class ColumnChart {
  chartHeight = 50;
  constructor(props = {}) {
    const {
      data = [],
      label = '',
      value = 0,
      link = '',
      formatHeading = value => value,
    } = props;

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
    this.syncChartLoadingStatus();
    this.dataElements = this.getDataElements();
  }

  createTemplate() {
    return `
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value.toLocaleString('en-US'))}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartTemplate()}
        </div>
      </div>
    `;
  }

  createLinkTemplate() {
    return this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : '';
  }

  createChartTemplate() {
    if(!this.data.length) return '';

    const chartProps = this.getColumnProps(this.data);

    return chartProps
      .reduce((acc, {value, percent}) =>
        acc + `<div style="--value: ${value}" data-tooltip="${percent}"></div>`, '');
  }


  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  syncChartLoadingStatus() {
    if(!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
  }

  createElement() {
    const element = document.createElement("div"); // (*)

    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
  }

  getDataElements() {
    const result = {};
    const dataElementsNodes = this.element.querySelectorAll('[data-element]');

    for (const node of dataElementsNodes) {
      const nodeName = node.dataset.element;
      result[nodeName] = node;
    }

    return result;
  }

  update(data = []) {
    this.data = data;
    this.syncChartLoadingStatus()

    this.dataElements.body.innerHTML = this.createChartTemplate();
  }

  remove() {
    if(this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }

}
