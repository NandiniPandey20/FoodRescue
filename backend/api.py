from flask import Flask, request, jsonify
from flask_cors import CORS

from database.database import (
    create_tables,
    add_donation,
    get_active_donation,
    get_all_donations,
    update_donation_status,
    assign_volunteer,
    confirm_delivery
)

app = Flask(__name__)
CORS(app)

create_tables()


# =========================================================
# CONVERT DATABASE ROW TO JSON
# =========================================================

def convert_donation(row):
    if not row:
        return None

    return {
        "id": row[0],
        "donor_name": row[1],
        "food_category": row[2],
        "quantity": row[3],
        "location": row[4],
        "pickup_window": row[5],
        "best_before": row[6],
        "food_details": row[7],
        "volunteer_name": row[8],
        "ngo_name": row[9],
        "status": row[10],
        "created_at": row[11],
        "claimed_at": row[12],
        "picked_up_at": row[13],
        "in_transit_at": row[14],
        "arrived_at": row[15],
        "completed_at": row[16],
        "delivered_at": row[17],
        "verification_code": row[18]
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "FoodRescue API is running"
    })


# =========================================================
# ACTIVE DONATION
# =========================================================

@app.route("/api/donation/active", methods=["GET"])
def active_donation():
    donation = get_active_donation()

    return jsonify({
        "donation": convert_donation(donation)
    })


# =========================================================
# CREATE DONATION
# =========================================================

@app.route("/api/donations", methods=["POST"])
def create_donation():

    data = request.get_json() or {}

    required_fields = [
        "donor_name",
        "food_category",
        "quantity",
        "location"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required"
            }), 400

    donation_id = add_donation(
        data["donor_name"],
        data["food_category"],
        data["quantity"],
        data["location"],
        data.get("pickup_window", ""),
        data.get("best_before", ""),
        data.get("food_details", "")
    )

    donation = get_active_donation()

    return jsonify({
        "message": "Donation created successfully",
        "donation": convert_donation(donation)
    }), 201


# =========================================================
# DONATION HISTORY
# =========================================================

@app.route("/api/donations/history", methods=["GET"])
def donation_history():

    donations = get_all_donations()

    return jsonify({
        "donations": [
            convert_donation(donation)
            for donation in donations
        ]
    })


# =========================================================
# NGO RECEIVED HISTORY
# =========================================================

@app.route("/api/ngo/history", methods=["GET"])
def ngo_history():

    donations = get_all_donations()

    completed_donations = [
        convert_donation(donation)
        for donation in donations
        if donation[10] == "Completed" and donation[9]
    ]

    grouped = {}

    for donation in completed_donations:

        ngo_name = donation["ngo_name"]

        if ngo_name not in grouped:
            grouped[ngo_name] = []

        grouped[ngo_name].append(donation)

    return jsonify({
        "history": grouped
    })


# =========================================================
# CLAIM DONATION
# =========================================================

@app.route(
    "/api/donation/<int:donation_id>/claim",
    methods=["POST"]
)
def claim_donation(donation_id):

    data = request.get_json() or {}

    volunteer_name = data.get(
        "volunteer_name",
        ""
    ).strip()

    if not volunteer_name:
        return jsonify({
            "error": "Volunteer name is required"
        }), 400

    assign_volunteer(
        donation_id,
        volunteer_name
    )

    donation = get_active_donation()

    if not donation:
        return jsonify({
            "error": "Donation could not be found"
        }), 404

    return jsonify({
        "message": "Donation claimed successfully",
        "donation": convert_donation(donation)
    }), 200


# =========================================================
# PICKUP
# =========================================================

@app.route(
    "/api/donation/<int:donation_id>/pickup",
    methods=["POST"]
)
def pickup_donation(donation_id):

    update_donation_status(
        donation_id,
        "Food Picked Up"
    )

    donation = get_active_donation()

    return jsonify({
        "message": "Food picked up successfully",
        "donation": convert_donation(donation)
    }), 200


# =========================================================
# START TRANSIT
# =========================================================

@app.route(
    "/api/donation/<int:donation_id>/transit",
    methods=["POST"]
)
def start_transit(donation_id):

    update_donation_status(
        donation_id,
        "In Transit"
    )

    donation = get_active_donation()

    return jsonify({
        "message": "Delivery started",
        "donation": convert_donation(donation)
    }), 200


# =========================================================
# MARK DELIVERED
# =========================================================

@app.route(
    "/api/donation/<int:donation_id>/deliver",
    methods=["POST"]
)
def mark_delivered(donation_id):

    update_donation_status(
        donation_id,
        "Delivered"
    )

    donation = get_active_donation()

    return jsonify({
        "message": "Donation delivered successfully",
        "donation": convert_donation(donation)
    }), 200


# =========================================================
# CONFIRM NGO DELIVERY
# =========================================================

@app.route(
    "/api/donation/<int:donation_id>/confirm",
    methods=["POST"]
)
def confirm_donation(donation_id):

    data = request.get_json() or {}

    ngo_name = data.get(
        "ngo_name",
        ""
    ).strip()

    verification_code = data.get(
        "verification_code",
        ""
    ).strip()

    if not ngo_name or not verification_code:
        return jsonify({
            "error": "NGO name and verification code are required"
        }), 400

    success = confirm_delivery(
        donation_id,
        ngo_name,
        verification_code
    )

    if success is False:
        return jsonify({
            "error": "Invalid verification code"
        }), 400

    return jsonify({
        "message": "Delivery confirmed successfully",
        "donation": {
            "id": donation_id,
            "ngo_name": ngo_name,
            "status": "Completed"
        }
    }), 200


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )

    