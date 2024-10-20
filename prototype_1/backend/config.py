import os
from cryptography.fernet import Fernet

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///shopping.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Generate or load an encryption key
    FERNET_KEY = os.environ.get('FERNET_KEY') or Fernet.generate_key()

print(Fernet.generate_key().decode())