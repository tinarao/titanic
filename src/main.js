const batchSize = 100;
const DATA_URL =
  "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json";

let allData = [];
let currentIndex = 0;

const button = document.querySelector("#find-button");
const searchInput = document.querySelector("#search-input");
const tableBody = document.querySelector("#table-body");

button.onclick = handleSearch;

async function fetchData() {
  const response = await fetch(DATA_URL);
  return await response.json();
}

function clearTableState() {
  currentIndex = 0;
  tableBody.innerHTML = "";
}

function handleSearch() {
  clearTableState();
  let query = searchInput.value;
  if (!query) {
    renderBatch(allData);
    return;
  }

  query = query.trim().toLowerCase();

  const results = allData.filter((psg) =>
    psg.name.toLowerCase().includes(query),
  );

  renderBatch(results);
}

function renderBatch(data) {
  const fragment = document.createDocumentFragment();
  const nextPassengers = data.slice(currentIndex, currentIndex + batchSize);

  nextPassengers.forEach((psg) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${psg.id}</td>
        <td class="name-col">${psg.name}</td>
        <td>${psg.gender}</td>
        <td>${psg.survived}</td>
        <td>${Math.floor(psg.age)}</td>
        `;

    fragment.appendChild(row);
  });

  tableBody.appendChild(fragment);
  currentIndex += batchSize;
}

async function main() {
  allData = await fetchData();

  const observer = new IntersectionObserver(renderBatch);
  const anchor = document.querySelector("#observer-anchor");
  if (!anchor) throw "No anchor";

  observer.observe(anchor);
  renderBatch(allData);
}

main();
