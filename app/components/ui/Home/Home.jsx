import Navbar from './Navbar.jsx'
import Herosection from "./Herosection.jsx"
import Carosal from "./Carosal.jsx"
import Integrations from "./Integration.jsx"
import AIFeatures from './AIFeatures.tsx';
import ProductOverview from './ProductOverview';
import Footer from './Footer';
export default function Home() {
    return (
        <>
            <Navbar />
            <Herosection />
            <Carosal />
            <Integrations />
            <AIFeatures />
            <ProductOverview />
            <Footer/>

        </>
    )
}
