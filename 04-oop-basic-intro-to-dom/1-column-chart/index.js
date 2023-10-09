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
    this.element = this.render();
    this.dataElements = this.getDataElements();
  }

  getTemplate() {
    return `
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value.toLocaleString('en-US'))}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.getChartTemplate()}
        </div>
      </div>
    `;
  }

  getLinkTemplate() {
    return this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : '';
  }

  getChartTemplate() {
    if(!this.data.length) return '';

    let chartTemplate = '';
    const chartProps = this.getColumnProps(this.data);

    chartProps.forEach(({value, percent}) => {
      chartTemplate += `
      <div style="--value: ${value}" data-tooltip="${percent}"></div>
      `;
    });

    return chartTemplate;
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

  render() {
    const element = document.createElement("div"); // (*)

    element.innerHTML = this.getTemplate();
    const columnChartElement = element.firstElementChild;

    if(!this.data.length) {
      columnChartElement.classList.add('column-chart_loading');
    }

    return columnChartElement;
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
    if (!data.length) {
      this.element.classList.add('column-chart_loading');
    }

    this.data = data;
    this.dataElements.body.innerHTML = this.getChartTemplate();
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
