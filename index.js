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
clear.onclick = clearState
backspace.onclick = handleBackspace
equals.onclick = handleEquals

/* MATHS FUNCTIONS */
const add = (x, y) => x + y
const subtract = (x, y) => x - y
const multiply = (x, y) => x * y
const divide = (x, y) => x / y
const isNumber = x => !isNaN(x)

/* STATE VARIABLES */
const state = {
  operator: null,
  firstNumber: "",
  secondNumber: ""
}

function operate(operator, x, y) {
  console.log(x, operator, y)
  if(operator === '+') return add(x,y)
  else if(operator === '-') return subtract(x,y)
  else if(operator === '*') return multiply(x,y)
  else if(operator === '/') return divide(x,y)
}

function clearState() {
  state.firstNumber = ""
  state.secondNumber = ""
  state.operator = null
  display.textContent = ""
}

function handleBackspace(e) {
  const x = e.target.textContent
  let prop = "secondNumber"
  if(!state.operator) prop = "firstNumber"
  else if (state.firstNumber && !state.secondNumber) prop = "operator"

  state[prop] = state[prop].toString() // slice won't work on numbers
  state[prop] = state[prop].slice(0, state[prop].length -1)
  display.textContent = display.textContent.slice(0, display.textContent.length - 1)
}

function handleInput(e) {
  const x = e.target.textContent
  handleErrors(x)
  if (isNumber(x)) processNumber(x)
  else processOperator(x)

  function processNumber(num) {
    state.operator ? state.secondNumber += num : state.firstNumber += num
    display.textContent += num
  }

  function processOperator(op) {
    // We don't have an state.operator saved yet
    if(!state.operator) {
      // Allow negative prefix before firstNumber
      if(!state.firstNumber && x === '-') {
        state.firstNumber = x
        return display.textContent = x
      }
      else if(/[0-9]/.test(state.firstNumber) ) {
        state.operator = x
        display.textContent += ` ${x} `
      }
    }
    // We already have an state.operator
    else {
      // Allow negative prefix before secondNumber
      if(!state.secondNumber && x === '-') {
        state.secondNumber = x
        return display.textContent += x
      }
      else if(/[0-9]/.test(state.secondNumber) ) {
        // Do the calculation and save it to firstNumber
        state.firstNumber = operate(state.operator, +state.firstNumber, +state.secondNumber)
        // Then store the latest state.operator and wipe the secondNumber
        state.operator = x
        state.secondNumber = ""
        display.textContent = `${state.firstNumber} ${state.operator} `
      }
    }
  }

  function handleErrors(x) {
    if (display.textContent === 'Cannot divide by zero') {
      clearState()
    }
    else if (x === '0' && state.operator === '/') {
      display.textContent = 'Cannot divide by zero'
    }
  }
}

function handleEquals(e) {
  if(!state.secondNumber || state.secondNumber === "-") return

  // Do the calculation and save it as firstNumber to allow the user to continue from the result
  state.firstNumber = operate(state.operator, +state.firstNumber, +state.secondNumber)
  state.operator = null
  state.secondNumber = ""
  display.textContent = state.firstNumber
}

function handleDot() {
  
}
