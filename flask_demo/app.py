from flask import Flask, jsonify, request
from crow_kit import setTableWrapper, setGeneralWrapper, getWrapperData, listWrappers
import os

app = Flask(__name__)

@app.get("/")
def home():
    return "Flask is running ✅"

@app.get("/health")
def health():
    # This helps you quickly see where you are running and if storage path is writable.
    cwd = os.getcwd()
    wrappers_dir = os.path.join(cwd, "crow_kit_data", "wrappers")
    return jsonify(
        {
            "ok": True,
            "cwd": cwd,
            "wrappers_dir_expected": wrappers_dir,
            "wrappers_dir_exists": os.path.isdir(wrappers_dir),
        }
    )

@app.get("/wrappers")
def wrappers():
    success, files = listWrappers()
    return jsonify({"success": success, "wrappers": files})

@app.get("/wrapper/table")
def create_table_wrapper_get():
    url = request.args.get(
        "url",
        "https://www.ebi.ac.uk/chembl/id_lookup/CHEMBL1200669"
    )
    wrapper_name = request.args.get("wrapper_name", "my_table")

    success, wrapper_file, err_code, err_type, err_msg = setTableWrapper(
        url, wrapper_name=wrapper_name
    )

    return jsonify(
        {
            "success": success,
            "wrapper_file": wrapper_file,
            "error_code": err_code,
            "error_type": err_type,
            "error_message": err_msg,
        }
    )

@app.get("/wrapper/general")
def create_general_wrapper_get():
    """
    Example:
    /wrapper/general?url=...&wrapper_name=my_general&repeat=yes
    """
    url = request.args.get("url", "https://www.ncbi.nlm.nih.gov/gene/60")
    wrapper_name = request.args.get("wrapper_name", "my_general")
    repeat = request.args.get("repeat", "no")  # yes/no

    success, wrapper_file, err_code, err_type, err_msg = setGeneralWrapper(
        url, wrapper_name=wrapper_name, repeat=repeat
    )

    return jsonify(
        {
            "success": success,
            "wrapper_file": wrapper_file,
            "error_code": err_code,
            "error_type": err_type,
            "error_message": err_msg,
        }
    )


@app.get("/extract")
def extract_get():
    """
    Example:
    /extract?wrapper_name=FILE.json&maximum_data_count=50&url=
    """
    wrapper_name = request.args.get(
        "wrapper_name",
        "my_table_table_wrapper_b6706123-999a-4122-961b-0c814f62db87.json"
    )
    maximum_data_count = int(request.args.get("maximum_data_count", 100))
    url_override = request.args.get("url", "")  # optional override

    success, extracted_data = getWrapperData(
        wrapper_name, maximum_data_count=maximum_data_count, url=url_override
    )

    return jsonify(
        {
            "success": success,
            "count": len(extracted_data) if success and isinstance(extracted_data, list) else 0,
            "data": extracted_data,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5050)

