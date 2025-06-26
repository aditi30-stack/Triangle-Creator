import { useMemo, useState } from "react";
import "./TriangleStyles.css"

export const CreateTriangle = () => {
  const [AB, setAB] = useState("");
  const [BC, setBC] = useState("");
  const [CA, setCA] = useState("");

  const [angleA, setAngleA] = useState("");
  const [angleB, setAngleB] = useState("");
  const [angleC, setAngleC] = useState("");

  const isAllSidesPresent = AB > 0 && BC > 0 && CA > 0;
  const isAllAnglesPresent = angleA > 0 && angleB > 0 && angleC > 0;

  const validSideTriangle = useMemo(() => {
    const a = Number(AB), b = Number(BC), c = Number(CA);
    return a + b > c && b + c > a && a + c > b;
  }, [AB, BC, CA]);

  const validAngleTriangle = useMemo(() => {
    const A = Number(angleA), B = Number(angleB), C = Number(angleC);
    return A + B + C === 180;
  }, [angleA, angleB, angleC]);

  const classification = useMemo(() => {
    if (!isAllSidesPresent || !isAllAnglesPresent || !validSideTriangle || !validAngleTriangle) return null;

    const a = Number(AB), b = Number(BC), c = Number(CA);
    const A = Number(angleA), B = Number(angleB), C = Number(angleC);

    const isRight = A === 90 || B === 90 || C === 90;
    const allSidesEqual = a === b && b === c;
    const twoSidesEqual = a === b || b === c || a === c;
    const allAnglesEqual = A === 60 && B === 60 && C === 60;

    if (allSidesEqual && allAnglesEqual) return "Equilateral Triangle 🔺";
    if (twoSidesEqual) {
      return isRight ? "Right-Angled Isosceles Triangle 🔺" : "Isosceles Triangle 🔺";
    }
    return isRight ? "Right-Angled Scalene Triangle 🔺" : "Scalene Triangle 🔺";
  }, [AB, BC, CA, angleA, angleB, angleC, validSideTriangle, validAngleTriangle]);

  return (
    <div className="triangle-container">
      <div className="inputs-section fade-in-left">
        <h2>🔺 Identify Triangle</h2>

        <h3>Step 1: Enter Side Lengths (cm)</h3>
        {[{ label: "AB", value: AB, setter: setAB }, { label: "BC", value: BC, setter: setBC }, { label: "CA", value: CA, setter: setCA }].map(({ label, value, setter }) => (
          <div key={label}>
            <label>{label}: </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              placeholder="e.g. 5"
            />
          </div>
        ))}

        <h3>Step 2: Enter Angles (degrees)</h3>
        {[{ label: "∠A", value: angleA, setter: setAngleA }, { label: "∠B", value: angleB, setter: setAngleB }, { label: "∠C", value: angleC, setter: setAngleC }].map(({ label, value, setter }) => (
          <div key={label}>
            <label>{label}: </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              placeholder="e.g. 60"
            />
          </div>
        ))}
      </div>

      <div className="visual-section fade-in-right">
        <h3>Result:</h3>
        {!isAllSidesPresent || !isAllAnglesPresent ? (
          <p className="error-msg">❌ Please enter all three side lengths and all three angles.</p>
        ) : !validSideTriangle ? (
          <p className="error-msg">❌ Invalid triangle: the sum of any two sides must be greater than the third.</p>
        ) : !validAngleTriangle ? (
          <p className="error-msg">❌ Invalid angles: the sum of angles must be exactly 180°.</p>
        ) : (
          <p className="success-msg">✅ Triangle Type: {classification}</p>
        )}

        <h3>Current Inputs:</h3>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Side</th>
              <th>Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>AB</td><td>{AB || "-"}</td></tr>
            <tr><td>BC</td><td>{BC || "-"}</td></tr>
            <tr><td>CA</td><td>{CA || "-"}</td></tr>
          </tbody>

          <thead>
            <tr>
              <th>Angle</th>
              <th>Degrees (°)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>∠A</td><td>{angleA || "-"}</td></tr>
            <tr><td>∠B</td><td>{angleB || "-"}</td></tr>
            <tr><td>∠C</td><td>{angleC || "-"}</td></tr>
          </tbody>
        </table>

        {isAllSidesPresent && isAllAnglesPresent && validSideTriangle && validAngleTriangle && (
          <svg width="500" height="300" viewBox="0 0 300 300" className="triangle-svg">
            {(() => {
              const a = Number(AB);
              const b = Number(BC);
              const c = Number(CA);

              const maxCanvasSize = 200;
              const maxSide = Math.max(a, b, c);
              const scale = maxCanvasSize / maxSide;

              const A = { x: 50, y: 250 };
              const B = { x: A.x + a * scale, y: 250 };

              const cosC = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
              const angleCInRad = Math.acos(cosC);

              const C = {
                x: A.x + c * scale * Math.cos(angleCInRad),
                y: A.y - c * scale * Math.sin(angleCInRad),
              };

              return (
                <>
                  <polygon
                    points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                    fill="#f0f8ff"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <text x={A.x - 10} y={A.y + 15}>A</text>
                  <text x={B.x + 5} y={B.y + 15}>B</text>
                  <text x={C.x} y={C.y - 5}>C</text>
                </>
              );
            })()}
          </svg>
        )}
      </div>
    </div>
  );
};
