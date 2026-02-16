import { useState } from "react";
import { FaFacebook, FaEnvelope, FaTimes } from "react-icons/fa";
import "./LeadershipCard.css";

interface LeadershipCardProps {
  name: string;
  title: string;
  image: string;
  bio?: string;
  facebook?: string;
  email?: string;
}

export function LeadershipCard({
  name,
  title,
  image,
  bio,
  facebook,
  email,
}: LeadershipCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="leadership-card">
        <div className="leadership-image-container">
          <img src={image} alt={name} className="leadership-image" />
          
          {/* Social Icons Positioned Outside */}
          <div className="leadership-social-container">
            {facebook && (
              <div className="social-icon-wrapper facebook">
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  title="Facebook"
                >
                  <FaFacebook />
                </a>
              </div>
            )}
            
            {email && (
              <div className="social-icon-wrapper email">
                <a
                  href={`mailto:${email}`}
                  className="social-icon"
                  title="Email"
                >
                  <FaEnvelope />
                </a>
              </div>
            )}
            
            {bio && (
              <div className="social-icon-wrapper know-more">
                <button
                  className="know-more-btn"
                  onClick={() => setShowModal(true)}
                >
                  Know More
                </button>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="leadership-name">{name}</h3>
        <p className="leadership-title">{title}</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="leader-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="leader-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <div className="modal-header">
              <img src={image} alt={name} className="modal-image" />
              <h2>{name}</h2>
              <p className="leadership-title">{title}</p>
            </div>

            <div className="modal-body">
              {bio && <p className="modal-bio">{bio}</p>}

              <div className="modal-social">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <FaFacebook />
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="social-icon">
                    <FaEnvelope />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
