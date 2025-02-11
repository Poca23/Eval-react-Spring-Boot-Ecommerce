
blbl

🛍️ Simple E-commerce API
A lightweight e-commerce backend built with Spring Boot and JDBC. No fancy stuff, just the essentials!

🚀 Quick Start

# Clone the repo

git clone [your-repo-url]

# Configure your .env file

DATABASE_URL=your_database_url
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

# Run the project

./mvnw spring-boot:run

🎯 Features
Products Management - CRUD operations for your awesome products
Order Processing - Because people need to buy stuff!
Stock Management - No one likes "Out of Stock" messages
Basic Admin Panel - Keep track of your business
🛠️ Built With
Spring Boot 3.4.2
Spring JDBC (No JPA, we keep it simple!)
MySQL
Jakarta Validation
Spring Security
📚 API Endpoints

# Products

GET /api/products
GET /api/products/{id}
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

# Orders

GET /api/orders
POST /api/orders
GET /api/orders/search?email={email}

🔑 Environment Variables
DATABASE_URL=jdbc:mysql://localhost:3306/your_db
DATABASE_USERNAME= seriously 😉
DATABASE_PASSWORD= seriously 😉

🏃‍♂️ Running Tests
./mvnw test

👩‍💻 Made By
Made with ☕ and 💖 by [Your Name]

📝 License
This project is licensed under the MIT License - feel free to copy, modify, and sell!

Note: This is a learning project. Don't use it to sell real diamonds or cars... yet! 😉