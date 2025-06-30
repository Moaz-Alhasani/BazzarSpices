# BazzarSpices

**Ecommerce-websites** is a simple e-commerce backend application for selling various household products such as carpets, solar energy systems, salt, and more. It is built using **Node.js**, **TypeScript**, and **Prisma ORM** with a **PostgreSQL** database, providing a scalable and reliable architecture.

---

## ✨ Features

- 🔐 User registration and login system  
- 🛍️ Browse categorized products (carpets, solar energy, salt, etc.)  
- 💬 Contact seller directly via WhatsApp for each product  
- 🧑‍💼 Admin dashboard to manage products and users  
- 🗃️ Database managed with Prisma + PostgreSQL  
- ☁️ Ready for cloud deployment  

---

## 🧑‍💻 Tech Stack

- **Node.js** – Runtime environment  
- **TypeScript** – Strongly typed JavaScript  
- **Express.js** – Web framework  
- **Prisma ORM** – Database access and migrations  
- **PostgreSQL** – Relational database  
- **JWT** – JSON Web Tokens for authentication  
- **bcrypt** – Password hashing  
- **dotenv** – Manage environment variables  

---

## ⚙️ Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/Moaz-Alhasani/home-products-app.git
cd home-products-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit the .env file with your database and secret keys

# Generate Prisma client and run initial migration
npx prisma generate
npx prisma migrate dev --name init

# Run the development server
npm run dev
----------------
```

## 🔐 Security
 # Passwords are hashed using bcrypt

# Authentication handled with JWT

# Admin routes protected with role-based access

## 💡 Notes
# No online payment system integrated yet due to local limitations

# Planning to integrate local providers like Al-Haram

# Support for PayPal and Visa may be added later


