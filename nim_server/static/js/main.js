// create an array with nodes
var nodeData = [
  { id: 1, label: "google", url: "https://www.google.com/?hl=ja" },
  { id: 2, label: "qiita", url: 'https://qiita.com' },
  { id: 3, label: "mozilla", url: "https://developer.mozilla.org/en-US/" },
  { id: 4, label: "amazon", url: "https://www.amazon.co.jp/" },
  { id: 5, label: "yahoo", url: "https://www.yahoo.co.jp/" },
]
var nodes = new vis.DataSet(nodeData);

// create an array with edges
var edges = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
]);

// create a network
var container = document.getElementById("mynetwork");
var data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  interaction: { hover: true },

};

var network = new vis.Network(container, data, options);

network.on("click", function (params) {
  params.event = "[original event]";

  for (i = 0; i < nodeData.length; i++) {
    if (nodeData[i]["id"] == this.getNodeAt(params.pointer.DOM)) {
      let url = nodeData[i]["url"];
      window.open(url, '_blank');
    }
  }
});
//vis-network　クリック=>url先に移動 =>clear

//画面に表示した後=>nodeのデザインの検討
//vizque本体とまーじ

//vizque setup.pyを行う箇所を変更する
// volumeの変更を行う