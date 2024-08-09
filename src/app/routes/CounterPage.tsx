import { Add, Menu, Remove } from "@mui/icons-material";
import {
  AppBar,
  Button,
  CardContent,
  IconButton,
  Slider,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { incrementByAmount } from "../../features/counter/counterSlice";
import { TodoList } from "../../TodoList";
import { BasicPage } from "../BasicPage";

export function CounterPage() {
  const dispatch = useAppDispatch();
  const [sliderValue, setSliderValue] = useState<number>(50);

  const counter = useAppSelector((state) => state.counter.value);

  function handleAdd() {
    const action = incrementByAmount(sliderValue);
    dispatch(action);
  }
  function handleMinus() {
    const action = incrementByAmount(-sliderValue);
    dispatch(action);
  }

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <BasicPage title="Counter">
      <IconButton onClick={handleMinus}>
        <Remove />
      </IconButton>
      <IconButton onClick={handleAdd}>
        <Add />
      </IconButton>

      <CardContent>
        <Slider
          value={sliderValue}
          onChange={handleChange}
          valueLabelDisplay="on"
        />
      </CardContent>
      <Typography variant="h1" align="center">
        {counter}
      </Typography>
    </BasicPage>
  );
}
