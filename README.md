# 🏡 SriKrishna Real Estate

A modern, premium, and fully responsive real estate website for **SriKrishna Real Estate**, located in **Bilichy Village, Karamadai, Coimbatore, Tamil Nadu, India**.

This project provides an elegant platform for showcasing residential and commercial properties, allowing customers to explore listings, view property details, and contact the company with ease.

---

# ✨ Features

- Premium and responsive design
- Property listing and details pages
- Search and filtering
- Contact form
- Admin authentication using JWT
- Secure environment variable configuration
- Fast and optimized performance

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Authentication
- JSON Web Token (JWT)

---

# 📋 Prerequisites

Before running this project, install the following software:

- **Node.js (v18 or later)**
  - https://nodejs.org/

- **Git**
  - https://git-scm.com/

Verify the installation:

```bash
node -v
npm -v
git --version
```

---

# 📥 Clone the Repository

```bash
git clone https://github.com/sanjays2007/SriKrishna-realestate.git
cd SriKrishna-realestate
```

---

# 📦 Install Dependencies

Install all required packages:

```bash
npm install
```

If you need to install packages manually:

```bash
npm install express
npm install dotenv
npm install jsonwebtoken
npm install bcryptjs
npm install cookie-parser
npm install multer
npm install cors
```

Development dependency:

```bash
npm install --save-dev nodemon
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
JWT_SECRET=YourVeryStrongSecretKey
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

If `.env.example` is available:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

---

# ▶️ Running the Project

Start the server:

```bash
npm start
```

For development mode:

```bash
npm run dev
```

If nodemon is not configured:

```bash
node server.js
```

---

# 📂 Project Structure

```
SriKrishna-realestate/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│
├── routes/
├── middleware/
├── views/
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

# 📜 Available NPM Commands

| Command | Description |
|----------|-------------|
| `npm install` | Install all project dependencies |
| `npm start` | Start the production server |
| `npm run dev` | Start development server (Nodemon) |
| `npm update` | Update installed packages |
| `npm audit fix` | Fix security vulnerabilities |

---

# 🚀 Deployment

To deploy the application:

```bash
npm install
npm start
```

Configure the environment variables on your hosting platform before deployment.

---

# 📸 Screenshots

Include screenshots of:

- Home Page
- Property Listings
- Property Details
- Contact Page
- Admin Dashboard

---

# 🔮 Future Enhancements

- Property booking system
- Google Maps integration
- AI property recommendations
- Mortgage calculator
- Virtual property tours
- Customer reviews
- Email notifications
- Property comparison

---

# 👨‍💻 Author

**Sanjay S**

GitHub: https://github.com/sanjays2007

---

# 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and personal purposes.
