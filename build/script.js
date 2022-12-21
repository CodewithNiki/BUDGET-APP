const balanceTotal = document.querySelector("#balance-total");
const incomeTotal = document.querySelector("#income-total");
const outcomeTotal = document.querySelector("#outcome-total");
const incomeArea = document.querySelector("#income-area");
const expenseArea = document.querySelector("#expense-area");
const allArea = document.querySelector("#all-area");
const incomeBtn = document.querySelector("#income-btn");
const expenseBtn = document.querySelector("#expense-btn");
const allBtn = document.querySelector("#all-btn");
const incomeListContainer = document.querySelector("#income-list-container");
const expenseListContainer = document.querySelector("#expense-list-container");
const lists = document.querySelectorAll("ul");
const allListContainer = document.querySelector("#all-list-container");
const incomeAddBtn = document.querySelector("#add-income-btn");
const expenseAddBtn = document.querySelector("#add-expense-btn");
const incomeTitle = document.querySelector("#income-title");
const expenseTitle = document.querySelector("#expense-title");
const incomeAmount = document.querySelector("#income-amount");
const expenseAmount = document.querySelector("#expense-amount");

let [balance, income, outcome] = [0, 0, 0];
let [editBtn, deleteBtn] = ["far fa-edit", "fas fa-trash"];
let entryContainer;
entryContainer = JSON.parse(localStorage.getItem("entry-list")) || [];
updateUI();

incomeBtn.addEventListener("click", () => {
  show(incomeArea);
  hide([expenseArea, allArea]);
});

expenseBtn.addEventListener("click", () => {
  show(expenseArea);
  hide([incomeArea, allArea]);
});

allBtn.addEventListener("click", () => {
  show(allArea);
  hide([incomeArea, expenseArea]);
});

function show(element) {
  element.classList.remove("hidden");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hidden");
  });
}

document.addEventListener("keypress", (e) => {
  if (e.key !== "Enter") return;
  budgetIn(e);
  budgetOut(e)
});

incomeAddBtn.addEventListener("click", budgetIn);
expenseAddBtn.addEventListener("click", budgetOut);

lists.forEach((list)=>{
  list.addEventListener("click", (e)=>{
    let item = e.target;
    if(item.localName !== "i")return;
    let targetClass = item.classList.value;
    let targetId = item.parentNode.parentNode.id;

    if(targetClass === editBtn){
      editEntry(targetId);
      deleteEntry(targetId);
    }

    else if(targetClass === deleteBtn){
      deleteEntry(targetId);
    }

  });
})

function deleteEntry(targetId){
  entryContainer.splice(targetId, 1);
  updateUI();
}

function editEntry(targetId){
  let targetType = entryContainer[targetId].type;
  let targetAmount = entryContainer[targetId].amount;
  let targetTitle = entryContainer[targetId].title;
  if(targetType === "income"){
    incomeAmount.value = targetAmount;
    incomeTitle.value = targetTitle;
  }

  if(targetType === "expense"){
    expenseAmount.value = targetAmount;
    expenseTitle.value = targetTitle;
  }
}

function budgetIn(e) {
  e.preventDefault();
  if (incomeTitle.value === "" && incomeAmount.value === "")
    return;

  let income = {
    type: "income",
    title: incomeTitle.value,
    amount: parseInt(incomeAmount.value),
  };
  entryContainer.push(income);
  updateUI();
  clearList([incomeTitle, incomeAmount]);
}

function budgetOut(e) {
  e.preventDefault();
  if (expenseTitle.value == "" && expenseAmount.value == "")
    return;

  let expense = {
    type: "expense",
    title: expenseTitle.value,
    amount: parseInt(expenseAmount.value)
  };
  entryContainer.push(expense);
  updateUI();
  clearList([expenseTitle, expenseAmount]);
}

function updateUI(){
  income = calculateTotal("income", entryContainer);
  outcome = calculateTotal("expense", entryContainer);
  balance = Math.abs(calculateTotalBalance(income, outcome));

  let sign = income >= outcome ? "#" : "-#";

  balanceTotal.innerHTML = `<span>${sign}</span><p>${balance}</p>`
  incomeTotal.innerHTML = `<p>${income}</p>`
  outcomeTotal.innerHTML = `<p>${outcome}</p>`;

  clearElement([incomeListContainer, expenseListContainer, allListContainer]);

  entryContainer.forEach((entry, index)=>{
    if(entry.type === "income"){
      showEntry(incomeListContainer, entry.type, entry.title, entry.amount, index);
    }
    else if(entry.type === "expense"){
      showEntry(expenseListContainer, entry.type, entry.title, entry.amount, index);
    }
      showEntry(allListContainer, entry.type, entry.title, entry.amount, index);
  });
  updateChart(income, outcome);

  localStorage.setItem("entry-list", JSON.stringify(entryContainer));
}

function clearElement(elements){
  elements.forEach((element)=>{
    element.innerHTML = "";
  })
}

function showEntry(list, type, title, amount, id){
  const entry = `<li class = "${type}" id = "${id}">
                    <div class = "entry">${title}: #${amount}
                    </div>
                    <div class = "icon">
                     <i class = "far fa-edit"></i>
                     <i class = "fas fa-trash"></i>
                    </div>
                  </li>`;

  const positionItem = "afterbegin";
  list.insertAdjacentHTML(positionItem, entry);
}

function calculateTotalBalance(income, outcome){
  return income - outcome;
}


function calculateTotal(type, list){
  let sum = 0;
  list.forEach((entry) =>{
    if(entry.type === type){
      sum += entry.amount;
    }
  });
  return sum;
}

function clearList(inputs){
  inputs.forEach((input)=>{
    input.value = "";
  })
}