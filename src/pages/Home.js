import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import img2 from '../assets/img2.png';
import './Home.css';

export default function Home() {
  return (
    <>
      <Header />

      <main
        className="home"
        style={{ backgroundImage: `url(${img2})` }}
      >
        <div className="overlay">
          <div className="section-container intro">
            <h1>Empower Your Financial Freedom</h1>
            <p>
              Join our vibrant community and unlock the power of earning from anywhere, anytime! We’re dedicated to helping you achieve financial independence through diverse and rewarding opportunities.
            </p>
          </div>

          <div className="section-container bigger">
            <h2>Be Part of Something Bigger</h2>
            <p>
              Our community thrives on the contributions of individuals like you. With state-of-the-art technology and high safety standards, we guarantee a stable and secure platform for you to work and earn.
            </p>
          </div>

          <div className="section-container variety">
            <h2>Variety of Opportunities</h2>
            <p>Explore our wide range of jobs, including:</p>
            <ul>
              <li>Transcription services</li>
              <li>Data Entry</li>
              <li>Micro-tasks</li>
              <li>AI training</li>
              <li>Surveys</li>
              <li>Voice recordings</li>
              <li>Photo contests</li>
              <li>Typing/word processing</li>
            </ul>
          </div>

          <div className="section-container terms">
            <h2>Work on Your Terms</h2>
            <p>
              Enjoy the flexibility to work from anywhere, at any time. Our platform is designed to provide you with a seamless experience, ensuring high availability and performance.
            </p>
          </div>

          <div className="section-container join">
            <h2>Join Our Community Today!</h2>
            <p>
              Shape the future with us and take the first step towards financial freedom. Sign up now and discover the opportunities that await you!
            </p>
            <Link to="/register" className="home-btn">Become a worker</Link>
          </div>

          <div className="section-container microtasking">
            <h2>Earn Money with Micro Tasking</h2>
            <p>
              At Remoteworker, we offer a flexible and secure way to earn money through micro tasking. Here’s what sets us apart:
            </p>
            <h3>Weekly Payments</h3>
            <p>Get paid regularly and securely via Crypto or Payoneer. You decide when you get paid!</p>
            <h3>Data Security</h3>
            <p>We prioritize data privacy and security, ensuring your information is protected with ISO certification and transparent handling.</p>
            <h3>Find Your Perfect Job</h3>
            <p>Access a wide range of tasks that fit your schedule and skills, whether you’re on-the-go or working from home.</p>
          </div>

          <div className="section-container features">
            <h2>Remoteworker Platform</h2>
            <ul>
              <li>Push notifications for new job opportunities</li>
              <li>Track your account balance and earnings</li>
              <li>Work offline and submit jobs when you’re online</li>
              <li>Secure environment for your data</li>
            </ul>
          </div>

          <div className="section-container support">
            <h2>Support</h2>
            <p>Our helpdesk is here to assist you with any questions or concerns.</p>
          </div>

          <div className="section-container terms-repeat">
            <h2>Work on Your Terms</h2>
            <p>Access our platform from any device, whether it’s your smartphone, desktop, or notebook.</p>
          </div>

          <div className="section-container different">
            <h2>What Makes Us Different?</h2>
            <ul>
              <li>Diverse, high-quality tasks</li>
              <li>Supportive community</li>
              <li>Reliable payments</li>
            </ul>
          </div>

          <div className="section-container cta-final">
            <p>Join our community today and start earning money on your terms!</p>
            <Link to="/register" className="home-btn">Become a worker</Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
