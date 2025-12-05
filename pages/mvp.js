// app/mvp/page.js

export default function MVPPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to the MVP Page</h1>

      <p style={{ marginTop: "1rem" }}>
        This is a minimal starter page for your MVP. Replace this with your
        actual content or components as needed.
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Example Button
        </button>
      </div>
    </main>
  );
}
