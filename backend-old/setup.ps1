# This sets up a virtual environment, installs dependencies, creates a requirements.txt, and runs the Django dev server.

# Stop script on any error
$ErrorActionPreference = "Stop"

# Create virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install required packages
python -m pip install `
    asgiref==3.8.1 `
    Django==5.1.6 `
    django-cors-headers==4.7.0 `
    djangorestframework==3.15.2 `
    sqlparse==0.5.3 `
    tzdata==2025.1 `
    Pillow `
    firebase-admin==6.5.0

# Generate requirements.txt
pip freeze > requirements.txt
Write-Host "`n📄 requirements.txt generated"

# Run Django development server
Write-Host "`n🚀 Starting Django development server..."
python manage.py runserver
