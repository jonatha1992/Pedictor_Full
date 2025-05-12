// src/views/Home.jsx
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import FAQs from "../components/FAQs";


const Home = () => (
    <div className="min-h-screen px-2 py-8 bg-gradient-to-br from-gray-900 via-green-900 to-black md:px-8">
        <div className="mx-auto space-y-12 max-w-7xl">
            <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-green-800 to-green-900">
                <Hero />
            </div>
            <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 to-green-900">
                <Features />
            </div>
            <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 to-green-900">
                <Pricing />
            </div>
            <div className="border border-green-700 shadow-2xl rounded-xl bg-gradient-to-br from-gray-900 to-green-900">
                <FAQs />
            </div>
        </div>
    </div>
);

export default Home;
