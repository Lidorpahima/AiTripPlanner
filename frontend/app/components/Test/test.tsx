"use client"

export function Test() {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-screen flex items-center justify-center">

      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Laptop Device - Itinerary */}
          <div className="relative z-10 transform -rotate-6 transition-transform hover:scale-105 duration-300">
            <div className="w-[450px] h-[280px] bg-gray-800 rounded-t-xl p-2 shadow-xl">
              <div className="w-full h-full bg-white rounded overflow-hidden">
                <div className="h-full overflow-hidden">
                  <div className="p-3">
                    <h2 className="text-lg font-bold text-center mb-2">Your Tokyo Adventure</h2>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-gray-500">Start</div>
                        <div className="font-semibold text-xs">May 8, 2025</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-gray-500">End</div>
                        <div className="font-semibold text-xs">May 14, 2025</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-semibold text-xs">6 Days</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col items-center">
                        <div className="text-xs text-gray-500">Budget</div>
                        <div className="font-semibold text-xs">$1,676-$2,563</div>
                      </div>
                    </div>

                    <div className="bg-blue-500 text-white rounded-lg p-2 mb-2 text-sm">
                      <h3 className="font-semibold">Day 3: Asakusa and Sumida River Cruise</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="border-b pb-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700 text-xs">09:00</span>
                          <span className="text-xs text-gray-600">$20 - $40</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-1 text-xs">★</span>
                          <div>
                            <p className="text-gray-800 text-xs">Breakfast at the hotel.</p>
                            <button className="mt-1 text-[10px] text-green-600 font-medium border border-green-200 rounded px-1 py-0.5">
                              Suggest Alternative
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-b pb-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700 text-xs">10:00</span>
                          <span className="text-xs text-gray-600">$0 - $0</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-1 text-xs">★</span>
                          <div>
                            <p className="text-gray-800 text-xs">Visit Senso-ji Temple in Asakusa.</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <button className="text-[10px] text-blue-500 font-medium border border-blue-200 rounded px-1 py-0.5">
                                Details
                              </button>
                              <button className="text-[10px] text-green-600 font-medium border border-green-200 rounded px-1 py-0.5">
                                Suggest
                              </button>
                              <button className="text-[10px] text-red-600 font-medium border border-red-200 rounded px-1 py-0.5 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-2 w-2 mr-0.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                Map
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700 text-xs">11:30</span>
                          <span className="text-xs text-gray-600">$10 - $30</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-yellow-500 mr-1 text-xs">★</span>
                          <div>
                            <p className="text-gray-800 text-xs">Explore Nakamise-dori shopping street.</p>
                            <button className="mt-1 text-[10px] text-green-600 font-medium border border-green-200 rounded px-1 py-0.5">
                              Suggest Alternative
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[450px] h-3 bg-gray-800 rounded-b-lg"></div>
            <div className="w-[400px] h-2 bg-gray-700 mx-auto rounded-b-lg"></div>
          </div>

          {/* Tablet Device - Budget */}
          <div className="relative z-20 ml-[-80px] mt-[30px] transform rotate-3 transition-transform hover:scale-105 duration-300">
            <div className="w-[250px] h-[320px] bg-gray-800 rounded-[20px] p-2 shadow-xl">
              <div className="w-full h-full bg-white rounded-[12px] overflow-hidden">
                <div className="h-full overflow-hidden">
                  <div className="bg-blue-500 text-white p-3">
                    <h2 className="text-sm font-bold">Trip Budget Estimate</h2>
                    <p className="text-blue-100 text-xs">7-day trip to Tokyo</p>

                    <div className="mt-2">
                      <div className="flex items-baseline">
                        <span className="text-xl font-bold">$1,676</span>
                        <span className="mx-1 text-xs">to</span>
                        <span className="text-xl font-bold">$2,563</span>
                      </div>
                      <p className="text-[10px] text-blue-100">Based on a Mid-range budget</p>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-semibold mb-2">Cost Breakdown</h3>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            <span className="font-medium text-xs">Accommodations</span>
                          </div>
                          <span className="font-medium text-xs">$400-$700</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <span className="font-medium text-xs">Food & Drinks</span>
                          </div>
                          <span className="font-medium text-xs">$300-$500</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                              />
                            </svg>
                            <span className="font-medium text-xs">Attractions</span>
                          </div>
                          <span className="font-medium text-xs">$200-$350</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <span className="font-medium text-xs">Transportation</span>
                          </div>
                          <span className="font-medium text-xs">$200-$300</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            <span className="font-medium text-xs">Souvenirs</span>
                          </div>
                          <span className="font-medium text-xs">$576-$713</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Device - Hotel */}
          <div className="relative z-30 ml-[-40px] mt-[60px] transform rotate-6 transition-transform hover:scale-105 duration-300">
            <div className="w-[160px] h-[300px] bg-gray-800 rounded-[24px] p-2 shadow-xl">
              <div className="w-full h-full bg-white rounded-[20px] overflow-hidden">
                <div className="w-full h-[20px] bg-gray-100 rounded-t-[20px] flex justify-center items-end pb-1">
                  <div className="w-[50px] h-[3px] bg-gray-300 rounded-full"></div>
                </div>
                <div className="h-[calc(100%-40px)] overflow-hidden p-2">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-xs text-gray-800">Park Hyatt Tokyo</h3>
                    <button className="text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative h-24 w-full bg-gray-200 mb-2 rounded overflow-hidden">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-11%20223236-jByYha5HF6m0BQSokk8yrEp1S0SpaE.png"
                      alt="Park Hyatt Tokyo"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-1">
                      <button className="bg-black/30 rounded-full p-0.5 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="bg-black/30 rounded-full p-0.5 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[8px] text-white">
                      1 / 5
                    </div>
                  </div>

                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-500">
                      <span className="text-xs">★</span>
                    </div>
                    <span className="ml-0.5 font-medium text-xs">4.5</span>
                    <span className="ml-0.5 text-[8px] text-gray-600">(4376)</span>
                  </div>

                  <div className="flex items-start mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5 text-gray-500 mt-0.5 mr-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div className="text-[8px]">
                      <div>2, 3-chōme-7-1 Nishishinjuku,</div>
                      <div>Shinjuku City, Tokyo</div>
                      <a href="#" className="text-blue-500 text-[8px]">
                        (View Map)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center mb-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5 text-gray-500 mr-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a href="tel:03-5322-1234" className="text-blue-500 text-[8px]">
                      03-5322-1234
                    </a>
                  </div>

                  <div className="border-t pt-1 mt-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-[10px]">Reviews</h3>
                    </div>

                    <div>
                      <div className="border-b pb-1 mb-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[8px]">Ted Lee</span>
                          <div className="flex items-center text-yellow-500 text-[8px]">
                            <span className="mr-0.5">5/5</span>
                            <span>★</span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-[8px] text-gray-600">
                          Service is impeccable. The rooms are spotless...
                        </p>
                        <p className="mt-0.5 text-[8px] text-gray-500">11 months ago</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[8px]">Jackie Huang</span>
                          <div className="flex items-center text-yellow-500 text-[8px]">
                            <span className="mr-0.5">5/5</span>
                            <span>★</span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-[8px] text-gray-600">Staying as a Globalist at this property...</p>
                        <p className="mt-0.5 text-[8px] text-gray-500">1 year ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[20px] bg-gray-100 rounded-b-[20px] flex justify-center items-center">
                  <div className="w-[80px] h-[3px] bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
