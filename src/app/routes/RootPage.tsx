import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { BasicPage } from "../BasicPage";

export function RootPage() {
  useEffect(() => {
    setTimeout(() => {
      console.log("This text will be displayed after 2 seconds.");
      setLoaded(true);
    }, 500);
  }, []);

  const [loaded, setLoaded] = useState<boolean>(false);
  return (
    <BasicPage title="Home">
      <Box justifyContent="center" alignContent="center">
        {!loaded ? (
          <div style={{ width: 700, margin: "auto" }}>
            <CircularProgress size={700} color="secondary" />
          </div>
        ) : (
          "This is the content"
        )}
      </Box>
    </BasicPage>
  );
}
