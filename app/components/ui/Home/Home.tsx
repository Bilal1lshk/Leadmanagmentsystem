import Navbar from './Navbar'
import Herosection from "./Herosection"
import Carosal from "./Carosal"
import Integrations from "./Integration"
import AIFeatures from './AIFeatures';
import ProductOverview from './ProductOverview';
import Footer from './Footer';
import {useAppSelector} from "@/app/redux/hooks";
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
