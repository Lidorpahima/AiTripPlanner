import os

IGNORED_FOLDERS = {'node_modules', '.git', '.next', 'dist', '.venv', '__pycache__'}
MAX_DEPTH = 6
OUTPUT_FILE = "project_structure.txt"

def list_dir(path, depth=0):
    if depth > MAX_DEPTH:
        return ""
    
    output = ""
    try:
        for name in sorted(os.listdir(path)):
            full_path = os.path.join(path, name)
            if name in IGNORED_FOLDERS:
                continue
            prefix = "  " * depth + ("📁 " if os.path.isdir(full_path) else "📄 ")
            output += prefix + name + "\n"
            if os.path.isdir(full_path):
                output += list_dir(full_path, depth + 1)
    except Exception as e:
        output += "  " * depth + f"(Error reading {path}: {str(e)})\n"
    return output

if __name__ == "__main__":
    root_path = "."
    structure = list_dir(root_path)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(structure)
    print(f"✅ Project structure saved to {OUTPUT_FILE}")
