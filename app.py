import streamlit as st
import pandas as pd

from database.database import (
    create_tables,
    add_donation,
    get_latest_donation,
    get_active_donation,
    get_all_donations,
    update_donation_status,
    assign_volunteer,
    confirm_delivery
)


# =========================================================
# DATABASE SETUP
# =========================================================

create_tables()


# =========================================================
# PAGE CONFIG
# =========================================================

st.set_page_config(
    page_title="Food Rescue Platform",
    page_icon="🍱",
    layout="wide"
)


# =========================================================
# HELPERS
# =========================================================

def convert_database_donation(row):

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


def load_latest_donation():
    row = get_latest_donation()
    return convert_database_donation(row)


def load_active_donation():
    row = get_active_donation()
    return convert_database_donation(row)


def load_donation_history():

    rows = get_all_donations()

    if not rows:
        return []

    return [
        convert_database_donation(row)
        for row in rows
    ]


def display_timeline(donation):

    st.subheader("📍 Rescue Timeline")

    timeline = [
        ("Donation Created", donation["created_at"]),
        ("Volunteer Accepted", donation["claimed_at"]),
        ("Food Picked Up", donation["picked_up_at"]),
        ("Food In Transit", donation["in_transit_at"]),
        ("Arrived at NGO", donation["arrived_at"]),
        ("NGO Confirmed Delivery", donation["completed_at"])
    ]

    for title, timestamp in timeline:

        if timestamp:

            st.success(
                f"✓ **{title}**  \n"
                f"{timestamp}"
            )

        else:

            st.info(
                f"○ **{title}**  \n"
                "Waiting..."
            )


# =========================================================
# SESSION STATE
# =========================================================

if "donation" not in st.session_state:
    st.session_state.donation = load_active_donation()

if "donation_history" not in st.session_state:
    st.session_state.donation_history = load_donation_history()


# =========================================================
# SIDEBAR ROLE SELECTION
# =========================================================

st.sidebar.title("👤 Select Your Role")

role_from_url = st.query_params.get("role", "")

role_options = [
    "👨‍🍳 Food Donor",
    "🚴 Volunteer Courier",
    "🏠 NGO Dashboard"
]

if role_from_url == "donor":

    default_role = "👨‍🍳 Food Donor"

elif role_from_url == "courier":

    default_role = "🚴 Volunteer Courier"

elif role_from_url == "ngo":

    default_role = "🏠 NGO Dashboard"

else:

    default_role = "👨‍🍳 Food Donor"


role = st.sidebar.radio(
    "Choose one:",
    role_options,
    index=role_options.index(default_role)
)


# =========================================================
# FOOD DONOR
# =========================================================

if role == "👨‍🍳 Food Donor":

    st.title("🍱 Food Donor")

    st.write(
        "List your surplus food and help move it to people who need it."
    )

    active_donation = load_active_donation()

    # -----------------------------------------------------
    # ACTIVE DONATION
    # -----------------------------------------------------

    if active_donation:

        st.success(
            f"Active Donation #{active_donation['id']} — "
            f"{active_donation['status']}"
        )

        col1, col2 = st.columns(2)

        with col1:

            st.write(
                f"**Donor:** {active_donation['donor_name']}"
            )

            st.write(
                f"**Food:** {active_donation['food_category']}"
            )

            st.write(
                f"**Quantity:** {active_donation['quantity']}"
            )

            st.write(
                f"**Location:** {active_donation['location']}"
            )

        with col2:

            st.write(
                f"**Pickup Window:** "
                f"{active_donation['pickup_window']}"
            )

            st.write(
                f"**Best Before:** "
                f"{active_donation['best_before']}"
            )

            st.write(
                f"**Volunteer:** "
                f"{active_donation['volunteer_name'] or 'Not assigned yet'}"
            )

            st.write(
                f"**NGO:** "
                f"{active_donation['ngo_name'] or 'Not assigned yet'}"
            )

        if active_donation["verification_code"]:

            st.warning(
                f"🔐 Verification Code: "
                f"**{active_donation['verification_code']}**"
            )

        display_timeline(active_donation)

    # -----------------------------------------------------
    # NEW DONATION
    # -----------------------------------------------------

    else:

        st.subheader("➕ Post a Food Donation")

        with st.form("donation_form"):

            donor_name = st.text_input(
                "Donor / Restaurant Name"
            )

            food_category = st.selectbox(
                "Food Category",
                [
                    "Cooked Meals",
                    "Bakery",
                    "Fruits & Vegetables",
                    "Packaged Food",
                    "Other"
                ]
            )

            quantity = st.number_input(
                "Quantity",
                min_value=1,
                step=1
            )

            pickup_window = st.text_input(
                "Pickup Window",
                placeholder="Example: 2 PM - 4 PM"
            )

            location = st.text_input(
                "Pickup Location"
            )

            best_before = st.text_input(
                "Best Before",
                placeholder="Example: Today 6 PM"
            )

            food_details = st.text_area(
                "Food Details"
            )

            photo = st.file_uploader(
                "Food Photo",
                type=["jpg", "jpeg", "png"]
            )

            submit = st.form_submit_button(
                "🚀 Post Donation"
            )

        if submit:

            if not donor_name or not location:

                st.error(
                    "Please enter the donor name and pickup location."
                )

            else:

                donation_id = add_donation(
                    donor_name,
                    food_category,
                    quantity,
                    location,
                    pickup_window,
                    best_before,
                    food_details
                )

                st.session_state.donation = load_active_donation()
                st.session_state.donation_history = load_donation_history()

                st.success(
                    f"🎉 Donation posted successfully! "
                    f"Donation ID: #{donation_id}"
                )

                if st.session_state.donation:

                    st.warning(
                        "🔐 Verification Code: "
                        f"**{st.session_state.donation['verification_code']}**"
                    )


    # -----------------------------------------------------
    # DONATION HISTORY
    # -----------------------------------------------------

    st.divider()

    st.subheader("📜 Donation History")

    history = load_donation_history()

    if history:

        for donation in history:

            with st.expander(
                f"Donation #{donation['id']} — "
                f"{donation['food_category']} — "
                f"{donation['status']}"
            ):

                st.write(
                    f"**Donor:** {donation['donor_name']}"
                )

                st.write(
                    f"**Quantity:** {donation['quantity']}"
                )

                st.write(
                    f"**Location:** {donation['location']}"
                )

                st.write(
                    f"**Status:** {donation['status']}"
                )

                display_timeline(donation)

    else:

        st.info("No donations yet.")


# =========================================================
# VOLUNTEER COURIER
# =========================================================

elif role == "🚴 Volunteer Courier":

    st.title("🚴 Volunteer Courier")

    st.write(
        "Accept food rescue tasks and safely deliver surplus food to NGOs."
    )

    donation = load_active_donation()

    if not donation:

        st.info(
            "📭 No active food donation is available right now."
        )

    else:

        st.subheader(
            f"🍱 Donation #{donation['id']}"
        )

        col1, col2 = st.columns(2)

        with col1:

            st.write(
                f"**Food:** {donation['food_category']}"
            )

            st.write(
                f"**Quantity:** {donation['quantity']}"
            )

            st.write(
                f"**Pickup Location:** {donation['location']}"
            )

        with col2:

            st.write(
                f"**Pickup Window:** "
                f"{donation['pickup_window']}"
            )

            st.write(
                f"**Best Before:** "
                f"{donation['best_before']}"
            )

            st.write(
                f"**Current Status:** "
                f"{donation['status']}"
            )

        st.divider()

        st.subheader("🧠 Smart Matching")

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(
                "Distance",
                "2.3 km"
            )

        with col2:
            st.metric(
                "NGO Match",
                "Available"
            )

        with col3:
            st.metric(
                "Route",
                "Optimized"
            )

        st.divider()

        st.subheader("🛡️ Food Safety Check")

        packaging = st.checkbox(
            "Packaging is intact"
        )

        storage = st.checkbox(
            "Food was properly stored"
        )

        contamination = st.checkbox(
            "No visible contamination"
        )

        pickup_window_check = st.checkbox(
            "Food is within pickup window"
        )

        volunteer_name = st.text_input(
            "Volunteer Name"
        )

        if donation["status"] == "Listed":

            if st.button(
                "🚴 Accept Pickup Task"
            ):

                if not volunteer_name:

                    st.error(
                        "Please enter your name."
                    )

                elif not all([
                    packaging,
                    storage,
                    contamination,
                    pickup_window_check
                ]):

                    st.error(
                        "Please complete all food safety checks."
                    )

                else:

                    assign_volunteer(
                        donation["id"],
                        volunteer_name
                    )

                    st.success(
                        "Pickup task accepted!"
                    )

                    st.rerun()

        elif donation["status"] == "Claimed":

            st.success(
                f"Volunteer: {donation['volunteer_name']}"
            )

            if st.button(
                "📦 Mark Food as Picked Up"
            ):

                update_donation_status(
                    donation["id"],
                    "Food Picked Up"
                )

                st.success(
                    "Food marked as picked up."
                )

                st.rerun()

        elif donation["status"] == "Food Picked Up":

            if st.button(
                "🚚 Start Delivery"
            ):

                update_donation_status(
                    donation["id"],
                    "In Transit"
                )

                st.success(
                    "Delivery is now in transit."
                )

                st.rerun()

        elif donation["status"] == "In Transit":

            if st.button(
                "🏠 Mark as Delivered"
            ):

                update_donation_status(
                    donation["id"],
                    "Delivered"
                )

                st.success(
                    "Food delivered to NGO."
                )

                st.rerun()

        elif donation["status"] == "Delivered":

            st.success(
                "✅ Delivery completed. Waiting for NGO confirmation."
            )

        elif donation["status"] == "Completed":

            st.success(
                "🎉 Donation successfully completed!"
            )

        st.divider()

        display_timeline(donation)


# =========================================================
# NGO DASHBOARD
# =========================================================

elif role == "🏠 NGO Dashboard":

    st.title("🏠 NGO Dashboard")

    st.write(
        "Receive rescued food, track deliveries, and confirm distribution."
    )

    # -----------------------------------------------------
    # IMPACT METRICS
    # -----------------------------------------------------

    history = load_donation_history()

    completed_donations = [
        donation
        for donation in history
        if donation["status"] == "Completed"
    ]

    total_meals = sum(
        int(donation["quantity"])
        for donation in completed_donations
    )

    active_volunteers = len([
        donation
        for donation in history
        if donation["volunteer_name"]
    ])

    ngo_partners = 8

    col1, col2, col3 = st.columns(3)

    with col1:

        st.metric(
            "🍽️ Meals Rescued",
            total_meals
        )

    with col2:

        st.metric(
            "🚴 Active Volunteers",
            active_volunteers
        )

    with col3:

        st.metric(
            "🏠 NGO Partners",
            ngo_partners
        )

    st.divider()

    # -----------------------------------------------------
    # ACTIVE DONATION
    # -----------------------------------------------------

    donation = load_active_donation()

    if donation:

        st.subheader(
            "📥 Incoming Donation"
        )

        col1, col2 = st.columns(2)

        with col1:

            st.write(
                f"**Food:** {donation['food_category']}"
            )

            st.write(
                f"**Quantity:** {donation['quantity']}"
            )

            st.write(
                f"**Pickup Location:** {donation['location']}"
            )

        with col2:

            st.write(
                f"**Volunteer:** "
                f"{donation['volunteer_name'] or 'Not assigned'}"
            )

            st.write(
                f"**Status:** {donation['status']}"
            )

            st.write(
                f"**Pickup Window:** "
                f"{donation['pickup_window']}"
            )

        st.divider()

        st.subheader(
            "🚚 Delivery Tracking"
        )

        if donation["status"] == "Listed":

            st.info(
                "Waiting for a volunteer to accept the donation."
            )

        elif donation["status"] == "Claimed":

            st.info(
                "Volunteer has accepted the donation."
            )

        elif donation["status"] == "Food Picked Up":

            st.info(
                "Food has been picked up by the volunteer."
            )

        elif donation["status"] == "In Transit":

            st.warning(
                "🚚 Food is currently in transit."
            )

        elif donation["status"] == "Delivered":

            st.success(
                "📦 Food has arrived at the NGO."
            )

            st.subheader(
                "✅ Confirm Delivery"
            )

            ngo_name = st.text_input(
                "NGO / Community Name"
            )

            verification_code = st.text_input(
                "Verification Code"
            )

            if st.button(
                "✅ Confirm Food Delivery"
            ):

                if not ngo_name or not verification_code:

                    st.error(
                        "Please enter the NGO name and verification code."
                    )

                else:

                    success = confirm_delivery(
                        donation["id"],
                        ngo_name,
                        verification_code
                    )

                    if success:

                        st.success(
                            "🎉 Delivery confirmed successfully!"
                        )

                        st.balloons()

                        st.rerun()

                    else:

                        st.error(
                            "❌ Incorrect verification code."
                        )

        elif donation["status"] == "Completed":

            st.success(
                "🎉 Donation has been successfully completed."
            )

        st.divider()

        display_timeline(donation)

    else:

        st.info(
            "📭 No active donations at the moment."
        )

    # -----------------------------------------------------
    # DELIVERY HISTORY
    # -----------------------------------------------------

    st.divider()

    st.subheader(
        "📜 Delivery History"
    )

    if completed_donations:

        for donation in completed_donations:

            with st.expander(
                f"Donation #{donation['id']} — "
                f"{donation['food_category']}"
            ):

                st.write(
                    f"**Quantity:** {donation['quantity']}"
                )

                st.write(
                    f"**NGO:** {donation['ngo_name']}"
                )

                st.write(
                    f"**Volunteer:** {donation['volunteer_name']}"
                )

                st.write(
                    f"**Status:** {donation['status']}"
                )

    else:

        st.info(
            "No completed deliveries yet."
        )