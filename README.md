# 🍱 FoodRescue

**FoodRescue** is a web-based food donation and rescue platform designed to connect **food donors, volunteer couriers, and NGOs** so that surplus food can be collected and delivered instead of being wasted.

The platform provides an end-to-end workflow for creating food donations, claiming them through volunteers, tracking delivery progress, and confirming successful delivery through NGO verification.

---

## 🎯 Problem

Large amounts of surplus food from restaurants, events, and other sources can go to waste while people and communities still need food.

FoodRescue aims to make the rescue process more organized by providing a digital platform where:

* Donors can list surplus food.
* Volunteers can claim and transport donations.
* NGOs can receive and verify delivered food.
* Donation progress can be tracked throughout the rescue process.

---

## 💡 How FoodRescue Works

```text
Food Donor
    ↓
Creates Donation
    ↓
Volunteer Claims Donation
    ↓
Food Picked Up
    ↓
Food In Transit
    ↓
Food Delivered
    ↓
NGO Verifies Delivery
    ↓
Donation Completed
```

---

## ✨ Key Features

### 🍽️ Donor Dashboard

* Create a food donation
* Enter food category and quantity
* Add pickup location and pickup window
* Specify best-before information
* View active donation details
* Access donation history
* Receive a unique verification code for delivery confirmation

### 🚴 Volunteer Courier Dashboard

* View available food donations
* Claim a donation
* Complete food pickup
* Update delivery progress
* Mark food as in transit
* Mark food as delivered

### 🏠 NGO Dashboard

* View incoming food donations
* Track delivery status
* Enter the donor's verification code
* Confirm successful delivery
* View completed donation history

### 🔐 Delivery Verification

Each donation receives a unique verification code.

The NGO uses this code to confirm that the food has been successfully received, helping provide a clear delivery confirmation process.

### 📊 Donation History

The system stores donation information and delivery status so previous food rescue activities can be reviewed.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Python
* Flask
* Flask-CORS

### Database

* SQLite

### Development Tools

* Git
* GitHub
* VS Code
* PowerShell

---

## 🏗️ Project Structure

```text
FoodRescue/
│
├── backend/
│   └── api.py
│
├── database/
│   └── database.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── app.py
├── meal_demand_model.pkl
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/NandiniPandey20/FoodRescue.git
cd FoodRescue
```

### 2. Set up the Python environment

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Start the Flask backend

From the project root:

```bash
python -m backend.api
```

The backend will run on:

```text
http://localhost:5000
```

### 4. Start the React frontend

Open another terminal and move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## 📸 Screenshots

Screenshots of the FoodRescue application will be added here.

Suggested screenshots:

* Home page
* Donor dashboard
* Donation creation form
* Volunteer dashboard
* NGO dashboard
* Delivery verification
* Donation history

---

## 🔄 Donation Status Flow

FoodRescue uses a status-based workflow to track donations:

```text
Listed
  ↓
Claimed
  ↓
Food Picked Up
  ↓
In Transit
  ↓
Delivered
  ↓
Completed
```

The final **Completed** status is reached after the NGO verifies the delivery using the donation's verification code.

---

## 🌱 Impact

FoodRescue is designed to help reduce avoidable food waste by making surplus food easier to coordinate, collect, transport, and distribute.

The platform connects the three key participants in the process:

**Donor → Volunteer → NGO**

creating a structured digital workflow for food rescue.

---

## 👥 Team

**FoodRescue** was developed as a collaborative project.

* **Nandini Pandey**
* **Mehak**

---

## 📌 Project Status

**Completed — Working Prototype**

The current version includes the core donor, volunteer, NGO, backend API, database, delivery verification, and donation tracking workflows.

---

## 📄 License

This project is intended for educational, hackathon, and portfolio purposes.
