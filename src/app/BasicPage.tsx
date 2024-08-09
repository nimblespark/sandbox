import {
  Checklist,
  Home,
  Menu,
  MoodBad,
  MusicNote,
  Numbers,
} from "@mui/icons-material"
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Paper,
} from "@mui/material"
import { ReactNode, useState } from "react"

type Props = {
  title: string
  children: ReactNode
}

export function BasicPage(props: Props) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  return (
    <>
      <AppBar position="static" title="Siuuu">
        <Toolbar sx={{ display: "flex" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setDrawerOpen(true)
            }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ flex: 1, display: "flex", overflow: "auto" }}>
        {props.children}
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
        }}
      >
        <List>
          <ListItemButton href="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
          <ListItemButton href="todo">
            <ListItemIcon>
              <Checklist />
            </ListItemIcon>
            <ListItemText>Todo</ListItemText>
          </ListItemButton>
          <ListItemButton href="counter">
            <ListItemIcon>
              <Numbers />
            </ListItemIcon>
            <ListItemText>Counter</ListItemText>
          </ListItemButton>
          <ListItemButton href="rating">
            <ListItemIcon>
              <MoodBad />
            </ListItemIcon>
            <ListItemText>Rating</ListItemText>
          </ListItemButton>
          <ListItemButton href="shifts">
            <ListItemIcon>
              <MoodBad />
            </ListItemIcon>
            <ListItemText>Shifts</ListItemText>
          </ListItemButton>
          <ListItemButton href="music">
            <ListItemIcon>
              <MusicNote />
            </ListItemIcon>
            <ListItemText>Chord Generator</ListItemText>
          </ListItemButton>
        </List>
      </Drawer>
    </>
  )
}
