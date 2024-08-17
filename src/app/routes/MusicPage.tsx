import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material"
import { CSSProperties, ReactElement, useState } from "react"
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from "react-hook-form"
import { BasicPage } from "../BasicPage"

enum Note {
  C = "C",
  Db = "D♭",
  D = "D",
  Eb = "E♭",
  E = "E",
  F = "F",
  Gb = "G♭",
  G = "G",
  Ab = "A♭",
  A = "A",
  Bb = "B♭",
  B = "B",
}

enum Inversion {
  root = "Root",
  first = "1st",
  second = "2nd",
  third = "3rd",
}

enum Quality {
  maj7 = "Maj7",
  dom7 = "Dom7",
  min7 = "Min7",
  half = "Half-Dim7",
  full = "Dim7",
}

enum String {
  fifth = "fifth",
  sixth = "sixth",
}

const defaultNotes: Note[] = [
  Note.C,
  Note.Db,
  Note.D,
  Note.Eb,
  Note.E,
  Note.F,
  Note.Gb,
  Note.G,
  Note.Ab,
  Note.A,
  Note.Bb,
  Note.B,
]

const defaultInversions = [
  Inversion.root,
  Inversion.first,
  Inversion.second,
  Inversion.third,
]

const defaultQualities = [
  Quality.maj7,
  Quality.dom7,
  Quality.min7,
  Quality.half,
  Quality.full,
]

import React from "react"
import { maxHeight } from "@mui/system"

const styles = {
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 14,
    fontFamily: "sans-serif",
  },
  section: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
    gridTemplateRows: "repeat(auto-fit, minmax(40px, 1fr))",
    gap: 14,
  },
  notesSection: {
    display: "grid",

    gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
    gridTemplateRows: "repeat(auto-fit, minmax(40px, 1fr))",

    gap: 14,
  },
  formGroup: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    transition: "background-color 0.3s, transform 0.1s",
    cursor: "pointer",
    flex: 1,
  },
  chordText: {
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
  toggleButton: {
    maxHeight: "50px",
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    textAlign: "center",
    justifyContent: "center",
    fontSize: 15,
    padding: 7,
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.1s",
  },
  toggleButtonsContainer: {},
  toggleButtonChecked: {
    backgroundColor: "#9df",
  },
  toggleButtonUnchecked: {
    backgroundColor: "#eee",
  },
  toggleButtonHover: {
    backgroundColor: "#b3e5fc",
  },
  toggleButtonActive: {
    transform: "scale(0.95)",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  buttonActive: {
    transform: "scale(0.95)",
  },
}

export function MusicPage() {
  const [notes, setNotes] = useState<Note[]>(defaultNotes)
  const [inversions, setInversions] = useState<Inversion[]>(defaultInversions)
  const [qualities, setQualities] = useState<Quality[]>(defaultQualities)
  const [includeString, setIncludeString] = useState<boolean>(true)

  const [chord, setChord] = useState<{
    note: Note
    inversion: Inversion
    quality: Quality
    string: String | null
  } | null>(null)

  function handleGenerate() {
    setChord({
      note: notes[Math.floor(Math.random() * notes.length)],
      inversion: inversions[Math.floor(Math.random() * inversions.length)],
      quality: qualities[Math.floor(Math.random() * qualities.length)],
      string: includeString
        ? Math.floor(Math.random() * 2) === 0
          ? String.sixth
          : String.fifth
        : null,
    })
  }

  return (
    <BasicPage title={"Chord Generator"}>
      <div style={styles.container as CSSProperties}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <Typography style={styles.chordText as CSSProperties}>
            {chord
              ? `${chord.note} ${chord.quality ? chord.quality : ""} ${
                  chord.inversion
                } ${chord.string ? ` on ${chord.string} string` : ""}`
              : "Generate a chord!"}
          </Typography>
        </div>

        <div style={styles.toggleButtonsContainer}>
          <div style={styles.notesSection}>
            {Object.values(Note).map((note) => (
              <FlatToggleButton
                key={note}
                checked={notes.includes(note)}
                onChange={() =>
                  notes.includes(note)
                    ? setNotes((notes) => notes.filter((n) => n !== note))
                    : setNotes((notes) => notes.concat(note))
                }
              >
                {note}
              </FlatToggleButton>
            ))}
          </div>
          <Divider style={{ minHeight: "5px", margin: "7px 0" }} />
          <div style={styles.section}>
            {Object.values(Inversion).map((inversion) => (
              <FlatToggleButton
                key={inversion}
                checked={inversions.includes(inversion)}
                onChange={() =>
                  inversions.includes(inversion)
                    ? setInversions((inversions) =>
                        inversions.filter((n) => n !== inversion)
                      )
                    : setInversions((inversions) =>
                        inversions.concat(inversion)
                      )
                }
              >
                {inversion}
              </FlatToggleButton>
            ))}
          </div>
          <Divider style={{ minHeight: "5px", margin: "7px 0" }} />
          <div style={styles.section}>
            {Object.values(Quality).map((quality) => (
              <FlatToggleButton
                key={quality}
                checked={qualities.includes(quality)}
                onChange={() =>
                  qualities.includes(quality)
                    ? setQualities((qualities) =>
                        qualities.filter((n) => n !== quality)
                      )
                    : setQualities((qualities) => qualities.concat(quality))
                }
              >
                {quality}
              </FlatToggleButton>
            ))}
          </div>
        </div>
        <FormGroup style={styles.formGroup}>
          <FormControlLabel
            control={
              <Switch
                checked={includeString}
                onChange={() => setIncludeString(!includeString)}
              />
            }
            label="Include string"
          />
        </FormGroup>

        <div style={{ display: "flex" }}>
          <Button
            style={styles.button}
            size="large"
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = styles.buttonActive.transform)
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={handleGenerate}
          >
            Generate
          </Button>
        </div>
      </div>
    </BasicPage>
  )
}

type FlatToggleButtonProps = {
  checked: boolean
  children: React.ReactNode
  onChange: (isChecked: boolean) => void
}

function FlatToggleButton({
  children,
  checked,
  onChange,
}: FlatToggleButtonProps) {
  return (
    <div
      style={
        {
          ...styles.toggleButton,
          ...(checked
            ? styles.toggleButtonChecked
            : styles.toggleButtonUnchecked),
        } as React.CSSProperties
      }
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor =
          styles.toggleButtonHover.backgroundColor)
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = checked
          ? styles.toggleButtonChecked.backgroundColor
          : styles.toggleButtonUnchecked.backgroundColor)
      }
      onMouseDown={(e) =>
        (e.currentTarget.style.transform = styles.toggleButtonActive.transform)
      }
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => onChange(!checked)}
    >
      <div>{children}</div>
    </div>
  )
}
