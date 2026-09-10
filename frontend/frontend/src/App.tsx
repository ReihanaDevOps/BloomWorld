import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

interface Shop {
  id: number;
  name: string;
  city: string;
}

function App() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [newShopCity, setNewShopCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  
//backend fetching-------
  
  useEffect(() => {
  const getShops = async () => {
    try {
      console.log("Fetching shops...");

      const response = await fetch(
        "http://35.207.225.27/api/shops"
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();

      console.log("API DATA:", data);

      const shopList = Array.isArray(data)
        ? data
        : [data];

      console.log("SHOP LIST:", shopList);

      setShops(shopList);

    } catch (error) {
      console.error(
        "Error fetching shops:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  getShops();
}, []);

  const filteredShops = shops.filter((shop) => {
    const searchMatch = shop.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const cityMatch =
      city === "" ||
      shop.city.toLowerCase().includes(city.toLowerCase());

    return searchMatch && cityMatch;
  });


  const cities = [...new Set(shops.map((shop) => shop.city))];

  // ================= ADD NEW SHOP =================

  const handleAddShop = async (e: FormEvent) => {
    e.preventDefault();

    setFormError("");

    if (!newShopName.trim() || !newShopCity.trim()) {
      setFormError("Please fill in both shop name and city.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:3000/api/shops",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newShopName.trim(),
            city: newShopCity.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.errors?.[0]?.msg ||
          data?.message ||
          "Failed to add shop";

        throw new Error(message);
      }

      setShops((prev) => [...prev, data]);

      setNewShopName("");
      setNewShopCity("");
      setShowAddForm(false);

    } catch (error) {
      console.error("Error adding shop:", error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to add shop"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE SHOP =================

  const handleDeleteShop = async (shop: Shop) => {
    const confirmed = window.confirm(
      `Delete "${shop.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(shop.id);

      const response = await fetch(
        `http://localhost:3000/api/shops/${shop.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete shop");
      }

      setShops((prev) =>
        prev.filter((s) => s.id !== shop.id)
      );

      if (selectedShop?.id === shop.id) {
        setSelectedShop(null);
      }

    } catch (error) {
      console.error("Error deleting shop:", error);

      alert("Failed to delete shop. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="logo">
          <img
            src="/images/bloom-logo.png"
            alt="BloomWorld"
          />
        </div>

        <nav className="nav-links">
          <a href="#shops" className="active-nav">
            Visit Your Near Flower Shops
          </a>
        </nav>

        <button className="account-button">
          👤 My Account
        </button>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero" id="home">
        <div className="hero-content">

          {/* SEARCH PANEL */}

          <div className="search-panel">

            {/* SEARCH SHOP */}

            <div className="input-group">
              <label>Search Shop</label>

              <input
                type="text"
                placeholder="Search by shop name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>


            {/* CITY */}

            <div className="input-group">
              <label>City</label>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">
                  All Cities
                </option>

                {cities.map((shopCity) => (
                  <option
                    key={shopCity}
                    value={shopCity}
                  >
                    {shopCity}
                  </option>
                ))}
              </select>
            </div>


            <button className="find-button">
              🔍 Find Shops
            </button>

          </div>
        </div>
      </section>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= FILTER SIDEBAR ================= */}

        <aside className="filters">

          <div className="filter-title">
            <h2>Filters</h2>

            <button
              onClick={() => {
                setSearch("");
                setCity("");
              }}
            >
              Clear
            </button>
          </div>


          <div className="filter-group">
            <h3>Shop Location</h3>

            <p>
              Filter shops by city using the
              search section above.
            </p>
          </div>


          <div className="filter-group">

            <h3>Flower Categories</h3>

            <label>
              <input type="checkbox" />
              Roses
            </label>

            <label>
              <input type="checkbox" />
              Lilies
            </label>

            <label>
              <input type="checkbox" />
              Tulips
            </label>

            <label>
              <input type="checkbox" />
              Mixed Bouquets
            </label>

          </div>

        </aside>


        {/* ================= SHOP SECTION ================= */}

        <section
          className="shops-section"
          id="shops"
        >

          {/* ================= SHOP DETAIL (INLINE) ================= */}

          {selectedShop ? (

            <div className="shop-detail-view">

              <button
                className="back-button"
                onClick={() => setSelectedShop(null)}
              >
                ← Back to Shops
              </button>

              <div className="shop-detail-card">

                <div className="shop-detail-image">
                  🌸
                </div>

                <div className="shop-detail-content">

                  <h2>
                    {selectedShop.name}
                  </h2>

                  <div className="location">
                    📍 {selectedShop.city}
                  </div>

                  <div className="rating">
                    ⭐ 4.8
                    <span>(24 reviews)</span>
                  </div>

                  <p className="shop-description">
                    Welcome to {selectedShop.name}! Discover
                    beautiful flowers, fresh bouquets, and
                    customized arrangements for your special
                    occasions.
                  </p>

                  <h3>Available Services</h3>

                  <div className="tags">
                    <span>Fresh Flowers</span>
                    <span>Custom Bouquets</span>
                    <span>Special Events</span>
                  </div>

                  <div className="detail-actions">

                    <button className="order-button">
                      Explore Flowers
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteShop(selectedShop)}
                      disabled={deletingId === selectedShop.id}
                    >
                      {deletingId === selectedShop.id
                        ? "Deleting..."
                        : "🗑 Delete Shop"}
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ) : showAddForm ? (

            <div className="add-shop-view">

              <button
                className="back-button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormError("");
                }}
              >
                ← Back to Shops
              </button>

              <div className="add-shop-card">

                <h2>Add a New Shop</h2>

                <p>
                  Fill in the details below to list a
                  new flower shop.
                </p>

                <form
                  className="add-shop-form"
                  onSubmit={handleAddShop}
                >

                  <div className="input-group">
                    <label>Shop Name</label>

                    <input
                      type="text"
                      placeholder="e.g. Rose Garden Florist"
                      value={newShopName}
                      onChange={(e) => setNewShopName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>City</label>

                    <input
                      type="text"
                      placeholder="e.g. Colombo"
                      value={newShopCity}
                      onChange={(e) => setNewShopCity(e.target.value)}
                    />
                  </div>

                  {formError && (
                    <div className="form-error">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Shop"}
                  </button>

                </form>

              </div>

            </div>

          ) : (

            <>

              <div className="section-header">

                <div>
                  <h2>Nearby Shops</h2>

                  <p>
                    Explore flower shops available
                    in your area
                  </p>
                </div>


                <div className="header-actions">

                  <div className="shop-count">
                    {filteredShops.length} Shops Found
                  </div>

                  <button
                    className="add-shop-button"
                    onClick={() => setShowAddForm(true)}
                  >
                    ＋ Add New Shop
                  </button>

                </div>

              </div>


              {/* ================= LOADING ================= */}

              {loading && (
                <div className="status-message">
                  Loading shops...
                </div>
              )}


              {/* ================= NO SHOPS ================= */}

              {!loading && filteredShops.length === 0 && (
                <div className="status-message">
                  🌸 No shops found.
                </div>
              )}


              {/* ================= SHOP GRID ================= */}

              {!loading && filteredShops.length > 0 && (

                <div className="shop-grid">

                  {filteredShops.map((shop) => (

                    <article
                      className="shop-card"
                      key={shop.id}
                    >

                      {/* IMAGE */}

                      <div className="shop-image">
                        <span>🌸</span>

                        <div className="nearby-badge">
                          Nearby
                        </div>
                      </div>


                      {/* SHOP DETAILS */}

                      <div className="shop-details">

                        <h3>
                          {shop.name}
                        </h3>


                        <div className="rating">
                          ⭐ 4.8
                          <span>(24 reviews)</span>
                        </div>


                        <div className="location">
                          📍 {shop.city}
                        </div>


                        <p className="shop-description">
                          Beautiful flowers and bouquets
                          for every special occasion.
                        </p>


                        <div className="tags">
                          <span>Flowers</span>
                          <span>Bouquets</span>
                        </div>


                        {/* CARD ACTIONS */}

                        <div className="card-actions">

                          <button
                            className="view-button"
                            onClick={() => setSelectedShop(shop)}
                          >
                            View Shop
                          </button>

                          <button
                            className="delete-icon-button"
                            title="Delete shop"
                            disabled={deletingId === shop.id}
                            onClick={() => handleDeleteShop(shop)}
                          >
                            {deletingId === shop.id ? "…" : "🗑"}
                          </button>

                        </div>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </>

          )}

        </section>

      </main>


      {/* ================= SERVICES ================= */}

      <section className="services" id="about">

        <div className="service">
          <div className="service-icon">
            🌸
          </div>

          <h3>Beautiful Flowers</h3>

          <p>
            Discover fresh flowers from
            local flower shops.
          </p>
        </div>


        <div className="service">
          <div className="service-icon">
            📍
          </div>

          <h3>Find Nearby Shops</h3>

          <p>
            Easily find flower shops
            in your city.
          </p>
        </div>


        <div className="service">
          <div className="service-icon">
            💐
          </div>

          <h3>Custom Orders</h3>

          <p>
            Choose flowers and create
            your own bouquet.
          </p>
        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>
          🌸 BloomWorld
        </div>

        <p>
          Connecting you with beautiful
          flower shops.
        </p>

      </footer>

    </div>
  );
}

export default App;
