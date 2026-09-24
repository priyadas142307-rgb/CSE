import React from 'react'

function About() {
  const features = [
    {
      label: 'Events',
      title: 'Workshops, seminars, competitions, and tech programs',
      text: 'Students can explore upcoming events, skill-building workshops, seminars, contests, project showcases, and collaborative sessions through one organized platform.',
    },
    {
      label: 'Notice',
      title: 'Important updates in one accessible place',
      text: 'Academic announcements, society updates, registration deadlines, and event notices can be viewed quickly so students stay informed without confusion.',
    },
    {
      label: 'Committee',
      title: 'Meet the team behind the society',
      text: 'Students can know the committee members, their roles, and the people actively working to organize activities, support members, and strengthen the community.',
    },
    {
      label: 'Blog',
      title: 'Ideas, stories, and learning beyond the classroom',
      text: 'The blog section can share event recaps, student stories, programming insights, project inspiration, and career-focused content for continuous learning.',
    },
    {
      label: 'Alumni',
      title: 'Connect with graduates, mentors, and achievements',
      text: 'Students can discover alumni journeys, success stories, and guidance that help build motivation, networking opportunities, and a stronger academic identity.',
    },
    {
      label: 'Registration',
      title: 'Simple joining experience for every student',
      text: 'Interested students can register easily, become part of the society, and participate in events, community programs, and future opportunities.',
    },
  ]

  return (
    <>
      <section
        className="abt2-hero"
        style={{ backgroundImage: "url('/about-cse.jpg')" }}
      >
        <div className="abt2-hero-overlay">
          <div className="container">
            <div className="abt2-hero-inner">
              <span className="abt2-chip">About MU CSE Society</span>
              <h1>Building a smart, creative, and connected student community</h1>
              <p>
                MU CSE Society is a student-centered platform where learning,
                leadership, collaboration, and innovation come together. This
                website helps students explore events, notices, committee
                information, blogs, alumni connections, and registration
                opportunities through one modern digital space.
              </p>

              <div className="abt2-hero-points">
                <div className="abt2-hero-box">
                  <h3>Learn</h3>
                  <p>Explore practical experiences beyond classroom learning.</p>
                </div>
                <div className="abt2-hero-box">
                  <h3>Connect</h3>
                  <p>Build relationships with peers, committee members, and alumni.</p>
                </div>
                <div className="abt2-hero-box">
                  <h3>Grow</h3>
                  <p>Take part in activities that develop skill and confidence.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block abt2-story-wrap">
        <div className="container">
          <div className="abt2-story-grid">
            <div className="abt2-story-main">
              <span className="abt2-chip abt2-chip-light">Our Story</span>
              <h2>A student-led community designed for growth beyond academics</h2>
              <p>
                MU CSE Society is more than a regular student organization. It is
                a platform built to support academic excellence, practical
                development, teamwork, and leadership among CSE students. We aim
                to create a vibrant environment where students can participate,
                learn, communicate, and contribute meaningfully.
              </p>
              <p>
                Through events, workshops, seminars, contests, and collaborative
                initiatives, the society helps students strengthen technical
                skills, communication ability, and problem-solving confidence.
                The goal is to create opportunities that prepare students for
                both campus life and future professional challenges.
              </p>
              <p>
                This website is designed so that students can easily discover
                upcoming events, read important notices, know the committee,
                explore blogs, connect with alumni, and complete registration in
                a simple and engaging way. It works as a modern information and
                community hub for the department.
              </p>

              <div className="abt2-story-mini-grid">
                <div className="abt2-story-mini-card">
                  <strong>Student First</strong>
                  <span>Every section is designed to improve student experience.</span>
                </div>
                <div className="abt2-story-mini-card">
                  <strong>Modern Access</strong>
                  <span>Clean design and clear information flow for easy use.</span>
                </div>
              </div>
            </div>

            <div className="abt2-side-stack">
              <div className="abt2-side-card">
                <span className="abt2-chip abt2-chip-light">Mission</span>
                <h3>Practical growth for every learner</h3>
                <p>
                  We create meaningful opportunities through real activities,
                  teamwork, technical exposure, and student engagement.
                </p>
              </div>

              <div className="abt2-side-card">
                <span className="abt2-chip abt2-chip-light">Vision</span>
                <h3>Future-ready innovators and leaders</h3>
                <p>
                  We want to build a culture where students grow with confidence,
                  creativity, responsibility, and leadership.
                </p>
              </div>

              <div className="abt2-side-card">
                <span className="abt2-chip abt2-chip-light">Values</span>
                <h3>Collaboration, creativity, and commitment</h3>
                <p>
                  We believe in teamwork, inclusiveness, discipline, innovation,
                  and meaningful participation across the student community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block abt2-feature-wrap">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What Students Can Explore</span>
            <h2>Everything important in one professional platform</h2>
            <p>
              The website is built to make society information easier to access,
              more engaging to explore, and more useful for every student in the
              department.
            </p>
          </div>

          <div className="abt2-feature-grid">
            {features.map((item) => (
              <div className="abt2-feature-card" key={item.title}>
                <span className="abt2-feature-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block abt2-cta-wrap">
        <div className="container">
          <div className="abt2-cta-card">
            <div className="abt2-cta-content">
              <span className="abt2-chip abt2-chip-light">Join the Community</span>
              <h2>Explore, participate, register, and grow with MU CSE Society</h2>
              <p>
                From events and notices to blogs, alumni stories, committee
                details, and registration access — the platform is built to make
                every student feel informed, connected, and inspired.
              </p>
            </div>

            <div className="abt2-cta-actions">
              <a href="/events" className="primary-btn reference-primary-btn">
                Explore Events
              </a>
              <a href="/contact" className="secondary-btn reference-secondary-btn">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About