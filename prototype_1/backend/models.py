from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet
from config import Config
from datetime import datetime


fernet = Fernet(Config.FERNET_KEY)

db = SQLAlchemy()

class Billing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    credit_card_encrypted = db.Column(db.String, nullable=False)
    
    # Method to encrypt credit card details before saving
    def encrypt_credit_card(self, plain_card_number):
        self.credit_card_encrypted = fernet.encrypt(plain_card_number.encode()).decode()

    # Method to decrypt credit card details
    def decrypt_credit_card(self):
        return fernet.decrypt(self.credit_card_encrypted.encode()).decode()

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            # For security, we don't return decrypted credit card data in API responses
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  # Hash the password

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  # Check the hashed password



class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200))
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(200))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url
        }


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='orders', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'created_at': self.created_at
        }

# Assuming you already have Product and User models
class Cart(db.Model):
    __tablename__ = 'cart'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='cart_items', lazy=True)
    product = db.relationship('Product', backref='cart_products', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'product_name': self.product.name,
            'price': self.product.price,
            'quantity': self.quantity,
            'added_at': self.added_at
        }
