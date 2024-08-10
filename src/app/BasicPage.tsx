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
import { Link } from "react-router-dom"

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
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/todo">
            <ListItemIcon>
              <Checklist />
            </ListItemIcon>
            <ListItemText>Todo</ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/counter">
            <ListItemIcon>
              <Numbers />
            </ListItemIcon>
            <ListItemText>Counter</ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/rating">
            <ListItemIcon>
              <MoodBad />
            </ListItemIcon>
            <ListItemText>Rating</ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/shifts">
            <ListItemIcon>
              <MoodBad />
            </ListItemIcon>
            <ListItemText>Shifts</ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/music">
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
