import React, { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT : "add-digit",
  CHOOSE_OPERATION : "choose-operation",
  CLEAR : "clear",
  DELETE : "delete",
  EVALUATE : "evaluate"
}


function reducer(state,{type , payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(payload.digit === "0" && state.currOp === "0") return state;
      if(state.currOp == null && payload.digit === "."){
        return {
          ...state,
          currOp: "0.",
        }
      }
      else if(payload.digit === "." && state.currOp.includes('.')) return state;
      return {
        ...state,
        currOp: `${state.currOp || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if(state.prevOp == null && state.currOp == null) return state;
      if(state.currOp == null && state.prevOp != null){
        return{
          prevOp: state.prevOp,
          operation :  payload.operation
        }
      }
      if(state.prevOp == null && state.currOp!= null){
        return{
        ...state,
        operation : payload.operation,
        prevOp : state.currOp,
        currOp : null,
      }
    }
    if(state.prevOp != null && state.currOp != null){
      return{
        ...state,
        operation:payload.operation,
        prevOp : calculate(state.prevOp, state.currOp, state.operation),
        currOp:null
      }
    }
    break;
    case ACTIONS.EVALUATE:
      if(state.prevOp != null && state.currOp == null){
        return{
          ...state,
          currOp: state.prevOp,
          prevOp: null,
          operation: null
        }
      }
    return{
      ...state,
      currOp : calculate(state.prevOp, state.currOp, state.operation),
      prevOp: null,
      operation: null
    }
    case ACTIONS.DELETE:
      if(state.currOp != null){
        return {
        ...state,
        currOp : state.currOp.slice(0,-1),
      }
    }
    return{
      ...state
    }
    case ACTIONS.CLEAR:
      return {};
    default:
      return {...state}
  }
}

function calculate(prevString, currString, operation){
  let prevNum = Number.parseFloat(prevString);
  let currNum = Number.parseFloat(currString);
  let ans;
  switch (operation){
    case "/":
      ans = !Number.isInteger(prevNum/currNum)? (parseFloat(prevNum/currNum).toFixed(4)) : (prevNum/currNum);
      break;
    case "X":
      ans = !Number.isInteger(prevNum*currNum)? (parseFloat(prevNum*currNum).toFixed(4)) : (prevNum*currNum);
      break;
    case "+":
      ans = !Number.isInteger(prevNum+currNum)? (parseFloat(prevNum+currNum).toFixed(4)) : (prevNum+currNum);
      break;
    case "-":
      ans = !Number.isInteger(prevNum-currNum)? (parseFloat(prevNum-currNum).toFixed(4)) : (prevNum-currNum);
      break;
    default:
      return currString;
  }
  return ans.toString();
}

function App() {

  const [{currOp, prevOp, operation} , dispatch] = useReducer(reducer,{});

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='prev-operand'> {prevOp} {operation} </div>
        <div className='curr-operand'> {currOp} </div>
      </div>
      <button className='span-two' onClick={()=> dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type:ACTIONS.DELETE})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="X" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App