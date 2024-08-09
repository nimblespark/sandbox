import { useState } from "react";
import { TodoList } from "../../TodoList";
import { BasicPage } from "../BasicPage";
import { IconButton, Input, Tab, Tabs } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

export function TodoPage() {
  const [lists, setLists] = useState<string[][]>([[]]);
  const [currentList, setCurrentList] = useState<number>(0);
  const [todoNames, setTodoNames] = useState<string[]>(["List 1"]);

  function handleChange(newList: string[]) {
    const copyOfTodos = [...lists];
    copyOfTodos[currentList] = newList;
    setLists(copyOfTodos);
  }

  function handleTabChange(_: any, value: any) {
    setCurrentList(value as number);
  }

  return (
    <BasicPage title="Todo">
      <div style={{ display: "flex" }}>
        <Tabs
          value={currentList}
          onChange={handleTabChange}
          variant="scrollable"
        >
          {lists.map((_, i) => (
            <Tab
              style={{ textTransform: "none" }}
              key={i}
              label={
                i == currentList ? (
                  <div>
                    <Input
                      inputProps={{ maxLength: 15 }}
                      style={{ width: 120, textAlign: "center" }}
                      onChange={(ev) => {
                        const todosWithChange = todoNames;
                        todosWithChange[i] = ev.target.value;
                        return setTodoNames(todosWithChange);
                      }}
                      disableUnderline
                      size="small"
                      defaultValue={todoNames[i]}
                    />
                    {lists.length > 1 && (
                      <IconButton
                        onClick={() => {
                          setLists([...lists].filter((_, j) => j !== i));
                          if (currentList > 0) {
                            setCurrentList(currentList - 1);
                          }
                          setTodoNames(
                            [...todoNames].filter((_, j) => j !== i)
                          );
                        }}
                      >
                        <Close />
                      </IconButton>
                    )}
                  </div>
                ) : (
                  todoNames[i]
                )
              }
            />
          ))}
        </Tabs>
        <IconButton
          onClick={() => {
            setLists([...lists, []]);
            setCurrentList(lists.length);
            setTodoNames([...todoNames, `List ${lists.length + 1}`]);
          }}
        >
          <Add />
        </IconButton>
      </div>

      <TodoList
        todos={lists[currentList]}
        onChange={(newList) => handleChange(newList)}
      />
    </BasicPage>
  );
}
