# Of Agents and Aquifers // Research and Modeling Sandbox

> [!IMPORTANT]
> **Explore the Research Dashboard Live at:**  
> 👉 **[boxwrench.github.io/of-agents-and-aquifers](https://boxwrench.github.io/of-agents-and-aquifers/)**

Welcome to **Of Agents and Aquifers**! This repository is a structured workspace designed to log research, run experiments, and develop simulations at the intersection of **AI Agents and Water Utilities / Systems**.

The title is inspired by the ongoing evolution of agentic workflows (decentralized decision-makers, autonomous telemetry interpreters) interacting with water treatment systems, utility infrastructure, and operational parameters.

---

## 💧 Automated Link Catcher: How it Works

This repository is equipped with a **GitHub Action** that handles article import. When you spot an interesting article or paper online:

1. Click the **💧 Add to Aquifers** bookmarklet in your browser bookmarks bar (setup via the [Live Dashboard](https://boxwrench.github.io/of-agents-and-aquifers/)).
2. It opens a new GitHub Issue template in this repository with the webpage title and URL prefilled.
3. Submit the issue.
4. The GitHub Action launches, installs dependencies, and runs `scripts/add_article.py` which:
   - Fetches the webpage.
   - Extracts metadata (OpenGraph tags, page title, description, publisher).
   - Generates a structured markdown file under `research/` for study notes.
   - Appends the metadata to `docs/data/articles.json`.
   - Commits the updates back to the repo (which triggers GitHub Pages to redeploy).
   - Posts a summary comment on the issue and closes it automatically.

---

## 🗂️ Directory Structure

```text
of-agents-and-aquifers/
│
├── README.md                      # Front door: setup, structure, and instructions
│
├── .github/                       # GITHUB AUTOMATION WORKFLOWS
│   └── workflows/
│       └── add_article.yml        # CI/CD: Scrapes articles from issues and redeploys
│
├── docs/                          # LIVE WEB DASHBOARD (GitHub Pages)
│   ├── index.html                 # The dashboard frontend
│   ├── style.css                  # Premium dark-mode styling
│   ├── app.js                     # UI rendering, tag filtering, and search engine
│   └── data/
│       └── articles.json          # Database of scraped article metadata
│
├── research/                      # RESEARCH ARCHIVE & READING NOTES
│   ├── README.md                  # Index of all logged research
│   └── agent-based-modeling...md  # Individual study notes (e.g. key takeaways, relevance)
│
├── experiments/                   # SANDBOX & MODELING EXPERIMENTS
│   └── README.md                  # Index of active simulations and prototypes
│
└── scripts/                       # PORTABLE UTILITY SCRIPTS
    ├── add_article.py             # Web scraping engine
    └── requirements.txt           # Scraper library dependencies
```

---

## 🚀 Local Development & Scraper Testing

To test the scraping script locally without running it through a GitHub Action:

1. **Set up virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r scripts/requirements.txt
   ```

3. **Run local scrape test:**
   Create a temporary file `test_issue.txt` with a URL inside, and run:
   ```bash
   python scripts/add_article.py test_issue.txt
   ```
   This will scrape the URL, generate a markdown file in `research/`, and append it to `docs/data/articles.json`.

---

## ⚖️ License

All research notes, documentation, and original simulation code in this repository are licensed under the [MIT License](LICENSE) (or another open license of your choosing). Feel free to adapt these templates for other common-pool resource studies!
