import React, { Component, Fragment } from 'react';
import Graph from 'vis-react';
import initialGraph from "./jsonData/graph.json"
// Reference
// https://codesandbox.io/s/vis-react-forked-0zjdz?file=/src/visreact.js
// https://www.npmjs.com/package/vis-react

let options = {
  layout: {
    randomSeed: 5
  },
  nodes: {
    fixed: {
      x: false,
      y: false
    },
    shape: "dot",
    size: 30,
    borderWidth: 1.5,
    borderWidthSelected: 2,
    font: {
      size: 15,
      align: "center",
      bold: {
        color: "#bbbdc0",
        size: 34,
        vadjust: 0,
        mod: "bold"
      }
    }
  },
  edges: {
    width: 0.5,
    color: {
      color: "#D3D3D3",
      highlight: "#797979",
      hover: "#797979",
      opacity: 0.7
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1.3, type: "arrow" },
      middle: { enabled: false, scaleFactor: 1.5, type: "arrow" },
      from: { enabled: true, scaleFactor: 2, type: "arrow" }
    },
    smooth: {
      type: "continuous",
      roundness: 0
    }
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: true,
    hoverEdges: true,
    selectable: false,
    selectConnectedEdges: false,
    zoomView: true,
    dragView: true
  }
};



export default class VisReact extends Component {
  setState(stateObj){
    if (this.mounted) {
      super.setState(stateObj);
    }
  }

  componentWillMount(){
    this.mounted = true;
  }

  constructor(props){
    super(props);
    this.events = {
      click: function (event) {
        console.log("click!!")
      }
    };

    let newGraph = initialGraph;

    this.state = {
      graph: newGraph,
      style: { width: "1500px", height: "600px" },
      network: null
    };
    this.events.click = this.events.click.bind(this);
  }


 

  render() {
    return (
      <Fragment>
        <div className="vis-react-title">vis react</div>
        <Graph
          graph = {this.state.graph}
          style={this.state.style}
          options = {options}
          events={this.events}
          vis={(vis) => (this.vis = vis)}
        />
      </Fragment>
    );
  }


}






