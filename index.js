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

function clearState() {
  firstNumber = ""
  secondNumber = ""
  operator = ""
  display.textContent = ""
}

function handleInput(e) {
  const x = e.target.textContent

  // Handle errors
  if(x === '0' && operator === '/') {
    return display.textContent = 'Cannot divide by zero'
  }
  if(display.textContent === 'Cannot divide by zero') {
    clearState()
  }
  
  // User inputted a number
  if(isNumber(x)) {
    operator ? secondNumber += x : firstNumber += x
    display.textContent += x
  }
  // User inputted an operator
  else {
    // We don't have an operator yet
    if(!operator) {
      if(!firstNumber) {
        if(x === '-') {
          firstNumber += x
          return display.textContent = x
        }
        return
      }
      operator = x
      display.textContent += ` ${x} `
    }
    // We already have an operator
    else {
      // Allow negative prefix after operator
      if(!secondNumber && x === '-') {
        secondNumber += x
        return display.textContent += x
      }

      // Do the calculation and save it to firstNumber
      firstNumber = operate(operator, +firstNumber, +secondNumber)
      // Then store the latest operator and wipe the secondNumber
      operator = x
      secondNumber = ""
      display.textContent = `${firstNumber} ${operator} `
    }
  }
}

function handleEquals(e) {
  if(!secondNumber) return

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
