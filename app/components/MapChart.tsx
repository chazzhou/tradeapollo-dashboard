import React, { useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Graticule, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "@nextui-org/react";

const geoUrl = "/word_features.json";

const colorScale = scaleLinear<string>()
  .domain([0, 75])
  .range(["#ffedea", "#ff5233"] as const);

interface MapChartProps {
  year: number;
}

const tooltipText = (data: any) => {
  if (!data) {
    return "No data";
  }
  return (
    <div>
      <div>
        <strong>{data["Country/Region"]}</strong>
      </div>
      <div>{data.Data ? `${data.Data} ${data.unit || ""}` : "No data"}</div>
    </div>
  );
};

const MapChart: React.FC<MapChartProps> = ({ year }) => {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetch(`/co2_data/${year}.json`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`);
          return;
        }
        response.json().then((worldData) => {
          setData(worldData);
        });
      })
      .catch((err) => {
        console.log("Fetch Error :-S", err);
      });
  }, [year]);

  return (
    <div className="w-full h-full">
      <ComposableMap className="w-full h-full">
        <ZoomableGroup center={[10, 50]} zoom={6}>
          <Graticule stroke="#EAEAEC" strokeWidth={0.2} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const cd: any = data.find((country: any) => country.iso === geo.id);
                return (
                  <Tooltip key={geo.rsmKey} content={tooltipText(cd)}>
                    <Geography
                      geography={geo}
                      fill={cd?.Data ? colorScale(Number(cd.Data)) : "#F5F4F6"}
                      stroke="#EAEAEC"
                      strokeWidth={0.5}
                    />
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;