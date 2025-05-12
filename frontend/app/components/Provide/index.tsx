import Image from "next/image";
import Link from "next/link";

interface datatype {
    imgSrc: string;
    country: string;
    paragraph: string;
}

const Aboutdata: datatype[] = [
    {
        imgSrc: "/assets/provide/events.svg",
        country: "Live Local Events",
        paragraph: "Discover ongoing events and activities at your destination.",

    },
    {
        imgSrc: "/assets/provide/search_models.svg",
        country: "Tailored Trip Search",
        paragraph: "Find trips matching your style with our unique search models.",

    },
    {
        imgSrc: "/assets/provide/trip_modification.svg",
        country: "AI Trip Adjustments",
        paragraph: "Flexibly modify your itinerary with our AI assistant.",

    },
    {
        imgSrc: "/assets/provide/live_reviews_map.svg",
        country: "Real-time Insights",
        paragraph: "Access live reviews and interactive maps for your locations.",
    },
]


const Provide = () => {
    return (
        <div id="services">

            <div className='mx-auto max-w-7xl px-4 my-10 sm:py-20 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>

                    {/* COLUMN-1 */}
                    <div className='col-span-6 flex justify-center'>
                        <div className="flex flex-col align-middle justify-center p-10">
                            <p className="text-4xl lg:text-6xl pt-4 font-semibold lh-81 mt-5 text-center lg:text-start">Discover Your Next Adventure, Intelligently.</p>
                            <h4 className="text-lg pt-4 font-normal lh-33 text-center lg:text-start text-bluegray">Our AI-powered platform helps you craft personalized travel itineraries, discover local events, and explore with confidence using real-time information.</h4>
                            <Link href={'/'} className="mt-4 text-xl font-medium text-blue flex gap-2 mx-auto lg:mx-0 space-links">Learn more <Image src={'/assets/provide/arrow.svg'} alt={'arrow'} width={20} height={20} /></Link>
                        </div>
                    </div>

                    <div className='lg:col-span-1'></div>

                    {/* COLUMN-2 */}
                    <div className='col-span-6 lg:col-span-5'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 lg:gap-x-40 px-10 py-12 bg-bluebg rounded-3xl'>
                            {Aboutdata.map((item, i) => (
                                <div key={i} className='bg-white rounded-3xl lg:-ml-32 p-6 shadow-xl'>
                                    <Image src={item.imgSrc} alt={item.imgSrc} width={64} height={64} className="mb-5" />
                                    <h4 className="text-2xl font-semibold">{item.country}</h4>
                                    <h4 className='text-lg font-normal text-bluegray my-2'>{item.paragraph}</h4>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Provide;
