"use strict"
const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.op')
const dot = document.querySelector('#dot')
const clear = document.querySelector('#clear')
const backspace = document.querySelector('#backspace')
const equals = document.querySelector('#equals')

dot.onclick = handleDot
clear.onclick = clearState
backspace.onclick = handleBackspace
equals.onclick = handleEquals
buttons.forEach(button =>
  button.addEventListener('click', e => handleInput(e.target.textContent)))

// Keypress does not interfere with shift and F-keys (ie. F12 for dev tools)
// but also ignores backspace and delete so need to also listen for keydown
document.addEventListener('keypress', e => {
  const input = getInputFromKeyPress(e)
  if(input) handleInput(input)
})

document.addEventListener('keydown', e => {
  if(e.code === 'Enter' || e.code === 'NumpadEnter') {
    // Prevent Enter or NumpadEnter from triggering last button clicked with mouse
    e.preventDefault()
    handleEquals()
  }
  else if(e.code === 'Backspace' || e.code === 'Delete') {
    handleBackspace()
  }
})

const add = (x, y) => x + y
const subtract = (x, y) => x - y
const multiply = (x, y) => x * y
const divide = (x, y) => x / y
const isNumber = x => !isNaN(x)

const state = {
  operator: null,
  firstNumber: "",
  secondNumber: ""
}

function operate(operator, x, y) {
  console.log(x, operator, y)
  let answer
  if(operator === '+') answer = add(x,y)
  else if(operator === '-') answer = subtract(x,y)
  else if(operator === '*') answer = multiply(x,y)
  else if(operator === '/') answer = divide(x,y)
  return Number.parseFloat(answer.toFixed(16))
}

function clearState() {
  state.firstNumber = ""
  state.secondNumber = ""
  state.operator = null
  display.textContent = ""
}

function handleInput(x) {
  if (!state.firstNumber) clearState()
  if (isNumber(x)) processNumber(x)
  else processOperator(x)

  function processNumber(num) {
    state.operator ? state.secondNumber += num : state.firstNumber += num
    display.textContent += num
  }

  function processOperator(op) {
    function applyNegativePrefix(num) {
      state[num] = '-'
      display.textContent += '-'
    }

    if(!state.operator) {
      if(!state.firstNumber && x === '-') {
        applyNegativePrefix('firstNumber')
      }
      else if(/[0-9]/.test(state.firstNumber) ) {
        state.operator = x
        display.textContent += ` ${x} `
      }
    }
    else {
      if(!state.secondNumber && x === '-') applyNegativePrefix('secondNumber')
      else if(/[0-9]/.test(state.secondNumber) ) calculateAndDisplayResult(x)
    }
  }
}

function calculateAndDisplayResult(nextOperator) {
  if (state.secondNumber === '0' && state.operator === '/') {
    clearState()
    return display.textContent = 'Cannot divide by zero'
  }

  // Save result to first number in order to continue with further calculations
  state.firstNumber = operate(state.operator, +state.firstNumber, +state.secondNumber)
  state.operator = nextOperator || null
  state.secondNumber = ""
  display.textContent = state.firstNumber
  if(nextOperator) display.textContent += ` ${state.operator} `
  if(state.firstNumber === Infinity) state.firstNumber = ""
}

function handleEquals() {
  if(!state.secondNumber || state.secondNumber === "-") return
  calculateAndDisplayResult()
}

function handleBackspace() {
  let prop = "secondNumber"
  if(!state.operator) prop = "firstNumber"
  else if (state.firstNumber && !state.secondNumber) prop = "operator"

  state[prop] = "" + state[prop]
  state[prop] = state[prop].slice(0, state[prop].length - 1)

  display.textContent = display.textContent.trim()
  display.textContent = display.textContent.slice(0, display.textContent.length - 1)
  display.textContent = display.textContent.trim()
}

function handleDot() {
  let prop = "secondNumber"
  if(!state.operator) prop = "firstNumber"
  if(state[prop].includes('.')) return

  let dot = '.'
  if(!state[prop] || state[prop] === '-') dot = '0.'
  state[prop] += dot
  display.textContent = display.textContent += dot
}

function getInputFromKeyPress(e) {
  const c = e.key
  if(/^\d$/.test(c)) return c
  else if(['+', '-', '*', '/', '\\'].includes(c)) return c
  else if(c === '.') handleDot()
  else if(c === '=') handleEquals()
  else if(c === 'c' || c === 'C') clearState()
  return null
}
