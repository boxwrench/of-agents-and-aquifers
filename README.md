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




## 🔗 Resource Index (Direct Access)

### 📚 Research & Case Studies
- **[A Review of Artificial Intelligence Techniques for Leak Detection in Water Distribution Networks (2024)](https://pubmed.ncbi.nlm.nih.gov/38350191/)** — *PubMed* ([Notes](research/a-review-of-artificial-intelligence-techniques-for-leak-detection-in-water-distribution-networks-2024.md))
- **[Accelerating water distribution systems planning and design with generative artificial intelligence models (2026)](https://doi.org/10.1017/wat.2025.12)** — *DOI* ([Notes](research/accelerating-water-distribution-systems-planning-and-design-with-generative-artificial-intelligence-models-2026.md))
- **[Advanced Modeling in Agentic Systems (2026)](https://arxiv.org/pdf/2603.29755)** — *arXiv* ([Notes](research/advanced-modeling-in-agentic-systems-2026.md))
- **[Artificial Intelligence in Water Distribution Networks: A Systematic Review (2026)](https://doi.org/10.3390/smartcities9030045)** — *DOI* ([Notes](research/artificial-intelligence-in-water-distribution-networks-a-systematic-review-2026.md))
- **[Building Agents](https://openai.com/tracks/building-agents)** — *OpenAI* ([Notes](research/building-agents.md))
- **[Contaminations in Water Distribution Systems: A Critical Review of Detection and Response Methods (2024)](https://doi.org/10.2166/aqua.2024.125)** — *DOI* ([Notes](research/contaminations-in-water-distribution-systems-a-critical-review-of-detection-and-response-methods-2024.md))
- **[Cybersecurity in Water Distribution Networks: A Systematic Review of AI-Based Detection Algorithms (2026)](https://doi.org/10.3390/w18040519)** — *DOI* ([Notes](research/cybersecurity-in-water-distribution-networks-a-systematic-review-of-ai-based-detection-algorithms-2026.md))
- **[Dialectics for Artificial Intelligence (2025)](https://arxiv.org/abs/2512.17373)** — *arXiv* ([Notes](research/dialectics-for-artificial-intelligence-2025.md))
- **[Domain-Specific LLMs for Water/Wastewater Utility Applications](https://arxiv.org/html/2505.16120v2)** — *arXiv* ([Notes](research/domain-specific-llms-for-waterwastewater-utility-applications.md))
- **[How Claude Code Builds a System Prompt](https://www.dbreunig.com/2026/04/04/how-claude-code-builds-a-system-prompt.html)** — *DBreunig* ([Notes](research/how-claude-code-builds-a-system-prompt.md))
- **[Large Language Models for Water Distribution Systems Modeling and Decision-Making (2025/2026)](https://arxiv.org/abs/2503.16191)** — *arXiv* ([Notes](research/large-language-models-for-water-distribution-systems-modeling-and-decision-making-20252026.md))
- **[Leveraging large language models for automating water distribution network optimization](https://pubmed.ncbi.nlm.nih.gov/40945061/)** — *PubMed* ([Notes](research/leveraging-large-language-models-for-automating-water-distribution-network-optimization.md))
- **[NVIDIA NeMo Agent Toolkit](https://developer.nvidia.com/nemo-agent-toolkit)** — *NVIDIA* ([Notes](research/nvidia-nemo-agent-toolkit.md))
- **[Recent Advances in Intelligent Water Infrastructure](https://www.sciencedirect.com/science/article/pii/S0278612526000889)** — *ScienceDirect* ([Notes](research/recent-advances-in-intelligent-water-infrastructure.md))
- **[Reinforcement Learning and Machine Learning Controllers for Electrochemical Desalination](https://pubs.acs.org/doi/10.1021/acsestwater.4c00561)** — *ACS* ([Notes](research/reinforcement-learning-and-machine-learning-controllers-for-electrochemical-desalination.md))
- **[Research on AI/ML Advances (2026)](https://huggingface.co/papers/2605.27366)** — *Hugging Face* ([Notes](research/research-on-aiml-advances-2026.md))
- **[Review of Multi-Agent Intelligent Systems](https://www.academia.edu/8224528/A_review_paper_on_Multi_agent_base_intelligent_manufacturing_system)** — *Academia* ([Notes](research/review-of-multi-agent-intelligent-systems.md))
- **[Systematic review of AI in water regulations](https://www.nature.com/articles/s41545-026-00555-w)** — *Nature* ([Notes](research/systematic-review-of-ai-in-water-regulations.md))
- **[Top 7 Python Libraries for Large-Scale Data Processing](https://www.kdnuggets.com/top-7-python-libraries-for-large-scale-data-processing)** — *KDnuggets* ([Notes](research/top-7-python-libraries-for-large-scale-data-processing.md))
- **[aiWATERS (Virginia Tech)](https://vtechworks.lib.vt.edu/items/1eb809d6-947b-4e08-b91e-039380737f95)** — *Virginia Tech* ([Notes](research/aiwaters-virginia-tech.md))

### 📖 Tutorials & Guides
- **[A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)** — *OpenAI* ([Notes](research/a-practical-guide-to-building-ai-agents.md))
- **[Agent-to-Agent MCP Tutorial](https://matteovillosio.com/writing/agent2agent-mcp-tutorial/)** — *Matteo Villosio* ([Notes](research/agent-to-agent-mcp-tutorial.md))
- **[Anthropic Learn](https://www.anthropic.com/learn)** — *Anthropic* ([Notes](research/anthropic-learn.md))
- **[Claude for You](https://www.anthropic.com/learn/claude-for-you)** — *Anthropic* ([Notes](research/claude-for-you.md))
- **[Codex Prompting Guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)** — *OpenAI* ([Notes](research/codex-prompting-guide.md))
- **[Deep-ML Problems](https://www.deep-ml.com/problems)** — *Deep-ml* ([Notes](research/deep-ml-problems.md))
- **[Eval Skills: Best Practices for Evaluating AI](https://developers.openai.com/blog/eval-skills)** — *OpenAI* ([Notes](research/eval-skills-best-practices-for-evaluating-ai.md))
- **[Google Cloud Skills Course Template](https://www.skills.google/course_templates/1267?locale=en)** — *Google* ([Notes](research/google-cloud-skills-course-template.md))
- **[Google Cloud Training](https://cloud.google.com/learn/training)** — *Google* ([Notes](research/google-cloud-training.md))
- **[LangChain Academy Collections](https://academy.langchain.com/collections)** — *Langchain* ([Notes](research/langchain-academy-collections.md))
- **[Mastering Agentic Techniques for AI Agent Customization](https://developer.nvidia.com/blog/mastering-agentic-techniques-ai-agent-customization/)** — *NVIDIA* ([Notes](research/mastering-agentic-techniques-for-ai-agent-customization.md))
- **[NVIDIA Agentic AI Professional Certification](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)** — *NVIDIA* ([Notes](research/nvidia-agentic-ai-professional-certification.md))
- **[NVIDIA DLI Agentic AI Course](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-15+V1)** — *NVIDIA* ([Notes](research/nvidia-dli-agentic-ai-course.md))
- **[NVIDIA Self-Paced Courses](https://www.nvidia.com/en-us/training/self-paced-courses/)** — *NVIDIA* ([Notes](research/nvidia-self-paced-courses.md))
- **[OpenAI Academy](https://academy.openai.com/)** — *OpenAI* ([Notes](research/openai-academy.md))
- **[Run Long-Horizon Tasks with AI Agents](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)** — *OpenAI* ([Notes](research/run-long-horizon-tasks-with-ai-agents.md))
- **[Train Small Orchestration Agents to Solve Big Problems](https://developer.nvidia.com/blog/train-small-orchestration-agents-to-solve-big-problems/)** — *NVIDIA* ([Notes](research/train-small-orchestration-agents-to-solve-big-problems.md))
- **[Wired for Action: Langflow Enables Local AI Agent Creation](https://blogs.nvidia.com/blog/rtx-ai-garage-langflow-agents-remix/)** — *NVIDIA* ([Notes](research/wired-for-action-langflow-enables-local-ai-agent-creation.md))

### 🛠️ Tooling & Harnesses
- **[A-Evolve](https://github.com/A-EVO-Lab/a-evolve)** — *GitHub* ([Notes](research/a-evolve.md))
- **[AI Engineering From Scratch](https://github.com/rohitg00/ai-engineering-from-scratch)** — *GitHub* ([Notes](research/ai-engineering-from-scratch.md))
- **[AutoAgent](https://github.com/kevinrgu/autoagent)** — *GitHub* ([Notes](research/autoagent.md))
- **[Awesome Autoresearch](https://github.com/alvinreal/awesome-autoresearch)** — *GitHub* ([Notes](research/awesome-autoresearch.md))
- **[Awesome Open Source AI](https://github.com/alvinreal/awesome-opensource-ai)** — *GitHub* ([Notes](research/awesome-open-source-ai.md))
- **[EvolKit](https://github.com/arcee-ai/EvolKit)** — *GitHub* ([Notes](research/evolkit.md))
- **[GStack](https://github.com/garrytan/gstack)** — *GitHub* ([Notes](research/gstack.md))
- **[GitButler](https://gitbutler.com/)** — *GitButler* ([Notes](research/gitbutler.md))
- **[How to Train Your GPT](https://github.com/raiyanyahya/how-to-train-your-gpt)** — *GitHub* ([Notes](research/how-to-train-your-gpt.md))
- **[Introducing Ossature](https://ossature.dev/blog/introducing-ossature/)** — *Ossature* ([Notes](research/introducing-ossature.md))
- **[OpenAI Agents (Python)](https://github.com/openai/openai-agents-python)** — *GitHub* ([Notes](research/openai-agents-python.md))
- **[Potable](https://github.com/boxwrench/potable)** — *GitHub* ([Notes](research/potable.md))
- **[Vera](https://veralang.dev/)** — *Vera* ([Notes](research/vera.md))
- **[tesla_agent: Local Agentic AI for Utilities](https://github.com/boxwrench/tesla_agent)** — *GitHub* ([Notes](research/tesla-agent-local-agentic-ai-for-utilities.md))

### 📊 Datasets & Telemetry
- **[AssetOpsBench](https://github.com/IBM/AssetOpsBench)** — *GitHub* ([Notes](research/assetopsbench.md))
- **[Awesome Industrial Datasets](https://github.com/jonathanwvd/awesome-industrial-datasets)** — *GitHub* ([Notes](research/awesome-industrial-datasets.md))
- **[FDAbench](https://github.com/fdabench/FDAbench)** — *GitHub* ([Notes](research/fdabench.md))
- **[Hydraulic performance benchmarking for effective management of water distribution networks (2021)](https://pubmed.ncbi.nlm.nih.gov/34454199/)** — *PubMed* ([Notes](research/hydraulic-performance-benchmarking-for-effective-management-of-water-distribution-networks-2021.md))
- **[USGS Active Groundwater Level Network Telemetry Feed](https://waterdata.usgs.gov/nwis/gw)** — *USGS* ([Notes](research/usgs-active-groundwater-level-network-telemetry.md))

## ⚖️ License

All research notes, documentation, and original simulation code in this repository are licensed under the [MIT License](LICENSE) (or another open license of your choosing). Feel free to adapt these templates for other common-pool resource studies!
