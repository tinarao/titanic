const batchSize = 100;
const DATA_URL =
  "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json";

let allData = [];
let currentData = [];
let currentIndex = 0;

const tableBody = document.querySelector("#table-body");
const tableCaption = document.querySelector("#table-caption");
const searchForm = document.querySelector("#search-form");
const resetFormButton = document.querySelector("#reset-form-button");

searchForm.addEventListener("submit", handleSubmitSearchForm);
resetFormButton.addEventListener("click", handleResetFormState);

function handleResetFormState(_e) {
  clearTableState();
  searchForm.reset();
  currentData = allData;
  renderBatch();
}

function handleSubmitSearchForm(e) {
  e.preventDefault();

  const formData = new FormData(searchForm);
  const criteria = {
    name: formData.get("name").trim() || "",
    survived: formData.get("survived") === "on",
    gender: formData.get("gender"),
    age: formData.get("age") ? parseInt(formData.get("age")) : null,
  };

  const results = allData.filter((psg) => {
    if (
      criteria.name &&
      !psg.name.toLowerCase().includes(criteria.name.toLowerCase())
    ) {
      return false;
    }

    if (criteria.survived && !psg.survived) {
      return false;
    }

    if (criteria.gender !== "any" && psg.gender !== criteria.gender) {
      return false;
    }

    if (criteria.age !== null && Math.floor(psg.age) !== criteria.age) {
      return false;
    }

    return true;
  });

  currentData = results;

  clearTableState();
  renderBatch();
}

async function fetchData() {
  const response = await fetch(DATA_URL);
  return await response.json();
}

function clearTableState() {
  currentIndex = 0;
  tableBody.innerHTML = "";
}

function renderBatch() {
  tableCaption.innerHTML = `Total: ${currentData.length}`;
  const fragment = document.createDocumentFragment();
  const nextPassengers = currentData.slice(
    currentIndex,
    currentIndex + batchSize,
  );

  nextPassengers.forEach((psg) => {
    if (!psg.name) return;
    const row = document.createElement("tr");

    row.innerHTML = `
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

    fragment.appendChild(row);
  });

  tableBody.appendChild(fragment);
  currentIndex += batchSize;
}

async function main() {
  allData = await fetchData();
  currentData = allData;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && currentIndex < currentData.length) {
      renderBatch();
    }
  });
  const anchor = document.querySelector("#observer-anchor");
  if (!anchor) throw "No anchor";

  observer.observe(anchor);
}

main();
