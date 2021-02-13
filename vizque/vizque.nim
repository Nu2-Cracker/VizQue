# nim c -o:output -r vizque.nim
import
  httpClient,
  strtabs,
  re,
  xmlparser,
  xmltree,
  tables,
  json


type
  Json = object
  QueryDatas = Table[string, string]
  SecTables = seq[QueryDatas]


var
  nodes = newSeq[QueryDatas]()
  edges = newSeq[QueryDatas]()
  node: QueryDatas = initTable[string, string]()
  edge: QueryDatas = initTable[string, string]()
  graph = initTable[string, SecTables]()
  # querylist: seq[string] = newSeq[string]()
  #Node
  ci:int  = 0
  id: int = 0
  #edge
  from_id: int = 0
  to_id: int = 0


#検索ワードの取得
# echo "Please enter to search word: "
# let reader =  readLine(stdin)

# test
var reader = "whale shark"



proc querygetter(query:string): QueryDatas =
  var searchQuery: QueryDatas = initTable[string, string]()
  var rep_query = query.replace(re"\s+", "%20")
  var url = "http://www.google.com/complete/search?hl=en&q=${query}&output=toolbar" % {"query": rep_query}.newStringTable

  #ネットワークグラフ(ノード)
  # 同じラベルのノードは追加しない
  var first_query_i: string = ""
  block:
    var checks = newSeq[QueryDatas]()
    checks = nodes
    var tmp_query: seq[string]
    if len(nodes) != 0: #1巡目はnodesに入っていないため<=チェックいる？？スルーされるのでそもそもこの条件いらないのでは?
      for d in checks:
        if d["label"] == query:
          first_query_i = d["id"]
          # ここでfirst_queryidの処理をしないとそもそも値が変わるから意味ないのでは
          #first_queryを指定することで一つ繋ぎのネットワークを実装する
          #その代わり新たなnodeを作るひつよなし





    else:
      # 1巡目
      node["id"] = $id
      first_query_i = $id
      node["label"] = query
      var g_url = "https://www.google.com/search?q=${query}" % {"query": query}.newStringTable
      node["url"] = g_url
      nodes.add(node)
      inc(id)

      # 検索キーワードとそのnode,edgeデータを返す






  # 次の検索するキーワードを返す
  let client = newHttpClient()
  let response = client.request(url)
  var body: string = response.body
  let xmls = parseXml(body)
  let tag_suggestion = xmls.findAll("suggestion")
  for tag in tag_suggestion:
    #tagからdata属性(関連キーワード)を取得
    let relationQuery = tag.attr("data")
    if relationQuery != query:
      searchQuery[relationQuery] = $id

      node["id"] = $id
      node["label"] = relationQuery
      var g_url = "https://www.google.com/search?q=${query}" % {"query": relationQuery}.newStringTable
      node["url"] = g_url
      nodes.add(node)

      edge["from"] = first_query_i
      edge["to"] = $id

      edges.add(edge)
      inc(id)
  return searchQuery




let querytable = querygetter(reader)# 次の検索候補の取得
# block:
#   graph["nodes"] = nodes
#   graph["edges"] = edges
#   let to_json = %* graph
#   let f = open("../react-app/jsonData/graph.json", FileMode.fmWrite)
#   f.write(to_json.pretty(indent=5))
#   f.close()

var index = 0
for res in querytable.keys:
  # echo res
  if index == 2:
    break
  var floor2 = querygetter(res)
  graph["nodes"] = nodes
  graph["edges"] = edges

  block:
    let to_json = %* graph
    let f = open("../react-app/jsonData/graph.json", FileMode.fmWrite)
    f.write(to_json.pretty(indent=5))
    f.close()
  inc(index)





# graph["nodes"] = nodes
# graph["edges"] = edges

# block:
#   let to_json = %* graph
#   let f = open("../react-app/jsonData/graph.json", FileMode.fmWrite)
#   f.write(to_json.pretty(indent=5))
#   f.close()









