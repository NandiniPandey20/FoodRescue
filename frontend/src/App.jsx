import { useEffect, useState } from "react";
import "./App.css";

const API = "https://foodrescue-omz7.onrender.com";

function App() {
  const [page, setPage] = useState("home");
  const [donation, setDonation] = useState(null);
  const [message, setMessage] = useState("");

  const loadDonation = async () => {
    try {
      const response = await fetch(`${API}/api/donation/active`);
      const data = await response.json();
      setDonation(data.donation);
    } catch (error) {
      setMessage("Unable to connect to FoodRescue server.");
    }
  };

  useEffect(() => {
    if (page !== "home") {
      loadDonation();
    }
  }, [page]);

  const goHome = () => {
    setPage("home");
    setMessage("");
  };

  const goToRole = (role) => {
    setMessage("");
    setPage(role);
  };

  const updateDonation = (newDonation) => {
    setDonation(newDonation);
    setMessage("");
  };

  return (
    <div className="app">
      <Navbar onHome={goHome} />

      {page === "home" && <Home onRole={goToRole} />}

      {page === "donor" && (
        <DonorDashboard
          donation={donation}
          setDonation={updateDonation}
          message={message}
          setMessage={setMessage}
        />
      )}

      {page === "courier" && (
        <CourierDashboard
          donation={donation}
          setDonation={updateDonation}
          message={message}
          setMessage={setMessage}
        />
      )}

      {page === "ngo" && (
        <NgoDashboard
          donation={donation}
          setDonation={updateDonation}
          message={message}
          setMessage={setMessage}
        />
      )}

      <Footer />
    </div>
  );
}

/* =========================
   NAVBAR
========================= */

function Navbar({ onHome }) {
  return (
    <nav className="navbar">
      <button className="logo-button" onClick={onHome}>
        <span className="logo-mark">🍃</span>
        <span>FoodRescue</span>
      </button>

      <button className="nav-home" onClick={onHome}>
        Home
      </button>
    </nav>
  );
}

/* =========================
   HOME
========================= */

function Home({ onRole }) {
  return (
    <>
      <section className="hero">
        <div className="hero-badge">♻️ Rescue food. Feed people.</div>

        <h1>
          Turn surplus food
          <br />
          into <span className="green-text">meals.</span>
        </h1>

        <p>
          FoodRescue connects food donors, volunteer couriers and NGOs to make
          sure good food reaches people instead of going to waste.
        </p>

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">🍱</div>
            <h3>24K+</h3>
            <p>Meals rescued</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <h3>180+</h3>
            <p>Active volunteers</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <h3>8+</h3>
            <p>NGO partners</p>
          </div>
        </div>
      </section>

      <section className="role-section">
        <h2>How would you like to help?</h2>

        <p>Choose your role and start making an impact.</p>

        <div className="role-grid">
          <RoleCard
            icon="🍽️"
            title="Food Donor"
            text="Have surplus food? List it and help someone who needs it."
            button="Donate food"
            color="green"
            onClick={() => onRole("donor")}
          />

          <RoleCard
            icon="🚴"
            title="Volunteer Courier"
            text="Pick up available donations and deliver them safely."
            button="Deliver food"
            color="orange"
            onClick={() => onRole("courier")}
          />

          <RoleCard
            icon="🏠"
            title="NGO Partner"
            text="Receive incoming donations and confirm deliveries."
            button="Open dashboard"
            color="purple"
            onClick={() => onRole("ngo")}
          />
        </div>
      </section>
    </>
  );
}

function RoleCard({ icon, title, text, button, color, onClick }) {
  return (
    <div className={`role-card role-${color}`}>
      <div className="role-top">
        <div className="role-icon">{icon}</div>
        <span className="role-arrow">↗</span>
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <button className="big-action-button" onClick={onClick}>
        {button}
        <span>→</span>
      </button>
    </div>
  );
}

/* =========================
   DONOR DASHBOARD
========================= */

function DonorDashboard({
  donation,
  setDonation,
  message,
  setMessage
}) {
  const [showForm, setShowForm] = useState(!donation);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const [form, setForm] = useState({
    donor_name: "",
    food_category: "Cooked Meals",
    quantity: "",
    location: "",
    pickup_window: "",
    best_before: "",
    food_details: ""
  });

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API}/api/donations/history`);
      const data = await response.json();
      setHistory(data.donations || []);
    } catch (error) {
      console.error("Could not load donation history:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (donation) {
      setShowForm(false);
    }
  }, [donation]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitDonation = async (e) => {
    e.preventDefault();

    if (!form.donor_name || !form.quantity || !form.location) {
      setMessage("Please complete the required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not create donation.");
        return;
      }

      setDonation(data.donation);
      setShowForm(false);

      setMessage("Donation listed successfully! 🎉");

      await loadHistory();

      setForm({
        donor_name: "",
        food_category: "Cooked Meals",
        quantity: "",
        location: "",
        pickup_window: "",
        best_before: "",
        food_details: ""
      });
    } catch (error) {
      setMessage("Could not connect to the FoodRescue server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <DashboardHeading
        eyebrow="FOOD DONOR"
        title="Save food from going to waste."
        description="List your surplus food and we'll help connect it with a nearby delivery volunteer and NGO."
        icon="🍽️"
      />

      {message && <div className="message">{message}</div>}

      {!donation && !showForm && (
        <EmptyState
          icon="🍱"
          title="No active donation"
          text="You don't have a donation waiting for pickup."
          button="List surplus food"
          onClick={() => setShowForm(true)}
        />
      )}

      {showForm && (
        <div className="dashboard-grid">
          <div className="card form-card">
            <div className="card-heading">
              <div>
                <span className="section-kicker">NEW DONATION</span>

                <h2>Tell us about the food</h2>

                <p>
                  A few details help volunteers and NGOs prepare for pickup.
                </p>
              </div>

              <div className="card-icon green-icon">🍱</div>
            </div>

            <form onSubmit={submitDonation}>
              <div className="form-grid">
                <Input
                  label="Your name / organisation"
                  name="donor_name"
                  value={form.donor_name}
                  onChange={handleChange}
                  placeholder="e.g. Sharma Restaurant"
                  required
                />

                <div className="form-group">
                  <label>Food category</label>

                  <select
                    name="food_category"
                    value={form.food_category}
                    onChange={handleChange}
                  >
                    <option>Cooked Meals</option>
                    <option>Bakery Items</option>
                    <option>Fruits & Vegetables</option>
                    <option>Packaged Food</option>
                    <option>Other</option>
                  </select>
                </div>

                <Input
                  label="Quantity"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 30 meals"
                  required
                />

                <Input
                  label="Pickup location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Sector 14, Gurugram"
                  required
                />

                <Input
                  label="Pickup window"
                  name="pickup_window"
                  value={form.pickup_window}
                  onChange={handleChange}
                  placeholder="e.g. 6 PM – 7 PM"
                />

                <Input
                  label="Best before"
                  name="best_before"
                  value={form.best_before}
                  onChange={handleChange}
                  placeholder="e.g. Today, 9 PM"
                />

                <div className="form-group full">
                  <label>Food details</label>

                  <textarea
                    name="food_details"
                    value={form.food_details}
                    onChange={handleChange}
                    placeholder="Tell us anything useful about the food..."
                  />
                </div>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Listing donation..." : "List this food →"}
              </button>
            </form>
          </div>

          <div className="side-stack">
            <div className="impact-card">
              <div className="impact-icon">💚</div>

              <span>YOUR IMPACT</span>

              <h3>Every meal matters.</h3>

              <p>
                Your surplus can become someone's next meal instead of ending
                up in a landfill.
              </p>
            </div>

            <div className="card mini-card">
              <span className="section-kicker">WHAT HAPPENS NEXT</span>

              <Step number="01" text="Your donation is listed" />
              <Step number="02" text="A courier claims the pickup" />
              <Step number="03" text="Food reaches an NGO" />
            </div>
          </div>
        </div>
      )}

      {donation && !showForm && (
        <DonorActiveDonation
          donation={donation}
          onNew={() => setShowForm(true)}
        />
      )}

      <DonorHistory history={history} />
    </main>
  );
}

/* =========================
   DONOR ACTIVE DONATION
========================= */

function DonorActiveDonation({ donation, onNew }) {
  return (
    <>
      <div className="success-banner">
        <div className="success-symbol">✓</div>

        <div>
          <strong>Your donation is live!</strong>

          <p>
            FoodRescue is waiting for a volunteer to claim this pickup.
          </p>
        </div>

        <span className="status-badge">{donation.status}</span>
      </div>

      <div
        className="card"
        style={{
          marginBottom: "24px",
          textAlign: "center"
        }}
      >
        <span className="section-kicker">NGO VERIFICATION CODE</span>

        <h2>Share this code with the NGO</h2>

        <p>
          The NGO will enter this code after receiving the food to confirm the
          delivery.
        </p>

        <div
          style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "8px",
            margin: "20px 0",
            padding: "18px",
            borderRadius: "14px",
            background: "#f1f8f3"
          }}
        >
          {donation.verification_code}
        </div>

        <p>
          Keep this code safe until the food has been successfully delivered.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="card donation-main-card">
          <div className="card-heading">
            <div>
              <span className="section-kicker">ACTIVE DONATION</span>

              <h2>{donation.food_category}</h2>
            </div>

            <div className="food-big-icon">🍱</div>
          </div>

          <div className="big-quantity">{donation.quantity}</div>

          <p className="quantity-label">Food available to rescue</p>

          <div className="info-grid">
            <InfoBox
              icon="📍"
              title="Pickup location"
              value={donation.location}
            />

            <InfoBox
              icon="🕐"
              title="Pickup window"
              value={donation.pickup_window || "Flexible"}
            />

            <InfoBox
              icon="⏳"
              title="Best before"
              value={donation.best_before || "Not specified"}
            />

            <InfoBox
              icon="🚴"
              title="Volunteer"
              value={donation.volunteer_name || "Waiting for pickup"}
            />
          </div>
        </div>

        <div className="card">
          <span className="section-kicker">RESCUE PROGRESS</span>

          <h2 className="timeline-title">Track your food</h2>

          <Timeline status={donation.status} />
        </div>
      </div>

      <button className="outline-wide-button" onClick={onNew}>
        + List another donation
      </button>
    </>
  );
}

/* =========================
   DONOR HISTORY
========================= */

function DonorHistory({ history }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDonation = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section style={{ marginTop: "40px" }}>
      <div className="card">
        <span className="section-kicker">DONATION HISTORY</span>

        <h2>Food you've donated</h2>

        <p>
          Click a donation to view its complete rescue details.
        </p>

        {history.length === 0 ? (
          <div style={{ marginTop: "20px" }}>
            <EmptyState
              icon="📜"
              title="No donation history yet"
              text="Your previous food donations will appear here."
            />
          </div>
        ) : (
          <div style={{ marginTop: "24px" }}>
            {history.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <DonationHistoryCard
                  key={item.id}
                  donation={item}
                  expanded={isExpanded}
                  onClick={() => toggleDonation(item.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================
   DONATION HISTORY CARD
========================= */

function DonationHistoryCard({
  donation,
  expanded,
  onClick
}) {
  const isNotRescued =
    donation.status === "Not Rescued" ||
    donation.status === "Expired";

  const isCompleted =
    donation.status === "Completed" ||
    donation.status === "Delivered";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        marginBottom: "14px",
        overflow: "hidden",
        background: "#ffffff"
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#f1f8f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}
          >
            🍱
          </div>

          <div>
            <strong
              style={{
                display: "block",
                fontSize: "17px",
                marginBottom: "4px"
              }}
            >
              {donation.donor_name}
            </strong>

            <span
              style={{
                fontSize: "13px",
                color: "#777"
              }}
            >
              {donation.food_category}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}
        >
          <HistoryStatus
            status={donation.status}
            completed={isCompleted}
            notRescued={isNotRescued}
          />

          <span
            style={{
              fontSize: "20px",
              color: "#666"
            }}
          >
            {expanded ? "⌃" : "⌄"}
          </span>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            borderTop: "1px solid #eeeeee",
            padding: "20px"
          }}
        >
          <div className="info-grid">
            <InfoBox
              icon="🍱"
              title="Food type"
              value={donation.food_category}
            />

            <InfoBox
              icon="📦"
              title="Quantity"
              value={donation.quantity}
            />

            <InfoBox
              icon="📍"
              title="Donor location"
              value={donation.location}
            />

            <InfoBox
              icon="🕐"
              title="Pickup window"
              value={donation.pickup_window || "Not specified"}
            />

            <InfoBox
              icon="⏳"
              title="Best before"
              value={donation.best_before || "Not specified"}
            />

            <InfoBox
              icon="🚴"
              title="Volunteer"
              value={donation.volunteer_name || "No volunteer assigned"}
            />

            {donation.ngo_name && (
              <InfoBox
                icon="🏠"
                title="Received by"
                value={donation.ngo_name}
              />
            )}

            <InfoBox
              icon="📊"
              title="Status"
              value={donation.status}
            />
          </div>

          {isNotRescued && (
            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "12px",
                background: "#fff7ed",
                border: "1px solid #fed7aa"
              }}
            >
              <strong>⚠️ Donation not rescued</strong>

              <p
                style={{
                  margin: "7px 0 0",
                  lineHeight: "1.5"
                }}
              >
                No volunteer accepted the donation before the best-before
                time. The food could not be safely rescued and was wasted.
              </p>
            </div>
          )}

          {isCompleted && (
            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "12px",
                background: "#f1f8f3"
              }}
            >
              <strong>✓ Food successfully rescued</strong>

              <p
                style={{
                  margin: "7px 0 0",
                  lineHeight: "1.5"
                }}
              >
                The donation reached the receiving NGO successfully.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================
   HISTORY STATUS
========================= */

function HistoryStatus({
  status,
  completed,
  notRescued
}) {
  let background = "#f3f4f6";
  let color = "#555";
  let text = status;

  if (completed) {
    background = "#e8f5ec";
    color = "#287a45";
    text = "✓ Delivered";
  } else if (notRescued) {
    background = "#fff1e6";
    color = "#c45d20";
    text = "⚠ Not Rescued";
  } else if (status === "Listed") {
    background = "#eef5ff";
    color = "#3867a8";
    text = "Awaiting Volunteer";
  }

  return (
    <span
      style={{
        padding: "6px 11px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap"
      }}
    >
      {text}
    </span>
  );
}

/* =========================
   COURIER DASHBOARD
========================= */

function CourierDashboard({
  donation,
  setDonation,
  message,
  setMessage
}) {
  const [name, setName] = useState("");
  const [checks, setChecks] = useState({
    safe: false,
    sealed: false
  });
  const [loading, setLoading] = useState(false);

  const callAction = async (endpoint, body = {}) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Action could not be completed.");
        return;
      }

      setDonation(data.donation);
      setMessage(data.message);
    } catch (error) {
      setMessage("Unable to connect to FoodRescue server.");
    } finally {
      setLoading(false);
    }
  };

  const claim = () => {
    if (!name) {
      setMessage("Please enter your name first.");
      return;
    }

    if (!checks.safe || !checks.sealed) {
      setMessage("Please complete the food safety checks.");
      return;
    }

    callAction(`/api/donation/${donation.id}/claim`, {
      volunteer_name: name
    });
  };

  return (
    <main className="dashboard">
      <DashboardHeading
        eyebrow="VOLUNTEER COURIER"
        title="Help food reach the right place."
        description="Claim a nearby donation, pick it up and deliver it safely to an NGO."
        icon="🚴"
      />

      {message && <div className="message">{message}</div>}

      {!donation && (
        <EmptyState
          icon="🌱"
          title="No pickup available right now"
          text="New food donations will appear here when they are ready for pickup."
        />
      )}

      {donation && (
        <>
          <div className="match-card featured-match">
            <div className="match-header">
              <div>
                <span className="match-label">SMART MATCH</span>

                <h2>A donation needs you 🚴</h2>

                <p>
                  We've found a nearby food rescue opportunity.
                </p>
              </div>

              <div className="match-score">
                <strong>2.3</strong>

                <span>km away</span>
              </div>
            </div>

            <div className="match-items">
              <div className="match-item">
                <span>📍 PICKUP</span>

                <strong>{donation.location}</strong>
              </div>

              <div className="match-item">
                <span>🍱 FOOD</span>

                <strong>{donation.quantity}</strong>
              </div>

              <div className="match-item">
                <span>🕐 WINDOW</span>

                <strong>
                  {donation.pickup_window || "Flexible"}
                </strong>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card courier-action-card">
              <div className="card-heading">
                <div>
                  <span className="section-kicker">PICKUP TASK</span>

                  <h2>{donation.food_category}</h2>

                  <p>
                    {donation.food_details ||
                      "Surplus food ready for rescue."}
                  </p>
                </div>

                <div className="food-big-icon">📦</div>
              </div>

              <div className="courier-status-box">
                <span>Current status</span>

                <strong>{donation.status}</strong>
              </div>

              {donation.status === "Listed" && (
                <>
                  <div className="form-group courier-name">
                    <label>Your name</label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="check-list">
                    <label className="check-item">
                      <input
                        type="checkbox"
                        checked={checks.safe}
                        onChange={(e) =>
                          setChecks({
                            ...checks,
                            safe: e.target.checked
                          })
                        }
                      />

                      <span>
                        I confirm the food appears safe to transport.
                      </span>
                    </label>

                    <label className="check-item">
                      <input
                        type="checkbox"
                        checked={checks.sealed}
                        onChange={(e) =>
                          setChecks({
                            ...checks,
                            sealed: e.target.checked
                          })
                        }
                      />

                      <span>
                        I confirm the food is properly packed.
                      </span>
                    </label>
                  </div>

                  <button
                    className="submit-button"
                    onClick={claim}
                    disabled={loading}
                  >
                    {loading ? "Claiming..." : "Claim this pickup →"}
                  </button>
                </>
              )}

              {donation.status === "Claimed" && (
                <ActionButton
                  icon="📦"
                  title="Food ready for pickup"
                  text="I've collected the food from the donor."
                  button="Mark as picked up"
                  onClick={() =>
                    callAction(
                      `/api/donation/${donation.id}/pickup`
                    )
                  }
                  disabled={loading}
                />
              )}

              {donation.status === "Food Picked Up" && (
                <ActionButton
                  icon="🛵"
                  title="Ready to deliver"
                  text="Start the delivery journey to the NGO."
                  button="Start delivery"
                  onClick={() =>
                    callAction(
                      `/api/donation/${donation.id}/transit`
                    )
                  }
                  disabled={loading}
                />
              )}

              {donation.status === "In Transit" && (
                <ActionButton
                  icon="🏠"
                  title="Almost there!"
                  text="Mark the donation as delivered when you reach the NGO."
                  button="Mark as delivered"
                  onClick={() =>
                    callAction(
                      `/api/donation/${donation.id}/deliver`
                    )
                  }
                  disabled={loading}
                />
              )}

              {donation.status === "Delivered" && (
                <div className="completed-box">
                  <div>✓</div>

                  <strong>Delivery completed</strong>

                  <p>
                    The NGO can now confirm the donation.
                  </p>
                </div>
              )}
            </div>

            <div className="card">
              <span className="section-kicker">DELIVERY JOURNEY</span>

              <h2 className="timeline-title">Pickup → NGO</h2>

              <Timeline status={donation.status} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

/* =========================
   NGO DASHBOARD
========================= */

function NgoDashboard({
  donation,
  setDonation,
  message,
  setMessage
}) {
  const [ngoName, setNgoName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ngoHistory, setNgoHistory] = useState({});

  const loadNgoHistory = async () => {
    try {
      const response = await fetch(`${API}/api/ngo/history`);
      const data = await response.json();

      setNgoHistory(data.history || {});
    } catch (error) {
      console.error("Could not load NGO history:", error);
    }
  };

  useEffect(() => {
    loadNgoHistory();
  }, []);

  const confirmDelivery = async () => {
    if (!ngoName || !code) {
      setMessage(
        "Please enter your NGO name and verification code."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/api/donation/${donation.id}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ngo_name: ngoName,
            verification_code: code
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Verification failed.");
        return;
      }

      setDonation(null);
      setCode("");

      setMessage("Delivery confirmed successfully! 💚");

      await loadNgoHistory();
    } catch (error) {
      setMessage("Unable to connect to FoodRescue server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <DashboardHeading
        eyebrow="NGO DASHBOARD"
        title="Food is on its way."
        description="Manage incoming donations, track deliveries and confirm successful rescues."
        icon="🏠"
      />

      {message && <div className="message">{message}</div>}

      <div className="metrics">
        <Metric
          icon="🍱"
          number={donation ? "1" : "0"}
          label="Incoming donation"
        />

        <Metric
          icon="❤️"
          number="24K+"
          label="Meals rescued"
        />

        <Metric
          icon="🚴"
          number="8"
          label="Active volunteers"
        />
      </div>

      {!donation && (
        <EmptyState
          icon="📭"
          title="No incoming donations"
          text="When a courier delivers food, the donation will appear here."
        />
      )}

      {donation && (
        <div className="dashboard-grid">
          <div className="card incoming-card">
            <div className="card-heading">
              <div>
                <span className="section-kicker">
                  INCOMING DONATION
                </span>

                <h2>{donation.food_category}</h2>

                <p>Donation #{donation.id}</p>
              </div>

              <div className="food-big-icon">🍱</div>
            </div>

            <div className="ngo-food-number">
              {donation.quantity}
            </div>

            <p className="quantity-label">
              Food being rescued
            </p>

            <div className="info-grid">
              <InfoBox
                icon="👨‍🍳"
                title="Donor"
                value={donation.donor_name}
              />

              <InfoBox
                icon="🚴"
                title="Volunteer"
                value={
                  donation.volunteer_name ||
                  "Assigned volunteer"
                }
              />

              <InfoBox
                icon="📍"
                title="Pickup location"
                value={donation.location}
              />

              <InfoBox
                icon="🕐"
                title="Best before"
                value={
                  donation.best_before ||
                  "Not specified"
                }
              />
            </div>

            <div className="arrival-banner">
              <span>STATUS</span>

              <strong>{donation.status}</strong>
            </div>
          </div>

          <div className="card confirmation-card">
            <div className="card-icon purple-icon">✓</div>

            <span className="section-kicker">RECEIVE FOOD</span>

            <h2>Confirm delivery</h2>

            <p className="confirmation-text">
              Enter your NGO details and the verification code provided for
              this donation.
            </p>

            <div className="form-group">
              <label>NGO / organisation name</label>

              <input
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
                placeholder="e.g. Hope Foundation"
              />
            </div>

            <div className="form-group">
              <label>Verification code</label>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>

            <button
              className="submit-button purple-button"
              onClick={confirmDelivery}
              disabled={loading}
            >
              {loading
                ? "Confirming..."
                : "Confirm received food ✓"}
            </button>
          </div>
        </div>
      )}

      <NgoHistory history={ngoHistory} />
    </main>
  );
}

/* =========================
   NGO HISTORY
========================= */

function NgoHistory({ history }) {
  const [expandedId, setExpandedId] = useState(null);

  const allDonations = Object.values(history).flat();

  const toggleDonation = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section style={{ marginTop: "40px" }}>
      <div className="card">
        <span className="section-kicker">
          RECEIVED FOOD HISTORY
        </span>

        <h2>Food received from donors</h2>

        <p>
          Click a donor to view the complete donation and delivery details.
        </p>

        {allDonations.length === 0 ? (
          <div style={{ marginTop: "20px" }}>
            <EmptyState
              icon="🏠"
              title="No completed deliveries yet"
              text="Confirmed food deliveries will appear here."
            />
          </div>
        ) : (
          <div style={{ marginTop: "24px" }}>
            {allDonations.map((item) => (
              <DonationHistoryCard
                key={item.id}
                donation={item}
                expanded={expandedId === item.id}
                onClick={() => toggleDonation(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================
   SHARED COMPONENTS
========================= */

function DashboardHeading({
  eyebrow,
  title,
  description,
  icon
}) {
  return (
    <div className="dashboard-header">
      <div>
        <span className="dashboard-label">
          {icon} &nbsp; {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required
}) {
  return (
    <div className="form-group">
      <label>
        {label}
        {required && " *"}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function InfoBox({ icon, title, value }) {
  return (
    <div className="info-box">
      <div className="info-box-icon">{icon}</div>

      <div>
        <span>{title}</span>

        <strong>{value || "—"}</strong>
      </div>
    </div>
  );
}

function Metric({ icon, number, label }) {
  return (
    <div className="metric-card metric-new">
      <div className="metric-icon">{icon}</div>

      <div>
        <h2>{number}</h2>

        <p>{label}</p>
      </div>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="simple-step">
      <span>{number}</span>

      <p>{text}</p>
    </div>
  );
}

function ActionButton({
  icon,
  title,
  text,
  button,
  onClick,
  disabled
}) {
  return (
    <div className="next-action">
      <div className="next-action-icon">{icon}</div>

      <div>
        <h3>{title}</h3>

        <p>{text}</p>
      </div>

      <button
        className="submit-button"
        onClick={onClick}
        disabled={disabled}
      >
        {button} →
      </button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  button,
  onClick
}) {
  return (
    <div className="empty-state card">
      <div className="empty-state-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>

      {button && (
        <button
          className="submit-button empty-button"
          onClick={onClick}
        >
          {button} →
        </button>
      )}
    </div>
  );
}

function Timeline({ status }) {
  const steps = [
    {
      name: "Donation listed",
      statuses: [
        "Listed",
        "Claimed",
        "Food Picked Up",
        "In Transit",
        "Delivered",
        "Completed"
      ]
    },
    {
      name: "Volunteer claimed",
      statuses: [
        "Claimed",
        "Food Picked Up",
        "In Transit",
        "Delivered",
        "Completed"
      ]
    },
    {
      name: "Food picked up",
      statuses: [
        "Food Picked Up",
        "In Transit",
        "Delivered",
        "Completed"
      ]
    },
    {
      name: "In transit",
      statuses: [
        "In Transit",
        "Delivered",
        "Completed"
      ]
    },
    {
      name: "Delivered to NGO",
      statuses: [
        "Delivered",
        "Completed"
      ]
    },
    {
      name: "Rescue completed",
      statuses: ["Completed"]
    }
  ];

  return (
    <div className="timeline-new">
      {steps.map((step, index) => {
        const active = step.statuses.includes(status);

        return (
          <div
            className={`timeline-new-item ${
              active ? "timeline-active" : ""
            }`}
            key={index}
          >
            <div className="timeline-new-dot">
              {active ? "✓" : ""}
            </div>

            <div>
              <strong>{step.name}</strong>

              {active && <span>Current stage</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <strong>FoodRescue</strong>
      <br />
      Turning surplus food into meaningful meals.
    </footer>
  );
}

export default App;