import subprocess
import os

os.chdir("/VizQue")

subprocess.call(["python3", "-m", "venv", "VizQue"])
subprocess.call([".", "VizQue/bin/activate"])
subprocess.call(["python", "setup.py", "sdist"])
subprocess.call(["pip", "install", "-e", "."])