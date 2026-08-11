import sys, re
from html.parser import HTMLParser

html = open(sys.argv[1], encoding="utf-8").read()

VOID = {"area","base","br","col","embed","hr","img","input","link","meta","source","track","wbr",
        "path","circle","line","stop","use","rect","polyline","polygon","ellipse"}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack:
            self.errors.append(f"Schliess-Tag ohne Oeffner: {tag}")
        elif self.stack[-1] != tag:
            self.errors.append(f"Tag-Mismatch: erwartet </{self.stack[-1]}>, gefunden </{tag}>")
            if tag in self.stack:
                while self.stack and self.stack[-1] != tag:
                    self.stack.pop()
                if self.stack: self.stack.pop()
        else:
            self.stack.pop()

p = P()
p.feed(html)
if p.stack: p.errors.append(f"Unggeschlossene Tags: {p.stack}")
print("TAG-ERRORS:", p.errors if p.errors else "keine")

# Emoji check
emo = [c for c in html if ord(c) > 0x2100 and not c in "€–—’‘“”…·×≈Ø‑ "]
print("VERDAECHTIGE ZEICHEN:", sorted(set(emo)) if emo else "keine")

# style/script tags
print("STYLE/SCRIPT-TAGS:", re.findall(r"<\s*/?\s*(style|script)\b", html, re.I) or "keine")

# img tags & alt
imgs = re.findall(r"<img\b[^>]*>", html)
print("IMG-TAGS:", imgs or "keine")

# ids and classes without fin- prefix (excluding known shared classes)
shared = {"inhalt","glass","pane","pill","pill-gruen","pill-violett","pill-grau","btn","btn-primary",
          "btn-glass","btn-small","kpis","kpi","delta","zeile","l","r","tabelle","reveal"}
classes = set()
for m in re.findall(r'class="([^"]+)"', html):
    classes.update(m.split())
bad = [c for c in classes if not c.startswith("fin-") and c not in shared]
print("FREMDE KLASSEN:", bad or "keine")
ids = re.findall(r'\bid="([^"]+)"', html)
print("IDS:", ids, "ohne fin-:", [i for i in ids if not i.startswith("fin-")] or "keine")

# starts/ends
print("STARTS OK:", html.lstrip().startswith('<section class="inhalt" data-raum="finanzen"'))
print("ENDS OK:", html.rstrip().endswith("</section>"))
