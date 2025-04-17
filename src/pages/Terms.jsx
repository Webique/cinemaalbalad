import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-20 min-h-screen px-6 sm:px-10 lg:px-20 pb-32">
        <motion.section
          className="max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            Terms & Conditions
          </h1>

          <div className="space-y-6 text-black leading-relaxed text-lg bg-white/90 p-6 rounded-xl shadow-lg">
            <p>
              Welcome to Cinema Al Balad. By booking tickets through our website,
              you agree to the following terms and policies in accordance with
              the regulations of the Ministry of Commerce in the Kingdom of Saudi Arabia.
            </p>

            <h2 className="text-2xl font-semibold text-primary">General</h2>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>Tickets are valid only for the specific movie, date, and time selected.</li>
              <li>Please arrive 15 minutes prior to your showtime.</li>
              <li>Food and drinks purchased outside are not permitted inside the cinema.</li>
              <li>Management reserves the right to deny entry without refund for rule violations.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary">Refund Policy</h2>
            <p>
              All ticket sales are final. <strong>No refunds</strong> or cancellations
              will be accepted under any circumstances. Please double-check all details
              before confirming your purchase.
            </p>

            <h2 className="text-2xl font-semibold text-primary">Privacy Policy</h2>
            <p>
              We are committed to protecting your personal data. Your contact information
              and booking details are stored securely and will not be shared with third parties,
              except as required by law or payment processors like Moyasar.
            </p>

            <h2 className="text-2xl font-semibold text-primary">E-Commerce Compliance</h2>
            <p>
              This website operates in full compliance with Saudi Arabia’s
              <a
                href="https://mc.gov.sa/ar/mediacenter/News/Pages/13-04-22-01.aspx"
                target="_blank"
                className="underline text-blue-600 ml-1"
              >
                e-commerce regulations
              </a>
              , ensuring transparency, fair practices, and proper data handling.
            </p>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
