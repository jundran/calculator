"use strict"

/* DOM ELEMENTS */
const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.op')
const dot = document.querySelector('#dot')
const clear = document.querySelector('#clear')
const backspace = document.querySelector('#backspace')
const equals = document.querySelector('#equals')

/* SET UP EVENT LISTENERS */
buttons.forEach(button => button.addEventListener('click', handleInput) )
dot.onclick = handleDot
clear.onclick = handleClear
backspace.onclick = handleBackspace
equals.onclick = handleEquals

/* MATHS FUNCTIONS */
const add = (x, y) => x + y
const subtract = (x, y) => x - y
const multiply = (x, y) => x * y
const divide = (x, y) => x / y
const isNumber = x => !isNaN(x)

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

function clearState() {
  firstNumber = ""
  secondNumber = ""
  operator = ""
  display.textContent = ""
}

function handleInput(e) {
  const x = e.target.textContent
  handleErrors(x)
  if (isNumber(x)) processNumber(x)
  else processOperator(x)

  function processNumber(num) {
    operator ? secondNumber += num : firstNumber += num
    display.textContent += num
  }

  function processOperator(op) {
    // We don't have an operator saved yet
    if(!operator) {
      // Allow negative prefix before firstNumber
      if(!firstNumber && x === '-') {
        firstNumber = x
        return display.textContent = x
      }
      else if(/[0-9]/.test(firstNumber) ) {
        operator = x
        display.textContent += ` ${x} `
      }
    }
    // We already have an operator
    else {
      // Allow negative prefix before secondNumber
      if(!secondNumber && x === '-') {
        secondNumber = x
        return display.textContent += x
      }
      else if(/[0-9]/.test(secondNumber) ) {
        // Do the calculation and save it to firstNumber
        firstNumber = operate(operator, +firstNumber, +secondNumber)
        // Then store the latest operator and wipe the secondNumber
        operator = x
        secondNumber = ""
        display.textContent = `${firstNumber} ${operator} `
      }
    }
  }

  function handleErrors(x) {
    if (display.textContent === 'Cannot divide by zero') {
      clearState()
    }
    else if (x === '0' && operator === '/') {
      display.textContent = 'Cannot divide by zero'
    }
  }
}

function handleEquals(e) {
  if(!secondNumber || secondNumber === "-") return

  // Do the calculation and save it as firstNumber to allow the user to continue from the result
  firstNumber = operate(operator, +firstNumber, +secondNumber)
  operator = null
  secondNumber = ""
  display.textContent = firstNumber
}

function handleClear() {
  operator = null
  firstNumber = ""
  secondNumber = ""
  display.textContent = ""
}

function handleBackspace() {

}

function handleDot() {
  
}
