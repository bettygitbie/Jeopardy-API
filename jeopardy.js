
let startBtn = document.getElementById("start-btn");
let gameTable = document.querySelector(".gametable");
const questionBtn = document.querySelector(".questions");
const showLoader = document.querySelector("#showLoader");
const tHead = document.getElementById("tHead");
const tBody = document.getElementById("tBody");

let categories = []; //All the categories from the API
let categoryReturned = []; //selected categories by Id.
let tableHeader = ""; //Updates the table header

startBtn.addEventListener("click", function () {
  if (startBtn.innerText === "Start") {
    showLoadingView();
  } else if (startBtn.innerText === "Restart") {
    resetTable();
    showLoadingView();
  }
});
function resetTable() {
  tableHeader = "";
  tHead.innerHTML = "";
  tBody.innerHTML ="";
  categoryReturned =[];  //Initialize array
}

async function setupAndStart() {
  gameTable.style.display = "block";
  const res = await axios.get(
    "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
  );
  categories = res.data;

  //get six random category id array
  const random_categories = getCategoryIds(categories);
  //get six objects with title and 5 clues
  fillTable(random_categories);
}

// Get random category ids array from given categories
function getCategoryIds(categories) {
  const NUM_CATEGORIES = categories.map((category) => category.id);
  let random_category = [];
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * NUM_CATEGORIES.length);
    if (!random_category.includes(NUM_CATEGORIES[random])) {
      random_category.push(NUM_CATEGORIES[random]);
    } else {
      i--; //if the array already has the value, run again!
    }
  }
  return random_category;
}

//Get category with a categroy Id.
async function getCategory(catId) {
  const res = await axios.get(
    `https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`
  );
  const { title, clues } = res.data;
  categoryReturned.push({ title, clues });
  return categoryReturned;
}

//Fill the table by accepting the random categories array
async function fillTable(random_categories) {
 
  //tHead.innerHTML = `<tr>${tableHeader}</tr>`;
  for (let id of random_categories) {
    await getCategory(id);
  }

  // Initialize the table with buttons and loaded category title
  categoryReturned.forEach(function (category) {
    tableHeader += `<th>${category.title}</th>`;
  });
  tHead.innerHTML = `<tr>${tableHeader}</tr>`;
  for (j = 0; j < 5; j++) {
    let row = document.createElement("tr");
    for (let i = 0; i < 6; i++) {
      let clueBox = document.createElement("td");
      clueBox.textContent = "?";
      clueBox.id = `${i}-${(j + 1) * 100}`; //Assign each box an Id based on value
      clueBox.addEventListener("click", handleClick, false);
      row.appendChild(clueBox);
    }
    tBody.appendChild(row);
  }
}

// Handle the clicked clue box by finding
function handleClick(event) {
  let target = event.currentTarget;
  let boxValue = target.id.slice(2);
  let parent = target.parentNode;
  let index = Array.prototype.findIndex.call(
    parent.children,
    (c) => c === target
  );
  let cluesList = categoryReturned[index].clues;
  let clue = cluesList.find((item) => {
    return item.value == boxValue;
  });
  showQuestions(clue, target, target.id);
}

function showQuestions(clue, clickedTarget, boxValue) {
  let question = document.getElementById(`${boxValue}`);
  question.innerHTML = clue.question;
  clickedTarget.addEventListener("click", function () {
    //if clicked again, show the answer to the clicked target
    showAnswer(clue, boxValue);
  });
}

function showAnswer(clue, boxValue) {
  let answer = document.getElementById(`${boxValue}`);
  answer.innerHTML = clue.answer;
  answer.style.backgroundColor = "green";
}
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  showLoader.classList.add("loader");
  startBtn.innerText = "Loading...";
  setTimeout(() => {
    hideLoadingView();
    setupAndStart();
    startBtn.innerText = "Restart";
  }, 2000);
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  showLoader.classList.remove("loader");
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
