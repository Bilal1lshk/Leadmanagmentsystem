import Navbar from './Navbar.tsx'
import Herosection from "./Herosection.tsx"
import Carosal from "./Carosal.tsx"
import Integrations from "./Integration.tsx"
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
