import React, { Component, Fragment } from 'react';
import Graph from 'vis-react';
import initialGraph from "./jsonData/graph.json"
var highlightActive = false;

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
      hoverNode: function (event) {
        this.neighbourhoodHighlight(event, this.props.searchData);
      },
      blurNode: function (event) {
        this.neighbourhoodHighlightHide(event);
      },
      click: function (event) {
        this.redirectToLearn(event, this.props.searchData);
      }
    };

    let newGraph = initialGraph;

    this.state = {
      graph: newGraph,
      style: { width: "800px", height: "600px" },
      network: null
    };
    this.measure = this.measure.bind(this);
    this.events.hoverNode = this.events.hoverNode.bind(this);
    this.events.blurNode = this.events.blurNode.bind(this);
    this.events.click = this.events.click.bind(this);
    this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this);
    this.redirectToLearn = this.redirectToLearn.bind(this);
    this.neighbourhoodHighlightHide = this.neighbourhoodHighlightHide.bind(
      this
    );

  }
  componentDidMount() {
    this.mounted = true;
    window.addEventListener("resize", this.measure);
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener("resize", this.measure);
  }

  measure(data) {
    console.log("measure");
    this.state.network.redraw();
    this.state.network.fit();
  }

  redirectToLearn(params, searchData) {
    console.log(this.state.network.getNodeAt(params.pointer.DOM));
    console.log(Object.keys(this.state.network));
  }

  neighbourhoodHighlight(params, searchData) {
    let allNodes = this.state.graph.nodes;
    // let cloneNodes = allNodes.map(a => {return {...a}});
    let Nodes = new this.vis.DataSet(allNodes);
    let cloneNodes = Nodes.get({ returnType: "Object" });

    this.state.network.canvas.body.container.style.cursor = "pointer";
    // this.setState({cursor});

    if (params.node !== undefined) {
      highlightActive = true;
      let i, j;
      let selectedNode = params.node;
      let degrees = 1;

      for (var nodeId in cloneNodes) {
        cloneNodes[nodeId].color = "rgba(200,200,200,0.5)";
        if (cloneNodes[nodeId].hiddenLabel === undefined) {
          cloneNodes[nodeId].hiddenLabel = cloneNodes[nodeId].label;
          cloneNodes[nodeId].label = undefined;
        }
      }

      let connectedNodes = this.state.network.getConnectedNodes(selectedNode);
      let allConnectedNodes = [];
      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(
            this.state.network.getConnectedNodes(connectedNodes[j])
          );
        }
      }

      // all second degree nodes get a different color and their label back
      for (i = 0; i < allConnectedNodes.length; i++) {
        cloneNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
        if (cloneNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
          cloneNodes[allConnectedNodes[i]].label =
            cloneNodes[allConnectedNodes[i]].hiddenLabel;
          cloneNodes[allConnectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // all first degree nodes get their own color and their label back
      for (let i = 0; i < connectedNodes.length; i++) {
        cloneNodes[connectedNodes[i]].color = undefined;
        if (cloneNodes[connectedNodes[i]]["hiddenLabel"] !== undefined) {
          cloneNodes[connectedNodes[i]].label =
            cloneNodes[connectedNodes[i]]["hiddenLabel"];
          const fontSize = this.state.network.body.nodes;
          fontSize[connectedNodes[i]].options.font.size = 15;
          cloneNodes[connectedNodes[i]]["hiddenLabel"] = undefined;
        }
      }

      // the main node gets its own color and its label back.
      cloneNodes[selectedNode].color = undefined;
      if (cloneNodes[selectedNode]["hiddenLabel"] !== undefined) {
        cloneNodes[selectedNode].label =
          cloneNodes[selectedNode]["hiddenLabel"];
        const fontSize = this.state.network.body.nodes;
        fontSize[selectedNode].options.font.size = 15;
        // this.setState({fontSize})
        cloneNodes[selectedNode]["hiddenLabel"] = undefined;
      }
    } else if (highlightActive === true) {
      // reset all nodes
      for (let nodeId in cloneNodes) {
        cloneNodes[nodeId].color = undefined;
        if (cloneNodes[nodeId]["hiddenLabel"] !== undefined) {
          cloneNodes[nodeId].label = cloneNodes[nodeId]["hiddenLabel"];
          const fontSize = this.state.network.body.nodes;
          fontSize[nodeId].options.font.size = 15;
          this.setState({ fontSize });
          cloneNodes[nodeId]["hiddenLabel"] = undefined;
        }
      }
      highlightActive = false;
    }

    let updateArray = [];
    for (let nodeId in cloneNodes) {
      if (cloneNodes.hasOwnProperty(nodeId)) {
        updateArray.push(cloneNodes[nodeId]);
      }
    }
    if (this.mounted) {
      this.setState({
        graph: {
          nodes: updateArray,
          edges: this.state.graph.edges
        }
      });
    }
  }

  neighbourhoodHighlightHide(params) {
    let allNodes = this.state.graph.nodes;

    let Nodes = new this.vis.DataSet(allNodes);
    let allNodess = Nodes.get({ returnType: "Object" });
    // let allNodess = allNodes.map(a => {return {...a}})
    this.state.network.canvas.body.container.style.cursor = "default";

    for (var nodeId in allNodess) {
      allNodess[nodeId].color = "rgba(200,200,200,0.5)";
      if (allNodess[nodeId].hiddenLabel === undefined) {
        allNodess[nodeId].hiddenLabel = allNodess[nodeId].label;
        allNodess[nodeId].label = undefined;
      }
    }

    highlightActive = true;
    if (highlightActive === true) {
      // reset all nodes
      for (var nodeIds in allNodess) {
        allNodess[nodeIds].color = undefined;
        if (allNodess[nodeIds].hiddenLabel !== undefined) {
          allNodess[nodeIds].label = allNodess[nodeIds].hiddenLabel;
          const fontSize = this.state.network.body.nodes;
          fontSize[nodeIds].options.font.size = 15;
          this.setState({ fontSize });
          allNodess[nodeIds].hiddenLabel = undefined;
        }
      }
      highlightActive = false;
    }

    var updateArray = [];
    for (var nodeIde in allNodess) {
      if (allNodess.hasOwnProperty(nodeIde)) {
        updateArray.push(allNodess[nodeIde]);
      }
    }
    if (this.mounted) {
      this.setState({
        graph: {
          nodes: updateArray,
          edges: this.state.graph.edges
        }
      });
    }
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






