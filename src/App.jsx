import React, { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:         "#F5F6F8",
  surface:    "#FFFFFF",
  surfaceAlt: "#F9FAFB",
  border:     "#E4E7EC",
  borderDark: "#C8CDD6",
  text:       "#0F1923",
  textMid:    "#3D4F63",
  textSoft:   "#7C8FA3",
  textDim:    "#A8B5C2",
  green:      "#0A6E3F",
  greenMid:   "#0D8A50",
  greenLight: "#E8F5EE",
  greenGlow:  "rgba(10,110,63,0.12)",
  gold:       "#B8860B",
  goldLight:  "#FDF6E3",
  red:        "#C0392B",
  redLight:   "#FDECEA",
  blue:       "#1A56DB",
  blueLight:  "#EBF0FD",
  purple:     "#6C3FC8",
  purpleLight:"#F0EBFB",
  amber:      "#D97706",
  amberLight: "#FEF3C7",
  teal:       "#0D7377",
  tealLight:  "#E6F4F4",
  coral:      "#C4473A",
  coralLight: "#FBEAE9",
};

const ROLES = {
  super_admin:           { label:"Super Admin",          color:C.purple, bg:C.purpleLight, icon:"⚙️"  },
  tournament_organizer:  { label:"Tournament Organizer",  color:C.blue,   bg:C.blueLight,  icon:"🏆"  },
  team_manager:          { label:"Team Manager",          color:C.green,  bg:C.greenLight, icon:"🧩"  },
  data_entry:            { label:"Data Entry",            color:C.amber,  bg:C.amberLight, icon:"📊"  },
  master_referee:        { label:"Master Referee",        color:C.coral,  bg:C.coralLight, icon:"🟥"  },
  medic:                 { label:"Medic",                 color:C.teal,   bg:C.tealLight,  icon:"🏥"  },
};

const ALL_TEAMS = [
  { id:"t1", name:"Nairobi Rhinos RFC",     has_manager:false },
  { id:"t2", name:"Mombasa Lions RFC",      has_manager:true  },
  { id:"t3", name:"Kisumu Tigers RFC",      has_manager:false },
  { id:"t4", name:"Eldoret Bulls RFC",      has_manager:false },
  { id:"t5", name:"Nakuru Eagles RFC",      has_manager:true  },
  { id:"t6", name:"Thika Panthers RFC",     has_manager:false },
  { id:"t7", name:"Nyeri Sharks RFC",       has_manager:false },
  { id:"t8", name:"Machakos Cobras RFC",    has_manager:true  },
  { id:"t9", name:"Garissa Hawks RFC",      has_manager:false },
  { id:"t10",name:"Malindi Falcons RFC",    has_manager:false },
];

const GS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #F5F6F8; color: #0F1923; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #F5F6F8; }
  ::-webkit-scrollbar-thumb { background: #C8CDD6; border-radius: 3px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes slideInPanel { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .fade-up  { animation: fadeUp 0.45s ease both; }
  .fade-in  { animation: fadeIn 0.3s ease both; }
  .scale-in { animation: scaleIn 0.2s ease both; }
  .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 22px; border-radius: 8px; border: none; background: #0A6E3F; color: #fff; font-family: 'DM Sans'; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
  .btn-primary:hover { background: #0D8A50; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(10,110,63,0.18); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: 1.5px solid #E4E7EC; background: transparent; color: #3D4F63; font-family: 'DM Sans'; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
  .btn-ghost:hover { border-color: #C8CDD6; background: #F9FAFB; }
  .btn-outline-green { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: 1.5px solid #0A6E3F; background: transparent; color: #0A6E3F; font-family: 'DM Sans'; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
  .btn-outline-green:hover { background: #E8F5EE; }
  .card { background: #FFFFFF; border: 1px solid #E4E7EC; border-radius: 12px; transition: box-shadow 0.18s; }
  .card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #E4E7EC; border-radius: 8px; background: #FFFFFF; color: #0F1923; font-family: 'DM Sans'; font-size: 14px; outline: none; transition: border-color 0.18s; box-sizing: border-box; }
  .input-field:focus { border-color: #0A6E3F; }
  .input-field::placeholder { color: #A8B5C2; }
  .label { display: block; font-size: 12px; font-weight: 600; color: #3D4F63; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; font-family: 'JetBrains Mono'; }
  .sidebar-link { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: #3D4F63; transition: all 0.15s; margin-bottom: 2px; border: 1px solid transparent; }
  .sidebar-link:hover { background: #F9FAFB; color: #0F1923; }
  .sidebar-link.active { background: #E8F5EE; color: #0A6E3F; border-color: rgba(10,110,63,0.15); font-weight: 600; }
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; font-family: 'JetBrains Mono'; }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ label, color = C.green, bg }) => (
  <span className="badge" style={{ color, background: bg || color + "18", border: `1px solid ${color}28` }}>{label}</span>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label className="label">{label}</label>
    {children}
  </div>
);

const Input = (props) => <input className="input-field" {...props} />;

const SelectField = ({ options, placeholder, ...props }) => (
  <select className="input-field" style={{ cursor: "pointer" }} {...props}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
    <div style={{ flex: 1, height: 1, background: C.border }} />
    {label && <span style={{ fontSize: 11, color: C.textSoft, fontFamily: "'JetBrains Mono'", letterSpacing: "0.06em" }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

const Alert = ({ type = "info", children }) => {
  const map = {
    info:    { bg: C.blueLight,  color: C.blue,  border: C.blue  + "30" },
    success: { bg: C.greenLight, color: C.green, border: C.green + "30" },
    warning: { bg: C.amberLight, color: C.amber, border: C.amber + "30" },
    error:   { bg: C.redLight,   color: C.red,   border: C.red   + "30" },
  };
  const s = map[type];
  return (
    <div style={{ padding: "10px 14px", borderRadius: 8, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 13, marginBottom: 14 }}>
      {children}
    </div>
  );
};

const StatCard = ({ icon, label, value, color = C.green, sub }) => (
  <div className="card" style={{ padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
    <div style={{ width: 42, height: 42, borderRadius: 10, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 11, color: C.textSoft, fontFamily: "'JetBrains Mono'", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Syne'", color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textSoft, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const Topbar = ({ user, onLogout, notifCount = 0 }) => {
  const role = ROLES[user?.role] || {};
  return (
    <div style={{ height: 56, background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontFamily: "'Syne'", fontSize: 14, fontWeight: 800 }}>P</span>
        </div>
        <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 16, color: C.text }}>ProGame</span>
        <span style={{ fontSize: 11, color: C.textSoft, fontFamily: "'JetBrains Mono'" }}>Rugby</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {notifCount > 0 && (
          <div style={{ position: "relative", cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>🔔</span>
            <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifCount}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: role.bg || C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{role.icon}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 11, color: C.textSoft }}>{role.label}</div>
          </div>
        </div>
        <button onClick={onLogout} className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}>Sign out</button>
      </div>
    </div>
  );
};

const Sidebar = ({ links, active, onNav, user }) => {
  const role = ROLES[user?.role] || {};
  return (
    <div style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, padding: "20px 12px", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
      <div style={{ marginBottom: 20, padding: "10px 12px", background: role.bg || C.greenLight, borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: role.color || C.green, fontFamily: "'JetBrains Mono'", fontWeight: 600, marginBottom: 2 }}>{(role.label || "").toUpperCase()}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{user?.name}</div>
        <div style={{ fontSize: 11, color: C.textSoft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
      </div>
      <div style={{ flex: 1 }}>
        {links.map(l => (
          <div key={l.id} className={`sidebar-link${active === l.id ? " active" : ""}`} onClick={() => onNav(l.id)}>
            <span style={{ fontSize: 16 }}>{l.icon}</span>
            <span style={{ flex: 1 }}>{l.label}</span>
            {l.badge && <Badge label={l.badge} color={C.red} bg={C.redLight}/>}
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 12px", fontSize: 11, color: C.textDim, fontFamily: "'JetBrains Mono'" }}>ProGame Rugby v1.0</div>
    </div>
  );
};

const DashboardShell = ({ user, onLogout, links, active, onNav, children, notifCount = 0 }) => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>
    <Topbar user={user} onLogout={onLogout} notifCount={notifCount}/>
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 56px)" }}>
      <Sidebar links={links} active={active} onNav={onNav} user={user}/>
      <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>{children}</main>
    </div>
  </div>
);

const ComingSoon = ({ icon, label }) => (
  <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 14 }}>
    <span style={{ fontSize: 52 }}>{icon}</span>
    <div style={{ fontFamily: "'Syne'", fontSize: 22, fontWeight: 700, color: C.text }}>{label}</div>
    <Badge label="Phase 2 →" color={C.green}/>
    <p style={{ fontSize: 14, color: C.textSoft, textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>This module will be fully built in the next phase. The structure and navigation are ready.</p>
  </div>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ onLogin, onRegister, onPublic }) => (
  <div style={{ minHeight: "100vh", background: C.surface }}>
    <nav style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: C.surface, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontFamily: "'Syne'", fontSize: 17, fontWeight: 800 }}>P</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 18, color: C.text, letterSpacing: "-0.02em", lineHeight: 1 }}>ProGame</div>
          <div style={{ fontSize: 10, color: C.textSoft, fontFamily: "'JetBrains Mono'", letterSpacing: "0.08em" }}>RUGBY PLATFORM</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-ghost" onClick={onPublic} style={{ fontSize: 13 }}>📺 Live scores</button>
        <button className="btn-ghost" onClick={onLogin} style={{ fontSize: 13 }}>Sign in</button>
        <button className="btn-primary" onClick={onRegister} style={{ fontSize: 13 }}>Create account</button>
      </div>
    </nav>

    <div style={{ padding: "80px 48px 64px", maxWidth: 1100, margin: "0 auto" }}>
      <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", background: C.greenLight, borderRadius: 20, border: "1px solid rgba(10,110,63,0.2)", marginBottom: 28 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }}/>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.green, fontFamily: "'JetBrains Mono'" }}>Kenya Rugby Tournament Management</span>
      </div>
      <div className="fade-up" style={{ animationDelay: "0.1s" }}>
        <h1 style={{ fontFamily: "'Syne'", fontSize: 54, fontWeight: 800, color: C.text, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 680 }}>
          The complete platform for{" "}
          <span style={{ color: C.green }}>rugby tournament</span>{" "}management
        </h1>
        <p style={{ fontSize: 17, color: C.textMid, lineHeight: 1.7, maxWidth: 540, marginBottom: 36 }}>
          Player verification, live scoring, facial recognition tagging, cards, injuries — everything managed in one place.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-primary" onClick={onRegister} style={{ padding: "14px 28px", fontSize: 15 }}>Get started →</button>
          <button className="btn-ghost" onClick={onPublic} style={{ padding: "14px 28px", fontSize: 15 }}>📺 Live scores</button>
        </div>
      </div>
    </div>

    <div style={{ background: C.bg, padding: "56px 48px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: C.green, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Who uses ProGame</div>
          <h2 style={{ fontFamily: "'Syne'", fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>Built for every role on match day</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { role:"tournament_organizer", desc:"Create tournaments, set schedules, verify player squads and manage cards/suspensions." },
            { role:"team_manager",         desc:"Submit player profiles with IDs and photos, build squads and receive alerts." },
            { role:"data_entry",           desc:"Control the match clock, enter live scores and schedule upcoming matches." },
            { role:"master_referee",       desc:"Record yellow/red cards and incidents that instantly notify all relevant parties." },
            { role:"medic",                desc:"Log player injuries per team with alerts sent directly to managers and organizers." },
            { role:"super_admin",          desc:"Resolve disputes, manage fake registrations and monitor platform statistics." },
          ].map((item, i) => {
            const r = ROLES[item.role];
            return (
              <div key={i} className="card fade-up" style={{ padding: "20px 22px", animationDelay: `${i * 0.07}s` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>{r.icon}</div>
                <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 14, color: r.color, marginBottom: 6 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <div style={{ padding: "56px 48px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: C.green, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>No login required</div>
          <h2 style={{ fontFamily: "'Syne'", fontSize: 30, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", marginBottom: 14 }}>Public live scores & player pool</h2>
          <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.7, marginBottom: 22 }}>Anyone can watch live scores, view standings, see match timelines and browse the full player pool — no account needed.</p>
          <button className="btn-outline-green" onClick={onPublic}>📺 Watch live now</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon:"📺", label:"Live scores",    desc:"Real-time updates" },
            { icon:"🏉", label:"Player pool",    desc:"All registered players" },
            { icon:"📋", label:"Standings",      desc:"EPL-style table" },
            { icon:"⏱️", label:"Match timeline", desc:"Try, conversion, penalty" },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: "14px 16px" }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginTop: 8 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: C.textSoft }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ padding: "22px 48px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: C.textDim }}>© 2025 ProGame · Rugby Platform</span>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-ghost" onClick={onLogin} style={{ fontSize: 12, padding: "6px 14px" }}>Sign in</button>
        <button className="btn-primary" onClick={onRegister} style={{ fontSize: 12, padding: "6px 14px" }}>Register</button>
      </div>
    </div>
  </div>
);

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
const RegisterPage = ({ onBack, onSuccess }) => {
  const [step, setStep]       = useState(1);
  const [role, setRole]       = useState("");
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"", confirm:"", team_id:"", referee_id:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const availableTeams = ALL_TEAMS.filter(t => role === "team_manager" ? !t.has_manager : true);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (role === "team_manager" && !form.team_id) { setError("Please select your team."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSuccess({ name: form.name, email: form.email, role, team_id: form.team_id });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: step === 1 ? 760 : 500 }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "'Syne'", fontSize: 17, fontWeight: 800 }}>P</span>
            </div>
            <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 20, color: C.text }}>ProGame</span>
          </div>
          <h2 style={{ fontFamily: "'Syne'", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            {step === 1 ? "Create your account" : `Register as ${ROLES[role]?.label}`}
          </h2>
          <p style={{ fontSize: 14, color: C.textSoft }}>{step === 1 ? "Select your role to get started" : "Fill in your details below"}</p>
        </div>

        {step === 1 && (
          <div className="fade-up" style={{ animationDelay: "0.1s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <div key={key} onClick={() => { setRole(key); setStep(2); setError(""); }}
                  style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "20px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.background = r.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 5 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: C.textSoft, lineHeight: 1.5 }}>
                    {key === "tournament_organizer" && "Manage tournaments & verify players"}
                    {key === "team_manager"         && "Register team & submit player profiles"}
                    {key === "data_entry"           && "Enter scores & control match clock"}
                    {key === "master_referee"       && "Record cards & match incidents"}
                    {key === "medic"                && "Log injuries & alert team staff"}
                    {key === "super_admin"          && "Platform admin & dispute resolution"}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 22 }}>
              <button className="btn-ghost" onClick={onBack}>← Back to home</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up scale-in" style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "32px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, padding: "10px 14px", background: ROLES[role]?.bg, borderRadius: 8, border: `1px solid ${ROLES[role]?.color}28` }}>
              <span style={{ fontSize: 20 }}>{ROLES[role]?.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ROLES[role]?.color }}>{ROLES[role]?.label}</div>
                <div style={{ fontSize: 11, color: C.textSoft }}>Registering as {ROLES[role]?.label}</div>
              </div>
              <button onClick={() => setStep(1)} style={{ fontSize: 11, color: C.textSoft, background: "none", border: "none", cursor: "pointer" }}>Change →</button>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Full Name *"><Input placeholder="John Kamau" value={form.name} onChange={e => set("name", e.target.value)}/></Field>
              <Field label="Email Address *"><Input type="email" placeholder="john@example.com" value={form.email} onChange={e => set("email", e.target.value)}/></Field>
              <Field label="Phone Number"><Input type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => set("phone", e.target.value)}/></Field>
              {role === "master_referee" && (
                <Field label="Referee Badge / ID"><Input placeholder="KRU-REF-XXXX" value={form.referee_id} onChange={e => set("referee_id", e.target.value)}/></Field>
              )}
            </div>

            {role === "team_manager" && (
              <Field label="Your Team *">
                <SelectField placeholder="— Select your team —" value={form.team_id} onChange={e => set("team_id", e.target.value)}
                  options={availableTeams.map(t => ({ value: t.id, label: t.name }))}/>
                <div style={{ fontSize: 11, color: C.textSoft, marginTop: 6 }}>⚠️ Teams with a registered manager are not shown. Each team can only have one Team Manager.</div>
              </Field>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Password *"><Input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set("password", e.target.value)}/></Field>
              <Field label="Confirm Password *"><Input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set("confirm", e.target.value)}/></Field>
            </div>

            <div style={{ padding: "10px 14px", background: C.surfaceAlt, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: C.textMid, marginBottom: 20, lineHeight: 1.6 }}>
              🔐 Your account will be reviewed by the Super Admin before you can access all features.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setStep(1)} style={{ flex: "0 0 110px" }}>← Back</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                {loading ? "Creating account..." : "Create account →"}
              </button>
            </div>

            <Divider label="Already have an account?"/>
            <div style={{ textAlign: "center" }}>
              <button className="btn-ghost" onClick={onBack} style={{ fontSize: 13 }}>Sign in instead</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onBack, onLogin }) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const DEMO = {
    "admin@progame.com":       { role:"super_admin",          name:"Super Admin",      password:"admin123"   },
    "organizer@progame.com":   { role:"tournament_organizer", name:"James Mwangi",     password:"org123"     },
    "manager@nairobifc.com":   { role:"team_manager",         name:"Coach Kamau",      password:"manager123" },
    "data@progame.com":        { role:"data_entry",           name:"Data Entry",       password:"data123"    },
    "referee@progame.com":     { role:"master_referee",       name:"Ref John Omondi",  password:"ref123"     },
    "medic@progame.com":       { role:"medic",                name:"Dr. Wanjiku",       password:"medic123"   },
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const acc = DEMO[email.toLowerCase()];
    if (acc && acc.password === password) {
      onLogin({ email, name: acc.name, role: acc.role });
    } else {
      setError("Invalid email or password. Use one of the demo accounts below.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontFamily: "'Syne'", fontSize: 17, fontWeight: 800 }}>P</span>
            </div>
            <span style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 20, color: C.text }}>ProGame</span>
          </div>
          <h2 style={{ fontFamily: "'Syne'", fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 5 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: C.textSoft }}>Sign in to your ProGame account</p>
        </div>

        <div className="fade-in card" style={{ padding: "32px 36px" }}>
          {error && <Alert type="error">{error}</Alert>}
          <Field label="Email Address"><Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleLogin()}/></Field>
          <Field label="Password">
            <div style={{ position: "relative" }}>
              <Input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleLogin()} style={{ paddingRight: 44 }}/>
              <button onClick={() => setShowPw(!showPw)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textSoft,fontSize:15 }}>
                {showPw?"🙈":"👁️"}
              </button>
            </div>
          </Field>
          <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width:"100%",marginBottom:14 }}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          <Divider label="Demo accounts"/>
          <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
            {Object.entries(DEMO).map(([em, acc]) => {
              const r = ROLES[acc.role];
              return (
                <button key={em} onClick={() => { setEmail(em); setPassword(acc.password); }}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",border:`1px solid ${C.border}`,borderRadius:8,background:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=r.bg; e.currentTarget.style.borderColor=r.color+"40"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=C.border; }}>
                  <span style={{ fontSize:16 }}>{r.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,fontWeight:600,color:C.text }}>{acc.name}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{em}</div>
                  </div>
                  <span style={{ fontSize:11,color:r.color,fontFamily:"'JetBrains Mono'",fontWeight:600 }}>{acc.password}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign:"center",marginTop:18 }}>
          <span style={{ fontSize:13,color:C.textSoft }}>Don't have an account? </span>
          <button onClick={onBack} style={{ fontSize:13,color:C.green,background:"none",border:"none",cursor:"pointer",fontWeight:600 }}>Register here</button>
        </div>
      </div>
    </div>
  );
};

// ─── PUBLIC LIVE PAGE ─────────────────────────────────────────────────────────
const PublicPage = ({ onBack }) => {
  const [tab, setTab] = useState("live");

  const liveMatch = { home:"Nairobi Rhinos RFC", away:"Kisumu Tigers RFC", hs:21, as:14, half:"2nd Half", minute:58 };
  const standings = [
    { pos:1,team:"Nairobi Rhinos RFC",  p:6,w:5,d:0,l:1,pts:25,gd:"+42" },
    { pos:2,team:"Mombasa Lions RFC",   p:6,w:4,d:1,l:1,pts:21,gd:"+28" },
    { pos:3,team:"Kisumu Tigers RFC",   p:6,w:3,d:1,l:2,pts:16,gd:"+11" },
    { pos:4,team:"Eldoret Bulls RFC",   p:6,w:2,d:0,l:4,pts:8, gd:"-18" },
    { pos:5,team:"Nakuru Eagles RFC",   p:5,w:1,d:1,l:3,pts:5, gd:"-30" },
    { pos:6,team:"Thika Panthers RFC",  p:5,w:0,d:1,l:4,pts:1, gd:"-33" },
  ];
  const timeline = [
    { min:3, type:"Try",        team:"home",player:"J. Kamau",   score:"5–0"  },
    { min:5, type:"Conversion", team:"home",player:"P. Omondi",  score:"7–0"  },
    { min:18,type:"Penalty",    team:"away",player:"M. Otieno",  score:"7–3"  },
    { min:31,type:"Try",        team:"away",player:"B. Waweru",  score:"7–8"  },
    { min:33,type:"Conversion", team:"away",player:"M. Otieno",  score:"7–10" },
    { min:40,type:"Half Time",  team:"",    player:"",           score:"7–10" },
    { min:44,type:"Try",        team:"home",player:"D. Njoroge", score:"12–10"},
    { min:46,type:"Conversion", team:"home",player:"P. Omondi",  score:"14–10"},
    { min:52,type:"Try",        team:"home",player:"J. Kamau",   score:"19–10"},
    { min:54,type:"Conversion", team:"home",player:"P. Omondi",  score:"21–10"},
    { min:57,type:"Penalty",    team:"away",player:"M. Otieno",  score:"21–13"},
    { min:58,type:"Penalty",    team:"away",player:"M. Otieno",  score:"21–14"},
  ];
  const players = [
    { name:"James Kamau",   team:"Nairobi Rhinos RFC",pos:"Prop",      jersey:1, tries:8,status:"Active"    },
    { name:"Peter Omondi",  team:"Nairobi Rhinos RFC",pos:"Fly-half",  jersey:10,tries:3,status:"Active"    },
    { name:"Moses Otieno",  team:"Kisumu Tigers RFC", pos:"Full-back", jersey:15,tries:5,status:"Active"    },
    { name:"Brian Waweru",  team:"Kisumu Tigers RFC", pos:"Winger",    jersey:11,tries:6,status:"Active"    },
    { name:"Daniel Njoroge",team:"Nairobi Rhinos RFC",pos:"Centre",    jersey:13,tries:4,status:"Injured"   },
    { name:"Ali Mwangi",    team:"Mombasa Lions RFC", pos:"Hooker",    jersey:2, tries:7,status:"Active"    },
    { name:"Grace Wanjiku", team:"Nakuru Eagles RFC", pos:"Scrum-half",jersey:9, tries:2,status:"Active"    },
    { name:"Tom Baraka",    team:"Eldoret Bulls RFC", pos:"No. 8",     jersey:8, tries:3,status:"Suspended" },
  ];

  const typeColor = { Try:C.green, Conversion:C.blue, Penalty:C.gold, "Half Time":C.textSoft };

  return (
    <div style={{ minHeight:"100vh",background:C.bg }}>
      <nav style={{ height:56,background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:28,height:28,borderRadius:7,background:C.green,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ color:"#fff",fontFamily:"'Syne'",fontSize:13,fontWeight:800 }}>P</span>
          </div>
          <span style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:15,color:C.text }}>ProGame Rugby</span>
          <div style={{ display:"flex",alignItems:"center",gap:5,padding:"2px 8px",background:C.redLight,borderRadius:5 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
            <span style={{ fontSize:10,fontWeight:700,color:C.red,fontFamily:"'JetBrains Mono'" }}>LIVE</span>
          </div>
        </div>
        <button className="btn-ghost" onClick={onBack} style={{ fontSize:12,padding:"6px 14px" }}>← Home</button>
      </nav>

      <div style={{ maxWidth:1100,margin:"0 auto",padding:"20px 24px" }}>
        {/* Live hero */}
        <div className="card fade-up" style={{ padding:"24px 28px",marginBottom:16,borderLeft:`4px solid ${C.green}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <div style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.redLight,borderRadius:5 }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
                <span style={{ fontSize:11,fontWeight:700,color:C.red,fontFamily:"'JetBrains Mono'" }}>LIVE</span>
              </div>
              <span style={{ fontSize:12,color:C.textSoft }}>{liveMatch.half} · {liveMatch.minute}'</span>
            </div>
            <span style={{ fontSize:12,color:C.textSoft }}>KRU Cup 2025 · Final</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:20,alignItems:"center" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne'",fontSize:20,fontWeight:800,color:C.text,marginBottom:3 }}>{liveMatch.home}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>Home</div>
            </div>
            <div style={{ textAlign:"center",padding:"12px 24px",background:C.bg,borderRadius:12 }}>
              <div style={{ fontFamily:"'Syne'",fontSize:44,fontWeight:800,color:C.text,letterSpacing:"-0.02em",lineHeight:1 }}>
                {liveMatch.hs} <span style={{ color:C.borderDark }}>—</span> {liveMatch.as}
              </div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne'",fontSize:20,fontWeight:800,color:C.text,marginBottom:3 }}>{liveMatch.away}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>Away</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",gap:6,marginBottom:14 }}>
          {[["live","⏱️ Timeline"],["standings","📋 Standings"],["players","🏉 Players"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ padding:"7px 18px",borderRadius:8,border:`1.5px solid ${tab===id?C.green:C.border}`,background:tab===id?C.greenLight:"transparent",color:tab===id?C.green:C.textMid,fontFamily:"'DM Sans'",fontSize:13,fontWeight:600,cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {tab==="live" && (
          <div className="card fade-in" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Match timeline</div>
            {[...timeline].reverse().map((e,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:14,padding:"9px 0",borderBottom:i<timeline.length-1?`1px solid ${C.border}`:"none" }}>
                <div style={{ width:34,textAlign:"center",fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:600,color:C.textSoft,flexShrink:0 }}>{e.min}'</div>
                <div style={{ width:30,height:30,borderRadius:7,background:e.team==="home"?C.greenLight:e.team==="away"?C.blueLight:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0 }}>
                  {e.type==="Try"?"🏉":e.type==="Conversion"?"🎯":e.type==="Penalty"?"⚽":e.type==="Half Time"?"⏸️":""}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:typeColor[e.type]||C.text }}>{e.type}</div>
                  {e.player && <div style={{ fontSize:11,color:C.textSoft }}>{e.player} · {e.team==="home"?liveMatch.home:liveMatch.away}</div>}
                </div>
                <div style={{ fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:700,color:C.text }}>{e.score}</div>
              </div>
            ))}
          </div>
        )}

        {tab==="standings" && (
          <div className="card fade-in" style={{ overflow:"hidden" }}>
            <div style={{ padding:"13px 20px",borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>KRU Cup 2025 · Standings</div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"32px 1fr 40px 40px 40px 40px 60px 44px",padding:"7px 20px",background:C.surfaceAlt,fontSize:10,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.06em" }}>
              {["#","Team","P","W","L","D","GD","Pts"].map(h=><span key={h}>{h}</span>)}
            </div>
            {standings.map((s,i)=>(
              <div key={i} style={{ display:"grid",gridTemplateColumns:"32px 1fr 40px 40px 40px 40px 60px 44px",padding:"11px 20px",borderBottom:`1px solid ${C.border}`,background:i===0?C.greenLight:"transparent",alignItems:"center" }}>
                <span style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:15,color:i<3?C.gold:C.textSoft }}>{s.pos}</span>
                <span style={{ fontWeight:i===0?700:500,color:i===0?C.green:C.text,fontSize:13 }}>{s.team}</span>
                {[s.p,s.w,s.l,s.d].map((v,j)=><span key={j} style={{ fontSize:13,color:C.textMid }}>{v}</span>)}
                <span style={{ fontSize:12,color:s.gd.startsWith("+")?C.green:C.red,fontFamily:"'JetBrains Mono'",fontWeight:600 }}>{s.gd}</span>
                <span style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:17,color:i===0?C.green:C.text }}>{s.pts}</span>
              </div>
            ))}
          </div>
        )}

        {tab==="players" && (
          <div className="card fade-in" style={{ overflow:"hidden" }}>
            <div style={{ padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Player Pool</div>
              <input className="input-field" placeholder="Search players..." style={{ width:220,padding:"6px 12px",fontSize:13 }}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 90px 60px 60px 90px",padding:"7px 20px",background:C.surfaceAlt,fontSize:10,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.06em" }}>
              {["Player","Team","Position","Jersey","Tries","Status"].map(h=><span key={h}>{h}</span>)}
            </div>
            {players.map((p,i)=>(
              <div key={i} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 90px 60px 60px 90px",padding:"11px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center",background:i%2===0?"transparent":C.surfaceAlt }}>
                <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                  <div style={{ width:30,height:30,borderRadius:7,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne'",fontSize:11,fontWeight:700,color:C.green,flexShrink:0 }}>
                    {p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                  </div>
                  <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{p.name}</span>
                </div>
                <span style={{ fontSize:12,color:C.textMid }}>{p.team}</span>
                <span style={{ fontSize:12,color:C.textSoft }}>{p.pos}</span>
                <div style={{ width:28,height:28,borderRadius:"50%",background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:C.green }}>{p.jersey}</div>
                <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.text }}>{p.tries}</span>
                <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:p.status==="Active"?C.greenLight:p.status==="Injured"?C.redLight:C.amberLight,color:p.status==="Active"?C.green:p.status==="Injured"?C.red:C.amber }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ROLE DASHBOARDS ──────────────────────────────────────────────────────────
const SuperAdminDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");
  const links = [
    { id:"overview",      label:"Overview",       icon:"📊" },
    { id:"users",         label:"User Accounts",  icon:"👥" },
    { id:"registrations", label:"Registrations",  icon:"📋", badge:"3" },
    { id:"disputes",      label:"Disputes",       icon:"⚠️", badge:"2" },
    { id:"tournaments",   label:"Tournaments",    icon:"🏆" },
    { id:"stats",         label:"Platform Stats", icon:"📈" },
  ];
  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={setPage}>
      {page==="overview" ? (
        <div className="fade-up">
          <div style={{ marginBottom:24 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Platform Overview</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>Welcome back, {user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
            <StatCard icon="👥" label="Total Users"        value="142" color={C.blue}   sub="Across all roles"/>
            <StatCard icon="🏆" label="Active Tournaments" value="3"   color={C.green}  sub="KRU Cup, League, U20"/>
            <StatCard icon="🏉" label="Players in Pool"    value="648" color={C.gold}   sub="+24 this week"/>
            <StatCard icon="⚠️" label="Open Disputes"      value="2"   color={C.red}    sub="Pending review"/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Pending approvals</div>
              {[
                { name:"Wycliffe Oduya", role:"Team Manager",  team:"Thika Panthers RFC", time:"2h ago" },
                { name:"Grace Muthoni",  role:"Medic",         team:"Nakuru Eagles RFC",  time:"5h ago" },
                { name:"Hassan Abdi",    role:"Data Entry",    team:"—",                  time:"1d ago" },
              ].map((u,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:34,height:34,borderRadius:8,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.green }}>{u.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{u.name}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{u.role} · {u.team}</div>
                  </div>
                  <span style={{ fontSize:11,color:C.textDim }}>{u.time}</span>
                  <div style={{ display:"flex",gap:5 }}>
                    <button style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>✓</button>
                    <button style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:11,cursor:"pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Open disputes</div>
              {[
                { title:"Duplicate player registration", team:"Nairobi Rhinos RFC", sev:"High",   time:"3h ago" },
                { title:"Unauthorized team manager",     team:"Kisumu Tigers RFC",  sev:"Medium", time:"1d ago" },
              ].map((d,i)=>(
                <div key={i} style={{ padding:"11px 13px",borderRadius:8,border:`1px solid ${d.sev==="High"?C.red+"40":C.amber+"40"}`,background:d.sev==="High"?C.redLight:C.amberLight,marginBottom:8 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text,marginBottom:4 }}>{d.title}</div>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontSize:11,color:C.textSoft }}>{d.team} · {d.time}</span>
                    <Badge label={d.sev} color={d.sev==="High"?C.red:C.amber}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>}
    </DashboardShell>
  );
};

const TournamentOrganizerDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");
  const links = [
    { id:"overview",     label:"Overview",           icon:"📊" },
    { id:"tournaments",  label:"My Tournaments",     icon:"🏆" },
    { id:"schedule",     label:"Match Schedule",     icon:"📅" },
    { id:"squads",       label:"Squad Verification", icon:"✅" },
    { id:"tagging",      label:"Player Tagging",     icon:"🎭" },
    { id:"cards",        label:"Cards & Suspensions",icon:"🟥" },
    { id:"notifications",label:"Notifications",      icon:"🔔", badge:"4" },
  ];
  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={setPage} notifCount={4}>
      {page==="overview" ? (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Tournament Overview</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>Welcome, {user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🏆" label="Active Tournaments" value="2"   color={C.blue}/>
            <StatCard icon="👥" label="Teams Registered"   value="12"  color={C.green}/>
            <StatCard icon="🏉" label="Players Verified"   value="184" color={C.gold}/>
            <StatCard icon="🟥" label="Active Suspensions" value="3"   color={C.red}/>
          </div>
          <Alert type="warning">⚠️ 3 players flagged during facial recognition tagging — review required before Saturday's matchday.</Alert>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Upcoming matches</div>
              {[
                { time:"Sat 14:00",home:"Nairobi Rhinos",  away:"Thika Panthers", venue:"RFUEA Ground"  },
                { time:"Sat 16:00",home:"Kisumu Tigers",   away:"Nakuru Eagles",  venue:"Kisumu Stad."  },
                { time:"Sun 15:00",home:"Mombasa Lions",   away:"Eldoret Bulls",  venue:"Mombasa Arena" },
              ].map((m,i)=>(
                <div key={i} style={{ padding:"9px 0",borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                  <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",marginBottom:3 }}>{m.time} · {m.venue}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{m.home} <span style={{ color:C.textSoft,fontWeight:400 }}>vs</span> {m.away}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Recent notifications</div>
              {[
                { msg:"Red card — J. Kamau (Nairobi Rhinos)",     icon:"🟥",time:"2h ago" },
                { msg:"Injury reported — B. Waweru (Kisumu)",      icon:"🏥",time:"4h ago" },
                { msg:"Squad submitted — Thika Panthers RFC",       icon:"✅",time:"1d ago" },
                { msg:"Player flagged — facial match below 80%",   icon:"⚠️",time:"1d ago" },
              ].map((n,i)=>(
                <div key={i} style={{ display:"flex",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:17,flexShrink:0 }}>{n.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,color:C.text }}>{n.msg}</div>
                    <div style={{ fontSize:11,color:C.textDim }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>}
    </DashboardShell>
  );
};

const TeamManagerDashboard = ({ user, onLogout }) => {
  const [page, setPage]           = useState("overview");
  const [players, setPlayers]     = useState([
    { id:1, name:"James Kamau",   dob:"2000-01-15", phone:"+254721000001", jersey:1,  position:"Loosehead Prop", kin_name:"Mary Kamau",   kin_phone:"+254721000010", photo:null, id_front:null, id_back:null, status:"Verified", submitted:"Mar 10" },
    { id:2, name:"Peter Omondi",  dob:"1999-03-22", phone:"+254722000002", jersey:10, position:"Fly-half",       kin_name:"Jane Omondi",  kin_phone:"+254722000020", photo:null, id_front:null, id_back:null, status:"Verified", submitted:"Mar 10" },
    { id:3, name:"Daniel Njoroge",dob:"2001-07-10", phone:"+254723000003", jersey:13, position:"Centre",         kin_name:"Paul Njoroge", kin_phone:"+254723000030", photo:null, id_front:null, id_back:null, status:"Pending",  submitted:"Mar 15" },
    { id:4, name:"Kevin Mutua",   dob:"2002-04-18", phone:"+254724000004", jersey:14, position:"Winger",         kin_name:"Ann Mutua",    kin_phone:"+254724000040", photo:null, id_front:null, id_back:null, status:"Pending",  submitted:"Mar 17" },
  ]);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formError, setFormError]       = useState("");
  const [formSuccess, setFormSuccess]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  // Form state
  const emptyForm = { name:"", dob:"", phone:"", jersey:"", position:"", kin_name:"", kin_phone:"", photo:null, photoPreview:null, id_front:null, id_frontPreview:null, id_back:null, id_backPreview:null };
  const [form, setForm] = useState(emptyForm);

  const POSITIONS = ["Loosehead Prop","Hooker","Tighthead Prop","Lock","Flanker","Number 8","Scrum-half","Fly-half","Centre","Winger","Full-back"];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileUpload = (key, previewKey, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      set(key, file);
      set(previewKey, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setFormError("");
    if (!form.name)         { setFormError("Player full name is required.");       return; }
    if (!form.dob)          { setFormError("Date of birth is required.");          return; }
    if (!form.phone)        { setFormError("Phone number is required.");           return; }
    if (!form.jersey)       { setFormError("Jersey number is required.");          return; }
    if (!form.position)     { setFormError("Position is required.");               return; }
    if (!form.kin_name)     { setFormError("Next of kin name is required.");       return; }
    if (!form.kin_phone)    { setFormError("Next of kin phone is required.");      return; }
    if (!form.photo)        { setFormError("Player photo is required.");           return; }
    if (!form.id_front)     { setFormError("Kenyan ID front photo is required.");  return; }
    if (!form.id_back)      { setFormError("Kenyan ID back photo is required.");   return; }

    // Check duplicate jersey
    if (players.some(p => Number(p.jersey) === Number(form.jersey))) {
      setFormError(`Jersey #${form.jersey} is already taken by another player.`);
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));

    const newPlayer = {
      id:          players.length + 1,
      name:        form.name,
      dob:         form.dob,
      phone:       form.phone,
      jersey:      Number(form.jersey),
      position:    form.position,
      kin_name:    form.kin_name,
      kin_phone:   form.kin_phone,
      photo:       form.photoPreview,
      id_front:    form.id_frontPreview,
      id_back:     form.id_backPreview,
      status:      "Pending",
      submitted:   new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short" }),
    };

    setPlayers(prev => [...prev, newPlayer]);
    setForm(emptyForm);
    setSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setShowAddForm(false); }, 2500);
  };

  const statusColor = { Verified:C.green, Pending:C.amber, Flagged:C.red };
  const statusBg    = { Verified:C.greenLight, Pending:C.amberLight, Flagged:C.redLight };

  const links = [
    { id:"overview",      label:"Overview",        icon:"📊" },
    { id:"players",       label:"Player Profiles", icon:"🏉" },
    { id:"squad",         label:"Build Squad",     icon:"📋" },
    { id:"tournaments",   label:"Tournaments",     icon:"🏆" },
    { id:"injuries",      label:"Injuries",        icon:"🏥", badge:"1" },
    { id:"cards",         label:"Cards & Flags",   icon:"🟥" },
    { id:"notifications", label:"Notifications",   icon:"🔔", badge:"3" },
  ];

  // ── UPLOAD BOX ──────────────────────────────────────────────────────────────
  const UploadBox = ({ label, preview, onUpload, accept = "image/*", icon }) => (
    <div>
      <label className="label">{label}</label>
      <label style={{ display:"block", cursor:"pointer" }}>
        <input type="file" accept={accept} style={{ display:"none" }} onChange={e => onUpload(e.target.files[0])}/>
        <div style={{ border:`2px dashed ${preview?C.green:C.borderDark}`, borderRadius:10, padding:preview?"8px":"20px 12px", textAlign:"center", background:preview?C.greenLight:C.surfaceAlt, transition:"all 0.18s", minHeight:preview?"auto":90, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}
          onMouseEnter={e => { if(!preview) e.currentTarget.style.borderColor=C.green; }}
          onMouseLeave={e => { if(!preview) e.currentTarget.style.borderColor=C.borderDark; }}>
          {preview ? (
            <div style={{ position:"relative" }}>
              <img src={preview} alt={label} style={{ width:"100%", maxHeight:120, objectFit:"cover", borderRadius:7, display:"block" }}/>
              <div style={{ position:"absolute", top:4, right:4, background:C.green, color:"#fff", borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 6px" }}>✓ Uploaded</div>
            </div>
          ) : (
            <>
              <span style={{ fontSize:26 }}>{icon}</span>
              <div style={{ fontSize:12, fontWeight:600, color:C.textMid }}>Click to upload</div>
              <div style={{ fontSize:11, color:C.textSoft }}>JPG, PNG · Max 5MB</div>
            </>
          )}
        </div>
      </label>
    </div>
  );

  // ── PLAYER CARD (detail view) ────────────────────────────────────────────────
  const PlayerDetail = ({ player, onClose }) => (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200, backdropFilter:"blur(2px)" }}/>
      <div style={{ position:"fixed", top:0, right:0, bottom:0, width:460, background:C.surface, borderLeft:`1px solid ${C.border}`, zIndex:201, display:"flex", flexDirection:"column", animation:"slideInPanel 0.25s ease", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:17, color:C.text }}>{player.name}</div>
            <div style={{ fontSize:12, color:C.textSoft }}>{player.position} · Jersey #{player.jersey}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:statusBg[player.status], color:statusColor[player.status] }}>{player.status}</span>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.textSoft, lineHeight:1 }}>×</button>
          </div>
        </div>

        <div style={{ padding:"20px 22px", flex:1 }}>
          {/* Player photo */}
          <div style={{ display:"flex", gap:14, marginBottom:22 }}>
            <div style={{ width:80, height:80, borderRadius:12, background:C.greenLight, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {player.photo
                ? <img src={player.photo} alt={player.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <span style={{ fontFamily:"'Syne'", fontSize:28, fontWeight:800, color:C.green }}>{player.name[0]}</span>
              }
            </div>
            <div>
              <div style={{ fontFamily:"'Syne'", fontSize:15, fontWeight:800, color:C.text, marginBottom:4 }}>{player.name}</div>
              <div style={{ fontSize:13, color:C.textMid, marginBottom:3 }}>{player.position}</div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ padding:"2px 8px", borderRadius:5, background:C.greenLight, color:C.green, fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono'" }}>#{player.jersey}</span>
                <span style={{ padding:"2px 8px", borderRadius:5, background:C.surfaceAlt, color:C.textSoft, fontSize:11, fontFamily:"'JetBrains Mono'" }}>Nairobi Rhinos RFC</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Player details</div>
          {[
            { label:"Date of birth", value:player.dob },
            { label:"Phone",         value:player.phone },
            { label:"Submitted",     value:player.submitted },
          ].map((r,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12, color:C.textSoft }}>{r.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.value}</span>
            </div>
          ))}

          <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", margin:"16px 0 8px" }}>Next of kin</div>
          {[
            { label:"Name",  value:player.kin_name  },
            { label:"Phone", value:player.kin_phone },
          ].map((r,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12, color:C.textSoft }}>{r.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.value}</span>
            </div>
          ))}

          {/* ID Documents */}
          <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", margin:"16px 0 8px" }}>ID Documents</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { label:"ID Front", img:player.id_front },
              { label:"ID Back",  img:player.id_back  },
            ].map((doc,i) => (
              <div key={i} style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${C.border}` }}>
                {doc.img
                  ? <img src={doc.img} alt={doc.label} style={{ width:"100%", height:90, objectFit:"cover", display:"block" }}/>
                  : <div style={{ height:90, background:C.surfaceAlt, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:4 }}>
                      <span style={{ fontSize:22 }}>🪪</span>
                      <span style={{ fontSize:11, color:C.textSoft }}>{doc.label}</span>
                    </div>
                }
                <div style={{ padding:"5px 10px", fontSize:11, fontWeight:600, color:C.textMid, background:C.surfaceAlt }}>{doc.label}</div>
              </div>
            ))}
          </div>

          {player.status === "Pending" && (
            <div style={{ marginTop:16, padding:"10px 14px", background:C.amberLight, borderRadius:8, border:`1px solid ${C.amber}28`, fontSize:12, color:C.amber }}>
              ⏳ Awaiting review by Tournament Organizer before appearing in the public pool.
            </div>
          )}
          {player.status === "Verified" && (
            <div style={{ marginTop:16, padding:"10px 14px", background:C.greenLight, borderRadius:8, border:`1px solid ${C.green}28`, fontSize:12, color:C.green }}>
              ✅ Player verified and visible in the public pool.
            </div>
          )}
          <div style={{ marginTop:12, padding:"10px 14px", background:C.surfaceAlt, borderRadius:8, border:`1px solid ${C.border}`, fontSize:11, color:C.textSoft }}>
            🔒 Player profiles cannot be edited after submission. Contact the Tournament Organizer if there is an error.
          </div>
        </div>
      </div>
    </>
  );

  // ── ADD PLAYER FORM ──────────────────────────────────────────────────────────
  const AddPlayerForm = () => (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button className="btn-ghost" onClick={() => { setShowAddForm(false); setFormError(""); setForm(emptyForm); }} style={{ padding:"7px 14px", fontSize:13 }}>← Back</button>
        <div>
          <h2 style={{ fontFamily:"'Syne'", fontSize:22, fontWeight:800, color:C.text }}>Add Player Profile</h2>
          <p style={{ fontSize:13, color:C.textSoft }}>Nairobi Rhinos RFC · Profile cannot be edited after submission</p>
        </div>
      </div>

      {formSuccess && (
        <div style={{ padding:"14px 18px", background:C.greenLight, border:`1px solid ${C.green}28`, borderRadius:10, marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:22 }}>✅</span>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.green }}>Player submitted successfully!</div>
            <div style={{ fontSize:12, color:C.textSoft }}>Awaiting review by Tournament Organizer.</div>
          </div>
        </div>
      )}

      {formError && (
        <div style={{ padding:"10px 14px", background:C.redLight, border:`1px solid ${C.red}28`, borderRadius:8, marginBottom:16, fontSize:13, color:C.red }}>
          ⚠️ {formError}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Left column — details */}
        <div>
          <div className="card" style={{ padding:"22px 24px", marginBottom:16 }}>
            <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15, color:C.text, marginBottom:18 }}>Player details</div>

            <Field label="Full Name *">
              <Input placeholder="e.g. James Omondi Kamau" value={form.name} onChange={e => set("name", e.target.value)}/>
            </Field>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Date of Birth *">
                <Input type="date" value={form.dob} onChange={e => set("dob", e.target.value)}/>
              </Field>
              <Field label="Phone Number *">
                <Input type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => set("phone", e.target.value)}/>
              </Field>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Field label="Jersey Number *">
                <Input type="number" min="1" max="99" placeholder="e.g. 10" value={form.jersey} onChange={e => set("jersey", e.target.value)}/>
              </Field>
              <Field label="Position *">
                <SelectField
                  placeholder="— Select position —"
                  value={form.position}
                  onChange={e => set("position", e.target.value)}
                  options={POSITIONS.map(p => ({ value:p, label:p }))}
                />
              </Field>
            </div>
          </div>

          <div className="card" style={{ padding:"22px 24px" }}>
            <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15, color:C.text, marginBottom:18 }}>Next of kin / Emergency contact</div>
            <Field label="Full Name *">
              <Input placeholder="e.g. Mary Kamau" value={form.kin_name} onChange={e => set("kin_name", e.target.value)}/>
            </Field>
            <Field label="Phone Number *">
              <Input type="tel" placeholder="+254 7XX XXX XXX" value={form.kin_phone} onChange={e => set("kin_phone", e.target.value)}/>
            </Field>
          </div>
        </div>

        {/* Right column — photos */}
        <div>
          <div className="card" style={{ padding:"22px 24px", marginBottom:16 }}>
            <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>Player photo</div>
            <div style={{ fontSize:12, color:C.textSoft, marginBottom:16 }}>Clear face photo — will be used for facial recognition verification on matchday.</div>
            <UploadBox
              label="Player face photo *"
              preview={form.photoPreview}
              icon="📸"
              onUpload={file => handleFileUpload("photo", "photoPreview", file)}
            />
          </div>

          <div className="card" style={{ padding:"22px 24px" }}>
            <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15, color:C.text, marginBottom:6 }}>Kenyan ID documents</div>
            <div style={{ fontSize:12, color:C.textSoft, marginBottom:16 }}>Upload both sides of the player's Kenyan National ID. Must be clear and readable.</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <UploadBox
                label="ID Front *"
                preview={form.id_frontPreview}
                icon="🪪"
                onUpload={file => handleFileUpload("id_front", "id_frontPreview", file)}
              />
              <UploadBox
                label="ID Back *"
                preview={form.id_backPreview}
                icon="🪪"
                onUpload={file => handleFileUpload("id_back", "id_backPreview", file)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div style={{ padding:"12px 16px", background:C.amberLight, borderRadius:8, border:`1px solid ${C.amber}28`, fontSize:12, color:C.amber, margin:"20px 0", lineHeight:1.6 }}>
        ⚠️ <strong>Important:</strong> Once submitted, this profile cannot be edited. The player will appear as <strong>Pending</strong> until reviewed and approved by the Tournament Organizer. Make sure all details and photos are correct before submitting.
      </div>

      <div style={{ display:"flex", gap:12 }}>
        <button className="btn-ghost" onClick={() => { setShowAddForm(false); setFormError(""); setForm(emptyForm); }} style={{ flex:"0 0 130px" }}>
          Cancel
        </button>
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ flex:1, fontSize:15 }}>
          {submitting ? "Submitting..." : "Submit player profile →"}
        </button>
      </div>
    </div>
  );

  // ── PLAYERS LIST PAGE ────────────────────────────────────────────────────────
  const PlayersPage = () => {
    const verified = players.filter(p => p.status === "Verified");
    const pending  = players.filter(p => p.status === "Pending");
    const flagged  = players.filter(p => p.status === "Flagged");

    return (
      <div className="fade-up">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne'", fontSize:24, fontWeight:800, color:C.text }}>Player Profiles</h1>
            <p style={{ fontSize:13, color:C.textSoft }}>Nairobi Rhinos RFC · {players.length} players submitted</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowAddForm(true); setFormError(""); setForm(emptyForm); }} style={{ fontSize:13 }}>
            + Add Player
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          <div className="card" style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✅</div>
            <div>
              <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", textTransform:"uppercase", letterSpacing:"0.05em" }}>Verified</div>
              <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:22, color:C.green }}>{verified.length}</div>
            </div>
          </div>
          <div className="card" style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:C.amberLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⏳</div>
            <div>
              <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", textTransform:"uppercase", letterSpacing:"0.05em" }}>Pending</div>
              <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:22, color:C.amber }}>{pending.length}</div>
            </div>
          </div>
          <div className="card" style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:C.redLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🚩</div>
            <div>
              <div style={{ fontSize:11, color:C.textSoft, fontFamily:"'JetBrains Mono'", textTransform:"uppercase", letterSpacing:"0.05em" }}>Flagged</div>
              <div style={{ fontFamily:"'Syne'", fontWeight:800, fontSize:22, color:C.red }}>{flagged.length}</div>
            </div>
          </div>
        </div>

        {pending.length > 0 && (
          <div style={{ padding:"10px 14px", background:C.amberLight, borderRadius:8, border:`1px solid ${C.amber}28`, fontSize:12, color:C.amber, marginBottom:16 }}>
            ⏳ {pending.length} player{pending.length>1?"s are":" is"} awaiting review by the Tournament Organizer.
          </div>
        )}

        {/* Players grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {players.map((p,i) => (
            <div key={p.id} className="card" onClick={() => setSelectedPlayer(p)}
              style={{ padding:"16px 18px", cursor:"pointer", borderLeft:`3px solid ${statusColor[p.status]}`, transition:"all 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                {/* Avatar */}
                <div style={{ width:48, height:48, borderRadius:10, background:p.photo?"transparent":C.greenLight, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {p.photo
                    ? <img src={p.photo} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    : <span style={{ fontFamily:"'Syne'", fontSize:20, fontWeight:800, color:C.green }}>{p.name[0]}</span>
                  }
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:14, color:C.text, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                  <div style={{ fontSize:12, color:C.textSoft }}>{p.position}</div>
                </div>
                <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:statusBg[p.status], color:statusColor[p.status], flexShrink:0 }}>{p.status}</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ padding:"2px 8px", borderRadius:5, background:C.greenLight, color:C.green, fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono'" }}>#{p.jersey}</span>
                <span style={{ fontSize:11, color:C.textSoft }}>Submitted {p.submitted}</span>
                <span style={{ marginLeft:"auto", fontSize:12, color:C.green, fontWeight:600 }}>View →</span>
              </div>
              {/* ID docs status */}
              <div style={{ display:"flex", gap:6, marginTop:10 }}>
                {[
                  { label:"Photo",    ok:!!p.photo    },
                  { label:"ID Front", ok:!!p.id_front },
                  { label:"ID Back",  ok:!!p.id_back  },
                ].map((doc,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 7px", borderRadius:4, background:doc.ok?C.greenLight:C.redLight, fontSize:10, fontWeight:600, color:doc.ok?C.green:C.red }}>
                    {doc.ok?"✓":"✗"} {doc.label}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div className="card" onClick={() => { setShowAddForm(true); setFormError(""); setForm(emptyForm); }}
            style={{ padding:"16px 18px", cursor:"pointer", border:`1.5px dashed ${C.borderDark}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10, minHeight:140, background:"transparent", transition:"all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.green; e.currentTarget.style.background=C.greenLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.borderDark; e.currentTarget.style.background="transparent"; }}>
            <div style={{ width:40, height:40, borderRadius:10, background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>+</div>
            <div style={{ fontSize:13, fontWeight:600, color:C.textSoft }}>Add new player</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={(p) => { setPage(p); setShowAddForm(false); setSelectedPlayer(null); }} notifCount={3}>
      {/* Player detail panel */}
      {selectedPlayer && <PlayerDetail player={selectedPlayer} onClose={() => setSelectedPlayer(null)}/>}

      {page === "overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'", fontSize:26, fontWeight:800, color:C.text }}>Team Dashboard</h1>
            <p style={{ fontSize:14, color:C.textSoft }}>Nairobi Rhinos RFC · {user.name}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:18 }}>
            <StatCard icon="🏉" label="Registered Players" value={players.length} color={C.green}/>
            <StatCard icon="✅" label="Verified Players"   value={players.filter(p=>p.status==="Verified").length}  color={C.blue}/>
            <StatCard icon="⏳" label="Pending Review"     value={players.filter(p=>p.status==="Pending").length}   color={C.amber}/>
            <StatCard icon="🚩" label="Flagged Players"    value={players.filter(p=>p.status==="Flagged").length}   color={C.red}/>
          </div>
          {players.filter(p=>p.status==="Pending").length > 0 && (
            <Alert type="warning">⏳ {players.filter(p=>p.status==="Pending").length} player{players.filter(p=>p.status==="Pending").length>1?"s are":" is"} awaiting verification by the Tournament Organizer.</Alert>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15 }}>Players</div>
                <button className="btn-outline-green" onClick={() => setPage("players")} style={{ fontSize:12, padding:"5px 12px" }}>View all →</button>
              </div>
              {players.slice(0,4).map((p,i) => (
                <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:30, height:30, borderRadius:7, background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono'", fontSize:11, fontWeight:700, color:C.green, flexShrink:0 }}>{p.jersey}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.name}</div>
                    <div style={{ fontSize:11, color:C.textSoft }}>{p.position}</div>
                  </div>
                  <span style={{ padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:600, background:statusBg[p.status], color:statusColor[p.status] }}>{p.status}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:15, marginBottom:14 }}>Notifications</div>
              {[
                { msg:"Red card — J. Kamau suspended 1 match",   icon:"🟥", time:"2h ago" },
                { msg:"Daniel Njoroge marked injured by medic",   icon:"🏥", time:"4h ago" },
                { msg:"Squad verified for Saturday",              icon:"✅", time:"1d ago" },
              ].map((n,i) => (
                <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:17, flexShrink:0 }}>{n.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:C.text }}>{n.msg}</div>
                    <div style={{ fontSize:11, color:C.textDim }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {page === "players" && (showAddForm ? <AddPlayerForm/> : <PlayersPage/>)}

      {page !== "overview" && page !== "players" && (
        <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>
      )}
    </DashboardShell>
  );
};


const DataEntryDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");
  const links = [
    { id:"overview", label:"Overview",     icon:"📊" },
    { id:"clock",    label:"Match Clock",  icon:"⏱️" },
    { id:"scores",   label:"Live Scores",  icon:"📺" },
    { id:"schedule", label:"Schedule",     icon:"📅" },
    { id:"events",   label:"Match Events", icon:"🏉" },
  ];
  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={setPage}>
      {page==="overview" ? (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Data Entry</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name} · Match day operations</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="📺" label="Matches Today"   value="3" color={C.blue}/>
            <StatCard icon="⏱️" label="Currently Live"  value="1" color={C.red}/>
            <StatCard icon="✅" label="Completed Today" value="1" color={C.green}/>
          </div>
          <div className="card" style={{ padding:18,marginBottom:14,border:`1.5px solid ${C.red+"40"}`,background:C.redLight }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <span style={{ width:9,height:9,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
              <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:13,color:C.red }}>LIVE MATCH</span>
            </div>
            <div style={{ fontFamily:"'Syne'",fontSize:17,fontWeight:800,color:C.text,marginBottom:3 }}>Nairobi Rhinos vs Kisumu Tigers</div>
            <div style={{ fontSize:12,color:C.textSoft,marginBottom:12 }}>RFUEA Ground · KRU Cup Final · 2nd Half 58'</div>
            <button className="btn-primary" onClick={()=>setPage("clock")} style={{ fontSize:13 }}>⏱️ Manage match clock →</button>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Today's schedule</div>
            {[
              { time:"14:00",home:"Nairobi Rhinos",away:"Kisumu Tigers", status:"Live",      venue:"RFUEA Ground"  },
              { time:"16:30",home:"Mombasa Lions", away:"Thika Panthers",status:"Scheduled", venue:"Mombasa Arena" },
              { time:"18:00",home:"Nakuru Eagles", away:"Eldoret Bulls",  status:"Scheduled", venue:"Nakuru Stad."  },
            ].map((m,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:600,color:C.textSoft,flexShrink:0,width:46 }}>{m.time}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{m.home} vs {m.away}</div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{m.venue}</div>
                </div>
                <Badge label={m.status} color={m.status==="Live"?C.red:C.blue}/>
              </div>
            ))}
          </div>
        </div>
      ) : <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>}
    </DashboardShell>
  );
};

const MasterRefereeDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");
  const links = [
    { id:"overview",label:"Overview",      icon:"📊" },
    { id:"cards",   label:"Issue Cards",   icon:"🟥" },
    { id:"reports", label:"Match Reports", icon:"📝" },
    { id:"history", label:"Card History",  icon:"📋" },
  ];
  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={setPage}>
      {page==="overview" ? (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Referee Panel</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🟨" label="Yellow Cards" value="18" color={C.gold}/>
            <StatCard icon="🟥" label="Red Cards"    value="4"  color={C.red}/>
            <StatCard icon="🚫" label="Suspensions"  value="3"  color={C.amber}/>
            <StatCard icon="📝" label="Reports"      value="12" color={C.blue}/>
          </div>
          <div className="card" style={{ padding:18,marginBottom:14,border:`1.5px solid ${C.red+"40"}`,background:C.redLight }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:13,color:C.red,marginBottom:7 }}>Current match — LIVE</div>
            <div style={{ fontFamily:"'Syne'",fontSize:16,fontWeight:800,color:C.text,marginBottom:10 }}>Nairobi Rhinos vs Kisumu Tigers</div>
            <button className="btn-primary" onClick={()=>setPage("cards")} style={{ background:C.red,fontSize:13 }}>🟥 Issue card →</button>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Recent cards issued</div>
            {[
              { player:"James Kamau",  team:"Nairobi Rhinos",card:"Red",   reason:"Dangerous tackle",     time:"58'" },
              { player:"Brian Waweru", team:"Kisumu Tigers", card:"Yellow",reason:"Repeated infringement", time:"34'" },
              { player:"Ali Hassan",   team:"Mombasa Lions", card:"Yellow",reason:"Obstruction",           time:"22'" },
            ].map((c,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<2?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:20,flexShrink:0 }}>{c.card==="Red"?"🟥":"🟨"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{c.player} · {c.team}</div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{c.reason} · {c.time}</div>
                </div>
                <Badge label={c.card+" Card"} color={c.card==="Red"?C.red:C.gold}/>
              </div>
            ))}
          </div>
        </div>
      ) : <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>}
    </DashboardShell>
  );
};

const MedicDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");
  const links = [
    { id:"overview", label:"Overview",       icon:"📊" },
    { id:"injuries", label:"Log Injury",     icon:"🏥" },
    { id:"teams",    label:"Team Health",    icon:"👥" },
    { id:"history",  label:"Injury History", icon:"📋" },
  ];
  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={setPage}>
      {page==="overview" ? (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Medical Panel</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🏥" label="Active Injuries"   value="4" color={C.red}   sub="Across all teams"/>
            <StatCard icon="✅" label="Cleared This Week" value="2" color={C.green} sub="Fit to play"/>
            <StatCard icon="👥" label="Teams Monitored"   value="6" color={C.blue}/>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Active injury log</div>
            {[
              { player:"Daniel Njoroge",team:"Nairobi Rhinos RFC", injury:"Hamstring strain",   sev:"Moderate",reported:"Today"      },
              { player:"Grace Wanjiku", team:"Nakuru Eagles RFC",  injury:"Ankle sprain",        sev:"Minor",   reported:"Yesterday"  },
              { player:"Tom Baraka",    team:"Eldoret Bulls RFC",  injury:"Shoulder dislocation",sev:"Severe",  reported:"3 days ago" },
              { player:"Ali Hassan",    team:"Mombasa Lions RFC",  injury:"Knee bruise",         sev:"Minor",   reported:"4 days ago" },
            ].map((inj,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:18,flexShrink:0 }}>🏥</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{inj.player} · {inj.team}</div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{inj.injury} · {inj.reported}</div>
                </div>
                <Badge label={inj.sev} color={inj.sev==="Severe"?C.red:inj.sev==="Moderate"?C.amber:C.green}/>
                <button style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>Clear ✓</button>
              </div>
            ))}
          </div>
        </div>
      ) : <ComingSoon icon={links.find(l=>l.id===page)?.icon} label={links.find(l=>l.id===page)?.label}/>}
    </DashboardShell>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);

  const handleLogin = (u) => { setUser(u); setView("dashboard"); };
  const handleLogout = () => { setUser(null); setView("landing"); };
  const handleRegisterSuccess = (u) => { setUser(u); setView("register_success"); };

  const p = { user, onLogout: handleLogout };

  return (
    <>
      <style>{GS}</style>
      {view==="landing"          && <LandingPage onLogin={()=>setView("login")} onRegister={()=>setView("register")} onPublic={()=>setView("public")}/>}
      {view==="register"         && <RegisterPage onBack={()=>setView("login")} onSuccess={handleRegisterSuccess}/>}
      {view==="login"            && <LoginPage onBack={()=>setView("register")} onLogin={handleLogin}/>}
      {view==="public"           && <PublicPage onBack={()=>setView("landing")}/>}
      {view==="register_success" && (
        <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div className="card fade-up scale-in" style={{ padding:"44px 52px",textAlign:"center",maxWidth:460 }}>
            <div style={{ fontSize:52,marginBottom:18 }}>🎉</div>
            <h2 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text,marginBottom:10 }}>Account created!</h2>
            <p style={{ fontSize:14,color:C.textSoft,lineHeight:1.7,marginBottom:22 }}>
              Your account as <strong style={{ color:ROLES[user?.role]?.color }}>{ROLES[user?.role]?.label}</strong> has been submitted. You will be notified once approved by the Super Admin.
            </p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button className="btn-primary" onClick={()=>setView("login")}>Sign in →</button>
              <button className="btn-ghost" onClick={()=>setView("landing")}>← Home</button>
            </div>
          </div>
        </div>
      )}
      {view==="dashboard" && user && (
        <>
          {user.role==="super_admin"          && <SuperAdminDashboard          {...p}/>}
          {user.role==="tournament_organizer"  && <TournamentOrganizerDashboard {...p}/>}
          {user.role==="team_manager"          && <TeamManagerDashboard         {...p}/>}
          {user.role==="data_entry"            && <DataEntryDashboard           {...p}/>}
          {user.role==="master_referee"        && <MasterRefereeDashboard       {...p}/>}
          {user.role==="medic"                 && <MedicDashboard               {...p}/>}
        </>
      )}
    </>
  );
}
