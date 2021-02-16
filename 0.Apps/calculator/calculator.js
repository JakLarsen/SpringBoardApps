//Onload setup initial values and update when submitted
window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("calc-form");
  if (form) {
    setupIntialValues();
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      update();
    });
  }
});

function getCurrentInputs() {
  return {
    amount: +(document.getElementById("loan-amount").value),
    years: +(document.getElementById("loan-years").value),
    rate: +(document.getElementById("loan-rate").value),
  }
}

function setupIntialValues() {

  const inputs = {amount: 100000, years: 12, rate: 2};
  const amountInput = document.querySelector('#loan-amount');
  const yearsInput = document.querySelector('#loan-years');
  const rateInput = document.querySelector('#loan-rate');

  amountInput.value = inputs.amount;
  yearsInput.value = inputs.years;
  rateInput.value = inputs.rate;

  update();
}

//gets the inputs we have saved from the form, checks them for proper inputs, sends them to be calculated, and displays
function update(){
  const currentInputs = getCurrentInputs();
  checkInputs(currentInputs);
  displayMonthly(calculateMonthlyPayment(currentInputs));
}

function displayMonthly(monthlyPayment) {
  const monthlyDisplay = document.getElementById("monthly-payment");
  monthlyDisplay.innerText = "$" + monthlyPayment;
}

function calculateMonthlyPayment(userInput){
  const rate = ((userInput.rate/100)/12);
  const n = (userInput.years * 12);
  let monthlyPayment = parseFloat(((rate*userInput.amount)/(1-Math.pow((1+rate),-n))).toFixed(2));
  
  // if monthlyPayment.toString().split(
  return monthlyPayment;
}

function checkInputs(currentInputs){
  if (currentInputs.rate === 0){
    alert("Please enter a positive number greater than 1000 for Loan Amount, a positive number less than 100 for Term in Years, and a non-zero Yearly Rate.");
    throw new Error ('userInputError: Rate amount must be a nonzero number.');
  }
  else if (currentInputs.years <= 0 || currentInputs.years > 100){
    alert("Please enter a positive number greater than 1000 for Loan Amount, a positive number less than 100 for Term in Years, and a non-zero Yearly Rate.");
    throw new Error ('userInputError: Term in years must be a positive number.');
  }
  else if (currentInputs.amount <= 0 || currentInputs.amount <1000){
    alert("Please enter a positive number greater than 1000 for Loan Amount, a positive number less than 100 for Term in Years, and a non-zero Yearly Rate.");
    throw new Error ('userInputError: Loan Amount must be a positive number.');
  }
}



