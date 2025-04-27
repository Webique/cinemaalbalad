import { motion } from "framer-motion";
import pattern from "../assets/pattern.png";
import { Instagram, Youtube, Twitter, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ NEW

export default function Footer() {
  const { t } = useTranslation(); // ✅ NEW

  return (
    <footer className="bg-white text-black pt-16 px-6 sm:px-10 lg:px-20 border-t border-black/10">
      {/* Footer Content */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo & Vision */}
        <div className="space-y-4">
          <h3 className="text-2xl font-cinema tracking-wide">{t('footer.title')}</h3> {/* ✅ */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {t('footer.description')}
          </p>
        </div>

        {/* Divider Image */}
        <section className="w-full">
          <img
            src={pattern}
            alt={t('footer.dividerAlt')} // ✅
            className="w-full h-auto object-cover"
          />
        </section>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h4 className="uppercase tracking-wider text-gray-600 text-xs mb-2">{t('footer.contactTitle')}</h4> {/* ✅ */}
          <p className="flex items-center gap-2 text-gray-700">
            <Mail size={16} /> Sa7rti@cinemalbalad.com
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <Phone size={16} /> +966 544 155 153
          </p>

          {/* Terms & Conditions Link */}
          <Link
            to="/terms"
            className="inline-block mt-3 text-primary underline text-sm hover:text-black transition"
          >
            📄 {t('footer.terms')} {/* ✅ */}
          </Link>
        </div>

        {/* Social Links */}
        <div className="space-y-3 text-sm">
          <h4 className="uppercase tracking-wider text-gray-600 text-xs mb-2">{t('footer.socialTitle')}</h4> {/* ✅ */}
          <div className="flex gap-4 text-gray-700 text-lg">
            <a
              href="https://instagram.com/cinemaalbalad"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Instagram />
            </a>
            <a
              href="https://youtube.com/@cinemaalbalad"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Youtube />
            </a>
            <a
              href="https://x.com/cinemaalbalad"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Twitter />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Location Map */}
      <motion.div
        className="max-w-7xl mx-auto mt-20 overflow-hidden rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <iframe
          title={t('footer.mapTitle')} // ✅
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14850.17596925637!2d39.17412030530276!3d21.486402101057426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3cf1a4b78394b%3A0xb2f902e7dad72c0!2sAl-Balad%2C%20Jeddah%20Saudi%20Arabia!5e0!3m2!1sen!2suk!4v1742957821428!5m2!1sen!2suk"
          className="w-full h-[300px] md:h-[400px] border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </motion.div>

      {/* Copyright */}
      <div className="mt-16 text-center text-xs text-gray-500 pb-10">
        © {new Date().getFullYear()} {t('footer.title')}. {t('footer.rights')}
      </div>
    </footer>
  );
}
