export function LayoutPage() {
  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        height: "100%",
        border: "10px solid green",
        boxSizing: "border-box",
      }}
    >
      <div style={{ border: "3px solid blue", height: "100px" }}></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          border: "3px solid orange",
          flex: 1,
        }}
      >
        <div style={{ border: "3px solid yellow", width: "100px" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid red",
            flex: 1,
          }}
        >
          <button>sIUUUU</button>
        </div>
      </div>
      <div style={{ height: "100px", border: "3px solid pink" }}></div>
    </div>
  );
}
