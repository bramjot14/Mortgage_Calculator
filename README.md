# 🏠 Mortgage Calculator Web App

A full-stack **Mortgage Calculator** built using **Node.js, Express, EJS, PostgreSQL, and CSS**.
This application allows users to calculate mortgage payments dynamically and display results in a clean, responsive UI.

---

## 📌 Project Overview

This project demonstrates:

* Server-side rendering using **EJS**
* Form handling with **Express & body-parser**
* Mortgage calculation logic on the backend
* PostgreSQL database connection using **pg**
* Clean UI styling with custom CSS
* Structured MVC-style Express application

---

## 🧠 How the Application Works

1. User enters mortgage details (loan amount, interest rate, term, etc.)
2. Form data is submitted to the Express server
3. Mortgage calculations are processed on the backend
4. Results are rendered dynamically on the same page using EJS
5. UI highlights calculated values for clarity

---

## 🗂️ Project Structure

```
Mortgage_Calculator-main/
│
├── app.js                 # Main Express server and logic
├── package.json           # Project metadata & dependencies
├── package-lock.json      # Dependency lock file
├── .gitattributes
│
├── public/
│   └── styles/
│       └── main.css       # Custom styling
│
└── views/
    └── index.ejs          # UI template and form layout
```

---

## ⚙️ Tech Stack

* **Node.js**
* **Express.js**
* **EJS (Embedded JavaScript Templates)**
* **PostgreSQL**
* **CSS**
* **Body-Parser**
* **pg (PostgreSQL client)**

---

## 📄 File-by-File Explanation

### `app.js`

* Initializes Express server
* Configures middleware (`body-parser`, static files)
* Establishes PostgreSQL database connection using `pg`
* Handles routing and form submission
* Contains mortgage calculation logic
* Passes calculated values to EJS template for rendering

---

### `views/index.ejs`

* Main UI template
* Contains:

  * Mortgage input form
  * Result display section
  * Dynamic rendering using `<%= %>`
* Uses semantic HTML and inline styles for layout clarity

---

### `public/styles/main.css`

* Handles layout and responsiveness
* Card-style container with shadows and rounded corners
* Highlighted rows for calculated results
* Clean, professional UI suitable for real-world apps

---

### `package.json`

* Defines project dependencies
* Uses ES module syntax (`"type": "module"`)
* Includes Express, body-parser, and pg

---

## 🧮 Mortgage Calculation Logic

The backend calculates:

* Monthly payment
* Interest amount
* Total payable amount

Using standard mortgage formulas processed server-side and rendered dynamically via EJS.

---

## 🚀 How to Run the Project Locally

```bash
# Install dependencies
npm install

# Start the server
node app.js
```

Then open your browser at:

```
http://localhost:3000
```

---

## 🎯 Learning Outcomes

* Full-stack Express + EJS workflow
* Backend form handling
* PostgreSQL integration
* Server-side rendering
* Real-world project structuring
* Clean UI + logic separation

---

## 🧑‍💻 Author

**Bramjot Singh**
Full-Stack Developer (Learning Phase)
Focused on building practical, production-style web applications.
