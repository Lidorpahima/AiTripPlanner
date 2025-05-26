/**
 * Map Chart Component
 * 
 * An interactive world map visualization using react-simple-maps.
 * Features:
 * - Interactive country selection
 * - Visited countries highlighting
 * - Tooltip display on hover
 * - Responsive design
 * - Data caching for performance
 * - Loading state handling
 */

'use client';
import React, { memo, useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip as ReactTooltip } from 'react-tooltip';

/**
 * GeoJSON data URL configuration
 * Uses different sources for production and development environments
 */
const geoUrl = process.env.NODE_ENV === 'production' 
  ? "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  : "/data/world-110m.json";

/**
 * Props interface for the MapChart component
 * @property visitedCountries - Array of country names that have been visited
 * @property onCountrySelect - Callback function when a country is selected
 */
interface MapChartProps {
  visitedCountries: string[];
  onCountrySelect: (countryName: string) => void;
}

// Cache for geography data to prevent unnecessary reloading
let cachedGeoData: any = null;

/**
 * MapChart Component
 * 
 * Renders an interactive world map with visited countries highlighted
 * and tooltips showing country names on hover.
 */
const MapChart: React.FC<MapChartProps> = ({ visitedCountries, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Load geography data on component mount
  useEffect(() => {
    if (!cachedGeoData) {
      fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
          cachedGeoData = data;
          setIsMapReady(true);
        })
        .catch(err => {
          console.error("Error loading map data:", err);
          setIsMapReady(true); 
        });
    } else {
      setIsMapReady(true);
    }
  }, []);

  // Loading state while map data is being fetched
  if (!isMapReady && !cachedGeoData) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  /**
   * Handles country click events
   * @param geo - The geography object of the clicked country
   */
  const handleCountryClick = (geo: any) => {
     const countryName = geo.properties.name;
     if (countryName) {
         onCountrySelect(countryName);
     } else {
         console.warn("Clicked on geography with no name property:", geo);
     }
  };

  return (
    <>
      {/* Interactive World Map */}
      <ComposableMap 
        data-tooltip-id="map-tooltip" 
        projectionConfig={{ scale: 155 }}
        width={800}
        height={400}
        style={{ width: "100%", height: "auto" }}
      >
          {/* Geography Data Rendering */}
          <Geographies geography={cachedGeoData || geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const isVisited = visitedCountries.includes(countryName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => {
                      setTooltipContent(`${geo.properties.name}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: isVisited ? "#3b82f6" : "#E4E5E6", // Blue for visited, gray for unvisited
                        outline: "none",
                        stroke: "#FFF", 
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: isVisited ? "#2563eb" : "#A9A9A9", // Darker blue/gray on hover
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#1e40af", // Darkest blue when clicked
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
      </ComposableMap>

      {/* Tooltip for country names */}
      <ReactTooltip id="map-tooltip" content={tooltipContent} />
    </>
  );
};

export default memo(MapChart);