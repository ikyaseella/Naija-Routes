import re
import os

files_to_update = [
    "naija-routes/apps/web/search.html",
    "naija-routes/apps/web/booking.html",
    "naija-routes/apps/web/ticket.html"
]

nav_html = """  <div class="design-label">🎨 Naija Routes · Traveller Web App · Design 1 — "Deep Roots"</div>

  <!-- NAV -->
  <nav>
    <a href="index.html" class="nav-logo" style="text-decoration:none;">🚌 Naija<span>Routes</span></a>
    <div class="nav-links">
      <a href="index.html">Routes</a>
      <a href="#">Cargo</a>
      <a href="#">Track Bus</a>
      <a href="#">Help</a>
    </div>
    <button class="nav-cta">Sign in</button>
  </nav>"""

footer_html = """  <footer>
    <strong>Naija Routes</strong> — Nigeria's road transport aggregator. Supported languages: English · Yoruba · Hausa · Igbo · Pidgin
  </footer>"""

for file_path in files_to_update:
    path = os.path.join(r"c:\Users\user pc\Desktop\Naija_routes", file_path)
    if not os.path.exists(path):
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace head links
    content = re.sub(r'<link rel="stylesheet" href="css/tokens.css">', r'<link rel="stylesheet" href="css/theme-deep-roots.css">\n  <link rel="stylesheet" href="css/tokens.css">', content)
    
    # Replace navbar
    content = re.sub(r'<nav class="navbar">.*?</nav>', nav_html, content, flags=re.DOTALL)
    
    # Replace footer
    content = re.sub(r'<footer.*?</footer>', footer_html, content, flags=re.DOTALL)
    
    # For search.html, fix the broken line 170 from previous tool call
    if "search.html" in file_path:
        content = content.replace("""    .op-type {
      <footer>
    <strong>Naija Routes</strong> — Nigeria's road transport aggregator. Supported languages: English · Yoruba · Hausa · Igbo · Pidgin
  </footer>gin-top: 2px;
    }""", """    .op-type {
      font-size: var(--text-sm);
      color: var(--color-slate-500);
      margin-bottom: var(--space-3);
    }
    .time-row {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    .time-block-inner { text-align: center; }
    .time-bold {
      font-weight: var(--weight-extrabold);
      font-size: var(--text-xl);
      line-height: 1;
    }
    .time-location {
      font-size: var(--text-xs);
      color: var(--color-slate-500);
      margin-top: 2px;
    }""")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path}")
