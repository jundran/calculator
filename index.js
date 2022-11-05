"use strict"
const display = document.querySelector('.display')
const buttons = document.querySelectorAll('.op')
const dot = document.querySelector('#dot')
const clear = document.querySelector('#clear')
const backspace = document.querySelector('#backspace')
const equals = document.querySelector('#equals')

buttons.forEach(button => button.addEventListener('click', handleInput) )
dot.onclick = handleDot
clear.onclick = clearState
backspace.onclick = handleBackspace
equals.onclick = handleEquals

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
  
  if (state.secondNumber === '0' && state.operator === '/') {
    return display.textContent = 'Cannot divide by zero'
  }
  
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

function handleInput(e) {
  const x = e.target.textContent
  if (display.textContent === 'Cannot divide by zero') clearState()
  if (isNumber(x)) processNumber(x)
  else processOperator(x)

  function processNumber(num) {
    state.operator ? state.secondNumber += num : state.firstNumber += num

    const lastChar = display.textContent.charAt(display.textContent.length - 1)
    isNumber(lastChar) || lastChar === '-' || lastChar === '.' ?
      display.textContent += num :
      display.textContent += ` ${num}`
  }

  function processOperator(op) {
    function applyNegativePrefix(num) {
      state[num] = '-'
      return display.textContent += '-'
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
      if(!state.secondNumber && x === '-') {
        applyNegativePrefix('secondNumber')
      }
      else if(/[0-9]/.test(state.secondNumber) ) {
        state.firstNumber = operate(state.operator, +state.firstNumber, +state.secondNumber)
        state.operator = x
        state.secondNumber = ""
        display.textContent = `${state.firstNumber} ${state.operator} `
      }
    }
  }
}

function handleEquals(e) {
  if(!state.secondNumber || state.secondNumber === "-") return
  // Save result to first number in order to continue with further calculations
  state.firstNumber = operate(state.operator, +state.firstNumber, +state.secondNumber)
  state.operator = null
  state.secondNumber = ""
  display.textContent = state.firstNumber
}

function handleBackspace(e) {
  const x = e.target.textContent
  let prop = "secondNumber"
  if(!state.operator) prop = "firstNumber"
  else if (state.firstNumber && !state.secondNumber) prop = "operator"

  state[prop] = "" + state[prop]
  state[prop] = state[prop].slice(0, state[prop].length - 1)
  do {
    display.textContent = display.textContent.slice(0, display.textContent.length - 1)
    console.log(state)
  } while (display.textContent.charAt(display.textContent.length - 1) === ' ')
}

function handleDot() {
  let prop = "secondNumber"
  if(!state.operator) prop = "firstNumber"
  if(state[prop].includes('.')) return
  
  let dot
  if(!state[prop]) dot = '0.'
  else dot = '.'
  state[prop] += dot
  display.textContent = display.textContent += dot
}
