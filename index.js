//input parameters
const baseUrl = `https://g.tenor.com/v1/random`;
const apikey = `MQEGHTEYHEJE`;
const limit = 1;
const contentfilter = `medium`;
const media_filter = `basic`;
const ar_range = `wide`;

let query = window.localStorage.getItem(`q`);

if (query == null) {
  query = prompt(`What would you like to see?`);
  window.localStorage.setItem(`q`, query);
} else {
  query = window.localStorage.getItem(`q`);
}

const queryF = replaceWithHyphen(query);
async function start() {
  try {
    const searchUrl = `${baseUrl}?q=${queryF}&key=${apikey}$limit=${limit}&contentfilter=${contentfilter}&media_filter=${media_filter}&ar_range=${ar_range}`;
    console.log(`Search url`, searchUrl);
    const response = await fetch(searchUrl);
    data = await response.json();
    const resourceUrl = data.results[0].media[0].gif.url;
    //update with new resource url
    updateImg(resourceUrl);
  } catch (error) {
    console.log(error);
    updateImg(`img/2.gif`);
  }
}

function updateImg(url) {
  let hero = document.getElementById(`hero`);
  hero.src = url;
}

function replaceWithHyphen(string) {
  console.log(string);
  let newString = string.replace(/ /g, `-`);
  console.log(newString);
  return newString;
}

start();
