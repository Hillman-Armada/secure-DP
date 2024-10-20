from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from functools import wraps
from models import db, Product, User, Order, Cart
from authentication import token_required
from authentication import auth
from models import Billing, User
from privacy import laplace_mechanism
import jwt
from werkzeug.security import check_password_hash

app = Flask(__name__)

# Configuration for CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# SQLAlchemy configuration (ensure the DB URI is set)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shopping.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config.from_object(Config)

# db = SQLAlchemy(app)
db.init_app(app);
app.register_blueprint(auth)

# Route: Home/Welcome
@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Shopping API with Differential Privacy'})


# Route: Fetch all products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])


# Route: Fetch a single product
@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())


# Route: Add a new product (admin only)
@app.route('/api/products', methods=['POST'])
@token_required  # JWT token verification for admin
def add_product(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin privileges required'}), 403
    
    data = request.get_json()
    new_product = Product(
        name=data['name'],
        price=data['price'],
        description=data['description'],
        category=data['category'],
        image_url=data['image_url']
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201


# Route: Update a product (admin only)
@app.route('/api/products/<int:id>', methods=['PUT'])
@token_required
def update_product(current_user, id):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin privileges required'}), 403
    
    product = Product.query.get_or_404(id)
    data = request.get_json()

    product.name = data.get('name', product.name)  # Use existing values if not provided
    product.price = data.get('price', product.price)
    product.description = data.get('description', product.description)
    product.category = data.get('category', product.category)
    product.image_url = data.get('image_url', product.image_url)

    db.session.commit()
    return jsonify(product.to_dict())


# Route: Delete a product (admin only)
@app.route('/api/products/<int:id>', methods=['DELETE'])
@token_required
def delete_product(current_user, id):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin privileges required'}), 403
    
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

@app.route('/api/orders', methods=['POST'])
@token_required  # Ensure the user is authenticated
def place_order(current_user):
    # Get all cart items for the current user
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()

    if not cart_items:
        return jsonify({'message': 'Your cart is empty'}), 400

    # Calculate the total amount
    total_amount = sum(item.product.price * item.quantity for item in cart_items)

    # Create a new order
    order = Order(user_id=current_user.id, total_amount=total_amount)
    db.session.add(order)

    # Clear the user's cart after placing the order
    for item in cart_items:
        db.session.delete(item)

    db.session.commit()

    return jsonify({'message': 'Order placed successfully', 'order': order.to_dict()}), 201

@app.route('/api/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = Order.query.filter_by(user_id=current_user.id).all()
    return jsonify([order.to_dict() for order in orders])


@app.route('/api/billing', methods=['POST'])
@token_required
def add_billing_info(current_user):
    if not current_user:
        return jsonify({'message': 'User not authenticated'}), 403
    
    data = request.get_json()
    plain_credit_card = data.get('credit_card')
    
    if not plain_credit_card:
        return jsonify({'message': 'Credit card info is required'}), 400
    
    # Encrypt credit card info before saving
    billing = Billing(user_id=current_user.id)
    billing.encrypt_credit_card(plain_credit_card)
    
    db.session.add(billing)
    db.session.commit()
    
    return jsonify({'message': 'Billing information added successfully'}), 201

@app.route('/api/billing/summary', methods=['GET'])
@token_required
def get_billing_summary(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Admin privileges required'}), 403
    
    epsilon = 0.5  # Privacy budget, can be tuned
    sensitivity = 1.0  # Sensitivity of the billing data query
    
    # Perform a query to calculate total billing amount (without revealing individual data)
    total_billing = db.session.query(db.func.sum(Billing.credit_card_encrypted)).scalar() or 0
    
    # Apply differential privacy to the total
    total_billing_with_dp = laplace_mechanism(total_billing, sensitivity, epsilon)
    
    return jsonify({'total_billing': total_billing_with_dp})

# Route: Add to cart
@app.route('/api/cart', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({'message': 'Product ID is required'}), 400

    # Create a new cart item
    cart_item = Cart(user_id=current_user.id, product_id=product_id, quantity=quantity)
    db.session.add(cart_item)
    db.session.commit()

    return jsonify({'message': 'Item added to cart successfully'}), 201

# Route: Get cart items
@app.route('/api/cart', methods=['GET'])
@token_required
def get_cart_items(current_user):
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    return jsonify([item.to_dict() for item in cart_items])

# Route: Update cart item
@app.route('/api/cart/<int:id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, id):
    cart_item = Cart.query.filter_by(user_id=current_user.id, id=id).first()
    if not cart_item:
        return jsonify({'message': 'Cart item not found'}), 404

    data = request.get_json()
    cart_item.quantity = data.get('quantity', cart_item.quantity)
    db.session.commit()

    return jsonify({'message': 'Cart item updated successfully'})

# Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'is_admin': user.is_admin  # Send is_admin flag as part of the response
    }), 200

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/api/admin-dashboard', methods=['GET'])
@token_required
def admin_dashboard(current_user):
    if not current_user.is_admin:
        return jsonify({'message': 'Access forbidden: Admins only'}), 403

    products = Product.query.all()
    return jsonify([{'id': product.id, 'name': product.name, 'price': product.price} for product in products])

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
