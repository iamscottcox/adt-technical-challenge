import { Box, Card, Grid } from "@mui/material";
import { Feature, MultiPolygon } from "geojson";
import { RampData, RampProperties } from "./types";
import React, { useEffect, useState } from "react";

import { BoatMaterialsPie } from "./materials-pie-chart";
import { Header } from "./header";
import { Map } from "./map";
import { RampTable } from "./table";
import { worker } from ".";

export const App = () => {
  const [data, setData] = useState<RampData | undefined>(undefined);
  const [visibleFeatures, setVisibleFeatures] = useState<
    Feature<MultiPolygon, RampProperties>[] | []
  >([]);

  worker.postMessage({});
  worker.onmessage = function (e) {
    console.log('e.data', e.data)
  }

  useEffect(() => {
    const getData = async () => {
      const results = await fetch("./data.json");
      setData(await results.json());
    };

    getData();
  }, [])


  useEffect(() => {
    if (data?.features && !visibleFeatures.length) {
      setVisibleFeatures(data?.features);
    }
  }, [data]);

  return data === undefined ? (
    <div>Loading...</div>
  ) : (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} margin={3}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Card elevation={2} sx={{ height: 400 }}>
              <Map
                ramps={data}
                visibleFeatures={visibleFeatures}
                setVisibleFeatures={setVisibleFeatures}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={2} sx={{ height: 400 }}>
              <BoatMaterialsPie ramps={data} />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card elevation={2} sx={{ overflow: "hidden" }}>
              <RampTable ramps={visibleFeatures} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
