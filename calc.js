// THINGS I HAVE LEARNED
// 1- WHAT IS DATASET , AND HOW TO CREATE THEM IN HTML AND JS , WHY TO USE THEM
// IN HTML U USE DATA- FOLLOWED BY THE NAME OF UR DATASET
// "ACTION" IN THIS CODE FOR EXAMBLE  WAS CREATED IN HTML AND USED TO KNOW WHAT'S THE KEY type
// u can use action only by the EVENT VARIABLE CUZ IT IS A BUTTON IF IT WAS A DIV U CAN USE THE DIV VARIABLE
// ANOTHER DATASET MADE WAS previousKeyType , HERE U SHOULD USE THE DIV VARIABLE THAT U WANT
// 2- ARROW FUNCTIONS
let mooo= false;
function moo (){
  let moo=document.querySelector(".header--text2");
  if(!mooo){
    moo.textContent= "Another One";
    mooo=true;
  }
  else{
    mooo=false;
    moo.textContent= "";
  }
}

const calculate = function (n1, operator, n2) {

  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum  + secondNum;
  if (operator === 'subtract') return firstNum  - secondNum;
  if (operator === 'multiply') return firstNum  * secondNum;
  if (operator === 'divide') return firstNum  / secondNum;
}

const getKeyType = key => { //
  // arrow function that takes a one arg to decide what is the key type
    const {action} = key.dataset // just a const without a name that can hold other variables and assign them with a value
    //key is just the button (key -_-) we clicked
    // key.dataset means what is the dataset we created in html actually holds

    // console.log(action); // u can check if u want
    if(!action) return 'number' // if action==null
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) return 'operator'

    return action // return decimal or clear or equal
}

const createResultString = (key, displayNum , state)=>{
  // arrow function that takes three arg the key type , displayed Number and the state
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const { // creats a const that holds 4 values and assign them to an object (state)
      // since state actually represents calculator.dataset == the datasets we created in the code
       firstValue,
       operator,
       modValue,
       previousKeyType,
    } = state

    if(keyType==='number'){
      return displayNum==='0' ||
         previousKeyType==='operator' ||
         previousKeyType==='calculate'
         ? keyContent
         : displayNum + keyContent
    }

    if(keyType==='decimal'){
      if (!displayNum.includes('.')) return displayNum + '.'
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
      return displayNum
    }

    if(keyType==='operator'){
      return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayNum)
      : displayNum
    }

    if (keyType === 'clear') return 0;
    if (keyType === 'calculate') {
      return firstValue
       ? previousKeyType === 'calculate'
        ? calculate(displayNum, operator, modValue)
        : calculate(firstValue, operator, displayNum)
       : displayNum
    }

}


  const updateCalculatorState = (key, calculator, calculatedValue, displayNum) => {
    // updateCalculatorState is a function that changes the calculator’s custom attributes.
    // firstValue, operator,modValue,previousKeyType
    const keyType = getKeyType(key)
    const {
     firstValue,
     operator,
     modValue,
     previousKeyType
     // those valuse are related to the custom attributes (dataset) we create, if not created it is still null
   } = calculator.dataset

   calculator.dataset.previousKeyType = keyType //custom attribute no.1
   // if i already got to this function that means i have a value before it , so i need to know what is it
   // to continue the calculation.



    if (keyType === 'operator') {
      calculator.dataset.operator = key.dataset.action; //custom attribute no.2
      // checking if the user didnt click a opreator before or there is no value at all
      calculator.dataset.firstValue = firstValue && //custom attribute no.3
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayNum;
    }


    if (keyType === 'clear' && key.textContent === 'AC') {
       calculator.dataset.firstValue = '';
       calculator.dataset.operator = '';
       calculator.dataset.modValue = '';
       calculator.dataset.previousKeyType = '';
     }

    if (keyType === 'calculate') {
      // mod value would just keep track of the last value (second value) before the calculated value
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' //custom attribute no.4
        ? modValue
        : displayNum;
    }
}


const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

  if (keyType === 'operator') key.classList.add('is-depressed');

  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';

  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]') ;
    clearButton.textContent = 'CE';
  }
}


// create const for the entire buttons in the calculator
const calculator = document.querySelector(".calculator");
// for the keys only
const keys = calculator.querySelector(".calculator-keys");
// display area
const display = document.querySelector(".calculator-display");

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
    const key = e.target;
    const displayNum = display.textContent;

    const resultString = createResultString(key, displayNum, calculator.dataset);
    // console.log(calculator.dataset);
  //  console.log(resultString);

  display.textContent = resultString ;

  updateCalculatorState(key, calculator, resultString, displayNum);
  updateVisualState(key, calculator);

});
