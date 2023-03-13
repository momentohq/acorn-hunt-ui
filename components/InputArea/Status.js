function StatusDot({ status }) {
  let color;
  if (status === "Connected") {
    color = "green";
  } else if (status === "Disconnected") {
    color = "red";
  } else {
    color = "gray";
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
    <div style={{ backgroundColor: color, width: "10px", height: "10px", borderRadius: "50%" }} />
    <div style={{ marginLeft: "10px", textTransform:"capitalize", fontSize: ".9rem", fontStyle: "italic", color:'#EFEFEF' }}>{status}</div>
  </div>
  );
}

export default StatusDot;
