import { motion } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./ContactCard.css";

const socialLinks = [
  { name: "GitHub", handle: "@alexhalo", url: "#", icon: "💻" },
  { name: "Twitter", handle: "@alexhalo", url: "#", icon: "🐦" },
  { name: "LinkedIn", handle: "Alex Halo", url: "#", icon: "💼" },
  { name: "Email", handle: "hello@alexhalo.dev", url: "#", icon: "📧" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

function ContactCard() {
  return (
    <BaseCard className="card card-contact">
      <div className="contact-content">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          Let's build something amazing together
        </p>
        <motion.div
          className="social-links"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              className="social-link"
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <span className="social-icon">{link.icon}</span>
              <div className="social-info">
                <div className="social-name">{link.name}</div>
                <div className="social-handle">{link.handle}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </BaseCard>
  );
}

export default ContactCard;
