// components/MapChart.tsx (או .jsx)
'use client';
import React, { memo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Tooltip as ReactTooltip } from 'react-tooltip' 

const geoUrl = "/data/world-110m.json";

interface MapChartProps {
  visitedCountries: string[];
  onCountrySelect: (countryName: string) => void;
}

const MapChart: React.FC<MapChartProps> = ({ visitedCountries, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState('');

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
      <ComposableMap data-tooltip-id="map-tooltip" projectionConfig={{ scale: 155 }} >

          <Geographies geography={geoUrl}>
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
                        fill: isVisited ? "#3b82f6" : "#E4E5E6", 
                        outline: "none",
                        stroke: "#FFF", 
                        strokeWidth: 0.5,
                      },
                      hover: {
                        fill: isVisited ? "#2563eb" : "#A9A9A9",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#1e40af", 
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
      </ComposableMap>

      <ReactTooltip id="map-tooltip" content={tooltipContent} />
    </>
  );
};

export default memo(MapChart);