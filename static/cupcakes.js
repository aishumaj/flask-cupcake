"use strict";

const BASE_URL = "http://localhost:5000/api"

const $cupcakeList = $("#cupcake-list")
const $cupcakeAddForm = $("#add-cupcake-form")

/** Generate HTML to input into empty list with details for each cupcake */
function cupcakeHTML(cupcake) {
  return `<li>
    ${cupcake.flavor} | ${cupcake.size} | ${cupcake.rating}
    <img src="${cupcake.image}">
  </li>`
}

/** Get information on all cupcakes in database,
 * return array [{cupcake1}, {cupcake2}, ...].
*/
async function getCupcakes(){
  const cupcakeData = await axios.get(`${BASE_URL}/cupcakes`);
  return cupcakeData.data.cupcakes;
}

/** Put cupcakes into listhome */
async function appendCupcakesToList(){
  let cupcakes = await getCupcakes();

  for(let cupcake of cupcakes){
    console.log(cupcake);
    let cupcakeInfo = cupcakeHTML(cupcake);
    console.log(cupcakeInfo);
    $cupcakeList.append(cupcakeInfo);
  }
}

async function start(){
  await appendCupcakesToList();
}

start();

//handle form on click
