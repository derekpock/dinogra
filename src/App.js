import logo from './logo.svg';
import oneDot from './dot/one.dot';
import {DotParser} from './data/DotParser.js'
import './App.css';

// Derek added
import React from 'react';
import ReactDOM from 'react-dom';

// function WelcomeV2(props) {
//   return <h1>Hello again {props.name}</h1>
// }

// class WelcomeV1 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { x: 0 };
//     this.onInterval = this.onInterval.bind(this);
//     this.onClick = this.onClick.bind(this);
//   }

//   updateState(state, props) {
//     return { x: state.x + 1 };
//   }

//   onInterval() {
//     this.setState(this.updateState);
//   }

//   onClick(e) {
//     this.setState((state, props) => ({ x: state.x + 10 }));
//     // e.stopPropagation();
//     // e.preventDefault();
//     console.log(e);
//   }

//   componentDidMount() {
//     this.intervalHandle = setInterval(this.onInterval, 1000);
//   }

//   componentWillUnmount() {
//     clearInterval(this.intervalHandle);
//   }

//   render() {
//     if (this.state.x % 5 == 0) {
//       return null;
//     }
//     return <h1 onClick={this.onClick}>Hello, {this.props.name}. {this.state.x}</h1>;
//   }
// }

// function getHello(name) {
//   const extendedName = name + "1234"
//   return <div>
//     <WelcomeV1 name={name}></WelcomeV1>
//     <WelcomeV2 name={extendedName}></WelcomeV2>
//   </div>;
// }

// const listItems = numbers.map((number) =>
//   // Correct! Key should be specified inside the array.
//   <ListItem key={number.toString()} value={number} />
// );

// this.setState({
//   [name]: value
// });

class DotInput extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {value: props.value}
  }

  onSubmit(e) {
    DotParser.parse(this.state.value);
    this.setState({ status: "Done" });
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  render() {
    return <div>
      <textarea class="dotInputArea" value={this.state.value} onChange={this.onChange}></textarea><br />
      <input type="submit" value="Submit" onClick={this.onSubmit} />
      {this.state.status && <div>{this.state.status}</div>}
    </div>
  }
}

function getFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status === 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

export function App() {
  const dotValue = getFile(oneDot);
  let element = <DotInput value={dotValue} />
  return element;
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

// Build a static version of the display, then adapt it to interactivity
// Do not use state at all when building static
// Bottom-up works well when writing tests
// State is:
//   Not passed in from parent via props
//   Not changed overtime
//   Not computed based on other state or props in the component
// Where state lies:
//   What components change based on that state
//   What parent component can own that state
//   Parent component or another higher component?
//   Create new copmonent solely for holding state?