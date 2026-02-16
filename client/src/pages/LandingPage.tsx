import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGlobe,
  FaArrowRight,
  FaTimes,
  FaBars,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaQuoteLeft
} from "react-icons/fa";
import "./LandingPage.css";
import logo from "../components/assets/logo.jpg";
import { getProjects, Project, getSiteSettings, SiteSettings } from "../services/firestore";
import { LeadershipCard } from "../components/LeadershipCard";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lang, setLang] = useState<"EN" | "NE">("EN");
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  }

  async function loadSettings() {
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="landing-container">
      {/* 1. Sticky Navigation */}
      <nav className={`landing-nav ${isMenuOpen ? "active" : ""}`}>
        <div className="nav-content">
          <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="Rotaract Club of Lamahi" className="logo-img" />
            <div className="logo-text">
              <h3>Rotaract Lamahi Dang</h3>
              <p>Sponsored by Rotary Club of Lamahi</p>
            </div>
          </div>

          <div className="desktop-menu">
            <button onClick={() => handleScrollToSection("projects")}>Projects</button>
            <button onClick={() => handleScrollToSection("events")}>Events</button>
            <button onClick={() => handleScrollToSection("planning")}>Plans</button>
            <button onClick={() => handleScrollToSection("gallery")}>Gallery</button>
            <button onClick={() => handleScrollToSection("blog")}>Blog</button> 
            <button onClick={() => handleScrollToSection("donate")}>Donate</button>
            <button onClick={() => handleScrollToSection("contact")}>Contact</button>
          </div>

          <div className="nav-actions">
            <button className="lang-toggle" onClick={() => setLang(lang === "EN" ? "NE" : "EN")}>
              <FaGlobe /> {lang}
            </button>
            <button className="login-btn-subtle" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <button onClick={() => handleScrollToSection("projects")}>Projects</button>
            <button onClick={() => handleScrollToSection("events")}>Events</button>
            <button onClick={() => handleScrollToSection("planning")}>Plans</button>
            <button onClick={() => handleScrollToSection("gallery")}>Gallery</button>
            <button onClick={() => handleScrollToSection("blog")}>Blog</button>
            <button onClick={() => handleScrollToSection("donate")}>Donate</button>
            <button onClick={() => handleScrollToSection("contact")}>Contact</button>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        )}
      </nav>
      
      {/* 2. Iconic Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badges">
            <span className="trust-badge">Community-driven</span>
            <span className="trust-badge">Volunteer-led</span>
            <span className="trust-badge">Transparent</span>
          </div>
          <h1>Youth-led service for a stronger Lamahi.</h1>
          <p>
            We organize awareness programs, health initiatives, and community projects — driven by impact, transparency, and volunteer leadership.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => handleScrollToSection("projects")}>
              View Projects
            </button>
            <button className="btn-secondary-outline" onClick={() => handleScrollToSection("events")}>
              Join an Event
            </button>
            <button className="btn-tertiary" onClick={() => handleScrollToSection("donate")}>
              Donate
            </button>
          </div>
        </div>
      </header>

      {/* 4. Featured Projects */}
      <section id="projects" className="section bg-light">
        <div className="section-header">
          <h2 className="section-title">Our Work in Action</h2>
          <p>Highlighting our efforts to create sustainable change in Lamahi.</p>
        </div>

        <div className="filter-container">
          {["All", "Health", "Awareness", "Sports", "Education"].map((cat) => (
            <button 
              key={cat} 
              className={`filter-pill ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="card-image" style={{ backgroundImage: `url(${project.image})` }}>
                <span className="category-tag">{project.category}</span>
              </div>
              <div className="card-body">
                <span className="card-year">{project.year}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <button className="btn-link">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Future Plans & Suggestions */}
      <section id="planning" className="section">
        <div className="section-header">
          <h2 className="section-title">What We’re Planning Next</h2>
          <p>Shape the future of our community. We value your input.</p>
        </div>

        <div className="plans-grid">
          <div className="plan-card highlight">
            <span className="plan-status">Fundraising</span>
            <h3>Public Library Renovation</h3>
            <p>Upgrading the local library with new books, furniture, and digital resources for students.</p>
             <button className="btn-primary">Support This</button>
          </div>
          <div className="plan-card">
             <span className="plan-status">Planning</span>
            <h3>Winter Warmth Drive</h3>
            <p>Collecting clothes and blankets for families in need during the upcoming winter.</p>
            <button className="btn-outline">Suggest an Idea</button>
          </div>
           <div className="plan-card">
             <span className="plan-status">Upcoming</span>
            <h3>Youth Leadership Summit</h3>
            <p>A 2-day workshop to empower young leaders with skills and networking opportunities.</p>
            <button className="btn-outline">Suggest an Idea</button>
          </div>
        </div>

        {/* Suggestion Box */}
        <div className="suggestion-box">
          <h3>Have an idea for Rotaract?</h3>
          <p className="helper-text">Your ideas help us serve better.</p>
          <div className="suggestion-form">
            <input type="text" placeholder="Your Name (Optional)" className="form-input" />
            <textarea placeholder="Share your suggestion or project idea..." className="form-textarea"></textarea>
            <button className="btn-primary">Submit Suggestion</button>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      {settings && (settings.presidentName || settings.vicePresidentName) && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Our Leadership</h2>
            <p>Meet the team leading Rotaract Club of Lamahi</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' }}>
            {settings.presidentName && (
              <LeadershipCard
                name={settings.presidentName}
                title={settings.presidentTitle}
                image={settings.presidentImage}
                bio={settings.presidentBio}
                facebook={settings.presidentFacebook}
                email={settings.presidentEmail}
              />
            )}

            {settings.vicePresidentName && (
              <LeadershipCard
                name={settings.vicePresidentName}
                title={settings.vicePresidentTitle}
                image={settings.vicePresidentImage}
                bio={settings.vicePresidentBio}
                facebook={settings.vicePresidentFacebook}
                email={settings.vicePresidentEmail}
              />
            )}
          </div>
        </section>
      )}

      {/* About Us Section */}
      {settings && settings.aboutUsContent && (
        <section className="section bg-light">
          <div className="section-header">
            <h2 className="section-title">{settings.aboutUsTitle || "About Us"}</h2>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', lineHeight: 1.8 }}>
            <p style={{ fontSize: 16, color: '#555' }}>{settings.aboutUsContent}</p>
          </div>
        </section>
      )}

      {/* 6. Upcoming Events */}
      <section id="events" className="section bg-light">
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <p>Join us in our mission. Open for everyone.</p>
        </div>

        <div className="events-grid">
          {/* Paid Event */}
          <div className="event-card">
            <div className="event-date">
              <span className="day">15</span>
              <span className="month">AUG</span>
            </div>
            <div className="event-details">
              <span className="badge-paid">Paid Entry</span>
              <h3>Independence Day Marathon</h3>
              <p><FaMapMarkerAlt /> Lamahi City Center</p>
              <p><FaClock /> 06:00 AM</p>
              <div className="paid-info">
                <span className="fee">NPR 500</span>
                <span className="payment-icons">eSewa / Khalti</span>
              </div>
              <button className="btn-primary-small">Register Now</button>
            </div>
          </div>

          {/* Free Event */}
          <div className="event-card">
            <div className="event-date">
              <span className="day">22</span>
              <span className="month">SEP</span>
            </div>
            <div className="event-details">
              <span className="badge-free">Free for All</span>
              <h3>Blood Donation Camp</h3>
              <p><FaMapMarkerAlt /> Rotary Hall, Lamahi</p>
              <p><FaClock /> 10:00 AM - 4:00 PM</p>
              <p className="note">Refreshments provided.</p>
              <button className="btn-secondary-small">Join Event</button>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-muted">Confirmation via email/SMS after registration.</p>
      </section>

      {/* 7. Donation / Support */}
      <section id="donate" className="section bg-red-gradient text-white">
        <div className="section-header text-white">
          <h2 className="section-title text-white">Support the Mission</h2>
          <p className="text-white-50">Your contribution fuels our community service initiatives.</p>
        </div>

        <div className="donation-container">
          <div className="donation-options">
            <div className="donation-card">
              <h3>General Donation</h3>
              <p>Support our ongoing projects and administrative needs.</p>
              <button className="btn-white">Donate Now</button>
            </div>
            <div className="donation-card">
              <h3>Sponsor an Event</h3>
              <p>Directly fund a specific upcoming event or campaign.</p>
              <button className="btn-outline-white">Become a Sponsor</button>
            </div>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <FaCheckCircle className="icon-check" /> 100% funds used for community
            </div>
            <div className="trust-item">
              <FaCheckCircle className="icon-check" /> Transparent monthly reporting
            </div>
            <div className="trust-item">
              <FaCheckCircle className="icon-check" /> Tax-deductible receipt provided
            </div>
          </div>
          
          <div className="payment-methods">
            <span>We accept:</span>
            <span className="method">eSewa</span>
            <span className="method">Khalti</span>
            <span className="method">Bank Transfer</span>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section id="testimonials" className="section bg-light">
        <div className="section-header">
          <h2 className="section-title">Community Voices</h2>
          <p>Read what our community members have to say.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "Rotaract Lamahi has transformed how we engage with community service. Their dedication is inspiring!"
            </p>
            <div className="testimonial-user">
              <div className="user-avatar" style={{ backgroundImage: "url('https://via.placeholder.com/100')" }}></div>
              <div>
                <h4>Sita Sharma</h4>
                <span>Local Teacher</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "The blood donation camp was so well organized. I felt safe and proud to contribute."
            </p>
            <div className="testimonial-user">
              <div className="user-avatar" style={{ backgroundImage: "url('https://via.placeholder.com/100')" }}></div>
              <div>
                <h4>Ramesh Chaudhary</h4>
                <span>Blood Donor</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "As a sponsor, I value their transparency. I know exactly where my donation goes."
            </p>
            <div className="testimonial-user">
              <div className="user-avatar" style={{ backgroundImage: "url('https://via.placeholder.com/100')" }}></div>
              <div>
                <h4>Binod Gupta</h4>
                <span>Business Owner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Join Rotaract */}
      <section id="join" className="section join-section">
        <div className="join-content">
          <h2>Become a Rotaractor</h2>
          <p className="lead-text">Join a global movement of young leaders making a difference.</p>
          
          <ul className="benefits-list">
            <li><FaCheckCircle /> Develop Professional Leadership Skills</li>
            <li><FaCheckCircle /> Network with Global Change-Makers</li>
            <li><FaCheckCircle /> Serve Your Community Directly</li>
            <li><FaCheckCircle /> Make Lifelong Friendships</li>
          </ul>

          <div className="join-cta">
            <button className="btn-white-large" onClick={() => navigate("/register")}>
              Apply for Membership <FaArrowRight />
            </button>
            <p className="note-text">
              *Membership is subject to board approval. You will be contacted for an interview.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Gallery & Videos */}
      <section id="gallery" className="section bg-light">
        <div className="section-header">
          <h2 className="section-title">Our Memories</h2>
          <p>Capturing moments of service and fellowship.</p>
        </div>

        <div className="gallery-grid">
           {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
             <div key={item} className="gallery-item">
               <div className="gallery-img" style={{ backgroundImage: `url('https://via.placeholder.com/300x300?text=Photo+${item}')` }}></div>
             </div>
           ))}
        </div>
        <div className="text-center mt-4">
           <button className="btn-outline">View Full Gallery</button>
        </div>

        <div className="video-section mt-5">
          <h3 className="subsection-title">Featured Videos</h3>
          <div className="video-grid">
            <div className="video-card">
              <div className="video-thumbnail" style={{ backgroundImage: "url('https://via.placeholder.com/400x225?text=Video+1')" }}>
                <div className="play-button">▶</div>
              </div>
              <h4>Project Documentary 2024</h4>
            </div>
            <div className="video-card">
              <div className="video-thumbnail" style={{ backgroundImage: "url('https://via.placeholder.com/400x225?text=Video+2')" }}>
                <div className="play-button">▶</div>
              </div>
              <h4>Installation Ceremony Highlights</h4>
            </div>
            <div className="video-card">
              <div className="video-thumbnail" style={{ backgroundImage: "url('https://via.placeholder.com/400x225?text=Video+3')" }}>
                 <div className="play-button">▶</div>
              </div>
              <h4>Public Awareness Campaign</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Blog / News */}
      <section id="blog" className="section">
        <div className="section-header">
          <h2 className="section-title">Latest from Lamahi</h2>
          <p>Stories, updates, and news from our club.</p>
        </div>
        
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-img" style={{ backgroundImage: "url('https://via.placeholder.com/400x250?text=News+1')" }}></div>
            <div className="blog-content">
              <span className="blog-date">Oct 15, 2024</span>
              <h3>Successfully Completed Sanitation Week</h3>
              <p>We cleaned 5 major areas in Lamahi and planted 100 trees...</p>
              <button className="btn-link-red">Read More <FaArrowRight /></button>
            </div>
          </div>
          <div className="blog-card">
             <div className="blog-img" style={{ backgroundImage: "url('https://via.placeholder.com/400x250?text=News+2')" }}></div>
            <div className="blog-content">
              <span className="blog-date">Sep 28, 2024</span>
              <h3>New Executive Board Installed</h3>
              <p>Meet the energetic team leading Rotaract Lamahi for R.Y. 2024-25...</p>
              <button className="btn-link-red">Read More <FaArrowRight /></button>
            </div>
          </div>
          <div className="blog-card">
             <div className="blog-img" style={{ backgroundImage: "url('https://via.placeholder.com/400x250?text=News+3')" }}></div>
            <div className="blog-content">
              <span className="blog-date">Sep 10, 2024</span>
              <h3>Collaborating with Red Cross</h3>
              <p>Strengthening our partnership for better emergency response...</p>
              <button className="btn-link-red">Read More <FaArrowRight /></button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Final CTA Banner */}
      <section className="cta-banner">
          <h2>Ready to Make a Difference?</h2>
          <p className="cta-subtitle">Join us in creating a better tomorrow for Lamahi.</p>
          <div className="cta-buttons">
              <button className="btn-white" onClick={() => navigate("/register")}>Join Rotaract</button>
              <button className="btn-outline-white">Donate Now</button>
          </div>
      </section>

      {/* 13. Footer */}
      <footer id="contact" className="site-footer">
          <div className="footer-content">
              <div className="footer-col">
                  <h3>Rotaract Lamahi</h3>
                  <p>Service Above Self.</p>
                  <div className="social-links">
                      <a href="#"><FaFacebook /></a>
                      <a href="#"><FaYoutube /></a>
                      <a href="#"><FaWhatsapp /></a>
                  </div>
              </div>
              <div className="footer-col">
                  <h3>Quick Links</h3>
                  <a href="#projects">Projects</a>
                  <a href="#events">Events</a>
                  <a href="#about">About Us</a>
                  <a href="/login">Login</a>
              </div>
              <div className="footer-col">
                  <h3>Contact</h3>
                  <p>Lamahi, Dang, Nepal</p>
                  <p>info@rotaractlamahi.org</p>
                  <p>+977 9800000000</p>
              </div>
          </div>
          <div className="footer-bottom">
              <p>&copy; 2026 Rotaract Club of Lamahi. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
