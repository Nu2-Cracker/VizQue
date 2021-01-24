import requests
import xml.etree.ElementTree as ET
from graphviz import Digraph
import os


def to_get_suggest_word(query: str) -> list:
    r = requests.get(f'http://www.google.com/complete/search?hl=en&q={query}&output=toolbar')
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
        self.dg = Digraph(format='svg', engine='fdp')

    def create_output_file_path(self, query):
        self.output_path = os.path.join("result", f"{query}.gv")

    def add_node(self, query, suggest_word):
        # 有向グラフ
        self.dg.node(query)
        for sug in suggest_word[1:]:
            self.dg.node(sug)
            self.dg.edge(query, sug)

    def output(self):
        self.dg.render(self.output_path, view=False)


def main():
    query = input("Please enter to search word: ")
    suggest_word = to_get_suggest_word(query)  # xmlレスポンスからデータの取得
    dg = CreateDGnode()
    dg.create_output_file_path(query)

    for _ in range(5):
        for query in suggest_word:
            suggest_word = to_get_suggest_word(query)
            dg.add_node(query, suggest_word)

    dg.output()
