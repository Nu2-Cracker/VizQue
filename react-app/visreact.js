import React, { Component, Fragment } from 'react';
import Graph from 'vis-react';
import initialGraph from "./jsonData/graph.json"

let options = {
  layout: {
    randomSeed: 12,
    hierarchical: false
  },
  nodes: {

    shape: "box",
    size: 30,
    borderWidth: 1.5,
    borderWidthSelected: 2,
    font: {
      size: 12,
      align: "center",
      bold: {
        color: "#bbbdc0",
        size: 25,
        vadjust: 0,
        mod: "bold"
      }
    }
  },
  edges: {
    width: 0.5,
    color: {
      color: "#D3D3D3",
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: "arrow" },
      middle: { enabled: false, scaleFactor: 100, type: "arrow" },
      from: { enabled: true, scaleFactor: 1, type: "arrow" }
    }
  },
  physics: {
    barnesHut: {
      gravitationalConstant: -30000,
      centralGravity: 1,
      springLength: 150,
      avoidOverlap: -1
    },
    stabilization: { iterations: 2500 }
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

        this.redirectToLearn(event, this.props.searchData);

      }
    };

    let newGraph = initialGraph;

    this.state = {
      graph: newGraph,
      style: { width: "1500px", height: "800px" },
      network: null
    };

    this.events.click = this.events.click.bind(this);
    this.redirectToLearn = this.redirectToLearn.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
  }

  redirectToLearn(params, searchData){
    let index = this.state.network.getNodeAt(params.pointer.DOM);
    let url = this.state.graph.nodes[index]["url"];
    window.open(url, '_blank')
  }


  getNetwork(data){
    this.setState({network: data})
  };


  render() {
    return (
      <Fragment>
        <div className="vis-react-title">vis react</div>
        <Graph
          graph = {this.state.graph}
          style={this.state.style}
          options = {options}
          getNetwork={this.getNetwork}
          events={this.events}
          vis={(vis) => (this.vis = vis)}
        />
      </Fragment>
    );
  }


}







