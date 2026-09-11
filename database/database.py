import sqlite3
import secrets
from datetime import datetime
from zoneinfo import ZoneInfo


DATABASE_NAME = "foodrescue.db"


# =========================================================
# IST TIME
# =========================================================

def current_ist_time():
    return datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).strftime("%Y-%m-%d %I:%M:%S %p")


# =========================================================
# DATABASE CONNECTION
# =========================================================

def create_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    return connection


# =========================================================
# GENERATE UNIQUE VERIFICATION CODE
# =========================================================

def generate_verification_code():

    connection = create_connection()
    cursor = connection.cursor()

    while True:

        code = str(
            secrets.randbelow(900000) + 100000
        )

        cursor.execute("""
            SELECT id
            FROM donations
            WHERE verification_code = ?
        """, (code,))

        existing = cursor.fetchone()

        if existing is None:
            break

    connection.close()

    return code


# =========================================================
# CREATE / UPDATE TABLES
# =========================================================

def create_tables():

    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS donations (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            donor_name TEXT NOT NULL,

            food_category TEXT NOT NULL,

            quantity INTEGER NOT NULL,

            location TEXT NOT NULL,

            pickup_window TEXT,

            best_before TEXT,

            food_details TEXT,

            volunteer_name TEXT,

            ngo_name TEXT,

            status TEXT DEFAULT 'Listed',

            created_at TEXT,

            claimed_at TEXT,

            picked_up_at TEXT,

            in_transit_at TEXT,

            arrived_at TEXT,

            completed_at TEXT,

            delivered_at TEXT,

            verification_code TEXT UNIQUE
        )
    """)

    # -----------------------------------------------------
    # CHECK EXISTING COLUMNS
    # -----------------------------------------------------

    cursor.execute("PRAGMA table_info(donations)")

    columns = [
        column[1]
        for column in cursor.fetchall()
    ]


    # -----------------------------------------------------
    # ADD MISSING COLUMNS TO OLD DATABASE
    # -----------------------------------------------------

    new_columns = {

        "volunteer_name":
            "ALTER TABLE donations ADD COLUMN volunteer_name TEXT",

        "ngo_name":
            "ALTER TABLE donations ADD COLUMN ngo_name TEXT",

        "created_at":
            "ALTER TABLE donations ADD COLUMN created_at TEXT",

        "claimed_at":
            "ALTER TABLE donations ADD COLUMN claimed_at TEXT",

        "picked_up_at":
            "ALTER TABLE donations ADD COLUMN picked_up_at TEXT",

        "in_transit_at":
            "ALTER TABLE donations ADD COLUMN in_transit_at TEXT",

        "arrived_at":
            "ALTER TABLE donations ADD COLUMN arrived_at TEXT",

        "completed_at":
            "ALTER TABLE donations ADD COLUMN completed_at TEXT",

        "delivered_at":
            "ALTER TABLE donations ADD COLUMN delivered_at TEXT",

        "verification_code":
            "ALTER TABLE donations ADD COLUMN verification_code TEXT"
    }


    for column_name, sql in new_columns.items():

        if column_name not in columns:

            cursor.execute(sql)


    connection.commit()


    # -----------------------------------------------------
    # GIVE OLD DONATIONS A VERIFICATION CODE
    # -----------------------------------------------------

    cursor.execute("""
        SELECT id
        FROM donations
        WHERE verification_code IS NULL
    """)

    old_donations = cursor.fetchall()

    for row in old_donations:

        donation_id = row[0]

        code = generate_verification_code()

        cursor.execute("""
            UPDATE donations
            SET verification_code = ?
            WHERE id = ?
        """, (
            code,
            donation_id
        ))


    connection.commit()
    connection.close()


# =========================================================
# ADD DONATION
# =========================================================

def add_donation(
    donor_name,
    food_category,
    quantity,
    location,
    pickup_window,
    best_before,
    food_details
):

    connection = create_connection()
    cursor = connection.cursor()

    verification_code = generate_verification_code()

    created_time = current_ist_time()

    cursor.execute("""
        INSERT INTO donations (

            donor_name,
            food_category,
            quantity,
            location,
            pickup_window,
            best_before,
            food_details,
            status,
            created_at,
            verification_code

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    """, (

        donor_name,
        food_category,
        quantity,
        location,
        pickup_window,
        best_before,
        food_details,
        "Listed",
        created_time,
        verification_code

    ))

    donation_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return donation_id


# =========================================================
# GET LATEST DONATION
# =========================================================

def get_latest_donation():

    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT

            id,
            donor_name,
            food_category,
            quantity,
            location,
            pickup_window,
            best_before,
            food_details,
            volunteer_name,
            ngo_name,
            status,
            created_at,
            claimed_at,
            picked_up_at,
            in_transit_at,
            arrived_at,
            completed_at,
            delivered_at,
            verification_code

        FROM donations

        ORDER BY id DESC

        LIMIT 1
    """)

    donation = cursor.fetchone()

    connection.close()

    return donation


# =========================================================
# GET ACTIVE DONATION
# =========================================================

def get_active_donation():

    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT

            id,
            donor_name,
            food_category,
            quantity,
            location,
            pickup_window,
            best_before,
            food_details,
            volunteer_name,
            ngo_name,
            status,
            created_at,
            claimed_at,
            picked_up_at,
            in_transit_at,
            arrived_at,
            completed_at,
            delivered_at,
            verification_code

        FROM donations

        WHERE status != 'Completed'

        ORDER BY id DESC

        LIMIT 1
    """)

    donation = cursor.fetchone()

    connection.close()

    return donation


# =========================================================
# GET ALL DONATIONS
# =========================================================

def get_all_donations():

    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT

            id,
            donor_name,
            food_category,
            quantity,
            location,
            pickup_window,
            best_before,
            food_details,
            volunteer_name,
            ngo_name,
            status,
            created_at,
            claimed_at,
            picked_up_at,
            in_transit_at,
            arrived_at,
            completed_at,
            delivered_at,
            verification_code

        FROM donations

        ORDER BY id DESC
    """)

    donations = cursor.fetchall()

    connection.close()

    return donations


# =========================================================
# UPDATE DONATION STATUS
# =========================================================

def update_donation_status(
    donation_id,
    status
):

    connection = create_connection()
    cursor = connection.cursor()

    timestamp = current_ist_time()

    if status == "Claimed":

        cursor.execute("""
            UPDATE donations

            SET
                status = ?,
                claimed_at = ?

            WHERE id = ?
        """, (
            status,
            timestamp,
            donation_id
        ))


    elif status == "Food Picked Up":

        cursor.execute("""
            UPDATE donations

            SET
                status = ?,
                picked_up_at = ?

            WHERE id = ?
        """, (
            status,
            timestamp,
            donation_id
        ))


    elif status == "In Transit":

        cursor.execute("""
            UPDATE donations

            SET
                status = ?,
                in_transit_at = ?

            WHERE id = ?
        """, (
            status,
            timestamp,
            donation_id
        ))


    elif status == "Delivered":

        cursor.execute("""
            UPDATE donations

            SET
                status = ?,
                arrived_at = ?

            WHERE id = ?
        """, (
            status,
            timestamp,
            donation_id
        ))


    else:

        cursor.execute("""
            UPDATE donations

            SET status = ?

            WHERE id = ?
        """, (
            status,
            donation_id
        ))


    connection.commit()
    connection.close()


# =========================================================
# ASSIGN VOLUNTEER
# =========================================================

def assign_volunteer(
    donation_id,
    volunteer_name
):

    connection = create_connection()
    cursor = connection.cursor()

    timestamp = current_ist_time()

    cursor.execute("""
        UPDATE donations

        SET
            volunteer_name = ?,
            status = 'Claimed',
            claimed_at = ?

        WHERE id = ?

    """, (
        volunteer_name,
        timestamp,
        donation_id
    ))

    connection.commit()
    connection.close()


# =========================================================
# CONFIRM NGO DELIVERY
# =========================================================

def confirm_delivery(
    donation_id,
    ngo_name,
    verification_code
):

    connection = create_connection()
    cursor = connection.cursor()

    # -----------------------------------------------------
    # CHECK CODE
    # -----------------------------------------------------

    cursor.execute("""
        SELECT verification_code

        FROM donations

        WHERE id = ?

    """, (
        donation_id,
    ))

    result = cursor.fetchone()

    if result is None:

        connection.close()

        return False


    stored_code = result[0]


    # -----------------------------------------------------
    # VERIFY
    # -----------------------------------------------------

    if str(verification_code).strip() != str(stored_code).strip():

        connection.close()

        return False


    # -----------------------------------------------------
    # COMPLETE DELIVERY
    # -----------------------------------------------------

    timestamp = current_ist_time()

    cursor.execute("""
        UPDATE donations

        SET
            ngo_name = ?,
            status = 'Completed',
            completed_at = ?,
            delivered_at = ?

        WHERE id = ?

    """, (
        ngo_name,
        timestamp,
        timestamp,
        donation_id
    ))

    connection.commit()
    connection.close()

    return True


# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":

    create_tables()

    print(
        "FoodRescue database created successfully!"
    )