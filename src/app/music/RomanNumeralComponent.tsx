type Props = {
  romanNumeral: string
}

export function RomanNumeralComponent(props: Props) {
  var superscript = ""
  var subscript = ""
  var body = ""
  console.log("roman numeral", props.romanNumeral)
  for (let i = 0; i < props.romanNumeral.length; i++) {
    const char = props.romanNumeral[i]
    if (!isNaN(parseInt(char))) {
      superscript === "" ? (superscript = char) : (subscript = char)
    } else {
      body += char
    }
  }

  return (
    <div style={{ fontSize: 200, color: "grey" }}>
      {body}
      <span style={{ position: "absolute" }}>
        <sup style={{ fontSize: 80, display: "block", position: "relative" }}>
          {superscript}
        </sup>
        <sub style={{ fontSize: 80, display: "block", position: "relative" }}>
          {subscript}
        </sub>
      </span>
    </div>
  )
}
