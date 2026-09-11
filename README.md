# 🍱 Smart Food Waste Predictor & Food Rescue Platform

> **Turning surplus food into community impact — before it becomes waste. ♻️**

A smart food-rescue platform designed to reduce food wastage by connecting **food donors, volunteer couriers, and NGOs** through a simple digital workflow.

The platform allows surplus food to be listed by donors, picked up by volunteers, tracked during delivery, and verified by NGOs. It also provides a foundation for integrating **machine-learning-based food demand and waste prediction** to reduce over-preparation in the future.

---

## 🌍 Problem

A large amount of edible food is wasted every day because of:

* Over-preparation of meals
* Unpredictable food demand
* Lack of coordination between food donors and NGOs
* Difficulty in transporting surplus food quickly
* Limited visibility into the status of food donations

At the same time, many communities and organizations face food shortages.

### Our idea

Instead of allowing surplus food to become waste:

**Donor → Smart Matching → Volunteer → NGO → Community**

The platform creates a simple digital bridge between surplus food and people who can use it.

---

## 🚀 Key Features

### 👨‍🍳 1. Food Donor

Food donors such as restaurants, bakeries, and other food providers can:

* Enter donor/restaurant details
* Select the food category
* Specify the quantity of meals
* Add pickup location
* Define a pickup time window
* Add the food's best-before time
* Provide additional food details
* Upload a food photograph
* Post the donation

Once posted, the donation becomes available to the rescue workflow.

---

### 🚴 2. Volunteer Courier

Volunteers can view available food donations and accept rescue tasks.

The platform includes:

* Donor and food information
* Quantity and expiry information
* Pickup location
* Pickup window
* Smart matching interface
* Food safety checklist
* Volunteer assignment
* Delivery status tracking

Before accepting a pickup, the volunteer verifies:

* ✅ Packaging is intact
* ✅ Food is properly stored
* ✅ No visible contamination
* ✅ Food is within the pickup window

---

### 🤖 3. Smart Matching

The platform provides a smart-matching interface to connect available food donations with suitable rescue resources.

The prototype displays:

* 📍 Distance
* 🏠 NGO availability
* 🚴 Route status

This creates the foundation for a future intelligent matching system based on real-time location, urgency, food quantity, volunteer availability, and NGO requirements.

---

### 🏠 4. NGO Dashboard

NGOs can monitor incoming food donations and delivery progress.

The dashboard provides:

* Meals rescued
* Active volunteers
* NGO partners
* Donation information
* Assigned volunteer
* Pickup location
* Pickup window
* Current delivery status

---

### 🚦 5. Delivery Tracking

Each donation moves through a simple rescue lifecycle:

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
Verified
```

This makes the entire rescue process easier to monitor.

---

### 🔐 6. Delivery Verification

After a volunteer marks the food as **Delivered**, the NGO can verify the delivery using a verification code.

After successful verification, the platform displays community impact metrics such as:

* Meals received
* Food rescued
* Reduction in potential landfill waste

---

## 🧠 Machine Learning Component

The project repository also includes a trained model file:

```text
meal_demand_model.pkl
```

The overall project is designed around the idea of using historical food-demand information to predict future requirements and reduce unnecessary food preparation.

The current prototype focuses primarily on the **food-rescue and redistribution workflow**, while the prediction component provides a foundation for future integration.

### Future prediction workflow

```text
Historical Food Data
        ↓
Data Preprocessing
        ↓
Feature Engineering
        ↓
Machine Learning Model
        ↓
Demand Prediction
        ↓
Recommended Food Quantity
        ↓
Reduced Over-Preparation
        ↓
Less Food Waste ♻️
```

---

## 🛠️ Tech Stack

| Technology           | Purpose                     |
| -------------------- | --------------------------- |
| Python               | Core programming language   |
| Streamlit            | Interactive web application |
| Pandas               | Data handling               |
| Scikit-learn         | Machine learning            |
| Joblib               | Model serialization/loading |
| Python Session State | Prototype state management  |

The current dependency list is defined in `requirements.txt`.

---

## 📁 Project Structure

```text
Smart-food-waste-predictor/
│
├── app.py
├── meal_demand_model.pkl
├── requirements.txt
└── README.md
```

### File Description

**`app.py`**
Main Streamlit application containing the donor, volunteer, and NGO workflows.

**`meal_demand_model.pkl`**
Saved machine-learning model intended for demand-prediction functionality.

**`requirements.txt`**
Contains the Python dependencies required to run the project.

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mahak30-gif/Smart-food-waste-predictor.git
```

### 2. Navigate into the project

```bash
cd Smart-food-waste-predictor
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Streamlit application

```bash
streamlit run app.py
```

### 5. Open the application

Streamlit will provide a local URL, typically:

```text
http://localhost:8501
```

---

## 🔄 How the Platform Works

### Step 1 — Donation

A food donor enters information about surplus food and posts a donation.

### Step 2 — Availability

The donation becomes visible to the volunteer rescue workflow.

### Step 3 — Matching

The platform presents a suitable NGO/volunteer match.

### Step 4 — Safety Check

The volunteer verifies the food's packaging, storage condition, contamination status, and pickup window.

### Step 5 — Pickup

The volunteer accepts the rescue task and collects the food.

### Step 6 — Transportation

The delivery status is updated to:

```text
Claimed → Food Picked Up → In Transit
```

### Step 7 — NGO Delivery

The food reaches the NGO and the volunteer marks the donation as delivered.

### Step 8 — Verification

The NGO confirms the delivery using a verification code.

### Step 9 — Impact

The platform displays the number of meals rescued and highlights the reduction of potential food waste.

---

## 💡 Why This Matters

Food waste is not only an environmental problem — it is also a coordination problem.

A restaurant may have perfectly edible surplus food, while an NGO nearby may need food. The challenge is connecting the two **quickly, safely, and efficiently**.

This platform addresses that gap by combining:

**Prediction + Donation + Matching + Transportation + Verification**

into one workflow.

---

## 🔮 Future Scope

The platform can be expanded into a complete intelligent food-rescue ecosystem.

### 🤖 Advanced ML Prediction

* Predict food demand before preparation
* Predict expected surplus
* Recommend optimal preparation quantities
* Continuously improve predictions using historical data

### 📍 Real-Time Smart Matching

* GPS-based donor/NGO matching
* Volunteer proximity detection
* Dynamic route optimization
* Priority matching for food close to expiry

### 📱 Mobile Application

Develop dedicated Android/iOS applications for:

* Donors
* Volunteers
* NGOs

### 🗺️ Live Tracking

* Real-time volunteer location
* Delivery tracking
* Estimated arrival time
* Route optimization

### 🛡️ Food Safety

Future versions can include:

* Automated expiry alerts
* Food-quality scoring
* Image-based food inspection
* Temperature monitoring through IoT sensors

### 📊 Analytics Dashboard

Organizations could monitor:

* Total food rescued
* Food waste avoided
* Number of successful donations
* Volunteer contribution
* NGO demand
* Monthly waste-reduction trends

### 🌱 Sustainability Metrics

The platform could estimate:

* Food waste avoided
* Meals rescued
* Potential landfill waste avoided
* Environmental impact
* Carbon footprint reduction

---

## 🎯 Vision

Our goal is to move from:

> **"Food is wasted because it wasn't needed."**

to:

> **"Food was predicted, rescued, and delivered where it was needed."**

By combining data-driven prediction with real-world food redistribution, the platform aims to create a more **efficient, sustainable, and connected food ecosystem.** 🌱

---

## 👥 Team

**Team:** Food Rescue / Smart Food Waste Predictor

Built as a prototype focused on using technology to reduce food waste and improve surplus-food redistribution.

---

## 📜 License

This project is currently developed as a prototype/hackathon project.
