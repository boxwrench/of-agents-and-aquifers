# Experiments // Of Agents and Aquifers

This folder is dedicated to small experiments, scripts, notebooks, and prototypes exploring agentic AI applied to water systems and aquifers.

## 🔬 Planned & Ongoing Experiments

1. **`01_scada_agent_simulation/`** *(Planned)*
   - A sandbox simulating a basic SCADA (Supervisory Control and Data Acquisition) system for a water distribution network.
   - Objective: Test how an LLM agent behaves when reading sensor telemetry and deciding when to cycle pumps or close valves based on simulated constraints.

2. **`02_aquifer_depletion_game/`** *(Planned)*
   - An interactive Python simulation of common-pool resource depletion.
   - Objective: Multiple LLM agents acting as independent agricultural pumpers, testing cooperation strategies and regulatory compliance.

## 🛠️ How to Structure an Experiment
For each experiment, please create a subfolder with its own `README.md` and dependencies:
```text
experiments/
└── 01_experiment_name/
    ├── README.md         # Objective, methodology, and findings
    ├── requirements.txt  # Python dependencies for this specific run
    └── run.py            # Primary executable script or Jupyter notebook
```
