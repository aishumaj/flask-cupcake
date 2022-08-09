"use strict";

const BASE_URL = "http://localhost:5000/api";

const $cupcakeList = $("#cupcake-list");
const $cupcakeAddForm = $("#add-cupcake-form");
const $cupcakeSearchForm = $("#search-form");

/** Generate HTML to input into empty list with details for each cupcake */
function cupcakeHTML(cupcake) {
  const $cupcakeImg = $("<img>").attr("src", `${cupcake.image}`);
  const $newCupcake = $("<li>").text(`${cupcake.flavor} | ${cupcake.size} | ${cupcake.rating}`).append($cupcakeImg);

  return $newCupcake;
}

/** Get information on all cupcakes in database,
 * return array [{cupcake1}, {cupcake2}, ...].
*/
async function getCupcakes() {
  const cupcakeData = await axios.get(`${BASE_URL}/cupcakes`);
  return cupcakeData.data.cupcakes;
}

/** Put cupcakes into listhome */
async function appendCupcakesToList() {
  const cupcakes = await getCupcakes();

  for (let cupcake of cupcakes) {
    const $cupcakeInfo = cupcakeHTML(cupcake);
    $cupcakeList.append($cupcakeInfo);
  }
}

/**
 * Handles the form submission and grabs the input data
 * and updates the DOM with the new cupcake created from the data
 * @param {*} evt
 */

async function submitNewCupcake(evt) {
  evt.preventDefault();

  const flavor = $("#flavor-input").val();
  const size = $("#size-input").val();
  const rating = $("#rating-input").val();
  const image = $("#img-input").val();

  const newCupcake = await addCupcake(flavor, size, rating, image);

  const $cupcakeInfo = cupcakeHTML(newCupcake);
  $cupcakeList.append($cupcakeInfo);

  $cupcakeAddForm.trigger("reset");
}

/** Handles the submit button */

$cupcakeAddForm.on("submit", submitNewCupcake);

/**
 * Ajax POST request to create a new cupcake
 * @param flavor, size, rating, image
 * @returns cupcake object {"flavor": flavor, "size": size, "rating": rating, "image": image}
 */

async function addCupcake(flavor, size, rating, image) {
  const response = await axios.post(`${BASE_URL}/cupcakes`, {
    flavor,
    size,
    rating,
    image
  });
  return response.data.cupcake;
}

async function submitCupcakeSearch(evt) {
  evt.preventDefault();

  $cupcakeList.empty();

  const flavor = $("#search-input").val();
  console.log("flavor", flavor);
  const cupcakesResults = await searchCupcake(flavor);
  console.log("cupcakesResults", cupcakesResults);
  if (cupcakesResults.length === 0) {
    alert(`No cupcakes found with ${flavor} flavor`);
  }

  for (let cupcake of cupcakesResults) {
    const $cupcakeInfo = cupcakeHTML(cupcake);
    $cupcakeList.append($cupcakeInfo);

  }
  $cupcakeSearchForm.trigger("reset");
}

$cupcakeSearchForm.on("submit", submitCupcakeSearch);

async function searchCupcake(flavor) {
  const response = await axios.get(`${BASE_URL}/cupcakes/search?flavor=${flavor}`);
  return response.data.cupcakes;
}

//start function
async function start() {
  await appendCupcakesToList();
}

start();

