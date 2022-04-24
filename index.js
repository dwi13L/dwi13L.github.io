//user input
let query = window.sessionStorage.getItem(`q`);

while (query == null) {
  query = prompt(`What would you like to see?`);
}

setSessionStorage(replaceWithHyphen(query));

if (query.includes(` `)) {
  query = replaceWithHyphen(query);
}

//query parameters
const baseUrl = `https://g.tenor.com/v1/random`;
const apikey = `MQEGHTEYHEJE`;
const limit = 10;
const contentfilter = `medium`; //(values: off | low | medium | high)
const media_filter = `basic`;
const ar_range = `wide`;
const whiteSpace = document.getElementById(`container`);
const body = document.getElementsByTagName(`body`);
let pos = 0;

//dom elements
let hero = document.getElementById(`hero`);
let searchbox = document.getElementById(`searchbar`);
let lens = document.getElementById(`lens`);

//Other global variables
let buffer = limit - 1; //to be less than limit at all times
let resultSet;
let images = [];
let current = 0;

/********** Functions **********/
main();

async function main() {
  console.log(`Entered Main`);
  try {
    await fetchData(prepareImages);
    updatePage();
  } catch (error) {
    fallback();
  }
}

async function fetchData(callback) {
  console.log(`%c Fetching data `, "background:green; color:white;");

  /**********Query**********/

  let searchUrl = `${baseUrl}?q=${query}&key=${apikey}&limit=${limit}&contentfilter=${contentfilter}&media_filter=${media_filter}&ar_range=${ar_range}&pos=${pos}`;

  try {
    console.log(`%c${searchUrl}`, `background: black; color: blue`);
    const response = await fetch(searchUrl);
    resultSet = await response.json();
    pos = resultSet.next;
    const imageData = resultSet.results;
    console.log(`imageData ->`, imageData);
    console.log(`Fetch successful`);

    callback(imageData);
  } catch (error) {
    console.error(`Fetch failed`);
    throw error;
  }
}

async function updatePage() {
  try {
    if (current === buffer || images.length == 0) {
      await fetchData(prepareImages);

      if (images.length > limit) {
        images.splice(0, buffer + 1);
        console.log(
          `%c Removing first ${buffer + 1} element. ${
            images.length
          } image URLs available`,
          `background: black; color: yellow`
        );
      }

      current = 0;
      console.log(`index reset to ->`, current);
    }

    if (images.length == 0) {
      console.error(`No URLs in queue`);
      return;
    }

    console.log(`updating page with index -> `, current);
    let url = images[current++];
    updateImage(url);
  } catch (error) {
    console.error(`Couldn't update image from data`);
    fallback();
  }
}

/**
 * Utility Functions
 */

function setSessionStorage(query) {
  window.sessionStorage.setItem(`q`, query);
}

function prepareImages(imageData) {
  console.log(`Preparing images`);

  imageData.forEach((imageData) => {
    images.push(imageData.media[0].gif.url);
  });

  console.log(`${images.length} image URLs ready`);
}

function updateImage(url) {
  hero.src = url;
  console.log(`Hero image updated`);
}

function replaceWithHyphen(string) {
  let newString = string.replace(/ /g, `-`);
  return newString;
}

function fallback() {
  console.warn(`Executing fallback`);
  updateImage(`img/2.gif`);
}

function setquery() {
  let value = replaceWithHyphen(searchbox.value);
  setSessionStorage(value);
  query = value;
  images = [];
  main();
}

/**
 * Event Listeners
 */
hero.addEventListener(`click`, () => {
  console.log(`Next image request`);
  updatePage();
});

searchbox.onchange = setquery;
lens.onclick = setquery;
