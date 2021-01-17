import subprocess

subprocess.call(["python3", "-m", "venv", "VizQue"])
subprocess.call(["source", "VizQue/bin/activate"])
subprocess.call(["python", "setup.py", "sdist"])
subprocess.call(["pip", "install", "-e", "."])