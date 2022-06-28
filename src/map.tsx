import "maplibre-gl/dist/maplibre-gl.css";

import { Feature, MultiPolygon } from "geojson";
import { RampData, RampProperties } from "./types";
import React, { Dispatch, SetStateAction, useState } from "react";
import ReactMap, { Marker, Popup, ViewStateChangeEvent } from "react-map-gl";

import maplibregl from "maplibre-gl";

export const Map = ({
  ramps,
  visibleFeatures,
  setVisibleFeatures,
}: {
  ramps: RampData;
  visibleFeatures: Feature<MultiPolygon, RampProperties>[] | [];
  setVisibleFeatures: Dispatch<
    SetStateAction<Feature<MultiPolygon, RampProperties>[] | []>
  >;
}) => {
  if (!visibleFeatures) {
    visibleFeatures = ramps.features;
  }
  const [popupData, setPopupData] = useState<
    Feature<MultiPolygon, RampProperties> | undefined
  >(undefined);

  const features: JSX.Element[] = [];

  for (let i = 0; i < ramps.features.length; i++) {
    let f = ramps.features[i];

    features.push(
      <Marker
        key={f.id}
        latitude={f.geometry.coordinates[0][0][0][1]}
        longitude={f.geometry.coordinates[0][0][0][0]}
        onClick={() => {
          setPopupData(f);
        }}
      />
    );
  }

  const filterVisibleRamps = (evt: ViewStateChangeEvent) => {
    const bounds = evt.target.getBounds();
    const visibleRamps = ramps.features.filter(
      ({ geometry: { coordinates } }) => {
        let inBounds = true;
        coordinates[0][0].map((coordKvPair) => {
          if (!bounds.contains(coordKvPair as [number, number])) {
            inBounds = false;
          }
        });
        return inBounds;
      }
    );
    setVisibleFeatures(visibleRamps);
  };

  const initialState = {
    latitude: ramps.features[0].geometry.coordinates[0][0][0][1],
    longitude: ramps.features[0].geometry.coordinates[0][0][0][0],
    zoom: 8,
  };

  return (
    <ReactMap
      mapLib={maplibregl}
      initialViewState={initialState}
      style={{ width: "100%", height: "100%" }}
      // Style and key borrowed from https://www.maptiler.com/maps/#basic//vector/1/0/0
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=eIgS48TpQ70m77qKYrsx"
      onMoveEnd={filterVisibleRamps}
    >
      {features}
      {popupData && (
        <Popup
          latitude={popupData.geometry.coordinates[0][0][0][1]}
          longitude={popupData.geometry.coordinates[0][0][0][0]}
          closeOnClick={false}
          onClose={() => setPopupData(undefined)}
        >
          {popupData.id}
        </Popup>
      )
      }
    </ReactMap >
  );
};
