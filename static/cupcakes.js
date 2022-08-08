"use strict";

const BASE_URL = "http://localhost:5001/api";

const $cupcakeList = $("#cupcake-list");
const $cupcakeAddForm = $("#add-cupcake-form");

/** Generate HTML to input into empty list with details for each cupcake */
function cupcakeHTML(cupcake) {
  return `<li>
    ${cupcake.flavor} | ${cupcake.size} | ${cupcake.rating}
    <img src="${cupcake.image}">
  </li>`;
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
  let cupcakes = await getCupcakes();

  for (let cupcake of cupcakes) {
    const cupcakeInfo = cupcakeHTML(cupcake);
    $cupcakeList.append(cupcakeInfo);
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

  const cupcakeInfo = cupcakeHTML(newCupcake);
  $cupcakeList.append(cupcakeInfo);

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
    flavor: flavor,
    size: size,
    rating: rating,
    image: image
  });
  return response.data.cupcake;
}

//start function
async function start() {
  await appendCupcakesToList();
}

start();

