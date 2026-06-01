#!/usr/bin/env python3
import os
import json

def get_category(art):
    tags = [t.lower() for t in art.get('tags', [])]
    
    # Matching rules corresponding to app.js
    research_tags = ['research', 'case-studies', 'case-study', 'modeling', 'water', 'treatment', 'scada']
    tutorial_tags = ['tutorials', 'guides', 'tutorial', 'guide']
    tooling_tags = ['tooling', 'harnesses', 'tool', 'harness', 'hermes']
    dataset_tags = ['datasets', 'telemetry', 'dataset', 'data', 'utilities', 'sensors']
    
    if any(t in dataset_tags for t in tags):
        return 'datasets'
    if any(t in tooling_tags for t in tags):
        return 'tooling'
    if any(t in tutorial_tags for t in tags):
        return 'tutorials'
    return 'research'

def main():
    repo_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(repo_dir, 'docs', 'data', 'articles.json')
    readme_path = os.path.join(repo_dir, 'README.md')
    
    if not os.path.exists(json_path):
        print("Error: articles.json not found.")
        return
        
    with open(json_path, 'r', encoding='utf-8') as f:
        articles = json.load(f)
        
    # Group articles
    groups = {
        'research': [],
        'tutorials': [],
        'tooling': [],
        'datasets': []
    }
    
    for art in articles:
        cat = get_category(art)
        groups[cat].append(art)
        
    # Generate Markdown lists
    sections = []
    
    # 1. Research & Cases
    sections.append("### 📚 Research & Case Studies")
    for art in sorted(groups['research'], key=lambda x: x['title']):
        notes_file = os.path.basename(art['notes_file'])
        sections.append(f"- **[{art['title']}]({art['url']})** — *{art['site_name']}* ([Notes](research/{notes_file}))")
        
    # 2. Tutorials & Guides
    sections.append("\n### 📖 Tutorials & Guides")
    for art in sorted(groups['tutorials'], key=lambda x: x['title']):
        notes_file = os.path.basename(art['notes_file'])
        sections.append(f"- **[{art['title']}]({art['url']})** — *{art['site_name']}* ([Notes](research/{notes_file}))")
        
    # 3. Tooling & Harnesses
    sections.append("\n### 🛠️ Tooling & Harnesses")
    for art in sorted(groups['tooling'], key=lambda x: x['title']):
        notes_file = os.path.basename(art['notes_file'])
        sections.append(f"- **[{art['title']}]({art['url']})** — *{art['site_name']}* ([Notes](research/{notes_file}))")
        
    # 4. Datasets & Telemetry
    sections.append("\n### 📊 Datasets & Telemetry")
    for art in sorted(groups['datasets'], key=lambda x: x['title']):
        notes_file = os.path.basename(art['notes_file'])
        sections.append(f"- **[{art['title']}]({art['url']})** — *{art['site_name']}* ([Notes](research/{notes_file}))")
        
    links_section = "\n## 🔗 Resource Index (Direct Access)\n\n" + "\n".join(sections) + "\n"
    
    # Read README
    with open(readme_path, 'r', encoding='utf-8') as f:
        readme_content = f.read()
        
    # Check if Direct Access section already exists and remove it
    readme_content = re.sub(r'## 🔗 Resource Index \(Direct Access\).*?(?=\n## ⚖️ License|\Z)', '', readme_content, flags=re.DOTALL)
    
    # Insert before License
    if "## ⚖️ License" in readme_content:
        parts = readme_content.split("## ⚖️ License")
        new_content = parts[0] + links_section + "\n## ⚖️ License" + parts[1]
    else:
        new_content = readme_content + "\n" + links_section
        
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("README.md updated with categorized link directory.")

if __name__ == '__main__':
    import re
    main()
