import { VirtualizedTable } from "./virtualization.js";

const DATA_URL =
  "https://raw.githubusercontent.com/altkraft/for-applicants/master/frontend/titanic/passengers.json";

let allData = [];
let currentData = [];

let table;

const tableCaption = document.querySelector("#table-caption");
const searchForm = document.querySelector("#search-form");
const resetFormButton = document.querySelector("#reset-form-button");

const tableContainer = document.querySelector("#table-wrapper");
const tableBody = document.querySelector("#table-body");
const tablePlaceholder = document.querySelector("#observer-anchor");

async function fetchData() {
  const response = await fetch(DATA_URL);
  return await response.json();
}

searchForm.addEventListener("submit", handleSubmitSearchForm);
resetFormButton.addEventListener("click", handleResetFormState);

function handleResetFormState(_e) {
  searchForm.reset();
  currentData = allData;
  table.updateData(currentData);
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

  table.updateData(results);
}

async function main() {
  allData = await fetchData();

  table = new VirtualizedTable(
    tableContainer,
    tableBody,
    tablePlaceholder,
    tableCaption,
    allData,
    50,
  );
}

main();
