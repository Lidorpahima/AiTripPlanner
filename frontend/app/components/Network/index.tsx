import Image from "next/image";

interface datatype {
    imgSrc: string;
    country: string;
    paragraph: string;
}

const Aboutdata: datatype[] = [
    {
        imgSrc: "/assets/network/paris.svg",
        country: "Paris, France",
        paragraph: "Romantic getaways, iconic landmarks, and culinary delights.",

    },
    {
        imgSrc: "/assets/network/tokyo.svg",
        country: "Tokyo, Japan",
        paragraph: "A vibrant blend of ancient traditions and futuristic technology.",

    },
    {
        imgSrc: "/assets/network/rome.svg",
        country: "Rome, Italy",
        paragraph: "Step back in time with historic ruins, art, and delicious pasta.",

    },
    {
        imgSrc: "/assets/network/bali.svg",
        country: "Bali, Indonesia",
        paragraph: "Lush landscapes, serene beaches, and a spiritual atmosphere.",

    },
]

const Network = () => {
    return (
        <div className="bg-babyblue" id="project">
            <div className="mx-auto max-w-2xl py-20 px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
                <h3 className="text-4xl sm:text-6xl font-semibold text-center my-10 lh-81">Explore the World with Us</h3>

                <Image src={'/assets/network/cca5022c86f67861746d7cf2eb486de8.gif'} alt={"map-image"} width={1400} height={800} />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-4 lg:gap-x-8'>
                    {Aboutdata.map((item, i) => (
                        <div key={i} className='bg-white rounded-2xl p-5 shadow-xl'>
                            <div className="flex justify-start items-center gap-2">
                                <Image src={item.imgSrc} alt={item.imgSrc} width={55} height={55} className="mb-2" />
                                <h4 className="text-xl font-medium text-midnightblue">{item.country}</h4>
                            </div>
                            <hr />
                            <h4 className='text-lg font-normal text-bluegrey my-2 text-center '>{item.paragraph}</h4>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Network;
