import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDays,
  ListChecks,
  LineChart as LineChartIcon,
  Check,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Plus,
  Dumbbell,
  Activity,
  X,
  Pencil,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------- */
/*  Design tokens                                                          */
/* ---------------------------------------------------------------------- */

const C = {
  bg: "#14171C",
  surface: "#1B1F26",
  surfaceRaised: "#232833",
  hairline: "#2E3542",
  text: "#E9E7E0",
  textMuted: "#8B93A3",
  textFaint: "#565E6D",
  brass: "#C89B3C",
  brassDim: "#7A6127",
  teal: "#4F9490",
  tealDim: "#2C4F4D",
  rust: "#B5573C",
  rustDim: "#5C2E22",
};

const FONT_HEAD = "'Oswald', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

/* ---------------------------------------------------------------------- */
/*  Program data                                                           */
/* ---------------------------------------------------------------------- */

const STRENGTH = {
  upperA: {
    label: "Upper A",
    exercises: [
      { name: "Standing / cable lateral raise", sets: "2", reps: "8–15", note: "1 RIR" },
      { name: "Cable triceps pushdown", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Cable curl", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Incline press", sets: "2", reps: "4–8", note: "1–2 RIR" },
      { name: "Chest-supported row", sets: "2", reps: "6–10", note: "1 RIR" },
      { name: "Rear-delt fly", sets: "1–2", reps: "10–15", note: "1 RIR" },
      { name: "Pulldown / pull-up", sets: "1–2", reps: "6–10", note: "1–2 RIR" },
      { name: "Overhead triceps extension", sets: "1", reps: "8–15", note: "1 RIR" },
      { name: "Serratus work", sets: "1–2", reps: "10–20", note: "" },
    ],
  },
  upperB: {
    label: "Upper B",
    exercises: [
      { name: "Machine shoulder press", sets: "2", reps: "5–10", note: "1 RIR" },
      { name: "Cable curl", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Cable triceps extension", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Flat machine / barbell press", sets: "1–2", reps: "5–8", note: "1–2 RIR" },
      { name: "Chest-supported row", sets: "2", reps: "6–10", note: "1 RIR" },
      { name: "Cable rear-delt fly", sets: "1", reps: "10–15", note: "" },
      { name: "Pull-up / pulldown", sets: "2", reps: "6–10", note: "" },
      { name: "Lateral raise", sets: "1", reps: "10–15", note: "" },
      { name: "Serratus work", sets: "1", reps: "10–20", note: "" },
    ],
  },
  lowerA: {
    label: "Lower A",
    exercises: [
      { name: "Hack squat", sets: "2", reps: "5–8", note: "1–2 RIR" },
      { name: "Seated leg curl", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Leg extension", sets: "1", reps: "8–15", note: "1 RIR" },
      { name: "Standing calf raise", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Adductor", sets: "1", reps: "8–15", note: "" },
      { name: "Abductor", sets: "1", reps: "8–15", note: "" },
      { name: "Machine crunch", sets: "2", reps: "8–15", note: "" },
    ],
  },
  lowerB: {
    label: "Lower B",
    exercises: [
      { name: "Romanian deadlift", sets: "2", reps: "5–8", note: "1–2 RIR" },
      { name: "Leg extension", sets: "2", reps: "8–15", note: "1 RIR" },
      { name: "Seated leg curl", sets: "1", reps: "8–12", note: "1 RIR" },
      { name: "Seated calf raise", sets: "2", reps: "6–12", note: "1 RIR" },
      { name: "Adductor", sets: "1", reps: "8–15", note: "" },
      { name: "Abductor", sets: "1", reps: "8–15", note: "" },
      { name: "Machine crunch", sets: "2", reps: "8–15", note: "" },
    ],
  },
  lowerA_sat: {
    label: "Lower A (abbreviated)",
    exercises: [
      { name: "Hack squat", sets: "2", reps: "5–8", note: "" },
      { name: "Seated leg curl", sets: "2", reps: "6–12", note: "" },
      { name: "Standing calf raise", sets: "2", reps: "6–12", note: "" },
      { name: "Machine crunch", sets: "2", reps: "8–15", note: "" },
    ],
  },
  lowerB_sat: {
    label: "Lower B (abbreviated)",
    exercises: [
      { name: "Romanian deadlift", sets: "2", reps: "5–8", note: "" },
      { name: "Seated leg curl", sets: "2", reps: "6–12", note: "" },
      { name: "Seated calf raise", sets: "2", reps: "6–12", note: "" },
      { name: "Machine crunch", sets: "2", reps: "8–15", note: "" },
    ],
  },
};

const CALISTHENICS = [
  { name: "Pull-ups", sets: "3", reps: "5–7 (or 1–2 if capacity is ~3)", note: "stop well short of failure" },
  { name: "Dips", sets: "2–3", reps: "4–8", note: "~2 RIR" },
  { name: "L-sit", sets: "3", reps: "10–30 sec", note: "" },
  { name: "Handstand practice", sets: "—", reps: "5–10 min total", note: "short, high-quality bouts" },
];

const ALL_EXERCISE_NAMES = Array.from(
  new Set([
    ...Object.values(STRENGTH).flatMap((t) => t.exercises.map((e) => e.name)),
    ...CALISTHENICS.map((e) => e.name),
  ])
);

function weekNumberFor(programIndex) {
  return Math.floor(programIndex / 7) + 1;
}

function vo2Detail(weekNumber) {
  const stage = (weekNumber - 1) % 8;
  if (stage <= 1) return "4 × 3 min hard / 3 min easy — build to ~90–95% HRmax by the later reps";
  if (stage <= 3) return "5 × 3 min hard / 3 min easy";
  if (stage <= 5) return "4 × 4 min hard / 3 min easy";
  if (stage === 6) return "5 × 4 min hard / 3 min easy";
  return "Deload — shorten or lighten the intervals";
}

function thresholdDetail(weekNumber) {
  const stage = (weekNumber - 1) % 8;
  if (stage <= 1) return "3 × 8 min @ RPE 7–8, 2–3 min easy recovery";
  if (stage <= 3) return "2 × 12 min @ RPE 7–8, 2–3 min easy recovery";
  if (stage <= 5) return "2 × 15 min @ RPE 7–8, 2–3 min easy recovery";
  return "20–30 min continuous @ threshold effort";
}

const ZONE2_DETAIL = "30–45 min easy, conversational pace (~60–70% HRmax)";

const CONDITIONING = {
  vo2: { label: "VO2max intervals", detail: vo2Detail, accent: "brass" },
  threshold: { label: "Lactate threshold", detail: thresholdDetail, accent: "brass" },
  zone2: { label: "Zone 2", detail: () => ZONE2_DETAIL, accent: "teal" },
};

const CYCLE = [
  { strength: "upperA", conditioning: "vo2" },
  { strength: "lowerA", conditioning: "zone2" },
  { strength: "upperB", conditioning: "threshold" },
  { strength: "lowerB", conditioning: "zone2" },
  { strength: "upperA", conditioning: "vo2" },
  { strength: "lowerA_sat", conditioning: "zone2", calisthenics: true },
  { strength: null, conditioning: null, isRest: true },
  { strength: "upperB", conditioning: "vo2" },
  { strength: "lowerB", conditioning: "zone2" },
  { strength: "upperA", conditioning: "threshold" },
  { strength: "lowerA", conditioning: "zone2" },
  { strength: "upperB", conditioning: "vo2" },
  { strength: "lowerB_sat", conditioning: "zone2", calisthenics: true },
  { strength: null, conditioning: null, isRest: true },
];

/* ---------------------------------------------------------------------- */
/*  Date helpers                                                           */
/* ---------------------------------------------------------------------- */

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function toKey(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function fromKey(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }
function fmtShort(d) { return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`; }
function fmtLong(d) { return `${DOW_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`; }

/* ---------------------------------------------------------------------- */
/*  Program index / schedule logic                                         */
/* ---------------------------------------------------------------------- */

function computeProgramIndex(dateObj, startDateObj, statusMap) {
  const days = daysBetween(startDateObj, dateObj);
  if (days < 0) return null;
  let skipsBefore = 0;
  const dStart = startOfDay(dateObj);
  for (const key in statusMap) {
    if (statusMap[key] !== "skipped") continue;
    const kd = fromKey(key);
    if (kd >= startDateObj && kd < dStart) skipsBefore++;
  }
  return days - skipsBefore;
}

function getDayPlan(dateObj, startDateObj, statusMap) {
  const key = toKey(dateObj);
  const status = statusMap[key] || "pending";
  const programIndex = computeProgramIndex(dateObj, startDateObj, statusMap);
  if (programIndex === null) {
    return { key, status: "before-start", programIndex: null };
  }
  const cyclePos = ((programIndex % 14) + 14) % 14;
  const week = weekNumberFor(programIndex);
  const slot = CYCLE[cyclePos];
  const weekLetter = cyclePos < 7 ? "A" : "B";
  return { key, status, programIndex, cyclePos, week, weekLetter, slot };
}

/* ---------------------------------------------------------------------- */
/*  Small UI atoms                                                         */
/* ---------------------------------------------------------------------- */

function AccentDot({ color, size = 7 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function Pill({ children, color }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
      style={{ color, border: `1px solid ${color}55`, borderRadius: 999, fontFamily: FONT_BODY }}
    >
      {children}
    </span>
  );
}

function slotAccent(slot) {
  if (!slot || slot.isRest) return C.textFaint;
  return slot.strength && slot.strength.startsWith("upper") ? C.brass : C.teal;
}

function slotTitle(slot) {
  if (!slot || slot.isRest) return "Rest";
  const s = STRENGTH[slot.strength];
  let t = s.label;
  if (slot.calisthenics) t += " + Calisthenics";
  return t;
}

/* ---------------------------------------------------------------------- */
/*  Day detail panel (shared by Calendar + This Week)                      */
/* ---------------------------------------------------------------------- */

function DayDetail({ dateObj, plan, onSetStatus, onClose }) {
  if (!plan || plan.status === "before-start") {
    return (
      <div
        className="p-5"
        style={{ background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}` }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 18 }}>{fmtLong(dateObj)}</h3>
          {onClose && (
            <button onClick={onClose} className="p-1" style={{ color: C.textMuted }}>
              <X size={16} />
            </button>
          )}
        </div>
        <p style={{ color: C.textMuted, fontSize: 14 }}>This date is before the program's start.</p>
      </div>
    );
  }

  const { slot, week, weekLetter, status, key } = plan;
  const accent = slotAccent(slot);
  const cond = slot.conditioning ? CONDITIONING[slot.conditioning] : null;

  return (
    <div className="p-5" style={{ background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}` }}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <div style={{ color: C.textMuted, fontSize: 12, fontFamily: FONT_BODY, letterSpacing: 0.3 }}>
            Week {week} · {weekLetter}
          </div>
          <h3 style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 20, marginTop: 2 }}>{fmtLong(dateObj)}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1" style={{ color: C.textMuted }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 mb-4">
        <AccentDot color={accent} size={9} />
        <span style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 16 }}>{slotTitle(slot)}</span>
        {status === "done" && <Pill color={C.brass}>Completed</Pill>}
        {status === "skipped" && <Pill color={C.rust}>Skipped → pushed</Pill>}
      </div>

      {slot.isRest ? (
        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>
          Actually rest. Walking and light mobility are fine — this is what makes the next quality session possible.
        </p>
      ) : (
        <>
          <div className="mb-4">
            <div style={{ color: C.textFaint, fontSize: 11, letterSpacing: 0.4, marginBottom: 6, fontFamily: FONT_BODY }}>
              STRENGTH
            </div>
            <div className="flex flex-col">
              {STRENGTH[slot.strength].exercises.map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairline}` }}
                >
                  <span style={{ color: C.text, fontSize: 13.5 }}>{e.name}</span>
                  <span style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT_MONO, whiteSpace: "nowrap", marginLeft: 12 }}>
                    {e.sets}×{e.reps}{e.note ? ` · ${e.note}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {slot.calisthenics && (
            <div className="mb-4">
              <div style={{ color: C.textFaint, fontSize: 11, letterSpacing: 0.4, marginBottom: 6, fontFamily: FONT_BODY }}>
                CALISTHENICS
              </div>
              <div className="flex flex-col">
                {CALISTHENICS.map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairline}` }}>
                    <span style={{ color: C.text, fontSize: 13.5 }}>{e.name}</span>
                    <span style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT_MONO, whiteSpace: "nowrap", marginLeft: 12 }}>
                      {e.sets}×{e.reps}{e.note ? ` · ${e.note}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cond && (
            <div className="mb-2">
              <div style={{ color: C.textFaint, fontSize: 11, letterSpacing: 0.4, marginBottom: 6, fontFamily: FONT_BODY }}>
                CONDITIONING
              </div>
              <div className="flex items-start gap-2">
                <AccentDot color={cond.accent === "brass" ? C.brass : C.teal} />
                <div>
                  <div style={{ color: C.text, fontSize: 13.5 }}>{cond.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>{cond.detail(week)}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!slot.isRest && (
        <div className="flex gap-2 mt-5">
          {status !== "done" && (
            <button
              onClick={() => onSetStatus(key, "done")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2"
              style={{ background: C.brass, color: "#1B1204", borderRadius: 7, fontSize: 13.5, fontWeight: 600 }}
            >
              <Check size={15} /> Mark complete
            </button>
          )}
          {status !== "skipped" && (
            <button
              onClick={() => onSetStatus(key, "skipped")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2"
              style={{ background: "transparent", color: C.rust, border: `1px solid ${C.rust}66`, borderRadius: 7, fontSize: 13.5, fontWeight: 600 }}
            >
              <SkipForward size={15} /> Skip → push
            </button>
          )}
          {status !== "pending" && (
            <button
              onClick={() => onSetStatus(key, "pending")}
              className="flex items-center justify-center gap-1.5 py-2 px-3"
              style={{ background: "transparent", color: C.textMuted, border: `1px solid ${C.hairline}`, borderRadius: 7, fontSize: 13.5 }}
            >
              <Undo2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Calendar tab                                                           */
/* ---------------------------------------------------------------------- */

function CalendarTab({ startDate, statusMap, onSetStatus }) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  const cells = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const startOffset = first.getDay();
    const gridStart = addDays(first, -startOffset);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [viewMonth]);

  const selectedPlan = getDayPlan(selected, startDate, statusMap);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 20 }}>
          {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            className="p-1.5"
            style={{ color: C.textMuted, border: `1px solid ${C.hairline}`, borderRadius: 6 }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            className="p-1.5"
            style={{ color: C.textMuted, border: `1px solid ${C.hairline}`, borderRadius: 6 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DOW_NAMES.map((d) => (
          <div key={d} className="text-center py-1" style={{ color: C.textFaint, fontSize: 11, fontFamily: FONT_BODY }}>
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth.getMonth();
          const plan = getDayPlan(d, startDate, statusMap);
          const accent = plan.status === "before-start" ? null : slotAccent(plan.slot);
          const isToday = daysBetween(today, d) === 0;
          const isSelected = daysBetween(selected, d) === 0;
          return (
            <button
              key={i}
              onClick={() => setSelected(d)}
              className="flex flex-col items-center justify-center py-2 gap-1"
              style={{
                opacity: inMonth ? 1 : 0.28,
                background: isSelected ? C.surfaceRaised : "transparent",
                border: isToday ? `1px solid ${C.brass}` : "1px solid transparent",
                borderRadius: 7,
              }}
            >
              <span style={{ color: C.text, fontSize: 12.5, fontFamily: FONT_MONO }}>{d.getDate()}</span>
              {accent && (
                plan.status === "skipped" ? (
                  <X size={9} color={C.rust} />
                ) : plan.status === "done" ? (
                  <Check size={9} color={C.brass} />
                ) : (
                  <AccentDot color={accent} size={5} />
                )
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5"><AccentDot color={C.brass} /><span style={{ color: C.textMuted, fontSize: 11.5 }}>Upper</span></div>
        <div className="flex items-center gap-1.5"><AccentDot color={C.teal} /><span style={{ color: C.textMuted, fontSize: 11.5 }}>Lower</span></div>
        <div className="flex items-center gap-1.5"><AccentDot color={C.textFaint} /><span style={{ color: C.textMuted, fontSize: 11.5 }}>Rest</span></div>
      </div>

      <DayDetail dateObj={selected} plan={selectedPlan} onSetStatus={onSetStatus} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  This Week tab                                                          */
/* ---------------------------------------------------------------------- */

function ThisWeekTab({ startDate, statusMap, onSetStatus }) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const [openKey, setOpenKey] = useState(toKey(today));

  return (
    <div className="flex flex-col gap-2">
      <h2 style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 20, marginBottom: 4 }}>Next 7 days</h2>
      {days.map((d) => {
        const plan = getDayPlan(d, startDate, statusMap);
        const key = toKey(d);
        const isOpen = openKey === key;
        const isToday = daysBetween(today, d) === 0;
        const accent = plan.status === "before-start" ? C.textFaint : slotAccent(plan.slot);
        return (
          <div key={key} style={{ borderBottom: `1px solid ${C.hairline}` }}>
            <button
              onClick={() => setOpenKey(isOpen ? null : key)}
              className="w-full flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <AccentDot color={accent} size={8} />
                <div className="text-left">
                  <div style={{ color: C.text, fontSize: 14, fontFamily: FONT_BODY, fontWeight: isToday ? 600 : 400 }}>
                    {fmtShort(d)}{isToday ? " · Today" : ""}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 12.5, marginTop: 1 }}>
                    {plan.status === "before-start" ? "Not started yet" : slotTitle(plan.slot)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {plan.status === "done" && <Pill color={C.brass}>Done</Pill>}
                {plan.status === "skipped" && <Pill color={C.rust}>Skipped</Pill>}
                <ChevronRight
                  size={15}
                  color={C.textFaint}
                  style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
                />
              </div>
            </button>
            {isOpen && (
              <div className="pb-4">
                <DayDetail dateObj={d} plan={plan} onSetStatus={onSetStatus} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Progress tab                                                           */
/* ---------------------------------------------------------------------- */

function LiftForm({ onAdd }) {
  const [exercise, setExercise] = useState(ALL_EXERCISE_NAMES[0]);
  const [date, setDate] = useState(toKey(new Date()));
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  const inputStyle = {
    background: C.surface,
    color: C.text,
    border: `1px solid ${C.hairline}`,
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 13.5,
    fontFamily: FONT_BODY,
  };

  return (
    <div className="flex flex-col gap-2 p-4" style={{ background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}` }}>
      <select value={exercise} onChange={(e) => setExercise(e.target.value)} style={inputStyle}>
        {ALL_EXERCISE_NAMES.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
      </div>
      <div className="flex gap-2">
        <input placeholder="Weight" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <input placeholder="Reps" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <input placeholder="Sets" inputMode="numeric" value={sets} onChange={(e) => setSets(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
      </div>
      <button
        onClick={() => {
          if (!weight) return;
          onAdd({ id: Date.now() + Math.random(), exercise, date, weight: Number(weight), reps: reps || "", sets: sets || "" });
          setWeight(""); setReps(""); setSets("");
        }}
        className="flex items-center justify-center gap-1.5 py-2 mt-1"
        style={{ background: C.brass, color: "#1B1204", borderRadius: 7, fontSize: 13.5, fontWeight: 600 }}
      >
        <Plus size={15} /> Log set
      </button>
    </div>
  );
}

function RunForm({ onAdd }) {
  const [type, setType] = useState("vo2");
  const [date, setDate] = useState(toKey(new Date()));
  const [duration, setDuration] = useState("");
  const [rpe, setRpe] = useState("");
  const [notes, setNotes] = useState("");

  const inputStyle = {
    background: C.surface,
    color: C.text,
    border: `1px solid ${C.hairline}`,
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 13.5,
    fontFamily: FONT_BODY,
  };

  return (
    <div className="flex flex-col gap-2 p-4" style={{ background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}` }}>
      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        <option value="vo2">VO2max intervals</option>
        <option value="threshold">Lactate threshold</option>
        <option value="zone2">Zone 2</option>
        <option value="other">Other</option>
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
      <div className="flex gap-2">
        <input placeholder="Duration (min)" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        <input placeholder="RPE 1–10" inputMode="numeric" value={rpe} onChange={(e) => setRpe(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
      </div>
      <input placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} />
      <button
        onClick={() => {
          if (!duration) return;
          onAdd({ id: Date.now() + Math.random(), type, date, duration: Number(duration), rpe: rpe || "", notes });
          setDuration(""); setRpe(""); setNotes("");
        }}
        className="flex items-center justify-center gap-1.5 py-2 mt-1"
        style={{ background: C.teal, color: "#08211F", borderRadius: 7, fontSize: 13.5, fontWeight: 600 }}
      >
        <Plus size={15} /> Log session
      </button>
    </div>
  );
}

function ProgressTab({ liftLogs, runLogs, onAddLift, onAddRun }) {
  const [mode, setMode] = useState("lift");
  const [liftExercise, setLiftExercise] = useState(ALL_EXERCISE_NAMES[0]);
  const [runType, setRunType] = useState("vo2");

  const liftChartData = useMemo(() => {
    return liftLogs
      .filter((l) => l.exercise === liftExercise)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => ({ date: fmtShort(fromKey(l.date)), weight: l.weight }));
  }, [liftLogs, liftExercise]);

  const runChartData = useMemo(() => {
    return runLogs
      .filter((r) => r.type === runType)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: fmtShort(fromKey(r.date)), duration: r.duration }));
  }, [runLogs, runType]);

  const tabBtn = (key, label, Icon) => (
    <button
      onClick={() => setMode(key)}
      className="flex-1 flex items-center justify-center gap-1.5 py-2"
      style={{
        color: mode === key ? C.text : C.textMuted,
        borderBottom: `2px solid ${mode === key ? C.brass : "transparent"}`,
        fontSize: 13.5,
        fontFamily: FONT_BODY,
        fontWeight: mode === key ? 600 : 400,
      }}
    >
      <Icon size={14} /> {label}
    </button>
  );

  const selectStyle = {
    background: C.surface,
    color: C.text,
    border: `1px solid ${C.hairline}`,
    borderRadius: 6,
    padding: "6px 8px",
    fontSize: 13,
    fontFamily: FONT_BODY,
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 20 }}>Progress</h2>
      <div className="flex" style={{ borderBottom: `1px solid ${C.hairline}` }}>
        {tabBtn("lift", "Lifting", Dumbbell)}
        {tabBtn("run", "Conditioning", Activity)}
      </div>

      {mode === "lift" ? (
        <>
          <LiftForm onAdd={onAddLift} />
          <div className="flex items-center justify-between">
            <span style={{ color: C.textFaint, fontSize: 11, letterSpacing: 0.4 }}>TREND</span>
            <select value={liftExercise} onChange={(e) => setLiftExercise(e.target.value)} style={selectStyle}>
              {ALL_EXERCISE_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div style={{ height: 180, background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}`, padding: 12 }}>
            {liftChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liftChartData}>
                  <CartesianGrid stroke={C.hairline} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={C.textFaint} fontSize={11} tickLine={false} />
                  <YAxis stroke={C.textFaint} fontSize={11} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 6, fontSize: 12 }} labelStyle={{ color: C.text }} />
                  <Line type="monotone" dataKey="weight" stroke={C.brass} strokeWidth={2} dot={{ r: 3, fill: C.brass }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: C.textFaint, fontSize: 12.5 }}>
                No sets logged for this exercise yet
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {liftLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((l) => (
              <div key={l.id} className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${C.hairline}` }}>
                <div>
                  <div style={{ color: C.text, fontSize: 13 }}>{l.exercise}</div>
                  <div style={{ color: C.textFaint, fontSize: 11.5 }}>{fmtShort(fromKey(l.date))}</div>
                </div>
                <div style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT_MONO }}>
                  {l.weight}{l.reps ? ` × ${l.reps}` : ""}{l.sets ? ` × ${l.sets}` : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <RunForm onAdd={onAddRun} />
          <div className="flex items-center justify-between">
            <span style={{ color: C.textFaint, fontSize: 11, letterSpacing: 0.4 }}>TREND</span>
            <select value={runType} onChange={(e) => setRunType(e.target.value)} style={selectStyle}>
              <option value="vo2">VO2max intervals</option>
              <option value="threshold">Lactate threshold</option>
              <option value="zone2">Zone 2</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ height: 180, background: C.surfaceRaised, borderRadius: 10, border: `1px solid ${C.hairline}`, padding: 12 }}>
            {runChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={runChartData}>
                  <CartesianGrid stroke={C.hairline} strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke={C.textFaint} fontSize={11} tickLine={false} />
                  <YAxis stroke={C.textFaint} fontSize={11} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.hairline}`, borderRadius: 6, fontSize: 12 }} labelStyle={{ color: C.text }} />
                  <Line type="monotone" dataKey="duration" stroke={C.teal} strokeWidth={2} dot={{ r: 3, fill: C.teal }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: C.textFaint, fontSize: 12.5 }}>
                No sessions logged for this type yet
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {runLogs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12).map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${C.hairline}` }}>
                <div>
                  <div style={{ color: C.text, fontSize: 13 }}>{CONDITIONING[r.type]?.label || "Other"}</div>
                  <div style={{ color: C.textFaint, fontSize: 11.5 }}>{fmtShort(fromKey(r.date))}{r.notes ? ` · ${r.notes}` : ""}</div>
                </div>
                <div style={{ color: C.textMuted, fontSize: 13, fontFamily: FONT_MONO }}>
                  {r.duration}min{r.rpe ? ` · RPE ${r.rpe}` : ""}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Root app                                                               */
/* ---------------------------------------------------------------------- */

export default function FitnessApp() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("week");
  const [startDate, setStartDate] = useState(startOfDay(new Date()));
  const [statusMap, setStatusMap] = useState({});
  const [liftLogs, setLiftLogs] = useState([]);
  const [runLogs, setRunLogs] = useState([]);
  const [editingStart, setEditingStart] = useState(false);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const meta = { value: localStorage.getItem("program-meta") };
        if (meta?.value) {
          const parsed = JSON.parse(meta.value);
          if (parsed.startDate) setStartDate(startOfDay(fromKey(parsed.startDate)));
        }
      } catch (e) {}
      try {
        const status = { value: localStorage.getItem("day-status") };
        if (status?.value) setStatusMap(JSON.parse(status.value));
      } catch (e) {}
      try {
        const lifts = { value: localStorage.getItem("lift-logs") };
        if (lifts?.value) setLiftLogs(JSON.parse(lifts.value));
      } catch (e) {}
      try {
        const runs = { value: localStorage.getItem("run-logs") };
        if (runs?.value) setRunLogs(JSON.parse(runs.value));
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const persistStatusMap = useCallback(async (next) => {
    setStatusMap(next);
    try { localStorage.setItem("day-status", JSON.stringify(next)); } catch (e) {}
  }, []);

  const persistStartDate = useCallback(async (d) => {
    setStartDate(startOfDay(d));
    try { localStorage.setItem("program-meta", JSON.stringify({ startDate: toKey(d) })); } catch (e) {}
  }, []);

  const handleSetStatus = useCallback((dateKey, status) => {
    const next = { ...statusMap };
    if (status === "pending") delete next[dateKey];
    else next[dateKey] = status;
    persistStatusMap(next);
  }, [statusMap, persistStatusMap]);

  const handleAddLift = useCallback(async (entry) => {
    const next = [...liftLogs, entry];
    setLiftLogs(next);
    try { localStorage.setItem("lift-logs", JSON.stringify(next)); } catch (e) {}
  }, [liftLogs]);

  const handleAddRun = useCallback(async (entry) => {
    const next = [...runLogs, entry];
    setRunLogs(next);
    try { localStorage.setItem("run-logs", JSON.stringify(next)); } catch (e) {}
  }, [runLogs]);

  const todayPlan = getDayPlan(startOfDay(new Date()), startDate, statusMap);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: C.bg, minHeight: 480 }}>
        <span style={{ color: C.textMuted, fontFamily: FONT_BODY, fontSize: 13 }}>Loading…</span>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: 600, fontFamily: FONT_BODY }} className="w-full flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${C.hairline}` }}>
        <div className="flex items-center justify-between">
          <div>
            <div style={{ fontFamily: FONT_HEAD, color: C.text, fontSize: 22, letterSpacing: 0.5 }}>
              SPLIT / RUN
            </div>
            <div style={{ color: C.textMuted, fontSize: 12.5, marginTop: 2 }}>
              {todayPlan.status === "before-start"
                ? `Program starts ${fmtShort(startDate)}`
                : `Week ${todayPlan.week} · ${todayPlan.weekLetter} — ${slotTitle(todayPlan.slot)}`}
            </div>
          </div>
          <button onClick={() => setEditingStart((v) => !v)} className="p-2" style={{ color: C.textFaint }}>
            <Pencil size={15} />
          </button>
        </div>
        {editingStart && (
          <div className="flex items-center gap-2 mt-3">
            <span style={{ color: C.textMuted, fontSize: 12.5 }}>Program start date</span>
            <input
              type="date"
              value={toKey(startDate)}
              onChange={(e) => persistStartDate(fromKey(e.target.value))}
              style={{ background: C.surface, color: C.text, border: `1px solid ${C.hairline}`, borderRadius: 6, padding: "5px 8px", fontSize: 13 }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-5 flex-1">
        {tab === "calendar" && <CalendarTab startDate={startDate} statusMap={statusMap} onSetStatus={handleSetStatus} />}
        {tab === "week" && <ThisWeekTab startDate={startDate} statusMap={statusMap} onSetStatus={handleSetStatus} />}
        {tab === "progress" && (
          <ProgressTab liftLogs={liftLogs} runLogs={runLogs} onAddLift={handleAddLift} onAddRun={handleAddRun} />
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex" style={{ borderTop: `1px solid ${C.hairline}`, background: C.surface }}>
        {[
          { key: "calendar", label: "Calendar", Icon: CalendarDays },
          { key: "week", label: "This Week", Icon: ListChecks },
          { key: "progress", label: "Progress", Icon: LineChartIcon },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 flex flex-col items-center gap-1 py-3"
            style={{ color: tab === key ? C.brass : C.textFaint }}
          >
            <Icon size={18} />
            <span style={{ fontSize: 10.5, fontFamily: FONT_BODY }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
