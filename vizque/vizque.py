import requests
import xml.etree.ElementTree as ET
from graphviz import Digraph
import shutil
import os


# 取得したファイルはtmpdirに生成
# サーバーからローカルホストでブラウザに表示するように変更


def to_get_suggest_word(query: str) -> list:
    r = requests.get(
        f'http://www.google.com/complete/search?hl=en&q={query}&output=toolbar')
    xml = r.text  # xmlレスポンスの取得
    root = ET.fromstring(xml)  # xmlデータを読み込みます
    suggest_word = [
        suggest.attrib["data"]
        for CompleteSuggestion in root
        for suggest in CompleteSuggestion
    ]
    return suggest_word


class CreateDGnode:
    def __init__(self):

        self.dg = Digraph(format="svg", engine='fdp')

    def add_node(self, query, suggest_word):
        # 有向グラフ
        self.dg.node(query)
        for sug in suggest_word[1:]:
            self.dg.node(sug)
            self.dg.edge(query, sug)

    def output(self):

        import re
        id = 0
        node_orig = []

        pr = re.compile("->")
        tmp_node= [] #nodes data
        node_data_words = {}
        for i in self.dg:
            if i == "digraph {" or i == "}":
                continue
            w_i = i.replace("\t", "").replace("\"", "")
            result = pr.search(w_i)
            if result is None:
                n_dict = { "id": str(id), "word": w_i, "url": f"https://www.google.com/search?q={w_i}"}
                tmp_node.append(n_dict) #data
                node_data_words[w_i] = str(id) # word(key): id(val) 
                id += 1
            else:
                node_orig.append(w_i.split(" -> "))
        

        for k in node_data_words.keys():
            for i, orig in enumerate(node_orig):
                from_ = orig[0]
                to_ = orig[1]
                if k == from_:
                    node_orig[i][0] = node_data_words[k]
                if k == to_:
                    node_orig[i][1] = node_data_words[k]
  

        def to_edge(edge):
            direction = {"from": edge[0], "to": edge[1]}
            return direction

        edge_data = [obj for obj in list(map(to_edge, node_orig))] #edge(from -> to)

        vis_grapf = {"nodes": tmp_node, "edges": edge_data}

        import json
        with open("./jsonData/grapf.json", mode="w") as fn:
            json.dump(vis_grapf, fn, indent=5, ensure_ascii=False)


def main():
    query = input("Please enter to search word: ")
    suggest_word = to_get_suggest_word(query)  # xmlレスポンスからデータの取得
    dg = CreateDGnode()

    for _ in range(10):
        for query in suggest_word:
            suggest_word = to_get_suggest_word(query)
            dg.add_node(query, suggest_word)

    dg.output()
