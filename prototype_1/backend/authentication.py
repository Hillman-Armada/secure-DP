from functools import wraps
import jwt
import datetime
from werkzeug.security import check_password_hash
from flask import Blueprint, request, jsonify
from models import User  # Ensure User model is imported
from config import Config  # Ensure Config is imported

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check for token in the Authorization header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            # Decode the token using the secret key
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated

auth = Blueprint('auth', __name__)

@auth.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists and password is correct
    if user and check_password_hash(user.password_hash, password):
        # Generate JWT token with user_id and is_admin flag
        token = jwt.encode({
            'user_id': user.id,
            'is_admin': user.is_admin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm="HS256")

        # Return the token and admin status
        return jsonify({'token': token, 'is_admin': user.is_admin})

    # If login fails, return an error message
    return jsonify({'message': 'Invalid email or password'}), 401