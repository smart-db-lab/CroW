# CroW-Kit Flask Demo (Localhost)

This is a lightweight Flask application that demonstrates how to use **CroW-Kit** end-to-end from a simple localhost server. It exposes HTTP endpoints to:

* Create **Table wrappers** (interactive, opens Chrome)
* Create **General wrappers** (interactive, opens Chrome)
* List saved wrappers
* Execute a saved wrapper headlessly and return extracted data as JSON

> Security note: This demo is intended for **local testing only**. Do not deploy it publicly as-is.

---

## Requirements

* Python **3.8+**
* **Google Chrome** installed (required for interactive wrapper authoring)

---

## Setup

### 1) Create a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
```

### 2) Install dependencies

```bash
pip install flask crow-kit
```

---

## Run the Server

```bash
python app.py
```

The server runs at:

* `http://127.0.0.1:5050/`

---

## Wrapper Storage Location

CroW-Kit stores wrapper JSON files inside its own working data directory:

```
crow_kit_data/wrappers/
```

> Note: Depending on how CroW-Kit is executed and your environment configuration, this directory is created relative to CroW-Kit’s runtime working location (i.e., where the package writes its data), which may differ from the Flask project folder.

You can confirm where the Flask server is running from using:

* `GET /health` (shows the Flask server current working directory)

And you can confirm where CroW-Kit sees wrappers via:

* `GET /wrappers` (lists the wrapper JSON files CroW-Kit can find)

---

## API Endpoints

### 1) Home

**GET** `/`

Returns a simple status string.

Example:

```bash
curl http://127.0.0.1:5050/
```

---

### 2) Health Check

**GET** `/health`

Shows the server’s working directory (useful for debugging local paths).

Example:

```bash
curl http://127.0.0.1:5050/health
```

---

### 3) List Wrappers

**GET** `/wrappers`

Lists wrapper JSON files that CroW-Kit can find.

Example:

```bash
curl http://127.0.0.1:5050/wrappers
```

---

### 4) Create a Table Wrapper (Interactive)

**GET** `/wrapper/table`

Query parameters:

* `url` (optional) — target page URL (default: ChEMBL lookup page)
* `wrapper_name` (optional) — name prefix for the wrapper (default: `my_table`)

Example:

```bash
curl "http://127.0.0.1:5050/wrapper/table?wrapper_name=chembl_table&url=https%3A%2F%2Fwww.ebi.ac.uk%2Fchembl%2Fid_lookup%2FCHEMBL1200669"
```

What happens:

1. Chrome opens the target URL
2. Wait until CroW’s control icon appears
3. Use the CroW UI to select the table and finish the flow
4. A JSON wrapper file is saved under `crow_kit_data/wrappers/`
5. The API returns `wrapper_file` in the JSON response

---

### 5) Create a General Wrapper (Interactive)

**GET** `/wrapper/general`

Query parameters:

* `url` (optional) — target page URL (default: NCBI Gene page)
* `wrapper_name` (optional) — name prefix for the wrapper (default: `my_general`)
* `repeat` (optional) — `yes` or `no` (default: `no`)

Example:

```bash
curl "http://127.0.0.1:5050/wrapper/general?wrapper_name=ncbi_gene&repeat=no&url=https%3A%2F%2Fwww.ncbi.nlm.nih.gov%2Fgene%2F60"
```

What happens:

1. Chrome opens the page
2. Wait until CroW’s control icon appears, then open the panel
3. Hover to preview target elements and **right-click** to select them (avoids triggering the site’s normal clicks)
4. Finish and save the wrapper
5. The API returns `wrapper_file`

---

### 6) Extract Data Using a Saved Wrapper (Headless)

**GET** `/extract`

Query parameters:

* `wrapper_name` (required) — the JSON wrapper filename (from `/wrappers` or wrapper creation response)
* `maximum_data_count` (optional) — max records to extract (default: `100`)
* `url` (optional) — override the URL stored in the wrapper

Example:

```bash
curl "http://127.0.0.1:5050/extract?wrapper_name=YOUR_WRAPPER.json&maximum_data_count=50"
```

Tip: first list wrappers:

```bash
curl http://127.0.0.1:5050/wrappers
```

---

## Typical Workflow

1. Create a wrapper:

* `/wrapper/table` or `/wrapper/general`

2. Confirm it was saved:

* `/wrappers`

3. Extract data:

* `/extract?wrapper_name=...`

---

## Troubleshooting

### The control icon does not appear

* The target page may still be loading JavaScript. Wait a bit longer.
* Ensure Chrome is installed and can open normally.

### No wrappers appear in `/wrappers`

* Create a wrapper first using `/wrapper/table` or `/wrapper/general`.
* Ensure CroW-Kit has write permission to create `crow_kit_data/wrappers/`.

### Permission errors when saving wrappers

Run the demo from a directory where you have write access, and ensure the environment allows CroW-Kit to create its data directory.

---

## License

MIT (same as CroW-Kit)
