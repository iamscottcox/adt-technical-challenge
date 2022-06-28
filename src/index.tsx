import { ThemeProvider, createTheme } from "@mui/material/styles";

import { App } from "./app";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";

export const worker = new Worker('./worker.js');

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
