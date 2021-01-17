from setuptools import setup, find_packages

setup(
    name='vizque',
    version='0.0.1',
    packages=find_packages(),
    install_requires=[
        'requests',
        'graphviz'
    ],
    entry_points="""
        [console_scripts]
        vizque=vizque:main
    """,
)