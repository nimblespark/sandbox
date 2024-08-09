import { Card, CardContent, Rating, Typography } from "@mui/material";
import { BasicPage } from "../BasicPage";
import { SyntheticEvent, useState } from "react";

export function RatingPage() {
  const [rating, setRating] = useState<number>(1);

  const handleChange = (
    _event: SyntheticEvent<Element, Event>,
    value: number | null
  ) => {
    setRating(value as number);
  };
  return (
    <BasicPage title="Rating">
      <CardContent>
        <Card>
          <CardContent>
            <Rating
              value={rating}
              onChange={handleChange}
              size="large"
              max={46}
            />
          </CardContent>
        </Card>
        <Typography color="pink" variant="h1">
          The rating you have chosen is {rating}
        </Typography>
      </CardContent>
    </BasicPage>
  );
}
