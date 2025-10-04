const BUFFER = 2;

export class VirtualizedTable {
  constructor(
    container,
    tableBody,
    placeholder,
    tableCaption,
    data,
    rowHeight = 50,
  ) {
    this.container = container;
    this.tableBody = tableBody;
    this.placeholder = placeholder;
    this.tableCaption = tableCaption;

    this.data = data;
    this.rowHeight = rowHeight;
    this.visibleRowCount = 20;
    this.startIndex = 0;
    this.nodePool = [];

    this.init();
  }

  init() {
    this.calculateVisibleRowCount();
    this.container.addEventListener("scroll", () => this.handleScroll());
    this.render();
  }

  calculateVisibleRowCount() {
    const containerHeight = this.container.clientHeight;
    const headerHeight = this.container.querySelector("thead").clientHeight;
    this.visibleRowCount =
      Math.ceil((containerHeight - headerHeight) / this.rowHeight) + BUFFER;
  }

  handleScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIdx = Math.floor(scrollTop / this.rowHeight);

    if (newStartIdx !== this.startIndex) {
      this.startIndex = newStartIdx;
      this.render();
    }
  }

  render() {
    this.tableCaption.innerHTML = `Total: ${this.data.length}`;

    const endIdx = Math.min(
      this.startIndex + this.visibleRowCount,
      this.data.length,
    );

    const fragment = document.createDocumentFragment();

    const topSpacer = document.createElement("tr");
    topSpacer.style.height = `${this.startIndex * this.rowHeight}px`;
    topSpacer.style.pointerEvents = "none";
    fragment.appendChild(topSpacer);

    for (let i = this.startIndex; i < endIdx; i++) {
      const psg = this.data[i];
      if (!psg.name) continue;
      const tr = document.createElement("tr");
      tr.style.height = `${this.rowHeight}px`;
      tr.innerHTML = `
        <td>${psg.id}</td>
        <td>
          ${psg.name}
          <br />
         <span class="ticket-badge">${psg.ticket}</span> 
        </td>
        <td>${psg.gender === "female" ? "F" : "M"}</td>
        <td>${psg.survived ? "Yes" : "No"}</td>
        <td>${Math.floor(psg.age)}</td>
      `;
      fragment.appendChild(tr);
    }

    if (endIdx < this.data.length) {
      const bottomSpacer = document.createElement("tr");
      const remainingRows = this.data.length - endIdx;
      bottomSpacer.style.height = `${remainingRows * this.rowHeight}px`;
      bottomSpacer.style.pointerEvents = "none";
      fragment.appendChild(bottomSpacer);
    }

    this.tableBody.innerHTML = "";
    this.tableBody.appendChild(fragment);
  }

  updateData(newData) {
    this.data = newData;
    this.startIndex = 0;
    this.container.scrollTop = 0;
    this.render();
  }
}
