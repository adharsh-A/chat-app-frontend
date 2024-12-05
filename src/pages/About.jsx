
// About.js
import React from 'react';

const About = () => {
  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '2rem',
          color: '#4a9eff'
        }}>About ChatApp</h1>

        <section style={{
          backgroundColor: '#2d2d2d',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#4a9eff',
            marginBottom: '1rem'
          }}>Our Mission</h2>
          <p style={{
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            ChatApp aims to provide a seamless and secure communication platform for users worldwide. 
            We believe in connecting people through simple, efficient, and reliable messaging.
          </p>
        </section>

        <section style={{
          backgroundColor: '#2d2d2d',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: '#4a9eff',
            marginBottom: '1rem'
          }}>Key Features</h2>
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {[
              'Real-time messaging',
              'End-to-end encryption',
              'File sharing',
              'Group chats',
              'Custom themes'
            ].map((feature, index) => (
              <li key={index} style={{
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  color: '#4a9eff',
                  marginRight: '0.5rem'
                }}>•</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section style={{
          backgroundColor: '#2d2d2d',
          padding: '2rem',
          borderRadius: '10px'
        }}>
          <h2 style={{
            color: '#4a9eff',
            marginBottom: '1rem'
          }}>Contact Us</h2>
          <p style={{
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            Have questions or feedback? Reach out to us at:
          </p>
          <a href="mailto:support@chatapp.com" 
             style={{
               color: '#4a9eff',
               textDecoration: 'none'
             }}>
            support@chatapp.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;