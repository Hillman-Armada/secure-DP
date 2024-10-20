import random
from app import db, app
from models import Product

# List of sample product names, descriptions, and categories
product_names = ["Laptop", "Smartphone", "Headphones", "Smartwatch", "Gaming Console", "Tablet", "Camera", "Bluetooth Speaker"]
product_descriptions = [
    "A powerful and modern electronic device.",
    "High-quality product with advanced features.",
    "Perfect for work, gaming, and more.",
    "New and improved model with better performance.",
    "Durable and reliable for everyday use.",
    "Latest model with cutting-edge technology."
]
product_categories = ["Electronics", "Accessories", "Gadgets", "Entertainment", "Appliances"]

# Function to generate random products
def create_random_product():
    name = random.choice(product_names)
    description = random.choice(product_descriptions)
    category = random.choice(product_categories)
    price = round(random.uniform(50.00, 1500.00), 2)  # Random price between 50 and 1500
    
    # Use Lorem Picsum for dynamic images instead of a placeholder
    image_url = f"https://picsum.photos/300/200?random={random.randint(1, 1000)}"
    
    return Product(name=name, price=price, description=description, category=category, image_url=image_url)

# Populate the database with predefined and random products
with app.app_context():
    # Add specific products to the database (predefined products)
    product1 = Product(
        name="Gaming Console",
        description="High-quality gaming console.",
        price=499.99,
        image_url="/assets/images/gaming_console.jpg"  # Path to local image
    )

    product2 = Product(
        name="Smartphone",
        description="Latest smartphone model.",
        price=799.99,
        image_url="/assets/images/smartphone.jpg"  # Path to local image
    )

    product3 = Product(
        name="Headphones",
        description="Noise-cancelling headphones.",
        price=299.99,
        image_url="/assets/images/headphones.jpg"  # Path to local image
    )

    db.session.add(product1)
    db.session.add(product2)
    db.session.add(product3)

    # Create and add random products to the database
    for _ in range(10):  # Create 10 random products
        random_product = create_random_product()
        db.session.add(random_product)

    # Commit all changes to the database
    db.session.commit()

    print("Predefined and random products added to the database successfully!")
