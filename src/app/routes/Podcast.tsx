import { useEffect, useState } from "react"

export function PodcastPage() {
  function handleInputMessage(event: MIDIMessageEvent) {
    // console.log("Midi input")
    if (event.data) {
      const note = event.data[1]
      const velocity = event.data[2]
      console.log(note, velocity)

      if (velocity > 0) {
        switch (note) {
          case 48:
            handleAudio("resources/bro2.mp3")
            break
          case 45:
            handleAudio("resources/GET OUT (sound effect).mp3")
            break
          case 51:
            handleAudio("resources/let him cook.mp3")
            break
          case 49:
            handleAudio("resources/RIZZ Sound Effect-[AudioTrimmer.com].mp3")
        }
      }
    }
  }

  const handleAudio = (file: string) => {
    const audio = new Audio(file) // Replace with your file path
    audio.play()
  }

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const data = await navigator.requestMIDIAccess()
      // console.log("inputs size", data.inputs.size)
      const keys = data.inputs
      keys.forEach((input) => {
        // console.log("INPUT", input)
        input.onmidimessage = handleInputMessage
      })

      //console.log("MIDI inputs", data.inputs.entries())
    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error)
  }, [])

  return <div>Podcast</div>
}
