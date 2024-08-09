import { Check, Delete, Edit as EditIcon } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type Props = {
  todos: string[];
  onChange: (newValue: string[]) => void;
};

export function TodoList({ todos, onChange }: Props) {
  const [textfieldValue, setTextfieldValue] = useState("");
  const [error, setError] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [textfieldValue2, setTextfieldValue2] = useState("");
  const textfieldRef = (node: HTMLInputElement | null) => {
    if (node) {
      //node.select();
    }
  };
  return (
    <>
      <CardContent>
        <Typography color="primary">
          You have {todos.length} item
          {todos.length < 1 || todos.length > 1 ? "s" : ""}
        </Typography>

        <List>
          {todos.map((str, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditIndex(i);
                      setTextfieldValue2(todos[i]);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      onChange(todos.filter((_, j) => j !== i));
                    }}
                  >
                    <Delete />
                  </IconButton>
                </>
              }
            >
              {str}
            </ListItem>
          ))}
        </List>
        <TextField
          // autoFocus
          error={error}
          id="outlined"
          value={textfieldValue}
          label="New item"
          // onFocus={ev => ev.target.select()}
          onChange={(ev) => setTextfieldValue(ev.target.value)}
          helperText={error && "required"}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              console.log("dialog");

              if (textfieldValue.length > 0) {
                setError(false);
                onChange([...todos, textfieldValue]);
                setTextfieldValue("");
              } else {
                setError(true);
              }
            }
          }}
        />
      </CardContent>

      <Dialog
        open={editIndex >= 0}
        onClose={() => setEditIndex(-1)}
        disableRestoreFocus
      >
        <TextField
          inputRef={textfieldRef}
          autoFocus
          error={error}
          id="outlined"
          value={textfieldValue2}
          onChange={(ev) => setTextfieldValue2(ev.target.value)}
          helperText={error && "required"}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              if (textfieldValue2.length > 0) {
                setError(false);
                onChange(
                  todos.map((str, i) =>
                    editIndex === i ? textfieldValue2 : str
                  )
                );

                console.log("setting index");
                setEditIndex(-1);
              } else {
                setError(true);
              }
            }
          }}
        />
      </Dialog>
    </>
  );
}
