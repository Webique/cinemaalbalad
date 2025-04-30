import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      <Navbar />
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className={`bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-20 min-h-screen px-6 sm:px-10 lg:px-20 pb-32 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <motion.section
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            {t('terms.title')}
          </h1>

          <div className="space-y-6 text-black leading-relaxed text-lg bg-white/90 p-6 rounded-xl shadow-lg">
            <p>{t('terms.intro')}</p>

            <h2 className="text-2xl font-semibold text-primary">{t('terms.generalTitle')}</h2>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>{t('terms.general1')}</li>
              <li>{t('terms.general2')}</li>
              <li>{t('terms.general3')}</li>
              <li>{t('terms.general4')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary">{t('terms.refundTitle')}</h2>
            <p>{t('terms.refundText')}</p>

            <h2 className="text-2xl font-semibold text-primary">{t('terms.privacyTitle')}</h2>
            <p>{t('terms.privacyText')}</p>

            <h2 className="text-2xl font-semibold text-primary">{t('terms.complianceTitle')}</h2>
            <p>
              {t('terms.complianceText')}
              <a
                href="https://mc.gov.sa/ar/mediacenter/News/Pages/13-04-22-01.aspx"
                target="_blank"
                className="underline text-blue-600 ml-1"
              >
                {t('terms.complianceLink')}
              </a>
              .
            </p>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
