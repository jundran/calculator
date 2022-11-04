"use strict"

/* DOM ELEMENTS */
const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.op')
const clearButton = document.querySelector('#clear')
const equalsButton = document.querySelector('#equals')

/* SET UP EVENT LISTENERS */
equalsButton.onclick = handleEquals
clearButton.onclick = handleClearButton
buttons.forEach(button => button.addEventListener('click', handleInput) )

/* MATHS FUNCTIONS */
const add = (x, y) => x + y
const subtract = (x, y) => x - y
const multiply = (x, y) => x * y
const divide = (x, y) => x / y
const isNumber = x => !isNaN(x)
const isOperator = x => isNaN(x)

/* STATE VARIABLES */
let operator
let firstNumber = ""
let secondNumber = ""

function operate(operator, x, y) {
  console.log(firstNumber, operator, secondNumber)
  if(operator === '+') return add(x,y)
  else if(operator === '-') return subtract(x,y)
  else if(operator === '*') return multiply(x,y)
  else if(operator === '/') return divide(x,y)
}

function handleInput(e) {
  const x = e.target.textContent
  // User inputted a number
  if(isNumber(x)) {
    operator ? secondNumber += x : firstNumber += x
    display.textContent += x
  }
  // User inputted an operator
  else {
    // We don't have an operator yet
    if(!operator) {
      operator = x
      display.textContent += ` ${x} `
    }
    // We already have an operator so do the calculation and save it to firstNumber
    // Then store the latest operator and wipe the secondNumber
    else {
      firstNumber = operate(operator, +firstNumber, +secondNumber)
      operator = x
      secondNumber = ""
      display.textContent = `${firstNumber} ${operator} `
    }
  }
}

function handleEquals(e) {
  // Do the calculation and save it as firstNumber to allow the user to continue from the result
  firstNumber = operate(operator, +firstNumber, +secondNumber)
  operator = null
  secondNumber = ""
  display.textContent = firstNumber
}

function handleClearButton() {
  operator = null
  firstNumber = ""
  secondNumber = ""
  display.textContent = ""
}
