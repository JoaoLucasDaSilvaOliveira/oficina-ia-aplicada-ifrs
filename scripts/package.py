"""Empacota a apresentação sem dependências externas."""
from pathlib import Path
import base64
import zipfile

root = Path(__file__).resolve().parent.parent
output = root / "entrega"
output.mkdir(exist_ok=True)

css = (root / "styles.css").read_text()
for name in ("open-sans-regular.ttf", "open-sans-bold.ttf"):
    encoded = base64.b64encode((root / "assets" / name).read_bytes()).decode()
    css = css.replace(f'url("assets/{name}")', f'url("data:font/ttf;base64,{encoded}")')

html = (root / "index.html").read_text()
import re
html = re.sub(r'<link rel="stylesheet" href="styles\.css(?:\?v=[0-9a-f]+)?">', lambda _: f"<style>\n{css}\n</style>", html)
avatar = base64.b64encode((root / "assets/joao-lucas.jpg").read_bytes()).decode()
for name in ("assets/qrcode.js", "slides.js", "app.js"):
    code = (root / name).read_text()
    code = code.replace('src="assets/joao-lucas.jpg"', f'src="data:image/jpeg;base64,{avatar}"')
    if "</script" in code.lower():
        raise ValueError(f"Fechamento de script precisa ser escapado em {name}")
    # defer não adia scripts inline: o código deve ficar depois do corpo.
    html = re.sub(rf'  <script src="{re.escape(name)}(?:\?v=[0-9a-f]+)?" defer></script>\n', "", html)
    html = html.replace("</body>", f"<script>\n{code}\n</script>\n</body>")

license_text = (root / "assets/OFL.txt").read_text()
html = html.replace("</head>", f"<!-- Open Sans license\n{license_text}\n-->\n</head>")
(output / "apresentacao.html").write_text(html)

paths = [root / name for name in ("index.html", "styles.css", "slides.js", "app.js", "glossario.js", "README.md")]
for folder in ("assets", "docs", "tests", "scripts", "dicionario", "apresentador"):
    paths.extend(path for path in (root / folder).rglob("*") if path.is_file() and "__pycache__" not in path.parts)
with zipfile.ZipFile(output / "oficina-ia-slides.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in paths:
        archive.write(path, Path("oficina-ia-slides") / path.relative_to(root))
    archive.write(output / "apresentacao.html", "oficina-ia-slides/apresentacao.html")
print(f"Gerados: {output / 'apresentacao.html'} e {output / 'oficina-ia-slides.zip'}")
