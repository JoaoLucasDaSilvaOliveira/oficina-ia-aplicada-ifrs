"""Carimba ?v=<hash> nos CSS e JS das páginas, para o navegador não misturar versões.

O GitHub Pages manda guardar os arquivos por 10 minutos; sem versão no endereço,
o navegador pode juntar um index.html novo com um styles.css ou app.js antigo.
Rode antes de publicar: python3 scripts/versionar.py (o teste confere).
"""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parent.parent
PAGES = [root / "index.html", root / "dicionario" / "index.html", root / "apresentador" / "index.html"]
REF = re.compile(r'(?P<attr>(?:src|href)=")(?P<path>[^"?#:]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(?P<end>")')


def version(page: Path, path: str) -> str:
    return hashlib.sha256((page.parent / path).resolve().read_bytes()).hexdigest()[:10]


def stamp(page: Path) -> str:
    return REF.sub(lambda m: f'{m["attr"]}{m["path"]}?v={version(page, m["path"])}{m["end"]}', page.read_text())


if __name__ == "__main__":
    for page in PAGES:
        page.write_text(stamp(page))
        print(f"versionado: {page.relative_to(root)}")
