import { Link } from 'react-router-dom'
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

function Card({
  image,
  title,
  subtitle,
  description,
  extra,
  link,
  facebook_url,
  linkedin_url,
}) {
  return (
    <div className="info-card">
      <div className="card-media-wrap">
        {image ? (
          <img src={image} alt={title} className="card-image" />
        ) : (
          <div className="card-image card-image-placeholder">No Image</div>
        )}
      </div>

      <div className="card-body">
        {subtitle && <span className="card-subtitle">{subtitle}</span>}

        <h3>{title}</h3>

        <p>{description}</p>

        {extra && <small className="card-extra">{extra}</small>}

        {(facebook_url || linkedin_url) && (
          <div className="card-social-links">
            {facebook_url && (
              <a
                href={facebook_url}
                target="_blank"
                rel="noreferrer"
                className="card-social-btn"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF />
              </a>
            )}

            {linkedin_url && (
              <a
                href={linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="card-social-btn linkedin"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            )}
          </div>
        )}

        {link && (
          <div className="card-action">
            <Link to={link} className="read-more-btn">
              Read Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Card