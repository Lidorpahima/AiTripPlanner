import Image from "next/image";



const Banner = () => {
    return (
        <main>
            <div className="px-6 lg:px-8">
                <div className="mx-auto max-w-7xl pt-20 sm:pt-20 pb-20 banner-image">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl gloock-regular text-navyblue">
                        <span className="gloock-regular-bold">Smart AI Travel</span>  <br /> Personalized Plans, Live Events & Insider Recommendations
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-bluegray">
                        Let our AI craft your perfect trip. <br /> Save time, travel smarter, and discover hidden gems with expert insights.
                        </p>
                    </div>


                    <div className="text-center mt-5">
                        <button type="button" className='text-15px text-white font-medium bg-blue py-5 px-9 mt-2 leafbutton'>
                            Design My AI Trip
                        </button>
                        <button type="button" className='text-15px ml-4 mt-2 text-blue transition duration-150 ease-in-out hover:text-white hover:bg-blue font-medium py-5 px-16 border border-lightgrey leafbutton'>
                            Explore AI Features
                        </button>
                        
                    </div>

                </div>
            </div>
        </main>
    )
}

export default Banner;
