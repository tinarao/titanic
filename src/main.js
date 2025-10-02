const batchSize = 100;
const DATA_URL =
  "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json";

let data;
let currentIndex = 0;

const button = document.querySelector("#find-button");
const searchInput = document.querySelector("#search-input");
const tableBody = document.querySelector("#table-body");

async function fetchData() {
  const response = await fetch(DATA_URL);
  data = await response.json();
}

function renderBatch() {
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
  await fetchData();

  // button.onclick = (_e) => {
  //   console.log(searchInput.value);
  // };

  const observer = new IntersectionObserver(renderBatch);
  const anchor = document.querySelector("#observer-anchor");
  if (!anchor) throw "No anchor";

  observer.observe(anchor);
}

main();
