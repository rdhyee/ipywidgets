#!/usr/bin/env bash

# For a clean conda environment, do:

# conda create -c conda-forge -n ipywidgets notebook=4.4.1
# source activate ipywidgets
# pip install jupyterlab==0.16.2
# ipython kernel install --name ipywidgets --display-name "ipywidgets" --sys-prefix
# git clone https://github.com/jupyter-widgets/ipywidgets.git
# cd ipywidgets
# ./dev-install.sh

echo -n "Checking npm... "
npm -v
if [ $? -ne 0 ]; then
    echo "'npm -v' failed, therefore npm is not installed.  In order to perform a
    developer install of ipywidgets you must have both npm and pip installed on your
    machine! See http://blog.npmjs.org/post/85484771375/how-to-install-npm for
    installation instructions."
    exit 1
fi

echo -n "Checking pip... "
pip --version
if [ $? -ne 0 ]; then
    echo "'pip --version' failed, therefore pip is not installed. In order to perform
    a developer install of ipywidgets you must have both pip and npm installed on
    your machine! See https://packaging.python.org/installing/ for installation instructions."
    exit 1
fi

echo -n "Checking jupyter lab... "
jupyter lab --version 2>/dev/null
if [ $? -ne 0 ]; then
    echo "no, skipping installation of jupyterlab_widgets"
    skip_jupyter_lab=yes
fi


# All following commands must run successfully
set -e

nbExtFlags="--sys-prefix $1"

echo -n "Installing and building all npm packages"
npm install
npm run build

echo -n "widgetsnbextension"
cd widgetsnbextension
pip install -v -e .
if [[ "$OSTYPE" == "msys" ]]; then
    jupyter nbextension install --overwrite --py $nbExtFlags widgetsnbextension
else
    jupyter nbextension install --overwrite --py --symlink $nbExtFlags widgetsnbextension
fi
jupyter nbextension enable --py $nbExtFlags widgetsnbextension
cd ..

echo -n "ipywidgets"
pip install -v -e .

if test "$skip_jupyter_lab" != yes; then
    jupyter labextension install jupyterlab_widgets
fi
