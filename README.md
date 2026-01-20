# CroW (Crowd-Enabled Wrapper Ecosystem)

This repository contains the CroW system artifacts, including the **CroW-Kit** Python package distribution and a lightweight **Flask demo** project for local testing.

---

## Repository Contents

* **`crow_kit-0.3.2/`**
  Source and packaging files for the **CroW-Kit** Python distribution (v0.3.2).

* **`flask_demo/`**
  A sample Flask project that demonstrates CroW-Kit’s main actions (create wrappers, list wrappers, execute wrappers) via localhost endpoints.

* **`crow_test_data_set.csv`**
  Example dataset used for testing/experiments.

* **`LICENSE`**
  MIT License.

---

## Quick Start (CroW-Kit)

### Install from PyPI

```bash
pip install crow-kit
```

CroW-Kit installs required Python dependencies automatically.
For interactive wrapper authoring, you must have **Google Chrome** installed.

---

## Flask Demo (Localhost)

To run the demo API locally, see:

* `flask_demo/readme.md`

In brief:

```bash
cd flask_demo
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install flask crow-kit
python app.py
```

Then open:

* `http://127.0.0.1:5050/health`

> Note: The demo is intended for local testing only.

---

## Development Install (Optional)

If you want to install CroW-Kit from the local source folder:

```bash
pip install -e ./crow_kit-0.3.2
```

---

## Citation

If you use CroW/CroW-Kit in academic work, please cite the corresponding paper (add citation details here once finalized).

---

## Contact

Kallol Naha
