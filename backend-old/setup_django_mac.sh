#!/bin/bash

# Stop on any error
set -e

# Create virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
python -m pip install \
    asgiref==3.8.1 \
    Django==5.1.6 \
    django-cors-headers==4.7.0 \
    djangorestframework==3.15.2 \
    sqlparse==0.5.3 \
    tzdata==2025.1 \
    Pillow \
    firebase-admin==6.5.0

# Generate requirements.txt
pip freeze > requirements.txt
echo -e "\n📄 requirements.txt generated"

# Run Django development server
echo -e "\n🚀 Starting Django development server..."
python manage.py runserver
