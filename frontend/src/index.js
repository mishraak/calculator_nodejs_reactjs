import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
//  import superagent from 'superagent'
const superagent = require('superagent');

const calcState = {
    value: 0,
    btns: [ "1", "2", "3", "C", "4", "5", "6", "=", "7", "8", "9", ".", "+", "0", "-", "*", "/" ]
} 

const calcReducer = (state = calcState, action) => {     
    switch(action.type){
        case 'ADD_ELEM':
                           
              return {
                  ...state,                            
                  value: state.value == 0 ? action.text : state.value + action.text
              }       
        case 'CLEAR':
            return{
                ...state,
                value: 0
            }
        case 'EQUAL':        
            return{
                ...state,
                value: action.value
            }
        
        default:
            return state;
    }
}

class App extends Component {
  constructor(props){
    super(props)
  }



  render() {
    const { value, btns, addElem, clear, equal } = this.props;
    return (
      <div className="App">
        <div className="value-container">
          <input type="text" value={value} />
        </div>
        <div className="buttons-container">
          {btns.map((item, key) => {
            if(item == "C"){
              return(
                <button onClick={ clear.bind(this) } key={key}>{item}</button>
              )
            } else if(item == "="){
              return(
                <button onClick={ equal.bind(this, value) } key={key}>{item}</button>
              )
            } else {
              return(
                <button onClick={ addElem.bind(this, item) } key={key}>{item}</button>
              )
            }
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    value: state.value,
    btns: state.btns
  }
}

const mapDispatchToProps = (dispatch) => {
   return {    
    addElem: (text) => {
      dispatch({
        type: 'ADD_ELEM',
        text
      })
    },
    clear: () => {
      dispatch({
        type: 'CLEAR'
      })
    },
    equal: (value) => {      
      superagent
       .post('http://localhost:3000/calculate')
       .send({ exp : value })         
       .set('Accept', 'application/json')
       .end((err,data) => {              
         dispatch({ type: 'EQUAL', value: JSON.parse(data.text).result })
       })
    }
  };
};

const Calc = connect(mapStateToProps, mapDispatchToProps)(App);

const store = createStore(calcReducer);

ReactDOM.render(
    <Provider store={store}>
        <Calc />
    </Provider>
    , document.getElementById('root'));
