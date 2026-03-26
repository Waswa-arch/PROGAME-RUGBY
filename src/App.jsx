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
      <main id="main-content" style={{ flex: 1, padding: "24px 28px", overflowY: "auto", scrollBehavior:"auto" }}>{children}</main>
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
const PublicPage = ({ onBack, liveMatches: externalLive }) => {
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

  // ── MOCK DATA ──────────────────────────────────────────────────────────────
  const [pendingRegistrations, setPendingRegistrations] = useState([
    { id:"r1", name:"Wycliffe Oduya",  email:"wycliffe@gmail.com",    role:"team_manager",  team:"Thika Panthers RFC",  phone:"+254711000001", submitted:"Mar 23 09:00", status:"Pending" },
    { id:"r2", name:"Grace Muthoni",   email:"grace@medicpro.com",    role:"medic",         team:"Nakuru Eagles RFC",   phone:"+254712000002", submitted:"Mar 23 11:30", status:"Pending" },
    { id:"r3", name:"Hassan Abdi",     email:"hassan@data.com",       role:"data_entry",    team:"—",                   phone:"+254713000003", submitted:"Mar 22 14:00", status:"Pending" },
    { id:"r4", name:"Amina Wanjiru",   email:"amina@ref.co.ke",       role:"master_referee",team:"—",                   phone:"+254714000004", submitted:"Mar 22 08:00", status:"Pending" },
    { id:"r5", name:"Felix Omondi",    email:"felix@lions.co.ke",     role:"team_manager",  team:"Mombasa Lions RFC",   phone:"+254715000005", submitted:"Mar 21 16:00", status:"Pending" },
  ]);

  const [allUsers, setAllUsers] = useState([
    { id:"u1", name:"Super Admin",      email:"admin@progame.com",      role:"super_admin",         status:"Active",   last_login:"Just now",        team:"—" },
    { id:"u2", name:"James Mwangi",     email:"organizer@progame.com",  role:"tournament_organizer", status:"Active",   last_login:"Mar 23 08:00",    team:"—" },
    { id:"u3", name:"Coach Kamau",      email:"manager@nairobifc.com",  role:"team_manager",        status:"Active",   last_login:"Mar 23 10:00",    team:"Nairobi Rhinos RFC" },
    { id:"u4", name:"Data Entry",       email:"data@progame.com",       role:"data_entry",          status:"Active",   last_login:"Mar 23 14:00",    team:"—" },
    { id:"u5", name:"Ref John Omondi",  email:"referee@progame.com",    role:"master_referee",      status:"Active",   last_login:"Mar 23 13:30",    team:"—" },
    { id:"u6", name:"Dr. Wanjiku",      email:"medic@progame.com",      role:"medic",               status:"Active",   last_login:"Mar 23 15:00",    team:"—" },
    { id:"u7", name:"Brian Wekesa",     email:"brian@thika.co.ke",      role:"team_manager",        status:"Suspended",last_login:"Mar 20 09:00",    team:"Thika Panthers RFC" },
    { id:"u8", name:"Mary Akinyi",      email:"mary@data.com",          role:"data_entry",          status:"Active",   last_login:"Mar 22 11:00",    team:"—" },
  ]);

  const [disputes, setDisputes] = useState([
    { id:"d1", title:"Duplicate player registration",       reporter:"Coach Kamau",  against:"Kisumu Tigers RFC",   description:"Player James Ochieng appears in both Nairobi Rhinos and Kisumu Tigers squad for KRU Cup 2025. ID number ID10000099 used twice.",    severity:"High",   status:"Open",     created:"Mar 22 10:00", tournament:"KRU Cup 2025" },
    { id:"d2", title:"Unauthorized team manager account",   reporter:"James Mwangi", against:"Thika Panthers RFC",  description:"Brian Wekesa registered as Team Manager for Thika Panthers RFC without club authorization. Club officials have raised concern.",        severity:"High",   status:"Open",     created:"Mar 21 14:00", tournament:"KRU Cup 2025" },
    { id:"d3", title:"Incorrect match score submitted",     reporter:"Ref Omondi",   against:"Data Entry",          description:"Match score for Mombasa Lions vs Nakuru Eagles was recorded incorrectly (42-7 instead of 24-7). Data entry guy disputes referee record.", severity:"Medium", status:"In review",created:"Mar 20 16:00", tournament:"KRU Cup 2025" },
    { id:"d4", title:"Player age falsification suspected",  reporter:"James Mwangi", against:"Eldoret Bulls RFC",   description:"Player Daniel Baraka's Kenyan ID shows 1998 birth year but registration form states 2003. Facial recognition also flagged discrepancy.",   severity:"High",   status:"Resolved", created:"Mar 18 09:00", tournament:"KRU Cup 2025" },
  ]);

  const [tournaments] = useState([
    { id:"t1", name:"KRU Cup 2025",    organizer:"James Mwangi", format:"Group+KO", teams:8,  status:"Active",   created:"Mar 1" },
    { id:"t2", name:"KRU League 2025", organizer:"James Mwangi", format:"League",   teams:12, status:"Completed",created:"Jan 15" },
    { id:"t3", name:"U20 Championship",organizer:"James Mwangi", format:"Knockout", teams:3,  status:"Draft",    created:"Mar 20" },
  ]);

  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedUser, setSelectedUser]       = useState(null);
  const [resolution, setResolution]           = useState("");
  const [userSearch, setUserSearch]           = useState("");

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  const approveReg = (id) => {
    const reg = pendingRegistrations.find(r=>r.id===id);
    setPendingRegistrations(prev=>prev.filter(r=>r.id!==id));
    setAllUsers(prev=>[...prev,{ id:`u${Date.now()}`, name:reg.name, email:reg.email, role:reg.role, status:"Active", last_login:"Never", team:reg.team }]);
  };
  const rejectReg  = (id) => setPendingRegistrations(prev=>prev.map(r=>r.id===id?{...r,status:"Rejected"}:r));
  const suspendUser= (id) => setAllUsers(prev=>prev.map(u=>u.id===id?{...u,status:u.status==="Suspended"?"Active":"Suspended"}:u));
  const resolveDispute = (id) => {
    if (!resolution.trim()) return;
    setDisputes(prev=>prev.map(d=>d.id===id?{...d,status:"Resolved",resolution,resolved_at:"Just now"}:d));
    setSelectedDispute(null);
    setResolution("");
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const roleColor = { super_admin:C.purple, tournament_organizer:C.blue, team_manager:C.green, data_entry:C.amber, master_referee:C.coral, medic:C.teal };
  const roleBg    = { super_admin:C.purpleLight, tournament_organizer:C.blueLight, team_manager:C.greenLight, data_entry:C.amberLight, master_referee:C.coralLight, medic:C.tealLight };
  const roleLabel = { super_admin:"Super Admin", tournament_organizer:"Org", team_manager:"Team Mgr", data_entry:"Data Entry", master_referee:"Referee", medic:"Medic" };
  const sevColor  = { High:C.red, Medium:C.amber, Low:C.blue };
  const sevBg     = { High:C.redLight, Medium:C.amberLight, Low:C.blueLight };

  const filteredUsers = allUsers.filter(u =>
    !userSearch ||
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.includes(userSearch.toLowerCase())
  );

  // ── SLIDE PANEL ────────────────────────────────────────────────────────────
  const SlidePanel = ({ title, subtitle, onClose, children }) => (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200,backdropFilter:"blur(2px)" }}/>
      <div style={{ position:"fixed",top:0,right:0,bottom:0,width:500,background:"#fff",borderLeft:`1px solid ${C.border}`,zIndex:201,display:"flex",flexDirection:"column",animation:"slideInPanel 0.25s ease",overflowY:"auto" }}>
        <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:17,color:C.text }}>{title}</div>
            {subtitle && <div style={{ fontSize:12,color:C.textSoft,marginTop:2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.textSoft }}>×</button>
        </div>
        <div style={{ padding:"20px 22px",flex:1 }}>{children}</div>
      </div>
    </>
  );

  const DR = ({ label, value, valueColor }) => (
    <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:12,color:C.textSoft }}>{label}</span>
      <span style={{ fontSize:13,fontWeight:600,color:valueColor||C.text }}>{value||"—"}</span>
    </div>
  );

  // ── REGISTRATIONS PAGE ─────────────────────────────────────────────────────
  const RegistrationsPage = () => {
    const pending  = pendingRegistrations.filter(r=>r.status==="Pending");
    const rejected = pendingRegistrations.filter(r=>r.status==="Rejected");
    return (
      <div className="fade-up">
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Account Registrations</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{pending.length} pending review</p>
        </div>
        {pending.length > 0 && (
          <Alert type="warning">⏳ {pending.length} account{pending.length>1?"s":""} waiting for your approval before they can access the platform.</Alert>
        )}
        <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:10 }}>Pending ({pending.length})</div>
        <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:24 }}>
          {pending.map((r,i)=>(
            <div key={r.id} className="card" style={{ padding:"16px 20px",borderLeft:`3px solid ${C.amber}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:42,height:42,borderRadius:10,background:roleBg[r.role]||C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>
                    {ROLES[r.role]?.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.text }}>{r.name}</div>
                    <div style={{ fontSize:12,color:C.textSoft }}>{r.email} · {r.phone}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:roleBg[r.role],color:roleColor[r.role] }}>{ROLES[r.role]?.label}</span>
                  <div style={{ fontSize:11,color:C.textDim,marginTop:4,fontFamily:"'JetBrains Mono'" }}>{r.submitted}</div>
                </div>
              </div>
              {r.team !== "—" && (
                <div style={{ padding:"7px 12px",background:C.greenLight,borderRadius:6,fontSize:12,color:C.green,marginBottom:10,fontWeight:600 }}>
                  🧩 Registering as Team Manager for: {r.team}
                </div>
              )}
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>approveReg(r.id)}
                  style={{ flex:1,padding:"9px",borderRadius:8,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                  ✓ Approve & activate
                </button>
                <button onClick={()=>rejectReg(r.id)}
                  style={{ flex:"0 0 100px",padding:"9px",borderRadius:8,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <div style={{ textAlign:"center",padding:"40px",color:C.textSoft,fontSize:14 }}>✅ No pending registrations.</div>
          )}
        </div>
        {rejected.length > 0 && (
          <>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.textSoft,marginBottom:10 }}>Rejected ({rejected.length})</div>
            <div className="card" style={{ overflow:"hidden" }}>
              {rejected.map((r,i)=>(
                <div key={r.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<rejected.length-1?`1px solid ${C.border}`:"none",opacity:0.6 }}>
                  <span style={{ fontSize:18 }}>{ROLES[r.role]?.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{r.name}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{r.email} · {ROLES[r.role]?.label}</div>
                  </div>
                  <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:C.redLight,color:C.red }}>Rejected</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // ── USERS PAGE ─────────────────────────────────────────────────────────────
  const UsersPage = () => (
    <div className="fade-up">
      {selectedUser && (
        <SlidePanel title={selectedUser.name} subtitle={`${ROLES[selectedUser.role]?.label} · ${selectedUser.email}`} onClose={()=>setSelectedUser(null)}>
          <DR label="Email"      value={selectedUser.email}/>
          <DR label="Role"       value={<span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:roleBg[selectedUser.role],color:roleColor[selectedUser.role] }}>{ROLES[selectedUser.role]?.label}</span>}/>
          <DR label="Team"       value={selectedUser.team}/>
          <DR label="Status"     value={<span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:selectedUser.status==="Active"?C.greenLight:C.redLight,color:selectedUser.status==="Active"?C.green:C.red }}>{selectedUser.status}</span>}/>
          <DR label="Last login" value={selectedUser.last_login}/>
          <div style={{ display:"flex",flexDirection:"column",gap:8,marginTop:18 }}>
            <button onClick={()=>{ suspendUser(selectedUser.id); setSelectedUser(null); }}
              style={{ padding:"10px",borderRadius:8,border:`1px solid ${selectedUser.status==="Suspended"?C.green:C.red}`,background:selectedUser.status==="Suspended"?C.greenLight:C.redLight,color:selectedUser.status==="Suspended"?C.green:C.red,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
              {selectedUser.status==="Suspended"?"✓ Reactivate account":"🚫 Suspend account"}
            </button>
            <button style={{ padding:"10px",borderRadius:8,border:`1px solid ${C.amber}`,background:C.amberLight,color:C.amber,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
              🔑 Reset password
            </button>
            {selectedUser.role==="team_manager" && (
              <button style={{ padding:"10px",borderRadius:8,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                🗑 Delete account (fake registration)
              </button>
            )}
          </div>
        </SlidePanel>
      )}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>User Accounts</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{allUsers.length} total · {allUsers.filter(u=>u.status==="Suspended").length} suspended</p>
        </div>
        <input className="input-field" placeholder="Search users..." value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{ width:220,padding:"8px 14px",fontSize:13 }}/>
      </div>

      {/* Role breakdown */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:18 }}>
        {Object.entries(ROLES).map(([key,r])=>(
          <div key={key} className="card" style={{ padding:"10px 12px",textAlign:"center" }}>
            <div style={{ fontSize:18,marginBottom:4 }}>{r.icon}</div>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:18,color:r.color }}>{allUsers.filter(u=>u.role===key).length}</div>
            <div style={{ fontSize:10,color:C.textSoft }}>{r.label.split(" ")[0]}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 100px 90px 110px 60px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
          {["Name","Email","Role","Status","Last login","Action"].map(h=>(
            <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
          ))}
        </div>
        {filteredUsers.map((u,i)=>(
          <div key={u.id} onClick={()=>setSelectedUser(u)}
            style={{ display:"grid",gridTemplateColumns:"1fr 1fr 100px 90px 110px 60px",alignItems:"center",padding:"0 16px",minHeight:52,borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:i%2===0?"transparent":C.surfaceAlt,opacity:u.status==="Suspended"?0.65:1 }}
            onMouseEnter={e=>e.currentTarget.style.background=C.greenLight}
            onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":C.surfaceAlt}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:30,height:30,borderRadius:7,background:roleBg[u.role],display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>{ROLES[u.role]?.icon}</div>
              <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{u.name}</span>
            </div>
            <span style={{ fontSize:12,color:C.textSoft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.email}</span>
            <span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:roleBg[u.role],color:roleColor[u.role] }}>{roleLabel[u.role]}</span>
            <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:u.status==="Active"?C.greenLight:C.redLight,color:u.status==="Active"?C.green:C.red }}>{u.status}</span>
            <span style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>{u.last_login}</span>
            <span style={{ fontSize:12,color:C.green,fontWeight:600 }}>View →</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── DISPUTES PAGE ──────────────────────────────────────────────────────────
  const DisputesPage = () => {
    const open     = disputes.filter(d=>d.status==="Open");
    const review   = disputes.filter(d=>d.status==="In review");
    const resolved = disputes.filter(d=>d.status==="Resolved");

    return (
      <div className="fade-up">
        {selectedDispute && (
          <SlidePanel title="Dispute Details" subtitle={selectedDispute.title} onClose={()=>{ setSelectedDispute(null); setResolution(""); }}>
            <div style={{ padding:"10px 14px",background:sevBg[selectedDispute.severity],border:`1px solid ${sevColor[selectedDispute.severity]}28`,borderRadius:8,marginBottom:14 }}>
              <Badge label={selectedDispute.severity+" priority"} color={sevColor[selectedDispute.severity]}/>
            </div>
            <DR label="Reported by"  value={selectedDispute.reporter}/>
            <DR label="Against"      value={selectedDispute.against}/>
            <DR label="Tournament"   value={selectedDispute.tournament}/>
            <DR label="Status"       value={selectedDispute.status}/>
            <DR label="Filed"        value={selectedDispute.created}/>
            <div style={{ margin:"14px 0 8px",fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em" }}>Description</div>
            <div style={{ padding:"10px 14px",background:C.surfaceAlt,borderRadius:8,fontSize:13,color:C.textMid,lineHeight:1.7,marginBottom:14 }}>
              {selectedDispute.description}
            </div>
            {selectedDispute.status==="Resolved" ? (
              <div style={{ padding:"10px 14px",background:C.greenLight,borderRadius:8,fontSize:13,color:C.green }}>
                ✅ <strong>Resolution:</strong> {selectedDispute.resolution}
                <div style={{ fontSize:11,color:C.textSoft,marginTop:4 }}>Resolved {selectedDispute.resolved_at}</div>
              </div>
            ) : (
              <>
                <div style={{ margin:"14px 0 8px",fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em" }}>Resolution notes</div>
                <textarea className="input-field" placeholder="Describe the resolution action taken — account suspended, player removed, score corrected..." rows={4}
                  value={resolution} onChange={e=>setResolution(e.target.value)} style={{ resize:"vertical",marginBottom:12 }}/>
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={()=>resolveDispute(selectedDispute.id)}
                    disabled={!resolution.trim()}
                    style={{ flex:1,padding:"10px",borderRadius:8,border:"none",background:resolution.trim()?C.green:C.borderDark,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,cursor:resolution.trim()?"pointer":"not-allowed",fontSize:13 }}>
                    ✓ Mark resolved
                  </button>
                  <button onClick={()=>setDisputes(prev=>prev.map(d=>d.id===selectedDispute.id?{...d,status:"In review"}:d))}
                    style={{ flex:"0 0 120px",padding:"10px",borderRadius:8,border:`1px solid ${C.amber}`,background:C.amberLight,color:C.amber,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                    Under review
                  </button>
                </div>
              </>
            )}
          </SlidePanel>
        )}

        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Disputes</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{open.length} open · {review.length} in review · {resolved.length} resolved</p>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18 }}>
          <StatCard icon="🚨" label="Open"      value={open.length}     color={C.red}   sub="Needs attention"/>
          <StatCard icon="🔍" label="In review" value={review.length}   color={C.amber} sub="Being investigated"/>
          <StatCard icon="✅" label="Resolved"  value={resolved.length} color={C.green} sub="Closed"/>
        </div>

        {open.length > 0 && (
          <Alert type="error">🚨 {open.filter(d=>d.severity==="High").length} high-priority dispute{open.filter(d=>d.severity==="High").length>1?"s":""} require immediate attention.</Alert>
        )}

        {[{ label:"Open", items:open },{ label:"In Review", items:review },{ label:"Resolved", items:resolved }].map(group => (
          group.items.length > 0 && (
            <div key={group.label} style={{ marginBottom:22 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:10 }}>{group.label} ({group.items.length})</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {group.items.map((d,i)=>(
                  <div key={d.id} className="card" onClick={()=>setSelectedDispute(d)}
                    style={{ padding:"14px 18px",cursor:"pointer",borderLeft:`3px solid ${d.status==="Resolved"?C.green:sevColor[d.severity]}` }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                      <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text }}>{d.title}</div>
                      <div style={{ display:"flex",gap:6,flexShrink:0,marginLeft:10 }}>
                        <Badge label={d.severity} color={sevColor[d.severity]} bg={sevBg[d.severity]}/>
                        <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:d.status==="Resolved"?C.greenLight:d.status==="In review"?C.amberLight:C.redLight,color:d.status==="Resolved"?C.green:d.status==="In review"?C.amber:C.red }}>{d.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:12,color:C.textSoft,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d.description}</div>
                    <div style={{ display:"flex",gap:16,fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>
                      <span>By: {d.reporter}</span>
                      <span>Against: {d.against}</span>
                      <span>{d.created}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  // ── TOURNAMENTS PAGE ───────────────────────────────────────────────────────
  const TournamentsAdminPage = () => (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Tournaments</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Platform-wide tournament overview</p>
      </div>
      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 140px 80px 60px 90px 80px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
          {["Tournament","Organizer","Format","Teams","Status","Action"].map(h=>(
            <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
          ))}
        </div>
        {tournaments.map((t,i)=>(
          <div key={t.id} style={{ display:"grid",gridTemplateColumns:"1fr 140px 80px 60px 90px 80px",alignItems:"center",padding:"0 16px",height:54,borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.surfaceAlt }}>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{t.name}</div>
              <div style={{ fontSize:11,color:C.textSoft }}>Created {t.created}</div>
            </div>
            <span style={{ fontSize:12,color:C.textMid }}>{t.organizer}</span>
            <span style={{ fontSize:12,color:C.textSoft }}>{t.format}</span>
            <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:18,color:C.blue }}>{t.teams}</span>
            <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:t.status==="Active"?C.greenLight:t.status==="Completed"?C.surfaceAlt:C.amberLight,color:t.status==="Active"?C.green:t.status==="Completed"?C.textSoft:C.amber }}>{t.status}</span>
            <button style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:11,cursor:"pointer",fontWeight:600 }}>Suspend</button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── PLATFORM STATS PAGE ────────────────────────────────────────────────────
  const StatsPage = () => {
    const roleBreakdown = Object.entries(ROLES).map(([key,r])=>({ label:r.label, value:allUsers.filter(u=>u.role===key).length, color:r.color, icon:r.icon }));
    return (
      <div className="fade-up">
        <div style={{ marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Platform Statistics</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>System-wide overview</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }}>
          <StatCard icon="👥" label="Total users"        value={allUsers.length}         color={C.blue}   sub="All roles"/>
          <StatCard icon="🏆" label="Tournaments"        value={tournaments.length}      color={C.green}  sub={`${tournaments.filter(t=>t.status==="Active").length} active`}/>
          <StatCard icon="⏳" label="Pending approvals"  value={pendingRegistrations.filter(r=>r.status==="Pending").length} color={C.amber}/>
          <StatCard icon="⚠️" label="Open disputes"      value={disputes.filter(d=>d.status==="Open").length} color={C.red}/>
        </div>

        {/* User breakdown */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:16 }}>Users by role</div>
            {roleBreakdown.map((r,i)=>(
              <div key={i} style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:14 }}>{r.icon}</span>
                    <span style={{ fontSize:13,color:C.text }}>{r.label}</span>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:700,color:r.color }}>{r.value}</span>
                </div>
                <div style={{ height:6,background:C.border,borderRadius:3,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${(r.value/allUsers.length)*100}%`,background:r.color,borderRadius:3,transition:"width 0.5s ease" }}/>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:16 }}>Platform activity</div>
            {[
              { label:"Accounts approved this week",   value:"12",  color:C.green  },
              { label:"Accounts rejected this week",   value:"2",   color:C.red    },
              { label:"Disputes resolved this month",  value:"8",   color:C.green  },
              { label:"Active suspensions",            value:String(allUsers.filter(u=>u.status==="Suspended").length), color:C.red },
              { label:"Players in pool",               value:"648", color:C.blue   },
              { label:"Squads submitted",              value:"6",   color:C.purple },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<5?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:13,color:C.textMid }}>{s.label}</span>
                <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:18,color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── LINKS ──────────────────────────────────────────────────────────────────
  const links = [
    { id:"overview",      label:"Overview",        icon:"📊" },
    { id:"registrations", label:"Registrations",   icon:"📋", badge:pendingRegistrations.filter(r=>r.status==="Pending").length>0?String(pendingRegistrations.filter(r=>r.status==="Pending").length):undefined },
    { id:"users",         label:"User Accounts",   icon:"👥" },
    { id:"disputes",      label:"Disputes",        icon:"⚠️", badge:disputes.filter(d=>d.status==="Open").length>0?String(disputes.filter(d=>d.status==="Open").length):undefined },
    { id:"tournaments",   label:"Tournaments",     icon:"🏆" },
    { id:"stats",         label:"Platform Stats",  icon:"📈" },
  ];

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={p=>{setPage(p);setSelectedDispute(null);setSelectedUser(null);}}>
      {page==="overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Platform Overview</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>Welcome back, {user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="👥" label="Total Users"        value={allUsers.length}           color={C.blue}   sub="All roles"/>
            <StatCard icon="🏆" label="Active Tournaments" value={tournaments.filter(t=>t.status==="Active").length} color={C.green}/>
            <StatCard icon="📋" label="Pending Approvals"  value={pendingRegistrations.filter(r=>r.status==="Pending").length} color={C.amber} sub="Awaiting review"/>
            <StatCard icon="⚠️" label="Open Disputes"      value={disputes.filter(d=>d.status==="Open").length} color={C.red} sub="Needs attention"/>
          </div>

          {pendingRegistrations.filter(r=>r.status==="Pending").length>0 && (
            <Alert type="warning">
              ⏳ {pendingRegistrations.filter(r=>r.status==="Pending").length} account{pendingRegistrations.filter(r=>r.status==="Pending").length>1?"s":""} waiting for approval.{" "}
              <button onClick={()=>setPage("registrations")} style={{ background:"none",border:"none",color:C.amber,cursor:"pointer",fontWeight:700,fontSize:13 }}>Review now →</button>
            </Alert>
          )}
          {disputes.filter(d=>d.status==="Open"&&d.severity==="High").length>0 && (
            <Alert type="error">
              🚨 {disputes.filter(d=>d.status==="Open"&&d.severity==="High").length} high-priority dispute{disputes.filter(d=>d.status==="Open"&&d.severity==="High").length>1?"s":""} require immediate action.{" "}
              <button onClick={()=>setPage("disputes")} style={{ background:"none",border:"none",color:C.red,cursor:"pointer",fontWeight:700,fontSize:13 }}>View disputes →</button>
            </Alert>
          )}

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {/* Pending registrations */}
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Pending approvals</div>
                <button className="btn-outline-green" onClick={()=>setPage("registrations")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
              </div>
              {pendingRegistrations.filter(r=>r.status==="Pending").slice(0,4).map((r,i)=>(
                <div key={r.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<Math.min(3,pendingRegistrations.filter(x=>x.status==="Pending").length-1)?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:34,height:34,borderRadius:8,background:roleBg[r.role],display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{ROLES[r.role]?.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{r.name}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{ROLES[r.role]?.label}{r.team!=="—"?` · ${r.team}`:""}</div>
                  </div>
                  <div style={{ display:"flex",gap:5 }}>
                    <button onClick={()=>approveReg(r.id)} style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>✓</button>
                    <button onClick={()=>rejectReg(r.id)} style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:11,cursor:"pointer" }}>✕</button>
                  </div>
                </div>
              ))}
              {pendingRegistrations.filter(r=>r.status==="Pending").length===0 && (
                <div style={{ textAlign:"center",padding:"20px",color:C.textSoft,fontSize:13 }}>✅ All caught up!</div>
              )}
            </div>

            {/* Open disputes */}
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Open disputes</div>
                <button className="btn-outline-green" onClick={()=>setPage("disputes")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
              </div>
              {disputes.filter(d=>d.status==="Open").map((d,i,arr)=>(
                <div key={d.id} onClick={()=>{setSelectedDispute(d);setPage("disputes");}}
                  style={{ padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text,flex:1,marginRight:8 }}>{d.title}</div>
                    <Badge label={d.severity} color={sevColor[d.severity]} bg={sevBg[d.severity]}/>
                  </div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{d.against} · {d.created}</div>
                </div>
              ))}
              {disputes.filter(d=>d.status==="Open").length===0 && (
                <div style={{ textAlign:"center",padding:"20px",color:C.textSoft,fontSize:13 }}>✅ No open disputes.</div>
              )}
            </div>
          </div>
        </div>
      )}
      {page==="registrations" && <RegistrationsPage/>}
      {page==="users"         && <UsersPage/>}
      {page==="disputes"      && <DisputesPage/>}
      {page==="tournaments"   && <TournamentsAdminPage/>}
      {page==="stats"         && <StatsPage/>}
    </DashboardShell>
  );
};



// ═══════════════════════════════════════════════════════════════════════════
// TOURNAMENT ORGANIZER — MISSING PAGES
// ═══════════════════════════════════════════════════════════════════════════

const OrgSchedulePage = ({ squads, tournaments }) => {
  const [selectedTournId, setSelectedTournId] = React.useState(tournaments[0]?.id||"t1");
  const [matches, setMatches] = React.useState([
    { id:"ms1", home:"Nairobi Rhinos RFC",  away:"Kisumu Tigers RFC",   date:"2025-06-07", time:"14:00", venue:"RFUEA Ground",   round:"Group A · MD1", status:"Scheduled" },
    { id:"ms2", home:"Mombasa Lions RFC",   away:"Thika Panthers RFC",  date:"2025-06-07", time:"16:30", venue:"RFUEA Ground",   round:"Group A · MD1", status:"Scheduled" },
    { id:"ms3", home:"Nakuru Eagles RFC",   away:"Eldoret Bulls RFC",   date:"2025-06-08", time:"14:00", venue:"Kisumu Stadium", round:"Group B · MD1", status:"Scheduled" },
    { id:"ms4", home:"Kisumu Tigers RFC",   away:"Mombasa Lions RFC",   date:"2025-06-14", time:"14:00", venue:"RFUEA Ground",   round:"Group A · MD2", status:"Scheduled" },
    { id:"ms5", home:"Nairobi Rhinos RFC",  away:"Thika Panthers RFC",  date:"2025-06-14", time:"16:30", venue:"RFUEA Ground",   round:"Group A · MD2", status:"Scheduled" },
  ]);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [mForm, setMForm] = React.useState({ home:"", away:"", date:"", time:"14:00", venue:"", round:"" });
  const [success, setSuccess] = React.useState(false);
  const setM = (k,v) => setMForm(f=>({...f,[k]:v}));

  const teamNames = squads.map(s=>s.team);

  const handleAdd = () => {
    if (!mForm.home||!mForm.away||!mForm.date||!mForm.venue) return;
    setMatches(prev=>[...prev,{ id:`ms${Date.now()}`, ...mForm, status:"Scheduled" }]);
    setMForm({ home:"",away:"",date:"",time:"14:00",venue:"",round:"" });
    setSuccess(true); setTimeout(()=>setSuccess(false),2000);
  };

  const groupedByDate = matches.reduce((acc,m) => {
    const k = m.date; if (!acc[k]) acc[k]=[]; acc[k].push(m); return acc;
  }, {});

  return (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Match Schedule</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{matches.length} matches scheduled</p>
        </div>
        <button className="btn-primary" onClick={()=>setShowAddForm(v=>!v)} style={{ fontSize:13 }}>
          {showAddForm?"✕ Cancel":"+ Schedule Match"}
        </button>
      </div>

      {success && <div style={{ padding:"10px 14px",background:C.greenLight,border:`1px solid ${C.green}28`,borderRadius:8,fontSize:13,color:C.green,marginBottom:14 }}>✅ Match scheduled successfully!</div>}

      {showAddForm && (
        <div className="card" style={{ padding:"20px 22px",marginBottom:18,border:`1px solid ${C.green}28` }}>
          <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,marginBottom:16 }}>Schedule new match</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field label="Home Team *"><SelectField placeholder="— Select home team —" value={mForm.home} onChange={e=>setM("home",e.target.value)} options={teamNames.map(t=>({value:t,label:t}))}/></Field>
            <Field label="Away Team *"><SelectField placeholder="— Select away team —" value={mForm.away} onChange={e=>setM("away",e.target.value)} options={teamNames.map(t=>({value:t,label:t}))}/></Field>
            <Field label="Date *"><Input type="date" value={mForm.date} onChange={e=>setM("date",e.target.value)}/></Field>
            <Field label="Kick-off time *"><Input type="time" value={mForm.time} onChange={e=>setM("time",e.target.value)}/></Field>
            <Field label="Venue *"><Input placeholder="e.g. RFUEA Ground, Nairobi" value={mForm.venue} onChange={e=>setM("venue",e.target.value)}/></Field>
            <Field label="Round / Stage"><Input placeholder="e.g. Group A · Matchday 1" value={mForm.round} onChange={e=>setM("round",e.target.value)}/></Field>
          </div>
          <button className="btn-primary" onClick={handleAdd} style={{ marginTop:12,fontSize:13 }}>Save match</button>
        </div>
      )}

      {Object.keys(groupedByDate).sort().map(date => (
        <div key={date} style={{ marginBottom:18 }}>
          <div style={{ fontSize:11,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border}` }}>
            {new Date(date+"T00:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </div>
          {groupedByDate[date].map((m,i) => (
            <div key={m.id} className="card" style={{ padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ textAlign:"center",padding:"8px 14px",background:C.surfaceAlt,borderRadius:8,minWidth:70 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:18,color:C.text }}>{m.time}</div>
                <div style={{ fontSize:10,color:C.textSoft }}>Kick-off</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:3 }}>
                  {m.home} <span style={{ color:C.textSoft,fontWeight:400 }}>vs</span> {m.away}
                </div>
                <div style={{ fontSize:12,color:C.textSoft }}>{m.venue}{m.round?` · ${m.round}`:""}</div>
              </div>
              <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:m.status==="Live"?"rgba(192,57,43,0.1)":C.blueLight,color:m.status==="Live"?C.red:C.blue }}>{m.status}</span>
              <button onClick={()=>setMatches(prev=>prev.filter(x=>x.id!==m.id))} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:11,cursor:"pointer" }}>Remove</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const OrgTaggingPage = ({ squads }) => {
  const [selectedTeam, setSelectedTeam] = React.useState(squads[0]?.team||"");
  const [tagStatuses, setTagStatuses] = React.useState({});
  const squad = squads.find(s=>s.team===selectedTeam);

  const mockPlayers = [
    { jersey:1, name:"James Kamau",    pos:"Loosehead Prop" },
    { jersey:2, name:"Ali Hassan",     pos:"Hooker"         },
    { jersey:3, name:"Brian Waweru",   pos:"Tighthead Prop" },
    { jersey:4, name:"Moses Otieno",   pos:"Lock"           },
    { jersey:5, name:"Peter Omondi",   pos:"Flanker"        },
    { jersey:8, name:"Daniel Njoroge", pos:"Number 8"       },
    { jersey:9, name:"Kevin Mutua",    pos:"Scrum-half"     },
    { jersey:10,name:"Grace Wanjiku",  pos:"Fly-half"       },
    { jersey:11,name:"Samuel Mutua",   pos:"Winger"         },
    { jersey:12,name:"David Njoroge",  pos:"Centre"         },
    { jersey:13,name:"Eric Ochieng",   pos:"Centre"         },
    { jersey:15,name:"Tom Baraka",     pos:"Full-back"      },
  ];

  const tag = (jersey, status) => setTagStatuses(prev=>({...prev,[`${selectedTeam}-${jersey}`]:status}));
  const getStatus = (jersey) => tagStatuses[`${selectedTeam}-${jersey}`] || "Untagged";

  const statusColor = { Tagged:C.green, Flagged:C.red, Untagged:C.textSoft };
  const statusBg    = { Tagged:C.greenLight, Flagged:C.redLight, Untagged:C.surfaceAlt };

  const tagged  = mockPlayers.filter(p=>getStatus(p.jersey)==="Tagged").length;
  const flagged = mockPlayers.filter(p=>getStatus(p.jersey)==="Flagged").length;

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Player Tagging</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Verify player identity before matchday — compare face to uploaded ID photo</p>
      </div>
      <div style={{ padding:"10px 14px",background:C.blueLight,border:`1px solid ${C.blue}28`,borderRadius:8,fontSize:12,color:C.blue,marginBottom:16 }}>
        ℹ️ Facial recognition compares the player's live face to their Kenyan ID photo. An 80–85% match is required. Players below threshold are flagged and cannot play until resolved.
      </div>

      {/* Team selector */}
      <Field label="Select team to tag">
        <SelectField value={selectedTeam} onChange={e=>setSelectedTeam(e.target.value)} options={squads.map(s=>({value:s.team,label:s.team}))}/>
      </Field>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18 }}>
        <div className="card" style={{ padding:"12px 16px",textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:24,color:C.green }}>{tagged}</div>
          <div style={{ fontSize:12,color:C.textSoft }}>Tagged ✅</div>
        </div>
        <div className="card" style={{ padding:"12px 16px",textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:24,color:C.red }}>{flagged}</div>
          <div style={{ fontSize:12,color:C.textSoft }}>Flagged 🚩</div>
        </div>
        <div className="card" style={{ padding:"12px 16px",textAlign:"center" }}>
          <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:24,color:C.textSoft }}>{mockPlayers.length-tagged-flagged}</div>
          <div style={{ fontSize:12,color:C.textSoft }}>Pending</div>
        </div>
      </div>

      {/* Player list */}
      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"44px 1fr 90px 110px 180px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
          {["#","Player","Position","Status","Action"].map(h=>(
            <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
          ))}
        </div>
        {mockPlayers.map((p,i)=>{
          const st = getStatus(p.jersey);
          const matchPct = st==="Tagged"?Math.floor(82+Math.random()*8):st==="Flagged"?Math.floor(55+Math.random()*20):null;
          return (
            <div key={p.jersey} style={{ display:"grid",gridTemplateColumns:"44px 1fr 90px 110px 180px",alignItems:"center",padding:"0 16px",minHeight:52,borderBottom:`1px solid ${C.border}`,background:st==="Flagged"?"rgba(192,57,43,0.03)":i%2===0?"transparent":C.surfaceAlt }}>
              <div style={{ width:30,height:30,borderRadius:7,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:C.green }}>#{p.jersey}</div>
              <div>
                <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{p.name}</div>
                {matchPct && <div style={{ fontSize:11,color:st==="Tagged"?C.green:C.red,fontFamily:"'JetBrains Mono'",fontWeight:600 }}>{matchPct}% match</div>}
              </div>
              <span style={{ fontSize:12,color:C.textSoft }}>{p.pos}</span>
              <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:statusBg[st],color:statusColor[st] }}>{st}</span>
              <div style={{ display:"flex",gap:6 }}>
                {st==="Untagged"&&(
                  <>
                    <button onClick={()=>tag(p.jersey,"Tagged")} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>✓ Tag</button>
                    <button onClick={()=>tag(p.jersey,"Flagged")} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:11,cursor:"pointer" }}>🚩 Flag</button>
                  </>
                )}
                {st==="Tagged"&&<button onClick={()=>tag(p.jersey,"Untagged")} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.borderDark}`,background:"transparent",color:C.textSoft,fontSize:11,cursor:"pointer" }}>Reset</button>}
                {st==="Flagged"&&(
                  <>
                    <button onClick={()=>tag(p.jersey,"Tagged")} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>✓ Approve</button>
                    <button onClick={()=>tag(p.jersey,"Untagged")} style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.borderDark}`,background:"transparent",color:C.textSoft,fontSize:11,cursor:"pointer" }}>Reset</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrgCardsPage = () => {
  const suspensions = [
    { player:"James Kamau",   jersey:1,  team:"Nairobi Rhinos RFC", card:"Red",    ban:1, ban_remaining:1, status:"Active",   match:"vs Kisumu Tigers",  issued:"Mar 23" },
    { player:"Collins Otieno",jersey:10, team:"Kisumu Tigers RFC",  card:"Yellow", ban:0, ban_remaining:0, status:"Warning",  match:"vs Nairobi Rhinos", issued:"Mar 23" },
    { player:"Mark Waweru",   jersey:8,  team:"Kisumu Tigers RFC",  card:"Citing", ban:0, ban_remaining:0, status:"Under investigation", match:"vs Nairobi Rhinos", issued:"Mar 23" },
  ];
  const [bans, setBans] = React.useState(suspensions);

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Cards & Suspensions</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Review and manage disciplinary records from all matches</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18 }}>
        <StatCard icon="🟥" label="Active bans"     value={bans.filter(b=>b.status==="Active").length}              color={C.red}/>
        <StatCard icon="⚠️" label="Under review"    value={bans.filter(b=>b.status==="Under investigation").length} color={C.amber}/>
        <StatCard icon="🟨" label="Warnings"        value={bans.filter(b=>b.status==="Warning").length}             color="#B8860B"/>
      </div>
      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px 110px 90px 130px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
          {["Player","Team","Card","Status","Issued","Action"].map(h=>(
            <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
          ))}
        </div>
        {bans.map((b,i)=>(
          <div key={i} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 80px 110px 90px 130px",alignItems:"center",padding:"0 16px",minHeight:52,borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.surfaceAlt }}>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{b.jersey?`#${b.jersey} `:""}{b.player}</div>
              <div style={{ fontSize:11,color:C.textSoft }}>{b.match}</div>
            </div>
            <span style={{ fontSize:12,color:C.textMid }}>{b.team}</span>
            <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:b.card==="Red"?C.redLight:b.card==="Yellow"?"#FDF6E3":C.purpleLight,color:b.card==="Red"?C.red:b.card==="Yellow"?"#B8860B":C.purple }}>
              {b.card==="Red"?"🟥":b.card==="Yellow"?"🟨":"📋"} {b.card}
            </span>
            <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:b.status==="Active"?C.redLight:b.status==="Warning"?"#FDF6E3":C.amberLight,color:b.status==="Active"?C.red:b.status==="Warning"?"#B8860B":C.amber }}>{b.status}</span>
            <span style={{ fontSize:12,color:C.textSoft,fontFamily:"'JetBrains Mono'" }}>{b.issued}</span>
            <div style={{ display:"flex",gap:5 }}>
              {b.status==="Active"&&<button onClick={()=>setBans(prev=>prev.map((x,j)=>j===i?{...x,ban_remaining:Math.max(0,x.ban_remaining-1),status:x.ban_remaining<=1?"Served":"Active"}:x))} style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:10,cursor:"pointer",fontWeight:600 }}>Serve match</button>}
              {b.status==="Under investigation"&&<button onClick={()=>setBans(prev=>prev.map((x,j)=>j===i?{...x,status:"Active",ban:2}:x))} style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:10,cursor:"pointer",fontWeight:600 }}>Confirm ban</button>}
              {b.ban>0&&<span style={{ fontSize:10,color:C.textSoft,fontFamily:"'JetBrains Mono'" }}>{b.ban_remaining}/{b.ban} games</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrgNotificationsPage = () => {
  const [notifs, setNotifs] = React.useState([
    { id:1,icon:"📋",title:"Squad submitted",       body:"Nairobi Rhinos RFC submitted their squad for KRU Cup 2025 — 18 players.",              time:"2h ago",  read:false },
    { id:2,icon:"🟥",title:"Red card issued",        body:"Referee issued red card to James Kamau (#1, Nairobi Rhinos) — dangerous play.",        time:"3h ago",  read:false },
    { id:3,icon:"🏥",title:"Injury reported",        body:"Medic logged severe injury — Mark Waweru (#8, Kisumu Tigers). Concussion, withdrawn.",  time:"4h ago",  read:false },
    { id:4,icon:"📋",title:"Squad submitted",        body:"Thika Panthers RFC submitted their squad for KRU Cup 2025 — 17 players.",             time:"1d ago",  read:true  },
    { id:5,icon:"⚠️",title:"Facial match failed",    body:"Player Daniel Baraka (Eldoret Bulls) — facial recognition match only 61%. Flagged.",   time:"1d ago",  read:true  },
    { id:6,icon:"✅",title:"Registration approved",  body:"Super Admin approved your account. Platform access is now fully active.",             time:"2d ago",  read:true  },
  ]);

  const markRead = (id) => setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));
  const markAllRead = () => setNotifs(prev=>prev.map(n=>({...n,read:true})));
  const unread = notifs.filter(n=>!n.read).length;

  return (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Notifications</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{unread} unread</p>
        </div>
        {unread>0&&<button className="btn-ghost" onClick={markAllRead} style={{ fontSize:12 }}>Mark all read</button>}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>markRead(n.id)} className="card"
            style={{ padding:"14px 18px",cursor:"pointer",background:n.read?"transparent":"rgba(26,86,219,0.03)",borderLeft:`3px solid ${n.read?C.border:C.blue}` }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
              <span style={{ fontSize:22,flexShrink:0 }}>{n.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                  <div style={{ fontSize:13,fontWeight:n.read?500:700,color:C.text }}>{n.title}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>{n.time}</span>
                    {!n.read&&<span style={{ width:8,height:8,borderRadius:"50%",background:C.blue,display:"inline-block" }}/>}
                  </div>
                </div>
                <div style={{ fontSize:12,color:C.textSoft,lineHeight:1.5 }}>{n.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TEAM MANAGER — MISSING PAGES
// ═══════════════════════════════════════════════════════════════════════════

const TMInjuriesPage = ({ externalNotifs }) => {
  const injuryNotifs = (externalNotifs||[]).filter(n=>n.type==="injury");
  const mockInjuries = [
    { player:"Daniel Njoroge",jersey:8, injury:"Hamstring strain",  severity:"Moderate",status:"Active", reported:"Mar 23 14:45",medic:"Dr. Wanjiku",notes:"Left hamstring. Resting." },
    { player:"Tom Baraka",    jersey:15,injury:"Shoulder bruise",   severity:"Minor",   status:"Cleared",reported:"Mar 20 10:00",medic:"Dr. Wanjiku",notes:"Strapped, returned to play." },
  ];
  const combined = [
    ...injuryNotifs.map(n=>({ player:n.player,jersey:"",injury:n.injury,severity:n.severity,status:"Active",reported:n.time,medic:"Medic",notes:`Logged during match` })),
    ...mockInjuries,
  ];
  const sevColor = { Minor:C.green,Moderate:C.amber,Severe:C.red,Unknown:C.purple };
  const sevBg    = { Minor:C.greenLight,Moderate:C.amberLight,Severe:C.redLight,Unknown:C.purpleLight };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Injuries</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Nairobi Rhinos RFC · {combined.filter(i=>i.status==="Active").length} active</p>
      </div>
      {combined.filter(i=>i.status==="Active").length>0&&(
        <Alert type="error">🏥 {combined.filter(i=>i.status==="Active").length} player{combined.filter(i=>i.status==="Active").length>1?"s are":" is"} currently injured. Review squad availability before your next match.</Alert>
      )}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {combined.map((inj,i)=>(
          <div key={i} className="card" style={{ padding:"16px 20px",borderLeft:`3px solid ${inj.status==="Cleared"?C.green:sevColor[inj.severity]||C.red}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:22 }}>🏥</span>
                <div>
                  <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text }}>{inj.jersey?`#${inj.jersey} `:""}{inj.player}</div>
                  <div style={{ fontSize:12,color:C.textSoft }}>{inj.injury}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:sevBg[inj.severity]||C.redLight,color:sevColor[inj.severity]||C.red }}>{inj.severity}</span>
                <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:inj.status==="Cleared"?C.greenLight:C.redLight,color:inj.status==="Cleared"?C.green:C.red }}>{inj.status}</span>
              </div>
            </div>
            <div style={{ fontSize:12,color:C.textMid,lineHeight:1.5,padding:"8px 12px",background:C.surfaceAlt,borderRadius:7 }}>{inj.notes}</div>
            <div style={{ fontSize:11,color:C.textDim,marginTop:6,fontFamily:"'JetBrains Mono'" }}>Reported by {inj.medic} · {inj.reported}</div>
          </div>
        ))}
        {combined.length===0&&<div style={{ textAlign:"center",padding:"40px",color:C.textSoft }}>✅ No injuries reported for your team.</div>}
      </div>
    </div>
  );
};

const TMCardsPage = ({ externalNotifs }) => {
  const cardNotifs = (externalNotifs||[]).filter(n=>n.type==="red_card"||n.type==="yellow_card"||n.type==="card");
  const mockCards = [
    { player:"James Kamau",  jersey:1, card:"Red",   offence:"Dangerous tackle", ban:1,ban_served:0,match:"vs Kisumu Tigers",time:"Mar 23 14:34",status:"Active" },
    { player:"Brian Waweru", jersey:4, card:"Yellow", offence:"Late tackle",      ban:0,ban_served:0,match:"vs Kisumu Tigers",time:"Mar 23 15:12",status:"Warning" },
  ];
  const combined = [
    ...cardNotifs.map(n=>({ player:n.player,jersey:"",card:n.card,offence:n.offence||"See referee report",ban:n.ban||0,ban_served:0,match:n.match,time:n.time,status:n.card==="Red"?"Active":"Warning",auto_red:n.auto_red })),
    ...mockCards,
  ];

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Cards & Flags</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Nairobi Rhinos RFC · disciplinary record</p>
      </div>
      {combined.filter(c=>c.status==="Active").length>0&&(
        <Alert type="error">🟥 {combined.filter(c=>c.status==="Active").length} player{combined.filter(c=>c.status==="Active").length>1?"s are":" is"} currently suspended and cannot play.</Alert>
      )}
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {combined.map((c,i)=>(
          <div key={i} className="card" style={{ padding:"16px 20px",borderLeft:`3px solid ${c.card==="Red"?C.red:c.card==="Yellow"?"#B8860B":C.purple}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:22 }}>{c.card==="Red"?"🟥":c.card==="Yellow"?"🟨":"📋"}</span>
                <div>
                  <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text }}>{c.jersey?`#${c.jersey} `:""}{c.player}</div>
                  <div style={{ fontSize:12,color:C.textSoft }}>{c.offence}{c.auto_red?" (2nd yellow → auto red)":""}</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:c.status==="Active"?C.redLight:C.surfaceAlt,color:c.status==="Active"?C.red:C.textSoft }}>{c.status}</span>
                <div style={{ fontSize:11,color:C.textDim,marginTop:3,fontFamily:"'JetBrains Mono'" }}>{c.time}</div>
              </div>
            </div>
            {c.ban>0&&(
              <div style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.redLight,borderRadius:7 }}>
                <span style={{ fontSize:14 }}>🚫</span>
                <span style={{ fontSize:12,color:C.red,fontWeight:600 }}>{c.ban}-match ban · {c.ban-c.ban_served} game{c.ban-c.ban_served!==1?"s":""} remaining</span>
              </div>
            )}
            <div style={{ fontSize:11,color:C.textSoft,marginTop:6 }}>Match: {c.match}</div>
          </div>
        ))}
        {combined.length===0&&<div style={{ textAlign:"center",padding:"40px",color:C.textSoft }}>✅ No cards issued to your players.</div>}
      </div>
    </div>
  );
};

const TMNotificationsPage = ({ externalNotifs }) => {
  const [readIds, setReadIds] = React.useState(new Set());
  const staticNotifs = [
    { id:"s1",icon:"✅",title:"Squad approved",       body:"Tournament Organizer approved your squad for KRU Cup 2025. All 18 players cleared.",time:"1d ago" },
    { id:"s2",icon:"📋",title:"Tournament registered", body:"Nairobi Rhinos RFC successfully registered for KRU Cup 2025. Squad submission is open.",time:"2d ago" },
  ];
  const liveNotifs = (externalNotifs||[]).map((n,i)=>({
    id:`live-${i}`,
    icon:n.type==="red_card"?"🟥":n.type==="yellow_card"?"🟨":n.type==="injury"?"🏥":"🔔",
    title:n.type==="red_card"?`Red card — ${n.player}`:n.type==="yellow_card"?`Yellow card — ${n.player}`:`Injury — ${n.player}`,
    body:n.type==="injury"?`${n.severity} injury reported: ${n.injury}. Logged by medic.`
         :n.type==="red_card"?`${n.ban>0?`${n.ban}-match ban issued.`:""} Review squad availability.`
         :`Warning — 2nd yellow = automatic red card suspension.`,
    time:n.time,
    isNew:true,
  }));
  const all = [...liveNotifs,...staticNotifs];
  const unread = all.filter(n=>!readIds.has(n.id)&&n.isNew).length;

  return (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Notifications</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{unread} unread</p>
        </div>
        {unread>0&&<button className="btn-ghost" onClick={()=>setReadIds(new Set(all.map(n=>n.id)))} style={{ fontSize:12 }}>Mark all read</button>}
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {all.map(n=>(
          <div key={n.id} onClick={()=>setReadIds(prev=>new Set([...prev,n.id]))} className="card"
            style={{ padding:"14px 18px",cursor:"pointer",background:readIds.has(n.id)||!n.isNew?"transparent":"rgba(26,86,219,0.03)",borderLeft:`3px solid ${readIds.has(n.id)||!n.isNew?C.border:C.blue}` }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
              <span style={{ fontSize:22,flexShrink:0 }}>{n.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                  <div style={{ fontSize:13,fontWeight:readIds.has(n.id)||!n.isNew?500:700,color:C.text }}>{n.title}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>{n.time}</span>
                    {n.isNew&&!readIds.has(n.id)&&<span style={{ width:8,height:8,borderRadius:"50%",background:C.blue,display:"inline-block" }}/>}
                  </div>
                </div>
                <div style={{ fontSize:12,color:C.textSoft,lineHeight:1.5 }}>{n.body}</div>
              </div>
            </div>
          </div>
        ))}
        {all.length===0&&<div style={{ textAlign:"center",padding:"40px",color:C.textSoft }}>No notifications yet.</div>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REFEREE — MATCH REPORTS PAGE
// ═══════════════════════════════════════════════════════════════════════════

const RefMatchReportsPage = ({ cards }) => {
  const [reports, setReports] = React.useState([
    { id:"rep1",match:"Nairobi Rhinos vs Kisumu Tigers",date:"Mar 23",venue:"RFUEA Ground",home_score:21,away_score:14,cards_issued:cards.length,incidents:"1 red card, 2 yellow cards, 1 citing. Match played in good spirit despite card incidents.",status:"Submitted" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [rForm, setRForm] = React.useState({ match:"",date:"",venue:"",home_score:"",away_score:"",incidents:"" });
  const setR = (k,v) => setRForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!rForm.match||!rForm.incidents) return;
    setReports(prev=>[{ id:`rep${Date.now()}`,cards_issued:0,status:"Submitted",...rForm },
      ...prev]);
    setRForm({ match:"",date:"",venue:"",home_score:"",away_score:"",incidents:"" });
    setShowForm(false);
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Match Reports</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{reports.length} report{reports.length!==1?"s":""} submitted</p>
        </div>
        <button className="btn-primary" onClick={()=>setShowForm(v=>!v)} style={{ fontSize:13,background:C.coral }}>
          {showForm?"✕ Cancel":"📝 New report"}
        </button>
      </div>

      {showForm&&(
        <div className="card" style={{ padding:"20px 22px",marginBottom:18,border:`1px solid ${C.coral}28` }}>
          <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,marginBottom:16 }}>Post-match report</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <Field label="Match *"><Input placeholder="Home vs Away" value={rForm.match} onChange={e=>setR("match",e.target.value)}/></Field>
            <Field label="Date"><Input type="date" value={rForm.date} onChange={e=>setR("date",e.target.value)}/></Field>
            <Field label="Venue"><Input placeholder="Venue name" value={rForm.venue} onChange={e=>setR("venue",e.target.value)}/></Field>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <Field label="Home score"><Input type="number" value={rForm.home_score} onChange={e=>setR("home_score",e.target.value)}/></Field>
              <Field label="Away score"><Input type="number" value={rForm.away_score} onChange={e=>setR("away_score",e.target.value)}/></Field>
            </div>
          </div>
          <Field label="Incidents & observations *">
            <textarea className="input-field" placeholder="Describe any incidents, card reasons, player conduct, ground conditions, any other observations relevant to the tournament organizer..."
              rows={5} value={rForm.incidents} onChange={e=>setR("incidents",e.target.value)} style={{ resize:"vertical" }}/>
          </Field>
          <button className="btn-primary" onClick={handleSubmit} style={{ background:C.coral,fontSize:13 }}>Submit report</button>
        </div>
      )}

      {reports.map((r,i)=>(
        <div key={r.id} className="card" style={{ padding:"18px 22px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.text,marginBottom:3 }}>{r.match}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>{r.venue}{r.date?` · ${r.date}`:""}</div>
            </div>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              {(r.home_score!==undefined&&r.away_score!==undefined)&&(
                <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:20,color:C.text,padding:"4px 14px",background:C.surfaceAlt,borderRadius:8 }}>
                  {r.home_score} — {r.away_score}
                </div>
              )}
              <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:C.greenLight,color:C.green }}>{r.status}</span>
            </div>
          </div>
          <div style={{ padding:"10px 14px",background:C.surfaceAlt,borderRadius:8,fontSize:13,color:C.textMid,lineHeight:1.6,marginBottom:8 }}>{r.incidents}</div>
          <div style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>Cards issued this match: {r.cards_issued}</div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEDIC — TEAM HEALTH PAGE
// ═══════════════════════════════════════════════════════════════════════════

const MedicTeamHealthPage = ({ injuries }) => {
  const teams = [
    { name:"Nairobi Rhinos RFC", players:18 },
    { name:"Kisumu Tigers RFC",  players:21 },
    { name:"Mombasa Lions RFC",  players:20 },
    { name:"Eldoret Bulls RFC",  players:17 },
    { name:"Nakuru Eagles RFC",  players:19 },
    { name:"Thika Panthers RFC", players:16 },
  ];

  const sevColor = { Minor:C.green,Moderate:C.amber,Severe:C.red,Unknown:C.purple };
  const sevBg    = { Minor:C.greenLight,Moderate:C.amberLight,Severe:C.redLight,Unknown:C.purpleLight };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Team Health</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Health overview across all registered teams</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {teams.map((team,i)=>{
          const teamInjuries = injuries.filter(inj=>inj.team===team.name&&inj.status==="Active");
          const hasSevere    = teamInjuries.some(inj=>inj.severity==="Severe");
          return (
            <div key={i} className="card" style={{ padding:"16px 20px",borderLeft:`3px solid ${hasSevere?C.red:teamInjuries.length>0?C.amber:C.green}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:teamInjuries.length>0?12:0 }}>
                <div>
                  <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text }}>{team.name}</div>
                  <div style={{ fontSize:12,color:C.textSoft }}>{team.players} registered players</div>
                </div>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:hasSevere?C.redLight:teamInjuries.length>0?C.amberLight:C.greenLight,color:hasSevere?C.red:teamInjuries.length>0?C.amber:C.green }}>
                    {teamInjuries.length===0?"✅ Fully fit":`${teamInjuries.length} injury${teamInjuries.length>1?"":""}${hasSevere?" 🚨":""}`}
                  </span>
                </div>
              </div>
              {teamInjuries.map((inj,j)=>(
                <div key={j} style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:C.surfaceAlt,borderRadius:7,marginBottom:6 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:sevColor[inj.severity]||C.red,flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:12,fontWeight:600,color:C.text }}>{inj.jersey?`#${inj.jersey} `:""}{inj.player}</span>
                    <span style={{ fontSize:11,color:C.textSoft }}> · {inj.type}</span>
                  </div>
                  <span style={{ padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:600,background:sevBg[inj.severity]||C.redLight,color:sevColor[inj.severity]||C.red }}>{inj.severity}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};



const TournamentOrganizerDashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("overview");

  // ── SHARED STATE ────────────────────────────────────────────────────────────
  const [tournaments, setTournaments] = useState([
    { id:"t1", name:"KRU Cup 2025",    venue:"RFUEA Ground, Nairobi", start:"2025-06-01", end:"2025-08-30", format:"Group + Knockout", deadline:"2025-05-20", max_teams:12, max_squad:23, status:"Open",   teams_registered:8  },
    { id:"t2", name:"KRU League 2025", venue:"Various venues",        start:"2025-03-01", end:"2025-05-30", format:"League",          deadline:"2025-02-20", max_teams:12, max_squad:20, status:"Closed",  teams_registered:12 },
    { id:"t3", name:"U20 Championship",venue:"Kisumu Stadium",        start:"2025-07-15", end:"2025-09-01", format:"Knockout",        deadline:"2025-07-01", max_teams:8,  max_squad:18, status:"Draft",   teams_registered:0  },
  ]);

  const [squads, setSquads] = useState([
    { id:"s1", team:"Nairobi Rhinos RFC",  manager:"Coach Kamau",   players:18, submitted:"Mar 17", status:"Pending",      tournament_id:"t1", flagged_players:[] },
    { id:"s2", team:"Kisumu Tigers RFC",   manager:"Coach Ochieng", players:21, submitted:"Mar 15", status:"Approved",     tournament_id:"t1", flagged_players:[] },
    { id:"s3", team:"Mombasa Lions RFC",   manager:"Coach Njeru",   players:20, submitted:"Mar 14", status:"Flagged",      tournament_id:"t1", flagged_players:["Player 4","Player 11"] },
    { id:"s4", team:"Eldoret Bulls RFC",   manager:"Coach Baraka",  players:0,  submitted:"—",      status:"Not submitted",tournament_id:"t1", flagged_players:[] },
    { id:"s5", team:"Nakuru Eagles RFC",   manager:"Coach Mutua",   players:19, submitted:"Mar 13", status:"Approved",     tournament_id:"t1", flagged_players:[] },
    { id:"s6", team:"Thika Panthers RFC",  manager:"Coach Ali",     players:17, submitted:"Mar 12", status:"Pending",      tournament_id:"t1", flagged_players:[] },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedSquad, setSelectedSquad]   = useState(null);
  const [selectedTourn, setSelectedTourn]   = useState(null);
  const [flagNote, setFlagNote]             = useState("");
  const [showFlagModal, setShowFlagModal]   = useState(false);

  // create form state
  const emptyTourn = { name:"", venue:"", start:"", end:"", format:"Group + Knockout", deadline:"", max_teams:"12", max_squad:"23" };
  const [tForm, setTForm]     = useState(emptyTourn);
  const [tError, setTError]   = useState("");
  const [tSuccess, setTSuccess] = useState(false);
  const [tLoading, setTLoading] = useState(false);
  const setT = (k,v) => setTForm(f => ({ ...f, [k]:v }));

  const handleCreateTournament = async () => {
    setTError("");
    if (!tForm.name)     { setTError("Tournament name is required.");     return; }
    if (!tForm.venue)    { setTError("Venue is required.");               return; }
    if (!tForm.start)    { setTError("Start date is required.");          return; }
    if (!tForm.end)      { setTError("End date is required.");            return; }
    if (!tForm.deadline) { setTError("Registration deadline is required."); return; }
    setTLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newT = { id:`t${tournaments.length+1}`, ...tForm, max_teams:Number(tForm.max_teams), max_squad:Number(tForm.max_squad), status:"Open", teams_registered:0 };
    setTournaments(prev => [...prev, newT]);
    setTForm(emptyTourn);
    setTLoading(false);
    setTSuccess(true);
    setTimeout(() => { setTSuccess(false); setShowCreateForm(false); }, 2000);
  };

  const handleSquadAction = (squadId, action) => {
    setSquads(prev => prev.map(s => s.id === squadId ? { ...s, status: action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Flagged" } : s));
    setSelectedSquad(null);
  };

  const statusColor = { Approved:"#0A6E3F", Pending:"#D97706", Flagged:"#C0392B", Rejected:"#C0392B", "Not submitted":"#7C8FA3" };
  const statusBg    = { Approved:"#E8F5EE", Pending:"#FEF3C7", Flagged:"#FDECEA", Rejected:"#FDECEA", "Not submitted":"#F9FAFB" };

  const FORMAT_OPTIONS = ["Group + Knockout","League","Knockout only","Round Robin"];

  // ── SQUAD DETAIL PANEL ──────────────────────────────────────────────────────
  const SquadPanel = ({ squad, onClose }) => {
    const mockPlayers = [
      { name:"James Kamau",   pos:"Loosehead Prop", jersey:1,  flagged:false },
      { name:"Ali Hassan",    pos:"Hooker",         jersey:2,  flagged:false },
      { name:"Brian Waweru",  pos:"Tighthead Prop", jersey:3,  flagged:false },
      { name:"Moses Otieno",  pos:"Lock",           jersey:4,  flagged:squad.status==="Flagged" },
      { name:"Peter Omondi",  pos:"Flanker",        jersey:5,  flagged:false },
      { name:"Daniel Njoroge",pos:"Number 8",       jersey:8,  flagged:false },
      { name:"Kevin Mutua",   pos:"Scrum-half",     jersey:9,  flagged:false },
      { name:"Grace Wanjiku", pos:"Fly-half",       jersey:10, flagged:false },
      { name:"Tom Baraka",    pos:"Centre",         jersey:12, flagged:false },
      { name:"David Njoroge", pos:"Centre",         jersey:13, flagged:false },
      { name:"Eric Ochieng",  pos:"Winger",         jersey:11, flagged:squad.status==="Flagged" },
      { name:"Samuel Mutua",  pos:"Full-back",      jersey:15, flagged:false },
    ];
    const [localFlags, setLocalFlags] = useState(mockPlayers.map(p => p.flagged));

    return (
      <>
        <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200,backdropFilter:"blur(2px)" }}/>
        <div style={{ position:"fixed",top:0,right:0,bottom:0,width:480,background:"#fff",borderLeft:`1px solid ${C.border}`,zIndex:201,display:"flex",flexDirection:"column",animation:"slideInPanel 0.25s ease",overflowY:"auto" }}>
          {/* Header */}
          <div style={{ padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0 }}>
            <div>
              <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:17,color:C.text }}>{squad.team}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>KRU Cup 2025 · {squad.players} players · Submitted {squad.submitted}</div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:statusBg[squad.status],color:statusColor[squad.status] }}>{squad.status}</span>
              <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.textSoft,lineHeight:1 }}>×</button>
            </div>
          </div>

          <div style={{ padding:"18px 22px",flex:1 }}>
            {/* Manager info */}
            <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.surfaceAlt,borderRadius:8,border:`1px solid ${C.border}`,marginBottom:16 }}>
              <div style={{ width:36,height:36,borderRadius:8,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.green }}>{squad.manager[0]}</div>
              <div>
                <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{squad.manager}</div>
                <div style={{ fontSize:11,color:C.textSoft }}>Team Manager · {squad.team}</div>
              </div>
              <div style={{ marginLeft:"auto",fontFamily:"'Syne'",fontWeight:700,fontSize:20,color:C.green }}>{squad.players}</div>
              <div style={{ fontSize:11,color:C.textSoft }}>players</div>
            </div>

            {squad.status==="Flagged" && (
              <div style={{ padding:"10px 14px",background:C.redLight,border:`1px solid ${C.red}28`,borderRadius:8,fontSize:12,color:C.red,marginBottom:14 }}>
                🚩 This squad has been flagged. Review the flagged players below before resolving.
              </div>
            )}

            {/* Players list */}
            <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8 }}>
              Squad players — click 🚩 to flag individual players
            </div>
            {mockPlayers.map((p,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`,background:localFlags[i]?"rgba(192,57,43,0.04)":"transparent" }}>
                <div style={{ width:30,height:30,borderRadius:7,background:localFlags[i]?C.redLight:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:localFlags[i]?C.red:C.green,flexShrink:0 }}>{p.jersey}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:localFlags[i]?C.red:C.text }}>{p.name}{localFlags[i]?" 🚩":""}</div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{p.pos}</div>
                </div>
                <button onClick={() => setLocalFlags(prev => prev.map((f,j) => j===i?!f:f))}
                  style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${localFlags[i]?C.green:C.red}`,background:"transparent",color:localFlags[i]?C.green:C.red,fontSize:10,cursor:"pointer",fontWeight:600 }}>
                  {localFlags[i]?"✓ Clear":"🚩 Flag"}
                </button>
              </div>
            ))}
            {squad.players > mockPlayers.length && (
              <div style={{ textAlign:"center",padding:"8px 0",fontSize:12,color:C.textSoft }}>+ {squad.players - mockPlayers.length} more players</div>
            )}

            {/* Actions */}
            {squad.status !== "Approved" && (
              <div style={{ display:"flex",gap:8,marginTop:16 }}>
                <button onClick={() => handleSquadAction(squad.id,"approve")}
                  style={{ flex:1,padding:"10px",borderRadius:8,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                  ✓ Approve Squad
                </button>
                <button onClick={() => handleSquadAction(squad.id,"flag")}
                  style={{ flex:"0 0 100px",padding:"10px",borderRadius:8,border:`1px solid ${C.amber}`,background:C.amberLight,color:C.amber,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                  🚩 Flag
                </button>
                <button onClick={() => handleSquadAction(squad.id,"reject")}
                  style={{ flex:"0 0 90px",padding:"10px",borderRadius:8,border:`1px solid ${C.red}`,background:C.redLight,color:C.red,fontFamily:"'DM Sans'",fontWeight:700,cursor:"pointer",fontSize:13 }}>
                  ✕ Reject
                </button>
              </div>
            )}
            {squad.status === "Approved" && (
              <div style={{ marginTop:16,padding:"10px 14px",background:C.greenLight,borderRadius:8,border:`1px solid ${C.green}28`,fontSize:12,color:C.green }}>
                ✅ Squad approved. Team is cleared for the tournament.
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // ── CREATE TOURNAMENT FORM ───────────────────────────────────────────────────

  // ── TOURNAMENTS LIST ─────────────────────────────────────────────────────────
  const TournamentsPage = () => (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>My Tournaments</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{tournaments.length} tournaments created</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowCreateForm(true); setTError(""); setTForm(emptyTourn); }} style={{ fontSize:13 }}>+ New Tournament</button>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {tournaments.map((t,i) => (
          <div key={t.id} className="card" style={{ padding:"18px 22px",borderLeft:`3px solid ${t.status==="Open"?C.green:t.status==="Draft"?C.amber:C.borderDark}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:17,color:C.text,marginBottom:3 }}>{t.name}</div>
                <div style={{ fontSize:12,color:C.textSoft }}>{t.venue} · {t.format}</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:t.status==="Open"?C.greenLight:t.status==="Draft"?C.amberLight:C.surfaceAlt,color:t.status==="Open"?C.green:t.status==="Draft"?C.amber:C.textSoft }}>{t.status}</span>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:14 }}>
              {[
                { label:"Teams",     value:`${t.teams_registered}/${t.max_teams}`, color:C.blue   },
                { label:"Max Squad", value:t.max_squad,                             color:C.green  },
                { label:"Starts",    value:t.start,                                color:C.text   },
                { label:"Ends",      value:t.end,                                  color:C.text   },
                { label:"Deadline",  value:t.deadline,                             color:t.status==="Open"?C.amber:C.textSoft },
              ].map((s,j) => (
                <div key={j} style={{ background:C.surfaceAlt,borderRadius:7,padding:"8px 10px" }}>
                  <div style={{ fontSize:10,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={() => { setSelectedTourn(t); setPage("squads"); }}
                style={{ padding:"6px 14px",borderRadius:6,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'" }}>
                View squads →
              </button>
              {t.status==="Open" && (
                <button style={{ padding:"6px 14px",borderRadius:6,border:`1px solid ${C.borderDark}`,background:"transparent",color:C.textMid,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans'" }}>
                  Close registration
                </button>
              )}
              {t.status==="Draft" && (
                <button style={{ padding:"6px 14px",borderRadius:6,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans'" }}>
                  Publish →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SQUAD VERIFICATION PAGE ──────────────────────────────────────────────────
  const SquadVerificationPage = () => {
    const tournamentSquads = squads.filter(s => !selectedTourn || s.tournament_id === selectedTourn?.id);
    const pending  = tournamentSquads.filter(s=>s.status==="Pending").length;
    const approved = tournamentSquads.filter(s=>s.status==="Approved").length;
    const flagged  = tournamentSquads.filter(s=>s.status==="Flagged").length;

    return (
      <div className="fade-up">
        {selectedSquad && <SquadPanel squad={selectedSquad} onClose={() => setSelectedSquad(null)}/>}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Squad Verification</h1>
            <p style={{ fontSize:13,color:C.textSoft }}>{selectedTourn?.name || "All tournaments"} · {tournamentSquads.length} teams</p>
          </div>
          {selectedTourn && (
            <button className="btn-ghost" onClick={() => setSelectedTourn(null)} style={{ fontSize:12,padding:"6px 14px" }}>← All tournaments</button>
          )}
        </div>

        {/* Tournament selector */}
        {!selectedTourn && (
          <div style={{ marginBottom:16 }}>
            <label className="label">Filter by tournament</label>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {tournaments.map(t => (
                <button key={t.id} onClick={() => setSelectedTourn(t)}
                  style={{ padding:"6px 14px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:C.textMid,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans'",transition:"all 0.15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenLight;e.currentTarget.style.color=C.green;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMid;}}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
          <StatCard icon="📋" label="Total teams"   value={tournamentSquads.length}                                          color={C.blue}/>
          <StatCard icon="⏳" label="Pending"       value={pending}  color={C.amber} sub="Awaiting review"/>
          <StatCard icon="✅" label="Approved"      value={approved} color={C.green} sub="Cleared to play"/>
          <StatCard icon="🚩" label="Flagged"       value={flagged}  color={C.red}   sub="Issues found"/>
        </div>

        {pending > 0 && (
          <div style={{ padding:"10px 14px",background:C.amberLight,border:`1px solid ${C.amber}28`,borderRadius:8,fontSize:12,color:C.amber,marginBottom:14 }}>
            ⏳ {pending} squad{pending>1?"s are":" is"} waiting for your review.
          </div>
        )}

        {/* Squads table */}
        <div className="card" style={{ overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 70px 90px 110px 160px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`,borderRadius:"12px 12px 0 0" }}>
            {["Team","Players","Submitted","Status","Actions"].map(h => (
              <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
            ))}
          </div>
          {tournamentSquads.map((s,i) => (
            <div key={s.id} style={{ display:"grid",gridTemplateColumns:"1fr 70px 90px 110px 160px",alignItems:"center",padding:"0 16px",height:58,borderBottom:`1px solid ${C.border}`,background:s.status==="Pending"?"rgba(217,119,6,0.04)":s.status==="Flagged"?"rgba(192,57,43,0.04)":i%2===0?"transparent":C.surfaceAlt,borderLeft:s.status==="Pending"?`3px solid ${C.amber}`:s.status==="Flagged"?`3px solid ${C.red}`:"3px solid transparent" }}>
              <div>
                <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{s.team}</div>
                <div style={{ fontSize:11,color:C.textSoft }}>{s.manager}</div>
              </div>
              <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:18,color:s.players>0?C.green:C.textDim }}>{s.players>0?s.players:"—"}</span>
              <span style={{ fontSize:12,color:C.textSoft }}>{s.submitted}</span>
              <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:statusBg[s.status],color:statusColor[s.status],display:"inline-block" }}>{s.status}</span>
              <div style={{ display:"flex",gap:5 }}>
                {s.status!=="Not submitted" && (
                  <button onClick={() => setSelectedSquad(s)}
                    style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.blue}`,background:"transparent",color:C.blue,fontSize:11,cursor:"pointer",fontWeight:600 }}>
                    Review
                  </button>
                )}
                {(s.status==="Pending"||s.status==="Flagged") && (
                  <button onClick={() => handleSquadAction(s.id,"approve")}
                    style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>
                    ✓
                  </button>
                )}
                {s.status==="Pending" && (
                  <button onClick={() => handleSquadAction(s.id,"flag")}
                    style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.amber}`,background:"transparent",color:C.amber,fontSize:11,cursor:"pointer" }}>
                    🚩
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const links = [
    { id:"overview",      label:"Overview",           icon:"📊" },
    { id:"tournaments",   label:"My Tournaments",     icon:"🏆" },
    { id:"squads",        label:"Squad Verification", icon:"✅", badge: squads.filter(s=>s.status==="Pending").length.toString() },
    { id:"schedule",      label:"Match Schedule",     icon:"📅" },
    { id:"tagging",       label:"Player Tagging",     icon:"🎭" },
    { id:"cards",         label:"Cards & Suspensions",icon:"🟥" },
    { id:"notifications", label:"Notifications",      icon:"🔔", badge:"4" },
  ];

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={(p) => { setPage(p); setShowCreateForm(false); setSelectedSquad(null); }} notifCount={4}>
      {page==="overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:22 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Tournament Overview</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>Welcome, {user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🏆" label="My Tournaments"    value={tournaments.length}                           color={C.blue}/>
            <StatCard icon="👥" label="Teams Registered"  value={tournaments.reduce((s,t)=>s+t.teams_registered,0)} color={C.green}/>
            <StatCard icon="⏳" label="Squads Pending"    value={squads.filter(s=>s.status==="Pending").length}  color={C.amber}/>
            <StatCard icon="🚩" label="Squads Flagged"    value={squads.filter(s=>s.status==="Flagged").length}  color={C.red}/>
          </div>
          {squads.filter(s=>s.status==="Pending").length > 0 && (
            <Alert type="warning">⏳ {squads.filter(s=>s.status==="Pending").length} squad submissions waiting for your review. <button onClick={()=>setPage("squads")} style={{ background:"none",border:"none",color:C.amber,cursor:"pointer",fontWeight:700,fontSize:13 }}>Review now →</button></Alert>
          )}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Active tournaments</div>
                <button className="btn-outline-green" onClick={()=>setPage("tournaments")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
              </div>
              {tournaments.filter(t=>t.status==="Open").map((t,i)=>(
                <div key={i} style={{ padding:"9px 0",borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{t.name}</div>
                    <span style={{ fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:700,color:C.blue }}>{t.teams_registered}/{t.max_teams}</span>
                  </div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{t.venue} · Deadline {t.deadline}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Recent notifications</div>
              {[
                { msg:"Squad submitted — Nairobi Rhinos RFC",       icon:"📋",time:"2h ago"  },
                { msg:"Red card — J. Kamau (Nairobi Rhinos)",       icon:"🟥",time:"3h ago"  },
                { msg:"Injury reported — B. Waweru (Kisumu Tigers)",icon:"🏥",time:"5h ago"  },
                { msg:"Squad submitted — Thika Panthers RFC",        icon:"📋",time:"1d ago"  },
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
      )}
      {page==="tournaments" && (showCreateForm 
        ? <CreateTournamentForm 
            onSuccess={(t) => { setTournaments(prev=>[...prev,{id:`t${prev.length+1}`,...t}]); setShowCreateForm(false); }} 
            onCancel={() => setShowCreateForm(false)}
          /> 
        : <TournamentsPage/>)}
      {page==="squads" && <SquadVerificationPage/>}
      {page==="schedule" && <OrgSchedulePage squads={squads} tournaments={tournaments}/>}
      {page==="tagging"  && <OrgTaggingPage squads={squads}/>}
      {page==="cards"    && <OrgCardsPage/>}
      {page==="notifications" && <OrgNotificationsPage/>}
    </DashboardShell>
  );
};

const TeamManagerDashboard = ({ user, onLogout, notifications: externalNotifs = [] }) => {
  const [page, setPage] = useState("overview");

  // ── SHARED STATE ────────────────────────────────────────────────────────────
  const [players, setPlayers] = useState([
    { id:1,  name:"James Kamau",   dob:"2000-01-15",phone:"+254721000001",jersey:1, position:"Loosehead Prop",kin_name:"Mary Kamau",  kin_phone:"+254721000010",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 10" },
    { id:2,  name:"Peter Omondi",  dob:"1999-03-22",phone:"+254722000002",jersey:10,position:"Fly-half",      kin_name:"Jane Omondi", kin_phone:"+254722000020",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 10" },
    { id:3,  name:"Daniel Njoroge",dob:"2001-07-10",phone:"+254723000003",jersey:13,position:"Centre",        kin_name:"Paul Njoroge",kin_phone:"+254723000030",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 12" },
    { id:4,  name:"Kevin Mutua",   dob:"2002-04-18",phone:"+254724000004",jersey:14,position:"Winger",        kin_name:"Ann Mutua",   kin_phone:"+254724000040",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 13" },
    { id:5,  name:"Ali Hassan",    dob:"1998-11-05",phone:"+254725000005",jersey:2, position:"Hooker",        kin_name:"Fatuma Hassan",kin_phone:"+254725000050",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 13" },
    { id:6,  name:"Brian Waweru",  dob:"1999-08-20",phone:"+254726000006",jersey:4, position:"Lock",          kin_name:"Rose Waweru", kin_phone:"+254726000060",photo:null,id_front:null,id_back:null,status:"Verified",submitted:"Mar 14" },
    { id:7,  name:"Moses Otieno",  dob:"2000-05-12",phone:"+254727000007",jersey:15,position:"Full-back",     kin_name:"Grace Otieno",kin_phone:"+254727000070",photo:null,id_front:null,id_back:null,status:"Pending", submitted:"Mar 17" },
    { id:8,  name:"David Njoroge", dob:"2001-02-28",phone:"+254728000008",jersey:12,position:"Centre",        kin_name:"Ruth Njoroge",kin_phone:"+254728000080",photo:null,id_front:null,id_back:null,status:"Pending", submitted:"Mar 17" },
  ]);

  // Tournaments (open ones only)
  const openTournaments = [
    { id:"t1",name:"KRU Cup 2025",    venue:"RFUEA Ground, Nairobi",start:"2025-06-01",end:"2025-08-30",format:"Group + Knockout",deadline:"2025-05-20",max_teams:12,max_squad:23,teams_registered:8,  registered:true,  squad_submitted:false, squad_status:"Not submitted" },
    { id:"t3",name:"U20 Championship",venue:"Kisumu Stadium",        start:"2025-07-15",end:"2025-09-01",format:"Knockout",        deadline:"2025-07-01",max_teams:8, max_squad:18,teams_registered:3,  registered:false, squad_submitted:false, squad_status:"Not submitted" },
  ];
  const [myTournaments, setMyTournaments] = useState(openTournaments);

  // Squad state per tournament
  const [squads, setSquads] = useState({ "t1": [] });
  const [activeTournamentId, setActiveTournamentId] = useState(null);
  const [squadSubmitted, setSquadSubmitted] = useState({});
  const [squadStatus, setSquadStatus]       = useState({});

  // Player profile form state
  const emptyForm = { name:"",dob:"",phone:"",jersey:"",position:"",kin_name:"",kin_phone:"",photo:null,photoPreview:null,id_front:null,id_frontPreview:null,id_back:null,id_backPreview:null };
  const [showAddForm, setShowAddForm]   = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [formError, setFormError]       = useState("");
  const [formSuccess, setFormSuccess]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const POSITIONS = ["Loosehead Prop","Hooker","Tighthead Prop","Lock","Flanker","Number 8","Scrum-half","Fly-half","Centre","Winger","Full-back"];
  const setF = (k,v) => setForm(f => ({ ...f,[k]:v }));

  const verifiedPlayers = players.filter(p => p.status === "Verified");
  const statusColor = { Verified:C.green, Pending:C.amber, Flagged:C.red };
  const statusBg    = { Verified:C.greenLight, Pending:C.amberLight, Flagged:C.redLight };

  // ── FILE UPLOAD ──────────────────────────────────────────────────────────────
  const handleFileUpload = (key, previewKey, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { setF(key,file); setF(previewKey,e.target.result); };
    reader.readAsDataURL(file);
  };

  // ── ADD PLAYER SUBMIT ────────────────────────────────────────────────────────
  const handleSubmitPlayer = async () => {
    setFormError("");
    if (!form.name)     { setFormError("Player full name is required."); return; }
    if (!form.dob)      { setFormError("Date of birth is required."); return; }
    if (!form.phone)    { setFormError("Phone number is required."); return; }
    if (!form.jersey)   { setFormError("Jersey number is required."); return; }
    if (!form.position) { setFormError("Position is required."); return; }
    if (!form.kin_name) { setFormError("Next of kin name is required."); return; }
    if (!form.kin_phone){ setFormError("Next of kin phone is required."); return; }
    if (!form.photo)    { setFormError("Player photo is required."); return; }
    if (!form.id_front) { setFormError("Kenyan ID front photo is required."); return; }
    if (!form.id_back)  { setFormError("Kenyan ID back photo is required."); return; }
    if (players.some(p => Number(p.jersey) === Number(form.jersey))) {
      setFormError(`Jersey #${form.jersey} is already taken.`); return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r,1200));
    setPlayers(prev => [...prev, { id:prev.length+1, name:form.name, dob:form.dob, phone:form.phone, jersey:Number(form.jersey), position:form.position, kin_name:form.kin_name, kin_phone:form.kin_phone, photo:form.photoPreview, id_front:form.id_frontPreview, id_back:form.id_backPreview, status:"Pending", submitted:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}) }]);
    setForm(emptyForm);
    setSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setShowAddForm(false); }, 2200);
  };

  // ── SQUAD HELPERS ────────────────────────────────────────────────────────────
  const getSquad = (tid) => squads[tid] || [];
  const addToSquad = (tid, player) => {
    const tourn = myTournaments.find(t=>t.id===tid);
    if (!tourn) return;
    const sq = getSquad(tid);
    if (sq.length >= tourn.max_squad) return;
    if (sq.find(p=>p.id===player.id)) return;
    setSquads(prev => ({ ...prev, [tid]: [...(prev[tid]||[]), player] }));
  };
  const removeFromSquad = (tid, playerId) => {
    setSquads(prev => ({ ...prev, [tid]: (prev[tid]||[]).filter(p=>p.id!==playerId) }));
  };
  const submitSquad = async (tid) => {
    const tourn = myTournaments.find(t=>t.id===tid);
    const sq = getSquad(tid);
    if (sq.length < 15) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r,1200));
    setSquadSubmitted(prev => ({ ...prev, [tid]:true }));
    setSquadStatus(prev => ({ ...prev, [tid]:"Pending" }));
    setSubmitting(false);
  };

  const registerTeam = (tid) => {
    setMyTournaments(prev => prev.map(t => t.id===tid ? { ...t, registered:true } : t));
    setSquads(prev => ({ ...prev, [tid]:[] }));
  };

  // ── UPLOAD BOX ──────────────────────────────────────────────────────────────
  const UploadBox = ({ label, preview, onUpload, icon }) => (
    <div>
      <label className="label">{label}</label>
      <label style={{ display:"block",cursor:"pointer" }}>
        <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>onUpload(e.target.files[0])}/>
        <div style={{ border:`2px dashed ${preview?C.green:C.borderDark}`,borderRadius:10,padding:preview?"8px":"18px 12px",textAlign:"center",background:preview?C.greenLight:C.surfaceAlt,transition:"all 0.18s",minHeight:preview?"auto":80,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5 }}>
          {preview ? (
            <div style={{ position:"relative" }}>
              <img src={preview} alt={label} style={{ width:"100%",maxHeight:110,objectFit:"cover",borderRadius:7,display:"block" }}/>
              <div style={{ position:"absolute",top:4,right:4,background:C.green,color:"#fff",borderRadius:4,fontSize:10,fontWeight:700,padding:"2px 6px" }}>✓</div>
            </div>
          ) : (
            <>
              <span style={{ fontSize:24 }}>{icon}</span>
              <div style={{ fontSize:12,fontWeight:600,color:C.textMid }}>Click to upload</div>
              <div style={{ fontSize:11,color:C.textSoft }}>JPG, PNG · Max 5MB</div>
            </>
          )}
        </div>
      </label>
    </div>
  );

  // ── PLAYER DETAIL PANEL ──────────────────────────────────────────────────────
  const PlayerDetailPanel = ({ player, onClose }) => (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200,backdropFilter:"blur(2px)" }}/>
      <div style={{ position:"fixed",top:0,right:0,bottom:0,width:440,background:"#fff",borderLeft:`1px solid ${C.border}`,zIndex:201,display:"flex",flexDirection:"column",animation:"slideInPanel 0.25s ease",overflowY:"auto" }}>
        <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:16,color:C.text }}>{player.name}</div>
            <div style={{ fontSize:12,color:C.textSoft }}>{player.position} · Jersey #{player.jersey}</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:statusBg[player.status],color:statusColor[player.status] }}>{player.status}</span>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.textSoft }}>×</button>
          </div>
        </div>
        <div style={{ padding:"18px 20px" }}>
          <div style={{ display:"flex",gap:12,marginBottom:18 }}>
            <div style={{ width:72,height:72,borderRadius:12,background:C.greenLight,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
              {player.photo ? <img src={player.photo} alt={player.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.green }}>{player.name[0]}</span>}
            </div>
            <div>
              <div style={{ fontFamily:"'Syne'",fontSize:15,fontWeight:800,color:C.text,marginBottom:3 }}>{player.name}</div>
              <div style={{ fontSize:12,color:C.textMid,marginBottom:6 }}>{player.position}</div>
              <span style={{ padding:"2px 8px",borderRadius:5,background:C.greenLight,color:C.green,fontSize:11,fontWeight:700,fontFamily:"'JetBrains Mono'" }}>#{player.jersey}</span>
            </div>
          </div>
          {[{ label:"Date of birth",value:player.dob },{ label:"Phone",value:player.phone },{ label:"Submitted",value:player.submitted }].map((r,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12,color:C.textSoft }}>{r.label}</span>
              <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{r.value}</span>
            </div>
          ))}
          <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",margin:"14px 0 8px" }}>Next of kin</div>
          {[{ label:"Name",value:player.kin_name },{ label:"Phone",value:player.kin_phone }].map((r,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:12,color:C.textSoft }}>{r.label}</span>
              <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{r.value}</span>
            </div>
          ))}
          <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",margin:"14px 0 8px" }}>ID Documents</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[{ label:"ID Front",img:player.id_front },{ label:"ID Back",img:player.id_back }].map((doc,i)=>(
              <div key={i} style={{ borderRadius:8,overflow:"hidden",border:`1px solid ${C.border}` }}>
                {doc.img ? <img src={doc.img} alt={doc.label} style={{ width:"100%",height:80,objectFit:"cover",display:"block" }}/> : <div style={{ height:80,background:C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4 }}><span style={{ fontSize:20 }}>🪪</span><span style={{ fontSize:11,color:C.textSoft }}>{doc.label}</span></div>}
                <div style={{ padding:"4px 8px",fontSize:11,fontWeight:600,color:C.textMid,background:C.surfaceAlt }}>{doc.label}</div>
              </div>
            ))}
          </div>
          {player.status==="Pending" && (
            <div style={{ marginTop:14,padding:"10px 14px",background:C.amberLight,borderRadius:8,border:`1px solid ${C.amber}28`,fontSize:12,color:C.amber }}>
              ⏳ Awaiting review by Tournament Organizer.
            </div>
          )}
          <div style={{ marginTop:10,padding:"10px 14px",background:C.surfaceAlt,borderRadius:8,border:`1px solid ${C.border}`,fontSize:11,color:C.textSoft }}>
            🔒 Profiles cannot be edited after submission.
          </div>
        </div>
      </div>
    </>
  );

  // ── ADD PLAYER FORM ──────────────────────────────────────────────────────────

  // ── PLAYERS PAGE ─────────────────────────────────────────────────────────────
  const PlayersPage = () => (
    <div className="fade-up">
      {selectedPlayer && <PlayerDetailPanel player={selectedPlayer} onClose={()=>setSelectedPlayer(null)}/>}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Player Profiles</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>Nairobi Rhinos RFC · {players.length} players</p>
        </div>
        <button className="btn-primary" onClick={()=>{ setShowAddForm(true); setFormError(""); setForm(emptyForm); }} style={{ fontSize:13 }}>+ Add Player</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
        {[
          { icon:"✅",label:"Verified",value:players.filter(p=>p.status==="Verified").length,color:C.green },
          { icon:"⏳",label:"Pending", value:players.filter(p=>p.status==="Pending").length, color:C.amber },
          { icon:"🚩",label:"Flagged", value:players.filter(p=>p.status==="Flagged").length,  color:C.red   },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:8,background:s.color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em" }}>{s.label}</div>
              <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:20,color:s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
      {players.filter(p=>p.status==="Pending").length>0 && (
        <div style={{ padding:"9px 14px",background:C.amberLight,borderRadius:8,border:`1px solid ${C.amber}28`,fontSize:12,color:C.amber,marginBottom:14 }}>
          ⏳ {players.filter(p=>p.status==="Pending").length} player{players.filter(p=>p.status==="Pending").length>1?"s are":" is"} awaiting verification.
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10 }}>
        {players.map((p,i)=>(
          <div key={p.id} className="card" onClick={()=>setSelectedPlayer(p)}
            style={{ padding:"14px 16px",cursor:"pointer",borderLeft:`3px solid ${statusColor[p.status]}` }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
              <div style={{ width:44,height:44,borderRadius:9,background:p.photo?"transparent":C.greenLight,overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                {p.photo ? <img src={p.photo} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontFamily:"'Syne'",fontSize:18,fontWeight:800,color:C.green }}>{p.name[0]}</span>}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontSize:11,color:C.textSoft }}>{p.position}</div>
              </div>
              <span style={{ padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:statusBg[p.status],color:statusColor[p.status],flexShrink:0 }}>{p.status}</span>
            </div>
            <div style={{ display:"flex",gap:6,alignItems:"center" }}>
              <span style={{ padding:"2px 7px",borderRadius:4,background:C.greenLight,color:C.green,fontSize:10,fontWeight:700,fontFamily:"'JetBrains Mono'" }}>#{p.jersey}</span>
              <span style={{ fontSize:11,color:C.textSoft }}>Submitted {p.submitted}</span>
              <span style={{ marginLeft:"auto",fontSize:11,color:C.green,fontWeight:600 }}>View →</span>
            </div>
            <div style={{ display:"flex",gap:5,marginTop:8 }}>
              {[{ label:"Photo",ok:!!p.photo },{ label:"ID Front",ok:!!p.id_front },{ label:"ID Back",ok:!!p.id_back }].map((d,j)=>(
                <div key={j} style={{ padding:"2px 6px",borderRadius:4,background:d.ok?C.greenLight:C.redLight,fontSize:10,fontWeight:600,color:d.ok?C.green:C.red }}>{d.ok?"✓":"✗"} {d.label}</div>
              ))}
            </div>
          </div>
        ))}
        <div className="card" onClick={()=>{ setShowAddForm(true); setFormError(""); setForm(emptyForm); }}
          style={{ padding:"14px 16px",cursor:"pointer",border:`1.5px dashed ${C.borderDark}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,minHeight:120,background:"transparent" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.background=C.greenLight;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.borderDark;e.currentTarget.style.background="transparent";}}>
          <div style={{ width:38,height:38,borderRadius:9,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>+</div>
          <div style={{ fontSize:12,fontWeight:600,color:C.textSoft }}>Add new player</div>
        </div>
      </div>
    </div>
  );

  // ── TOURNAMENTS PAGE ─────────────────────────────────────────────────────────
  const TournamentsPage = () => (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Tournaments</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Open tournaments available for registration</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {myTournaments.map((t,i)=>(
          <div key={t.id} className="card" style={{ padding:"18px 22px",borderLeft:`3px solid ${t.registered?C.green:C.borderDark}`,opacity:t.status==="Closed"?0.6:1 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:16,color:C.text,marginBottom:3 }}>{t.name}</div>
                <div style={{ fontSize:12,color:C.textSoft }}>{t.venue} · {t.format}</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                {t.registered && <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:C.greenLight,color:C.green }}>✓ Registered</span>}
                {squadSubmitted[t.id] && <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:C.amberLight,color:C.amber }}>{squadStatus[t.id]||"Pending"}</span>}
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14 }}>
              {[
                { label:"Teams",     value:`${t.teams_registered}/${t.max_teams}`, color:C.blue   },
                { label:"Max squad", value:t.max_squad,                             color:C.green  },
                { label:"Starts",    value:t.start,                                color:C.text   },
                { label:"Deadline",  value:t.deadline,                             color:C.amber  },
              ].map((s,j)=>(
                <div key={j} style={{ background:C.surfaceAlt,borderRadius:7,padding:"8px 10px" }}>
                  <div style={{ fontSize:10,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              {!t.registered ? (
                <button onClick={()=>registerTeam(t.id)} className="btn-primary" style={{ fontSize:13 }}>
                  Register Nairobi Rhinos RFC →
                </button>
              ) : !squadSubmitted[t.id] ? (
                <button onClick={()=>{ setActiveTournamentId(t.id); setPage("squad"); }} className="btn-primary" style={{ fontSize:13 }}>
                  Build & submit squad →
                </button>
              ) : (
                <button className="btn-ghost" style={{ fontSize:13,cursor:"default" }}>
                  Squad submitted — awaiting approval ⏳
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SQUAD BUILDER PAGE ───────────────────────────────────────────────────────
  const SquadBuilderPage = () => {
    const tid = activeTournamentId || myTournaments.find(t=>t.registered)?.id;
    if (!tid) return <div style={{ textAlign:"center",padding:40,color:C.textSoft }}>Register in a tournament first.</div>;
    const tourn  = myTournaments.find(t=>t.id===tid);
    const squad  = getSquad(tid);
    const inSquad = (id) => squad.some(p=>p.id===id);
    const canAdd  = squad.length < (tourn?.max_squad||23);
    const canSubmit = squad.length >= 15 && !squadSubmitted[tid];

    return (
      <div className="fade-up">
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
          <div>
            <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Build Squad</h1>
            <p style={{ fontSize:13,color:C.textSoft }}>{tourn?.name} · Min 15 · Max {tourn?.max_squad}</p>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ padding:"6px 14px",background:C.surfaceAlt,borderRadius:8,fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:700,color:squad.length>=15?C.green:C.amber }}>
              {squad.length} / {tourn?.max_squad} selected
            </div>
            {canSubmit && (
              <button className="btn-primary" onClick={()=>submitSquad(tid)} disabled={submitting} style={{ fontSize:13 }}>
                {submitting?"Submitting...":"Submit Squad →"}
              </button>
            )}
            {squadSubmitted[tid] && (
              <div style={{ padding:"6px 14px",background:C.amberLight,borderRadius:8,fontSize:12,fontWeight:600,color:C.amber }}>⏳ Awaiting approval</div>
            )}
          </div>
        </div>

        {squad.length < 15 && (
          <div style={{ padding:"9px 14px",background:C.amberLight,border:`1px solid ${C.amber}28`,borderRadius:8,fontSize:12,color:C.amber,marginBottom:14 }}>
            ⚠️ You need at least 15 players to submit. Add {15-squad.length} more.
          </div>
        )}

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {/* Available players */}
          <div>
            <div style={{ fontSize:11,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>
              Verified players ({verifiedPlayers.length})
            </div>
            <div className="card" style={{ overflow:"hidden" }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 80px 60px 60px",padding:"7px 14px",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}`,fontSize:10,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.06em" }}>
                {["Player","Position","Jersey",""].map(h=><span key={h}>{h}</span>)}
              </div>
              {verifiedPlayers.map((p,i)=>(
                <div key={p.id} style={{ display:"grid",gridTemplateColumns:"1fr 80px 60px 60px",alignItems:"center",padding:"9px 14px",borderBottom:`1px solid ${C.border}`,background:inSquad(p.id)?C.greenLight:i%2===0?"transparent":C.surfaceAlt }}>
                  <div style={{ fontSize:13,fontWeight:600,color:inSquad(p.id)?C.green:C.text }}>{p.name}{inSquad(p.id)?" ✓":""}</div>
                  <span style={{ fontSize:11,color:C.textSoft }}>{p.position.split(" ").slice(-1)[0]}</span>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:700,color:C.green }}>#{p.jersey}</span>
                  <button onClick={()=>inSquad(p.id)?removeFromSquad(tid,p.id):addToSquad(tid,p)}
                    disabled={!inSquad(p.id)&&!canAdd}
                    style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${inSquad(p.id)?C.red:C.green}`,background:"transparent",color:inSquad(p.id)?C.red:C.green,fontSize:10,cursor:"pointer",fontWeight:600,opacity:!inSquad(p.id)&&!canAdd?0.4:1 }}>
                    {inSquad(p.id)?"✕ Remove":"+ Add"}
                  </button>
                </div>
              ))}
              {verifiedPlayers.length === 0 && (
                <div style={{ textAlign:"center",padding:"30px",fontSize:13,color:C.textSoft }}>No verified players yet. Add players and wait for organizer verification.</div>
              )}
            </div>
          </div>

          {/* Selected squad */}
          <div>
            <div style={{ fontSize:11,fontWeight:700,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10 }}>
              Selected squad ({squad.length}/{tourn?.max_squad})
            </div>
            <div className="card" style={{ padding:14,minHeight:200 }}>
              {squad.length === 0 ? (
                <div style={{ textAlign:"center",padding:"40px 20px",color:C.textSoft,fontSize:13 }}>No players selected yet.<br/>Add players from the list on the left.</div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                  {squad.map((p,i)=>(
                    <div key={p.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 10px",border:`1px solid ${C.border}`,borderRadius:7,background:C.surface }}>
                      <div style={{ width:26,height:26,borderRadius:5,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:10,fontWeight:700,color:C.green,flexShrink:0 }}>#{p.jersey}</div>
                      <span style={{ flex:1,fontSize:13,fontWeight:600,color:C.text }}>{p.name}</span>
                      <span style={{ fontSize:11,color:C.textSoft }}>{p.position.split(" ").slice(-1)[0]}</span>
                      {!squadSubmitted[tid] && (
                        <button onClick={()=>removeFromSquad(tid,p.id)} style={{ background:"none",border:"none",cursor:"pointer",color:C.red,fontSize:16,lineHeight:1,padding:"0 2px" }}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {squad.length > 0 && squad.length < 15 && (
                <div style={{ marginTop:10,padding:"8px 12px",background:C.amberLight,borderRadius:7,fontSize:11,color:C.amber,textAlign:"center" }}>
                  Need {15-squad.length} more player{15-squad.length>1?"s":""} to submit
                </div>
              )}
              {squad.length >= 15 && !squadSubmitted[tid] && (
                <div style={{ marginTop:10,padding:"8px 12px",background:C.greenLight,borderRadius:7,fontSize:11,color:C.green,textAlign:"center",fontWeight:600 }}>
                  ✓ Squad ready to submit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const links = [
    { id:"overview",      label:"Overview",        icon:"📊" },
    { id:"players",       label:"Player Profiles", icon:"🏉" },
    { id:"squad",         label:"Build Squad",     icon:"📋" },
    { id:"tournaments",   label:"Tournaments",     icon:"🏆" },
    { id:"injuries",      label:"Injuries",        icon:"🏥", badge:"1" },
    { id:"cards",         label:"Cards & Flags",   icon:"🟥" },
    { id:"notifications", label:"Notifications",   icon:"🔔", badge:externalNotifs.length > 0 ? String(externalNotifs.filter(n=>!n.read).length) : "3" },
  ];

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={(p)=>{ setPage(p); setShowAddForm(false); setSelectedPlayer(null); }} notifCount={3}>
      {page==="overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Team Dashboard</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>Nairobi Rhinos RFC · {user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🏉" label="Total Players"    value={players.length}                                    color={C.green}/>
            <StatCard icon="✅" label="Verified"         value={players.filter(p=>p.status==="Verified").length}   color={C.blue}/>
            <StatCard icon="⏳" label="Pending Review"   value={players.filter(p=>p.status==="Pending").length}    color={C.amber}/>
            <StatCard icon="🏆" label="Tournaments"      value={myTournaments.filter(t=>t.registered).length}      color={C.purple}/>
          </div>
          {players.filter(p=>p.status==="Pending").length>0 && (
            <Alert type="warning">⏳ {players.filter(p=>p.status==="Pending").length} player profile{players.filter(p=>p.status==="Pending").length>1?"s are":" is"} pending organizer verification.</Alert>
          )}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Recent players</div>
                <button className="btn-outline-green" onClick={()=>setPage("players")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
              </div>
              {players.slice(-4).reverse().map((p,i)=>(
                <div key={p.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:28,height:28,borderRadius:6,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:C.green,flexShrink:0 }}>{p.jersey}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{p.name}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{p.position}</div>
                  </div>
                  <span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:statusBg[p.status],color:statusColor[p.status] }}>{p.status}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Notifications</div>
              {(externalNotifs.length > 0 ? externalNotifs.slice(0,4) : [
                { msg:"Red card — J. Kamau suspended 1 match",type:"red_card",  time:"2h ago" },
                { msg:"Daniel Njoroge marked injured by medic",type:"injury",    time:"4h ago" },
                { msg:"Squad verified for Saturday",           type:"squad",     time:"1d ago" },
              ]).map((n,i,arr)=>(
                <div key={n.id||i} style={{ display:"flex",gap:10,padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                  <span style={{ fontSize:17,flexShrink:0 }}>
                    {n.type==="red_card"?"🟥":n.type==="yellow_card"?"🟨":n.type==="injury"?"🏥":"✅"}
                  </span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12,color:C.text }}>
                      {n.msg || (n.type==="red_card"?`Red card — ${n.player} · ${n.ban>0?`${n.ban}-match ban`:""}`
                               :n.type==="yellow_card"?`Yellow card — ${n.player}`
                               :n.type==="injury"?`${n.severity||""} injury — ${n.player} (${n.injury||""})`
                               :n.msg)}
                    </div>
                    <div style={{ fontSize:11,color:C.textDim }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {page==="players" && (showAddForm 
        ? <AddPlayerForm
            existingJerseys={players.map(p=>p.jersey)}
            onSuccess={(p) => { setPlayers(prev=>[...prev,{ id:prev.length+1,...p,status:"Pending",submitted:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}) }]); setShowAddForm(false); }}
            onCancel={() => setShowAddForm(false)}
          />
        : <PlayersPage/>)}
      {page==="squad"       && <SquadBuilderPage/>}
      {page==="tournaments" && <TournamentsPage/>}
      {page==="injuries"     && <TMInjuriesPage externalNotifs={externalNotifs}/>}
      {page==="cards"         && <TMCardsPage externalNotifs={externalNotifs}/>}
      {page==="notifications" && <TMNotificationsPage externalNotifs={externalNotifs}/>}
    </DashboardShell>
  );
};


const DataEntryDashboard = ({ user, onLogout, liveMatches, setLiveMatches }) => {
  const [page, setPage]               = useState("overview");
  const [activeMatchId, setActiveMatchId] = useState(null);

  // ── MOCK SCHEDULED MATCHES ─────────────────────────────────────────────────
  const [matches, setMatches] = useState([
    { id:"m1", home:"Nairobi Rhinos RFC",  away:"Kisumu Tigers RFC",   venue:"RFUEA Ground",   date:"Sat 14:00", tournament:"KRU Cup 2025", half_duration:40, status:"Live",      home_score:21, away_score:14, clock:58, phase:"2nd Half",
      home_squad:[
        { jersey:1,  name:"James Kamau"   }, { jersey:2,  name:"Ali Hassan"     }, { jersey:3,  name:"Brian Waweru"  },
        { jersey:4,  name:"Moses Otieno"  }, { jersey:5,  name:"Peter Omondi"   }, { jersey:8,  name:"Daniel Njoroge"},
        { jersey:9,  name:"Kevin Mutua"   }, { jersey:10, name:"Grace Wanjiku"  }, { jersey:12, name:"David Njoroge" },
        { jersey:13, name:"Eric Ochieng"  }, { jersey:11, name:"Samuel Mutua"   }, { jersey:15, name:"Tom Baraka"    },
      ],
      away_squad:[
        { jersey:1,  name:"Wycliffe Oduya"}, { jersey:2,  name:"Hassan Abdi"    }, { jersey:3,  name:"John Mwenda"   },
        { jersey:4,  name:"Paul Kamau"    }, { jersey:5,  name:"Felix Omondi"   }, { jersey:8,  name:"Mark Waweru"   },
        { jersey:9,  name:"Steven Njeru"  }, { jersey:10, name:"Collins Otieno" }, { jersey:12, name:"Dennis Mutua"  },
        { jersey:13, name:"Victor Oduya"  }, { jersey:11, name:"George Kamau"   }, { jersey:15, name:"Richard Mwangi"},
      ],
      events:[
        { id:"e1", min:3,  type:"Try",        team:"home", player:"James Kamau",    jersey:1,  points:5, score:"5–0"  },
        { id:"e2", min:5,  type:"Conversion", team:"home", player:"Peter Omondi",   jersey:5,  points:2, score:"7–0"  },
        { id:"e3", min:18, type:"Penalty",    team:"away", player:"Collins Otieno", jersey:10, points:3, score:"7–3"  },
        { id:"e4", min:31, type:"Try",        team:"away", player:"Wycliffe Oduya", jersey:1,  points:5, score:"7–8"  },
        { id:"e5", min:33, type:"Conversion", team:"away", player:"Collins Otieno", jersey:10, points:2, score:"7–10" },
        { id:"e6", min:40, type:"Half Time",  team:"",     player:"",               jersey:"", points:0, score:"7–10" },
        { id:"e7", min:44, type:"Try",        team:"home", player:"Daniel Njoroge", jersey:8,  points:5, score:"12–10"},
        { id:"e8", min:46, type:"Conversion", team:"home", player:"Peter Omondi",   jersey:5,  points:2, score:"14–10"},
        { id:"e9", min:52, type:"Try",        team:"home", player:"James Kamau",    jersey:1,  points:5, score:"19–10"},
        { id:"e10",min:54, type:"Conversion", team:"home", player:"Peter Omondi",   jersey:5,  points:2, score:"21–10"},
        { id:"e11",min:57, type:"Penalty",    team:"away", player:"Collins Otieno", jersey:10, points:3, score:"21–13"},
        { id:"e12",min:58, type:"Penalty",    team:"away", player:"Collins Otieno", jersey:10, points:3, score:"21–14"},
      ],
    },
    { id:"m2", home:"Mombasa Lions RFC",  away:"Thika Panthers RFC", venue:"Mombasa Arena",  date:"Sat 16:30", tournament:"KRU Cup 2025", half_duration:40, status:"Scheduled",  home_score:0,  away_score:0,  clock:0,  phase:"Not started", home_squad:[], away_squad:[], events:[] },
    { id:"m3", home:"Nakuru Eagles RFC",  away:"Eldoret Bulls RFC",  venue:"Nakuru Stadium", date:"Sun 15:00", tournament:"KRU Cup 2025", half_duration:40, status:"Scheduled",  home_score:0,  away_score:0,  clock:0,  phase:"Not started", home_squad:[], away_squad:[], events:[] },
  ]);

  // ── CLOCK STATE ────────────────────────────────────────────────────────────
  const [running, setRunning]   = useState(false);
  const clockRef                = useRef(null);

  // ── SCORING MODAL STATE ────────────────────────────────────────────────────
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreForm, setScoreForm] = useState({ type:"Try", team:"home", search:"", selectedPlayer:null });
  const [editingEvent, setEditingEvent]     = useState(null);
  const [showEditModal, setShowEditModal]   = useState(false);

  const SCORE_TYPES = [
    { label:"Try",         points:5,  icon:"🏉" },
    { label:"Conversion",  points:2,  icon:"🎯" },
    { label:"Penalty",     points:3,  icon:"⚽" },
    { label:"Drop goal",   points:3,  icon:"🦵" },
    { label:"Penalty try", points:7,  icon:"⭐" },
  ];

  const PHASE_SEQUENCE = ["Not started","1st Half","Half Time","2nd Half","Full Time","Extra Time"];

  const getMatch = (id) => matches.find(m => m.id === id);
  const activeMatch = activeMatchId ? getMatch(activeMatchId) : matches.find(m => m.status === "Live");

  // ── CLOCK TICK ─────────────────────────────────────────────────────────────
  const scrollRef = useRef(null);
  useEffect(() => {
    if (running && activeMatch) {
      clockRef.current = setInterval(() => {
        // Save scroll position before state update
        const mainEl = document.getElementById('main-content');
        const scrollTop = mainEl ? mainEl.scrollTop : 0;
        setMatches(prev => prev.map(m =>
          m.id === activeMatch.id ? { ...m, clock: m.clock + 1 } : m
        ));
        // Restore scroll position after re-render
        requestAnimationFrame(() => {
          const el = document.getElementById('main-content');
          if (el) el.scrollTop = scrollTop;
        });
      }, 1000);
    } else {
      clearInterval(clockRef.current);
    }
    return () => clearInterval(clockRef.current);
  }, [running, activeMatch?.id]);

  // ── SYNC TO LIVE STATE (shared with public page) ───────────────────────────
  useEffect(() => {
    if (setLiveMatches) {
      setLiveMatches(matches.filter(m => m.status === "Live" || m.status === "Half Time"));
    }
  }, [matches]);

  // ── CLOCK CONTROL ─────────────────────────────────────────────────────────
  const handlePhaseChange = (matchId, newPhase) => {
    setRunning(false);
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const updates = { phase: newPhase };
      if (newPhase === "1st Half") {
        updates.status = "Live"; updates.clock = 0; setRunning(true);
      } else if (newPhase === "Half Time") {
        updates.status = "Half Time"; setRunning(false);
        const hs = m.home_score; const as = m.away_score;
        updates.events = [...m.events, { id:`e${Date.now()}`, min:m.clock, type:"Half Time", team:"", player:"", jersey:"", points:0, score:`${hs}–${as}` }];
      } else if (newPhase === "2nd Half") {
        updates.status = "Live"; setRunning(true);
      } else if (newPhase === "Full Time") {
        updates.status = "Completed"; setRunning(false);
        const hs = m.home_score; const as = m.away_score;
        updates.events = [...m.events, { id:`e${Date.now()}`, min:m.clock, type:"Full Time", team:"", player:"", jersey:"", points:0, score:`${hs}–${as}` }];
      } else if (newPhase === "Extra Time") {
        updates.status = "Live"; setRunning(true);
      }
      return { ...m, ...updates };
    }));
  };

  // ── RECORD EVENT ──────────────────────────────────────────────────────────
  const handleRecordEvent = (matchId) => {
    if (!scoreForm.selectedPlayer && scoreForm.type !== "Penalty try") {
      if (!scoreForm.search) return;
    }
    const match = getMatch(matchId);
    if (!match) return;

    const stInfo = SCORE_TYPES.find(s => s.label === scoreForm.type);
    const pts = stInfo?.points || 0;

    let hs = match.home_score;
    let as = match.away_score;
    if (scoreForm.team === "home") hs += pts;
    else as += pts;

    const newEvent = {
      id:       `e${Date.now()}`,
      min:      match.clock,
      type:     scoreForm.type,
      team:     scoreForm.team,
      player:   scoreForm.selectedPlayer?.name || scoreForm.search,
      jersey:   scoreForm.selectedPlayer?.jersey || "",
      points:   pts,
      score:    `${hs}–${as}`,
    };

    setMatches(prev => prev.map(m =>
      m.id === matchId ? { ...m, home_score: hs, away_score: as, events: [...m.events, newEvent] } : m
    ));
    setShowScoreModal(false);
    setScoreForm({ type:"Try", team:"home", search:"", selectedPlayer:null });
  };

  // ── DELETE EVENT ──────────────────────────────────────────────────────────
  const handleDeleteEvent = (matchId, eventId) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const evt = m.events.find(e => e.id === eventId);
      if (!evt || evt.points === 0) return { ...m, events: m.events.filter(e => e.id !== eventId) };
      const hs = m.home_score - (evt.team === "home" ? evt.points : 0);
      const as = m.away_score - (evt.team === "away" ? evt.points : 0);
      return { ...m, home_score: Math.max(0,hs), away_score: Math.max(0,as), events: m.events.filter(e => e.id !== eventId) };
    }));
  };

  // ── PLAYER SEARCH ─────────────────────────────────────────────────────────
  const getFilteredPlayers = (match, team, search) => {
    const squad = team === "home" ? match.home_squad : match.away_squad;
    if (!search) return squad;
    const q = search.toLowerCase();
    return squad.filter(p =>
      p.name.toLowerCase().includes(q) ||
      String(p.jersey).includes(q)
    );
  };

  const typeColor = { Try:C.green, Conversion:C.blue, Penalty:C.gold, "Drop goal":C.teal, "Penalty try":C.purple, "Half Time":C.textSoft, "Full Time":C.textSoft };
  const typeBg    = { Try:C.greenLight, Conversion:C.blueLight, Penalty:C.goldLight, "Drop goal":C.tealLight, "Penalty try":C.purpleLight, "Half Time":C.surfaceAlt, "Full Time":C.surfaceAlt };

  // ── SCORE MODAL ────────────────────────────────────────────────────────────
  const ScoreModal = ({ match, onClose }) => {
    const [localForm, setLocalForm] = useState({ type:"Try", team:"home", search:"", selectedPlayer:null });
    const filtered = getFilteredPlayers(match, localForm.team, localForm.search);
    const stInfo   = SCORE_TYPES.find(s => s.label === localForm.type);

    return (
      <>
        <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,backdropFilter:"blur(2px)" }}/>
        <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:520,background:"#fff",borderRadius:16,border:`1px solid ${C.border}`,zIndex:201,boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden" }}>
          {/* Header */}
          <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surfaceAlt }}>
            <div>
              <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:16,color:C.text }}>Record scoring event</div>
              <div style={{ fontSize:12,color:C.textSoft }}>{match.home} vs {match.away} · {match.clock}'</div>
            </div>
            <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.textSoft }}>×</button>
          </div>
          <div style={{ padding:"18px 20px" }}>
            {/* Event type */}
            <div style={{ marginBottom:16 }}>
              <label className="label">Event type</label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8 }}>
                {SCORE_TYPES.map(s => (
                  <button key={s.label} onClick={() => setLocalForm(f=>({...f,type:s.label}))}
                    style={{ padding:"10px 6px",borderRadius:8,border:`1.5px solid ${localForm.type===s.label?typeColor[s.label]:C.border}`,background:localForm.type===s.label?typeBg[s.label]:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s" }}>
                    <div style={{ fontSize:18,marginBottom:3 }}>{s.icon}</div>
                    <div style={{ fontSize:11,fontWeight:600,color:localForm.type===s.label?typeColor[s.label]:C.textMid }}>{s.label}</div>
                    <div style={{ fontSize:10,color:C.textSoft }}>+{s.points} pts</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Team */}
            <div style={{ marginBottom:16 }}>
              <label className="label">Team scoring</label>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {["home","away"].map(t => (
                  <button key={t} onClick={() => setLocalForm(f=>({...f,team:t,search:"",selectedPlayer:null}))}
                    style={{ padding:"10px",borderRadius:8,border:`1.5px solid ${localForm.team===t?C.green:C.border}`,background:localForm.team===t?C.greenLight:"transparent",cursor:"pointer",fontWeight:600,fontSize:13,color:localForm.team===t?C.green:C.textMid,transition:"all 0.15s" }}>
                    {t==="home"?match.home:match.away}
                  </button>
                ))}
              </div>
            </div>

            {/* Player search */}
            <div style={{ marginBottom:18 }}>
              <label className="label">Player (jersey # or name)</label>
              <input className="input-field" placeholder="e.g. 10 or James Kamau"
                value={localForm.search}
                onChange={e => setLocalForm(f=>({...f,search:e.target.value,selectedPlayer:null}))}
                autoFocus
              />
              {localForm.search && (
                <div style={{ marginTop:6,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",maxHeight:160,overflowY:"auto" }}>
                  {filtered.length === 0 ? (
                    <div style={{ padding:"10px 14px",fontSize:12,color:C.textSoft }}>No players found. Will record as typed.</div>
                  ) : filtered.map((p,i) => (
                    <div key={i} onClick={() => setLocalForm(f=>({...f,selectedPlayer:p,search:`#${p.jersey} ${p.name}`}))}
                      style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 14px",cursor:"pointer",background:localForm.selectedPlayer?.jersey===p.jersey?C.greenLight:"transparent",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.greenLight}
                      onMouseLeave={e=>e.currentTarget.style.background=localForm.selectedPlayer?.jersey===p.jersey?C.greenLight:"transparent"}>
                      <div style={{ width:28,height:28,borderRadius:6,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:C.green }}>{p.jersey}</div>
                      <span style={{ fontSize:13,fontWeight:600,color:C.text }}>{p.name}</span>
                      {localForm.selectedPlayer?.jersey===p.jersey && <span style={{ marginLeft:"auto",fontSize:12,color:C.green }}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            {(localForm.selectedPlayer || localForm.search) && (
              <div style={{ padding:"10px 14px",background:typeBg[localForm.type]||C.greenLight,borderRadius:8,border:`1px solid ${typeColor[localForm.type]}28`,marginBottom:16,fontSize:13 }}>
                <span style={{ fontSize:16,marginRight:8 }}>{SCORE_TYPES.find(s=>s.label===localForm.type)?.icon}</span>
                <strong style={{ color:typeColor[localForm.type] }}>{localForm.type}</strong>
                {" · "}
                {localForm.selectedPlayer ? `#${localForm.selectedPlayer.jersey} ${localForm.selectedPlayer.name}` : localForm.search}
                {" · "}
                {localForm.team==="home"?match.home:match.away}
                {" · "}
                <strong>+{SCORE_TYPES.find(s=>s.label===localForm.type)?.points} pts</strong>
              </div>
            )}

            <div style={{ display:"flex",gap:10 }}>
              <button className="btn-ghost" onClick={onClose} style={{ flex:"0 0 100px" }}>Cancel</button>
              <button className="btn-primary" onClick={() => { setScoreForm(localForm); handleRecordEvent(match.id); onClose(); }}
                disabled={!localForm.search && !localForm.selectedPlayer}
                style={{ flex:1,opacity:(!localForm.search&&!localForm.selectedPlayer)?0.5:1 }}>
                Record event →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ── MATCH CLOCK PAGE ──────────────────────────────────────────────────────
  const MatchClockPage = ({ match }) => {
    if (!match) return (
      <div style={{ textAlign:"center",padding:"60px 20px" }}>
        <div style={{ fontSize:48,marginBottom:16 }}>⏱️</div>
        <div style={{ fontFamily:"'Syne'",fontSize:20,fontWeight:700,color:C.text,marginBottom:8 }}>No active match</div>
        <div style={{ fontSize:14,color:C.textSoft }}>Select a match from the schedule to manage it.</div>
      </div>
    );

    const phaseIdx     = PHASE_SEQUENCE.indexOf(match.phase);
    const nextPhase    = PHASE_SEQUENCE[phaseIdx + 1];
    const isLive       = match.status === "Live";
    const isHalfTime   = match.phase === "Half Time";
    const isCompleted  = match.status === "Completed";
    const formatClock  = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
    const mins         = Math.floor(match.clock / 60);

    const phaseLabel = {
      "Not started":"Match not started",
      "1st Half":   "1st Half",
      "Half Time":  "Half Time",
      "2nd Half":   "2nd Half",
      "Full Time":  "Full Time",
      "Extra Time": "Extra Time",
    };

    return (
      <div className="fade-up">
        {showScoreModal && <ScoreModal match={match} onClose={()=>setShowScoreModal(false)}/>}

        {/* Match header */}
        <div className="card" style={{ padding:"24px 28px",marginBottom:16,borderLeft:`4px solid ${isLive?C.red:isCompleted?C.green:C.borderDark}` }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
            <div>
              <div style={{ fontSize:12,color:C.textSoft,fontFamily:"'JetBrains Mono'",marginBottom:4 }}>{match.tournament} · {match.venue}</div>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                {isLive && (
                  <div style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.redLight,borderRadius:5 }}>
                    <span style={{ width:7,height:7,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
                    <span style={{ fontSize:11,fontWeight:700,color:C.red,fontFamily:"'JetBrains Mono'" }}>LIVE</span>
                  </div>
                )}
                <span style={{ fontSize:13,fontWeight:600,color:isLive?C.red:C.textSoft }}>{phaseLabel[match.phase]}</span>
              </div>
            </div>
            {!isCompleted && (
              <button className="btn-primary" onClick={() => setShowScoreModal(true)}
                style={{ background:C.green,fontSize:13,display:"flex",alignItems:"center",gap:8 }}>
                🏉 Record event
              </button>
            )}
          </div>

          {/* Score display */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:20,alignItems:"center",marginBottom:20 }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne'",fontSize:18,fontWeight:800,color:C.text,marginBottom:4 }}>{match.home}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>Home</div>
            </div>
            <div style={{ textAlign:"center",padding:"16px 28px",background:C.bg,borderRadius:14 }}>
              <div style={{ fontFamily:"'Syne'",fontSize:52,fontWeight:800,color:isLive?C.red:C.text,letterSpacing:"-0.02em",lineHeight:1 }}>
                {match.home_score} <span style={{ color:C.borderDark }}>—</span> {match.away_score}
              </div>
              {/* Clock */}
              <div style={{ fontFamily:"'JetBrains Mono'",fontSize:20,fontWeight:700,color:isLive?C.red:C.textSoft,marginTop:8 }}>
                {match.status==="Not started"||match.status==="Scheduled" ? "00:00" : `${mins}'`}
              </div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne'",fontSize:18,fontWeight:800,color:C.text,marginBottom:4 }}>{match.away}</div>
              <div style={{ fontSize:12,color:C.textSoft }}>Away</div>
            </div>
          </div>

          {/* Clock controls */}
          {!isCompleted && (
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
              {match.phase === "Not started" && (
                <button onClick={() => handlePhaseChange(match.id,"1st Half")}
                  style={{ padding:"12px 24px",borderRadius:10,border:"none",background:C.green,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
                  ▶ Start 1st Half
                </button>
              )}
              {match.phase === "1st Half" && (
                <>
                  <button onClick={() => setRunning(r=>!r)}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${running?C.amber:C.green}`,background:running?C.amberLight:C.greenLight,color:running?C.amber:C.green,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    {running ? "⏸ Pause clock" : "▶ Resume clock"}
                  </button>
                  <button onClick={() => handlePhaseChange(match.id,"Half Time")}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${C.red}`,background:C.redLight,color:C.red,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    ⏹ Half Time
                  </button>
                </>
              )}
              {match.phase === "Half Time" && (
                <button onClick={() => handlePhaseChange(match.id,"2nd Half")}
                  style={{ padding:"12px 24px",borderRadius:10,border:"none",background:C.green,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:8 }}>
                  ▶ Start 2nd Half
                </button>
              )}
              {match.phase === "2nd Half" && (
                <>
                  <button onClick={() => setRunning(r=>!r)}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${running?C.amber:C.green}`,background:running?C.amberLight:C.greenLight,color:running?C.amber:C.green,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    {running ? "⏸ Pause clock" : "▶ Resume clock"}
                  </button>
                  <button onClick={() => handlePhaseChange(match.id,"Full Time")}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${C.red}`,background:C.redLight,color:C.red,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    🏁 Full Time
                  </button>
                  <button onClick={() => handlePhaseChange(match.id,"Extra Time")}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${C.purple}`,background:C.purpleLight,color:C.purple,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    ⚡ Extra Time
                  </button>
                </>
              )}
              {match.phase === "Extra Time" && (
                <>
                  <button onClick={() => setRunning(r=>!r)}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${running?C.amber:C.green}`,background:running?C.amberLight:C.greenLight,color:running?C.amber:C.green,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    {running ? "⏸ Pause" : "▶ Resume"}
                  </button>
                  <button onClick={() => handlePhaseChange(match.id,"Full Time")}
                    style={{ padding:"10px 20px",borderRadius:8,border:`1px solid ${C.red}`,background:C.redLight,color:C.red,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                    🏁 End Match
                  </button>
                </>
              )}
            </div>
          )}
          {isCompleted && (
            <div style={{ textAlign:"center",padding:"10px",background:C.greenLight,borderRadius:8,fontSize:13,fontWeight:700,color:C.green }}>
              🏁 Match completed
            </div>
          )}
        </div>

        {/* Match timeline */}
        <div className="card" style={{ padding:20 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.text }}>Match timeline</div>
            <span style={{ fontSize:12,color:C.textSoft,fontFamily:"'JetBrains Mono'" }}>{match.events.filter(e=>e.points>0).length} events</span>
          </div>
          {match.events.length === 0 ? (
            <div style={{ textAlign:"center",padding:"30px",color:C.textSoft,fontSize:13 }}>No events recorded yet.</div>
          ) : (
            <div>
              {[...match.events].reverse().map((e,i) => (
                <div key={e.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<match.events.length-1?`1px solid ${C.border}`:"none",background:"transparent" }}>
                  <div style={{ width:36,textAlign:"center",fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:600,color:C.textSoft,flexShrink:0 }}>{e.min}'</div>
                  <div style={{ width:32,height:32,borderRadius:8,background:typeBg[e.type]||C.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                    {SCORE_TYPES.find(s=>s.label===e.type)?.icon || (e.type==="Half Time"?"⏸️":"🏁")}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:typeColor[e.type]||C.text }}>{e.type}{e.points>0?` (+${e.points})`:""}</div>
                    {e.player && <div style={{ fontSize:11,color:C.textSoft }}>#{e.jersey} {e.player} · {e.team==="home"?match.home:match.away}</div>}
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:700,color:C.text,flexShrink:0 }}>{e.score}</div>
                  {e.points > 0 && (
                    <button onClick={() => handleDeleteEvent(match.id, e.id)}
                      style={{ padding:"3px 8px",borderRadius:5,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:10,cursor:"pointer",flexShrink:0 }}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── SCHEDULE PAGE ─────────────────────────────────────────────────────────
  const SchedulePage = () => (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Match Schedule</h1>
        <p style={{ fontSize:13,color:C.textSoft }}>Select a match to manage its clock and scoring</p>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {matches.map((m,i) => (
          <div key={m.id} className="card" onClick={() => { setActiveMatchId(m.id); setPage("clock"); }}
            style={{ padding:"16px 20px",cursor:"pointer",borderLeft:`3px solid ${m.status==="Live"?C.red:m.status==="Completed"?C.green:C.borderDark}`,transition:"all 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
              <div>
                <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",marginBottom:4 }}>{m.tournament} · {m.venue} · {m.date}</div>
                <div style={{ fontFamily:"'Syne'",fontSize:16,fontWeight:800,color:C.text }}>{m.home} <span style={{ color:C.textSoft,fontWeight:400 }}>vs</span> {m.away}</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                {m.status==="Live" && (
                  <div style={{ display:"flex",alignItems:"center",gap:5,padding:"3px 10px",background:C.redLight,borderRadius:5 }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
                    <span style={{ fontSize:10,fontWeight:700,color:C.red,fontFamily:"'JetBrains Mono'" }}>LIVE</span>
                  </div>
                )}
                <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:m.status==="Live"?C.redLight:m.status==="Completed"?C.greenLight:C.surfaceAlt,color:m.status==="Live"?C.red:m.status==="Completed"?C.green:C.textSoft }}>
                  {m.status==="Live"?m.phase:m.status}
                </span>
              </div>
            </div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <div style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:m.status==="Live"?C.red:C.text }}>
                  {m.home_score} — {m.away_score}
                </div>
                {m.status==="Live" && (
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:600,color:C.red }}>{Math.floor(m.clock/60)}'</span>
                )}
              </div>
              <span style={{ fontSize:12,color:C.green,fontWeight:600 }}>Manage →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const links = [
    { id:"overview",  label:"Overview",     icon:"📊" },
    { id:"clock",     label:"Match Clock",  icon:"⏱️" },
    { id:"schedule",  label:"Schedule",     icon:"📅" },
    { id:"events",    label:"All Events",   icon:"🏉" },
  ];

  const liveMatch = matches.find(m => m.status === "Live");

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={(p) => { setPage(p); if(p==="clock"&&liveMatch) setActiveMatchId(liveMatch.id); }}>
      {page === "overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Data Entry</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name} · Match day operations</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="📅" label="Matches Today"   value={matches.length}                              color={C.blue}/>
            <StatCard icon="⏱️" label="Live Now"        value={matches.filter(m=>m.status==="Live").length} color={C.red}/>
            <StatCard icon="✅" label="Completed"       value={matches.filter(m=>m.status==="Completed").length} color={C.green}/>
          </div>

          {/* Live match card */}
          {liveMatch && (
            <div className="card" style={{ padding:"20px 24px",marginBottom:14,border:`1.5px solid ${C.red}40`,background:"rgba(192,57,43,0.03)" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
                <span style={{ width:9,height:9,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
                <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.red }}>LIVE MATCH</span>
                <span style={{ fontSize:12,color:C.textSoft,fontFamily:"'JetBrains Mono'" }}>{liveMatch.phase} · {Math.floor(liveMatch.clock/60)}'</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",marginBottom:14 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Syne'",fontSize:16,fontWeight:800,color:C.text }}>{liveMatch.home}</div>
                </div>
                <div style={{ fontFamily:"'Syne'",fontSize:36,fontWeight:800,color:C.red,textAlign:"center" }}>{liveMatch.home_score} — {liveMatch.away_score}</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Syne'",fontSize:16,fontWeight:800,color:C.text }}>{liveMatch.away}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button className="btn-primary" onClick={() => { setActiveMatchId(liveMatch.id); setPage("clock"); }} style={{ flex:1,fontSize:13 }}>⏱️ Manage clock →</button>
                <button onClick={() => { setActiveMatchId(liveMatch.id); setShowScoreModal(true); }}
                  style={{ flex:1,padding:"10px",borderRadius:8,border:`1px solid ${C.green}`,background:C.greenLight,color:C.green,fontFamily:"'DM Sans'",fontWeight:700,fontSize:13,cursor:"pointer" }}>
                  🏉 Record event
                </button>
              </div>
            </div>
          )}

          {/* Today's schedule */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Today's schedule</div>
              <button className="btn-outline-green" onClick={() => setPage("schedule")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
            </div>
            {matches.map((m,i) => (
              <div key={m.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<matches.length-1?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontFamily:"'JetBrains Mono'",fontSize:12,fontWeight:600,color:C.textSoft,flexShrink:0,width:50 }}>{m.date.split(" ")[1]}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{m.home} vs {m.away}</div>
                  <div style={{ fontSize:11,color:C.textSoft }}>{m.venue}</div>
                </div>
                {m.status==="Live"
                  ? <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:16,color:C.red }}>{m.home_score}—{m.away_score}</div>
                  : <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:m.status==="Completed"?C.greenLight:C.surfaceAlt,color:m.status==="Completed"?C.green:C.textSoft }}>{m.status}</span>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {page === "clock"    && <MatchClockPage match={activeMatchId ? getMatch(activeMatchId) : liveMatch}/>}
      {page === "schedule" && <SchedulePage/>}
      {page === "events"   && (
        <div className="fade-up">
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text,marginBottom:20 }}>All Events</h1>
          {matches.map(m => m.events.length > 0 && (
            <div key={m.id} style={{ marginBottom:20 }}>
              <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:10,padding:"8px 12px",background:C.surfaceAlt,borderRadius:8 }}>{m.home} vs {m.away}</div>
              {[...m.events].reverse().map((e,i) => (
                <div key={e.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 12px",borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:11,color:C.textSoft,width:30 }}>{e.min}'</span>
                  <span style={{ fontSize:16 }}>{SCORE_TYPES.find(s=>s.label===e.type)?.icon||"⏱️"}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:13,fontWeight:600,color:typeColor[e.type]||C.text }}>{e.type}</span>
                    {e.player && <span style={{ fontSize:12,color:C.textSoft }}> · #{e.jersey} {e.player}</span>}
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono'",fontSize:13,fontWeight:700 }}>{e.score}</span>
                  {e.points > 0 && (
                    <button onClick={() => handleDeleteEvent(m.id,e.id)} style={{ padding:"2px 8px",borderRadius:4,border:`1px solid ${C.red}`,background:"transparent",color:C.red,fontSize:10,cursor:"pointer" }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
};


const MasterRefereeDashboard = ({ user, onLogout, onNotify }) => {
  const [page, setPage] = useState("overview");

  // ── CARD RECORDS ───────────────────────────────────────────────────────────
  const [cards, setCards] = useState([
    { id:"c1", type:"Red",    player:"James Kamau",   jersey:1,  team:"Nairobi Rhinos RFC", match:"Nairobi Rhinos vs Kisumu Tigers", min:34, offence:"Dangerous tackle from behind",         ban:1, ban_status:"Pending organizer review", match_id:"m1", timestamp:"Mar 23 14:34" },
    { id:"c2", type:"Yellow", player:"Collins Otieno",jersey:10, team:"Kisumu Tigers RFC",  match:"Nairobi Rhinos vs Kisumu Tigers", min:18, offence:"Repeated infringement at the ruck",    ban:0, ban_status:"Warning",                 match_id:"m1", timestamp:"Mar 23 14:18" },
    { id:"c3", type:"Yellow", player:"Brian Waweru",  jersey:4,  team:"Nairobi Rhinos RFC", match:"Nairobi Rhinos vs Kisumu Tigers", min:52, offence:"Late tackle",                          ban:0, ban_status:"Warning",                 match_id:"m1", timestamp:"Mar 23 15:12" },
    { id:"c4", type:"Citing", player:"Mark Waweru",   jersey:8,  team:"Kisumu Tigers RFC",  match:"Nairobi Rhinos vs Kisumu Tigers", min:80, offence:"Alleged biting — post-match report",   ban:0, ban_status:"Under investigation",     match_id:"m1", timestamp:"Mar 23 17:00" },
  ]);

  // ── MATCHES ────────────────────────────────────────────────────────────────
  const matches = [
    { id:"m1", label:"Nairobi Rhinos vs Kisumu Tigers",   status:"Live",      home_squad:[
        { jersey:1,name:"James Kamau" },{ jersey:4,name:"Brian Waweru" },{ jersey:5,name:"Peter Omondi" },
        { jersey:8,name:"Daniel Njoroge" },{ jersey:9,name:"Kevin Mutua" },{ jersey:10,name:"Grace Wanjiku" },
        { jersey:11,name:"Samuel Mutua" },{ jersey:12,name:"David Njoroge" },{ jersey:13,name:"Eric Ochieng" },
      ],
      away_squad:[
        { jersey:1,name:"Wycliffe Oduya" },{ jersey:8,name:"Mark Waweru" },{ jersey:10,name:"Collins Otieno" },
        { jersey:11,name:"George Kamau" },{ jersey:12,name:"Dennis Mutua" },{ jersey:13,name:"Victor Oduya" },
      ],
    },
    { id:"m2", label:"Mombasa Lions vs Thika Panthers",   status:"Scheduled", home_squad:[], away_squad:[] },
  ];

  // ── CARD FORM STATE ────────────────────────────────────────────────────────
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState({ type:"Yellow", match_id:"m1", team:"home", search:"", selectedPlayer:null, offence:"", ban:1 });
  const [cardError, setCardError]       = useState("");
  const [cardSuccess, setCardSuccess]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const setC = (k,v) => setCardForm(f => ({ ...f,[k]:v }));

  // Yellow card tracking for auto-red
  const yellowCount = (playerId, matchId) =>
    cards.filter(c => c.player === playerId && c.match_id === matchId && c.type === "Yellow").length;

  const CARD_TYPES = [
    { type:"Yellow", icon:"🟨", color:"#B8860B", bg:"#FDF6E3", desc:"Warning — player stays on" },
    { type:"Red",    icon:"🟥", color:C.red,     bg:C.redLight, desc:"Immediate suspension" },
    { type:"Sin bin",icon:"⏱️", color:C.teal,    bg:C.tealLight,desc:"10-min temporary suspension" },
    { type:"Citing", icon:"📋", color:C.purple,  bg:C.purpleLight,desc:"Post-match report" },
  ];

  const getSquad = (matchId, team) => {
    const m = matches.find(x => x.id === matchId);
    if (!m) return [];
    return team === "home" ? m.home_squad : m.away_squad;
  };

  const handleIssueCard = async () => {
    setCardError("");
    if (!cardForm.match_id)     { setCardError("Select a match.");           return; }
    if (!cardForm.selectedPlayer && !cardForm.search) { setCardError("Select a player."); return; }
    if (!cardForm.offence.trim()){ setCardError("Describe the offence."); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    const player = cardForm.selectedPlayer;
    const playerName   = player?.name  || cardForm.search;
    const playerJersey = player?.jersey || "";
    const matchLabel   = matches.find(m => m.id === cardForm.match_id)?.label || "";

    // Auto-upgrade 2nd yellow to red
    let finalType = cardForm.type;
    if (cardForm.type === "Yellow") {
      const yellows = cards.filter(c =>
        c.player === playerName && c.match_id === cardForm.match_id && c.type === "Yellow"
      ).length;
      if (yellows >= 1) finalType = "Red"; // 2nd yellow = red
    }

    const newCard = {
      id:         `c${Date.now()}`,
      type:       finalType,
      player:     playerName,
      jersey:     playerJersey,
      team:       cardForm.team === "home"
                    ? matches.find(m=>m.id===cardForm.match_id)?.label.split(" vs ")[0]+" RFC"
                    : matches.find(m=>m.id===cardForm.match_id)?.label.split(" vs ")[1]+" RFC",
      match:      matchLabel,
      match_id:   cardForm.match_id,
      min:        0,
      offence:    cardForm.offence,
      ban:        finalType === "Red" ? cardForm.ban : 0,
      ban_status: finalType === "Red" ? "Pending organizer review" : "Warning",
      timestamp:  new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),
      auto_red:   finalType === "Red" && cardForm.type === "Yellow",
    };

    setCards(prev => [newCard, ...prev]);

    // Notify Team Manager
    if (onNotify) {
      onNotify({
        type: finalType === "Red" ? "red_card" : finalType === "Yellow" ? "yellow_card" : "card",
        player: playerName,
        team: newCard.team,
        match: matchLabel,
        card: finalType,
        auto_red: newCard.auto_red,
        ban: newCard.ban,
        time: newCard.timestamp,
      });
    }

    setSubmitting(false);
    setCardSuccess(true);
    setCardForm({ type:"Yellow", match_id:"m1", team:"home", search:"", selectedPlayer:null, offence:"", ban:1 });
    setTimeout(() => { setCardSuccess(false); setShowCardForm(false); }, 2200);
  };

  const typeColor = { Yellow:"#B8860B", Red:C.red, "Sin bin":C.teal, Citing:C.purple };
  const typeBg    = { Yellow:"#FDF6E3", Red:C.redLight, "Sin bin":C.tealLight, Citing:C.purpleLight };

  // ── ISSUE CARD FORM ────────────────────────────────────────────────────────
  const IssueCardForm = () => {
    const squad = getSquad(cardForm.match_id, cardForm.team);
    const filtered = squad.filter(p =>
      !cardForm.search ||
      p.name.toLowerCase().includes(cardForm.search.toLowerCase()) ||
      String(p.jersey).includes(cardForm.search)
    );
    const matchLabel = matches.find(m=>m.id===cardForm.match_id)?.label || "";
    const yellows = cards.filter(c => c.player === (cardForm.selectedPlayer?.name||cardForm.search) && c.match_id === cardForm.match_id && c.type === "Yellow").length;
    const willAutoRed = cardForm.type === "Yellow" && yellows >= 1;

    return (
      <div className="fade-up">
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:22 }}>
          <button className="btn-ghost" onClick={() => { setShowCardForm(false); setCardError(""); }} style={{ padding:"7px 14px",fontSize:13 }}>← Back</button>
          <div>
            <h2 style={{ fontFamily:"'Syne'",fontSize:22,fontWeight:800,color:C.text }}>Issue Card</h2>
            <p style={{ fontSize:13,color:C.textSoft }}>Record a disciplinary card or incident</p>
          </div>
        </div>

        {cardSuccess && (
          <div style={{ padding:"14px 18px",background:C.greenLight,border:`1px solid ${C.green}28`,borderRadius:10,marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontSize:22 }}>✅</span>
            <div><div style={{ fontSize:14,fontWeight:700,color:C.green }}>Card issued successfully!</div><div style={{ fontSize:12,color:C.textSoft }}>Team Manager has been notified.</div></div>
          </div>
        )}
        {cardError && <div style={{ padding:"10px 14px",background:C.redLight,border:`1px solid ${C.red}28`,borderRadius:8,marginBottom:14,fontSize:13,color:C.red }}>⚠️ {cardError}</div>}

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
          {/* Left */}
          <div>
            <div className="card" style={{ padding:"20px 22px",marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:16 }}>Card type</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:6 }}>
                {CARD_TYPES.map(ct => (
                  <button key={ct.type} onClick={() => setC("type",ct.type)}
                    style={{ padding:"12px 10px",borderRadius:8,border:`1.5px solid ${cardForm.type===ct.type?ct.color:C.border}`,background:cardForm.type===ct.type?ct.bg:"transparent",cursor:"pointer",textAlign:"center",transition:"all 0.15s" }}>
                    <div style={{ fontSize:22,marginBottom:4 }}>{ct.icon}</div>
                    <div style={{ fontSize:12,fontWeight:700,color:cardForm.type===ct.type?ct.color:C.textMid }}>{ct.type}</div>
                    <div style={{ fontSize:10,color:C.textSoft,marginTop:2 }}>{ct.desc}</div>
                  </button>
                ))}
              </div>
              {willAutoRed && (
                <div style={{ padding:"8px 12px",background:C.redLight,border:`1px solid ${C.red}28`,borderRadius:7,fontSize:12,color:C.red,fontWeight:600 }}>
                  ⚠️ This player already has a yellow card this match — issuing will auto-upgrade to a RED card.
                </div>
              )}
            </div>

            <div className="card" style={{ padding:"20px 22px",marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Match & team</div>
              <Field label="Match *">
                <SelectField value={cardForm.match_id} onChange={e => setC("match_id",e.target.value)}
                  options={matches.map(m=>({ value:m.id, label:m.label }))}/>
              </Field>
              <Field label="Team *">
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  {["home","away"].map(t => {
                    const lbl = t==="home" ? matchLabel.split(" vs ")[0] : matchLabel.split(" vs ")[1];
                    return (
                      <button key={t} onClick={()=>setC("team",t)}
                        style={{ padding:"8px",borderRadius:7,border:`1.5px solid ${cardForm.team===t?C.green:C.border}`,background:cardForm.team===t?C.greenLight:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,color:cardForm.team===t?C.green:C.textMid }}>
                        {lbl||t}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {(cardForm.type === "Red" || willAutoRed) && (
              <div className="card" style={{ padding:"20px 22px" }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Suspension</div>
                <Field label="Match ban (games)">
                  <Input type="number" min="1" max="12" value={cardForm.ban} onChange={e=>setC("ban",Number(e.target.value))}/>
                </Field>
                <div style={{ fontSize:11,color:C.textSoft }}>Organizer will review and confirm the ban length.</div>
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <div className="card" style={{ padding:"20px 22px",marginBottom:14 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Player</div>
              <Field label="Search by jersey # or name *">
                <Input placeholder="e.g. 10 or James Kamau" value={cardForm.search}
                  onChange={e => setC("search",e.target.value) || setC("selectedPlayer",null)} autoFocus/>
              </Field>
              {cardForm.search && (
                <div style={{ border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginTop:-8,maxHeight:200,overflowY:"auto" }}>
                  {filtered.length === 0 ? (
                    <div style={{ padding:"10px 14px",fontSize:12,color:C.textSoft }}>No players found. Card will be recorded with typed name.</div>
                  ) : filtered.map((p,i) => {
                    const py = cards.filter(c=>c.player===p.name&&c.match_id===cardForm.match_id&&c.type==="Yellow").length;
                    return (
                      <div key={i} onClick={() => setC("selectedPlayer",p) || setC("search",`#${p.jersey} ${p.name}`)}
                        style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",background:cardForm.selectedPlayer?.jersey===p.jersey?C.greenLight:"transparent",borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}
                        onMouseEnter={e=>e.currentTarget.style.background=C.greenLight}
                        onMouseLeave={e=>e.currentTarget.style.background=cardForm.selectedPlayer?.jersey===p.jersey?C.greenLight:"transparent"}>
                        <div style={{ width:28,height:28,borderRadius:6,background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono'",fontSize:11,fontWeight:700,color:C.green }}>{p.jersey}</div>
                        <span style={{ flex:1,fontSize:13,fontWeight:600,color:C.text }}>{p.name}</span>
                        {py>0 && <span style={{ fontSize:10,fontWeight:700,color:"#B8860B",background:"#FDF6E3",padding:"2px 6px",borderRadius:4 }}>🟨 ×{py}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card" style={{ padding:"20px 22px" }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Offence details</div>
              <Field label="Offence description *">
                <textarea className="input-field" placeholder="Describe what happened e.g. dangerous tackle from behind at ruck, player was warned but persisted..."
                  rows={5} value={cardForm.offence} onChange={e=>setC("offence",e.target.value)}
                  style={{ resize:"vertical" }}
                />
              </Field>
            </div>

            {/* Preview */}
            {(cardForm.selectedPlayer||cardForm.search) && cardForm.offence && (
              <div style={{ padding:"12px 14px",background:typeBg[willAutoRed?"Red":cardForm.type]||C.surfaceAlt,border:`1px solid ${typeColor[willAutoRed?"Red":cardForm.type]}28`,borderRadius:8,marginTop:14,fontSize:13 }}>
                <span style={{ fontSize:16,marginRight:8 }}>{CARD_TYPES.find(t=>t.type===(willAutoRed?"Red":cardForm.type))?.icon}</span>
                <strong style={{ color:typeColor[willAutoRed?"Red":cardForm.type] }}>{willAutoRed?"Red (auto)":cardForm.type} card</strong>
                {" · "}
                {cardForm.selectedPlayer?`#${cardForm.selectedPlayer.jersey} ${cardForm.selectedPlayer.name}`:cardForm.search}
                {(cardForm.type==="Red"||(willAutoRed)) && cardForm.ban > 0 && ` · ${cardForm.ban}-match ban`}
              </div>
            )}
          </div>
        </div>

        <div style={{ display:"flex",gap:10,marginTop:18 }}>
          <button className="btn-ghost" onClick={() => { setShowCardForm(false); setCardError(""); }} style={{ flex:"0 0 120px" }}>Cancel</button>
          <button className="btn-primary" onClick={handleIssueCard} disabled={submitting}
            style={{ flex:1,fontSize:15,background:typeColor[willAutoRed?"Red":cardForm.type]||C.green }}>
            {submitting ? "Issuing..." : `Issue ${willAutoRed?"Red (auto)":cardForm.type} card →`}
          </button>
        </div>
      </div>
    );
  };

  // ── CARD HISTORY PAGE ──────────────────────────────────────────────────────
  const CardHistoryPage = () => (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Card History</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{cards.length} records this tournament</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowCardForm(true); setCardError(""); }} style={{ fontSize:13,background:C.red }}>🟥 Issue card</button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        {[
          { label:"Yellow cards", value:cards.filter(c=>c.type==="Yellow").length,  color:"#B8860B", icon:"🟨" },
          { label:"Red cards",    value:cards.filter(c=>c.type==="Red").length,     color:C.red,     icon:"🟥" },
          { label:"Sin bins",     value:cards.filter(c=>c.type==="Sin bin").length, color:C.teal,    icon:"⏱️" },
          { label:"Citings",      value:cards.filter(c=>c.type==="Citing").length,  color:C.purple,  icon:"📋" },
        ].map((s,i) => (
          <div key={i} className="card" style={{ padding:"14px 18px",display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:8,background:s.color+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em" }}>{s.label}</div>
              <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:22,color:s.color }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"60px 1fr 1fr 80px 100px 110px",padding:"0 16px",height:38,alignItems:"center",background:C.surfaceAlt,borderBottom:`1px solid ${C.border}` }}>
          {["Card","Player","Match","Min","Ban","Time"].map(h=>(
            <span key={h} style={{ fontSize:10,color:C.textSoft,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'JetBrains Mono'" }}>{h}</span>
          ))}
        </div>
        {cards.map((c,i) => (
          <div key={c.id} style={{ display:"grid",gridTemplateColumns:"60px 1fr 1fr 80px 100px 110px",alignItems:"center",padding:"0 16px",minHeight:56,borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.surfaceAlt }}>
            <div style={{ display:"flex",alignItems:"center",gap:6 }}>
              <span style={{ fontSize:18 }}>{CARD_TYPES.find(t=>t.type===c.type)?.icon||"📋"}</span>
              {c.auto_red && <span style={{ fontSize:9,fontWeight:700,color:C.red,background:C.redLight,padding:"1px 4px",borderRadius:3 }}>2Y</span>}
            </div>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{c.jersey?`#${c.jersey} `:""}{c.player}</div>
              <div style={{ fontSize:11,color:C.textSoft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180 }}>{c.team}</div>
            </div>
            <div style={{ fontSize:12,color:C.textMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.match}</div>
            <span style={{ fontSize:12,color:C.textSoft,fontFamily:"'JetBrains Mono'" }}>{c.min}'</span>
            <span style={{ padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:c.type==="Red"?C.redLight:C.surfaceAlt,color:c.type==="Red"?C.red:C.textSoft }}>
              {c.ban>0?`${c.ban}-match ban`:"Warning"}
            </span>
            <span style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>{c.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const links = [
    { id:"overview", label:"Overview",      icon:"📊" },
    { id:"cards",    label:"Issue Card",    icon:"🟥" },
    { id:"history",  label:"Card History",  icon:"📋" },
    { id:"reports",  label:"Match Reports", icon:"📝" },
  ];

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={p=>{setPage(p);setShowCardForm(false);}}>
      {page==="overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Referee Panel</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🟨" label="Yellow Cards" value={cards.filter(c=>c.type==="Yellow").length} color="#B8860B"/>
            <StatCard icon="🟥" label="Red Cards"    value={cards.filter(c=>c.type==="Red").length}    color={C.red}/>
            <StatCard icon="⏱️" label="Sin Bins"     value={cards.filter(c=>c.type==="Sin bin").length} color={C.teal}/>
            <StatCard icon="📋" label="Citings"      value={cards.filter(c=>c.type==="Citing").length}  color={C.purple}/>
          </div>

          {/* Live match panel */}
          <div className="card" style={{ padding:"18px 22px",marginBottom:14,borderLeft:`3px solid ${C.red}` }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
              <span style={{ width:8,height:8,borderRadius:"50%",background:C.red,display:"inline-block",animation:"pulse 1.5s infinite" }}/>
              <span style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.red }}>LIVE — Nairobi Rhinos vs Kisumu Tigers</span>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button className="btn-primary" onClick={()=>{setShowCardForm(true);setPage("cards");}} style={{ background:C.red,fontSize:13 }}>🟥 Issue card</button>
              <button className="btn-ghost" onClick={()=>setPage("history")} style={{ fontSize:13 }}>View card history</button>
            </div>
          </div>

          {/* Recent cards */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Recent cards</div>
            {cards.slice(0,4).map((c,i) => (
              <div key={c.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:20,flexShrink:0 }}>{CARD_TYPES.find(t=>t.type===c.type)?.icon||"📋"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{c.jersey?`#${c.jersey} `:""}{c.player} · {c.team}</div>
                  <div style={{ fontSize:11,color:C.textSoft,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.offence}</div>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <span style={{ padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,background:typeBg[c.type],color:typeColor[c.type] }}>{c.type}</span>
                  <div style={{ fontSize:10,color:C.textDim,marginTop:3,fontFamily:"'JetBrains Mono'" }}>{c.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {page==="cards"   && (showCardForm ? <IssueCardForm/> : (
        <div className="fade-up" style={{ textAlign:"center",padding:"60px 20px" }}>
          <div style={{ fontSize:56,marginBottom:16 }}>🟥</div>
          <div style={{ fontFamily:"'Syne'",fontSize:20,fontWeight:700,color:C.text,marginBottom:8 }}>Issue a Card</div>
          <p style={{ fontSize:14,color:C.textSoft,marginBottom:20 }}>Select the match, player and card type</p>
          <button className="btn-primary" onClick={()=>setShowCardForm(true)} style={{ background:C.red }}>🟥 Issue card now</button>
        </div>
      ))}
      {page==="history" && <CardHistoryPage/>}
      {page==="reports" && <RefMatchReportsPage cards={cards}/>}
    </DashboardShell>
  );
};

const MedicDashboard = ({ user, onLogout, onNotify }) => {
  const [page, setPage] = useState("overview");

  // ── INJURY RECORDS ─────────────────────────────────────────────────────────
  const [injuries, setInjuries] = useState([
    { id:"i1", player:"Daniel Njoroge", jersey:13, team:"Nairobi Rhinos RFC", type:"Hamstring strain",   severity:"Moderate", notes:"Player felt pain in left hamstring after tackle in 34th min. Can walk but unable to sprint.", status:"Active",   reported:"Mar 23 14:45", match:"Nairobi Rhinos vs Kisumu Tigers" },
    { id:"i2", player:"Collins Otieno", jersey:10, team:"Kisumu Tigers RFC",  type:"Ankle sprain",       severity:"Minor",    notes:"Rolled ankle during ruck. Strapped and returned to play.",                                   status:"Cleared",  reported:"Mar 23 15:20", match:"Nairobi Rhinos vs Kisumu Tigers" },
    { id:"i3", player:"Mark Waweru",    jersey:8,  team:"Kisumu Tigers RFC",  type:"Concussion",         severity:"Severe",   notes:"Head collision at 52nd min. Showed concussion symptoms. Withdrawn immediately. HIA required.", status:"Active",   reported:"Mar 23 15:52", match:"Nairobi Rhinos vs Kisumu Tigers" },
  ]);

  const [showInjuryForm, setShowInjuryForm] = useState(false);
  const [injForm, setInjForm] = useState({ team:"", player:"", jersey:"", match:"Nairobi Rhinos vs Kisumu Tigers", type:"", severity:"Minor", notes:"" });
  const [injError, setInjError]   = useState("");
  const [injSuccess, setInjSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const setI = (k,v) => setInjForm(f=>({ ...f,[k]:v }));

  const SEVERITIES = [
    { level:"Minor",   color:C.green,  bg:C.greenLight, desc:"Can play with treatment"         },
    { level:"Moderate",color:C.amber,  bg:C.amberLight, desc:"Needs rest, available next match" },
    { level:"Severe",  color:C.red,    bg:C.redLight,   desc:"Out for multiple matches"         },
    { level:"Unknown", color:C.purple, bg:C.purpleLight,desc:"Pending full assessment"          },
  ];

  const teams = [
    { name:"Nairobi Rhinos RFC", squad:[
        { jersey:1,name:"James Kamau" },{ jersey:4,name:"Brian Waweru" },
        { jersey:5,name:"Peter Omondi" },{ jersey:8,name:"Daniel Njoroge" },
        { jersey:13,name:"Eric Ochieng" },{ jersey:15,name:"Tom Baraka" },
    ]},
    { name:"Kisumu Tigers RFC", squad:[
        { jersey:1,name:"Wycliffe Oduya" },{ jersey:8,name:"Mark Waweru" },
        { jersey:10,name:"Collins Otieno" },{ jersey:13,name:"Victor Oduya" },
    ]},
    { name:"Mombasa Lions RFC", squad:[] },
  ];

  const teamSquad = teams.find(t=>t.name===injForm.team)?.squad||[];

  const handleLogInjury = async () => {
    setInjError("");
    if (!injForm.team)    { setInjError("Select a team.");               return; }
    if (!injForm.player)  { setInjError("Enter the player name.");       return; }
    if (!injForm.type.trim()) { setInjError("Describe the injury type."); return; }
    if (!injForm.notes.trim()) { setInjError("Add clinical notes.");     return; }

    setSubmitting(true);
    await new Promise(r=>setTimeout(r,1000));

    const newInj = {
      id:       `i${Date.now()}`,
      player:   injForm.player,
      jersey:   injForm.jersey,
      team:     injForm.team,
      type:     injForm.type,
      severity: injForm.severity,
      notes:    injForm.notes,
      match:    injForm.match,
      status:   "Active",
      reported: new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),
    };

    setInjuries(prev=>[newInj,...prev]);

    // Notify Team Manager
    if (onNotify) {
      onNotify({
        type:     "injury",
        player:   injForm.player,
        team:     injForm.team,
        injury:   injForm.type,
        severity: injForm.severity,
        time:     newInj.reported,
      });
    }

    setSubmitting(false);
    setInjSuccess(true);
    setInjForm({ team:"",player:"",jersey:"",match:"Nairobi Rhinos vs Kisumu Tigers",type:"",severity:"Minor",notes:"" });
    setTimeout(()=>{ setInjSuccess(false); setShowInjuryForm(false); },2200);
  };

  const handleClear = (injId) => {
    setInjuries(prev=>prev.map(inj=>inj.id===injId?{...inj,status:"Cleared"}:inj));
  };

  const sevColor = { Minor:C.green, Moderate:C.amber, Severe:C.red, Unknown:C.purple };
  const sevBg    = { Minor:C.greenLight, Moderate:C.amberLight, Severe:C.redLight, Unknown:C.purpleLight };

  // ── LOG INJURY FORM ────────────────────────────────────────────────────────
  const LogInjuryForm = () => (
    <div className="fade-up">
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:22 }}>
        <button className="btn-ghost" onClick={()=>{ setShowInjuryForm(false); setInjError(""); }} style={{ padding:"7px 14px",fontSize:13 }}>← Back</button>
        <div>
          <h2 style={{ fontFamily:"'Syne'",fontSize:22,fontWeight:800,color:C.text }}>Log Injury</h2>
          <p style={{ fontSize:13,color:C.textSoft }}>Record a player injury — Team Manager will be notified instantly</p>
        </div>
      </div>

      {injSuccess && (
        <div style={{ padding:"14px 18px",background:C.greenLight,border:`1px solid ${C.green}28`,borderRadius:10,marginBottom:18,display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:22 }}>✅</span>
          <div><div style={{ fontSize:14,fontWeight:700,color:C.green }}>Injury logged!</div><div style={{ fontSize:12,color:C.textSoft }}>Team Manager notified instantly.</div></div>
        </div>
      )}
      {injError && <div style={{ padding:"10px 14px",background:C.redLight,border:`1px solid ${C.red}28`,borderRadius:8,marginBottom:14,fontSize:13,color:C.red }}>⚠️ {injError}</div>}

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
        {/* Left */}
        <div>
          <div className="card" style={{ padding:"20px 22px",marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Player & team</div>
            <Field label="Team *">
              <SelectField placeholder="— Select team —" value={injForm.team} onChange={e=>{ setI("team",e.target.value); setI("player",""); setI("jersey",""); }}
                options={teams.map(t=>({ value:t.name,label:t.name }))}/>
            </Field>
            {injForm.team && teamSquad.length > 0 && (
              <Field label="Select player">
                <SelectField placeholder="— Pick from squad —" value={injForm.player}
                  onChange={e=>{
                    const p = teamSquad.find(x=>x.name===e.target.value);
                    setI("player",e.target.value);
                    setI("jersey",p?.jersey||"");
                  }}
                  options={teamSquad.map(p=>({ value:p.name,label:`#${p.jersey} ${p.name}` }))}/>
              </Field>
            )}
            <Field label={injForm.team&&teamSquad.length>0?"Or type player name manually":"Player name *"}>
              <Input placeholder="Player name" value={injForm.player} onChange={e=>setI("player",e.target.value)}/>
            </Field>
            {!injForm.jersey && (
              <Field label="Jersey number">
                <Input type="number" placeholder="e.g. 13" value={injForm.jersey} onChange={e=>setI("jersey",e.target.value)}/>
              </Field>
            )}
          </div>

          <div className="card" style={{ padding:"20px 22px" }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Severity</div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {SEVERITIES.map(s => (
                <button key={s.level} onClick={()=>setI("severity",s.level)}
                  style={{ padding:"10px 14px",borderRadius:8,border:`1.5px solid ${injForm.severity===s.level?s.color:C.border}`,background:injForm.severity===s.level?s.bg:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.15s",display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:s.color,flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,color:injForm.severity===s.level?s.color:C.textMid }}>{s.level}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="card" style={{ padding:"20px 22px",marginBottom:14 }}>
            <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:14,color:C.text,marginBottom:14 }}>Injury details</div>
            <Field label="Injury type *">
              <Input placeholder="e.g. Hamstring strain, Ankle sprain, Concussion..." value={injForm.type} onChange={e=>setI("type",e.target.value)} autoFocus/>
            </Field>
            <Field label="Clinical notes *">
              <textarea className="input-field" placeholder="Describe the injury in detail — mechanism, symptoms, treatment given, whether player continued..."
                rows={7} value={injForm.notes} onChange={e=>setI("notes",e.target.value)} style={{ resize:"vertical" }}/>
            </Field>
          </div>

          {/* Preview */}
          {injForm.player && injForm.type && (
            <div style={{ padding:"12px 14px",background:sevBg[injForm.severity],border:`1px solid ${sevColor[injForm.severity]}28`,borderRadius:8,fontSize:13 }}>
              <div style={{ width:10,height:10,borderRadius:"50%",background:sevColor[injForm.severity],display:"inline-block",marginRight:8 }}/>
              <strong style={{ color:sevColor[injForm.severity] }}>{injForm.severity}</strong>{" "}
              injury — <strong>{injForm.player}{injForm.jersey?` (#${injForm.jersey})`:""}</strong> · {injForm.type}
              <div style={{ fontSize:11,color:C.textSoft,marginTop:6 }}>🔔 Team Manager will be notified instantly</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display:"flex",gap:10,marginTop:18 }}>
        <button className="btn-ghost" onClick={()=>{ setShowInjuryForm(false); setInjError(""); }} style={{ flex:"0 0 120px" }}>Cancel</button>
        <button className="btn-primary" onClick={handleLogInjury} disabled={submitting} style={{ flex:1,fontSize:15 }}>
          {submitting ? "Logging..." : "Log injury →"}
        </button>
      </div>
    </div>
  );

  // ── INJURY LIST ────────────────────────────────────────────────────────────
  const InjuryListPage = () => (
    <div className="fade-up">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne'",fontSize:24,fontWeight:800,color:C.text }}>Injury Log</h1>
          <p style={{ fontSize:13,color:C.textSoft }}>{injuries.filter(i=>i.status==="Active").length} active · {injuries.filter(i=>i.status==="Cleared").length} cleared</p>
        </div>
        <button className="btn-primary" onClick={()=>{ setShowInjuryForm(true); setInjError(""); }} style={{ fontSize:13 }}>+ Log Injury</button>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:18 }}>
        {SEVERITIES.map(s => (
          <div key={s.level} className="card" style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:11,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em" }}>{s.level}</div>
              <div style={{ fontFamily:"'Syne'",fontWeight:800,fontSize:20,color:s.color }}>
                {injuries.filter(i=>i.severity===s.level&&i.status==="Active").length}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {injuries.map((inj,i) => (
          <div key={inj.id} className="card" style={{ padding:"16px 20px",borderLeft:`3px solid ${inj.status==="Cleared"?C.green:sevColor[inj.severity]}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:40,height:40,borderRadius:9,background:inj.status==="Cleared"?C.greenLight:sevBg[inj.severity],display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>🏥</div>
                <div>
                  <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,color:C.text }}>{inj.jersey?`#${inj.jersey} `:""}{inj.player}</div>
                  <div style={{ fontSize:12,color:C.textSoft }}>{inj.team}</div>
                </div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:inj.status==="Cleared"?C.greenLight:sevBg[inj.severity],color:inj.status==="Cleared"?C.green:sevColor[inj.severity] }}>
                  {inj.status==="Cleared"?"✓ Cleared":inj.severity}
                </span>
                {inj.status==="Active" && (
                  <button onClick={()=>handleClear(inj.id)}
                    style={{ padding:"4px 10px",borderRadius:5,border:`1px solid ${C.green}`,background:"transparent",color:C.green,fontSize:11,cursor:"pointer",fontWeight:600 }}>
                    ✓ Clear
                  </button>
                )}
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
              <div style={{ background:C.surfaceAlt,borderRadius:7,padding:"8px 12px" }}>
                <div style={{ fontSize:10,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3 }}>Injury type</div>
                <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{inj.type}</div>
              </div>
              <div style={{ background:C.surfaceAlt,borderRadius:7,padding:"8px 12px" }}>
                <div style={{ fontSize:10,color:C.textSoft,fontFamily:"'JetBrains Mono'",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3 }}>Match</div>
                <div style={{ fontSize:12,color:C.textMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{inj.match}</div>
              </div>
            </div>
            <div style={{ fontSize:12,color:C.textMid,lineHeight:1.6,padding:"8px 12px",background:C.surfaceAlt,borderRadius:7,marginBottom:6 }}>{inj.notes}</div>
            <div style={{ fontSize:11,color:C.textDim,fontFamily:"'JetBrains Mono'" }}>Reported {inj.reported}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const links = [
    { id:"overview",  label:"Overview",       icon:"📊" },
    { id:"log",       label:"Log Injury",     icon:"🏥" },
    { id:"injuries",  label:"Injury Log",     icon:"📋" },
    { id:"teams",     label:"Team Health",    icon:"👥" },
  ];

  return (
    <DashboardShell user={user} onLogout={onLogout} links={links} active={page} onNav={p=>{setPage(p);setShowInjuryForm(false);}}>
      {page==="overview" && (
        <div className="fade-up">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontFamily:"'Syne'",fontSize:26,fontWeight:800,color:C.text }}>Medical Panel</h1>
            <p style={{ fontSize:14,color:C.textSoft }}>{user.name}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18 }}>
            <StatCard icon="🏥" label="Active injuries"   value={injuries.filter(i=>i.status==="Active").length}   color={C.red}   sub="Across all teams"/>
            <StatCard icon="🔴" label="Severe"            value={injuries.filter(i=>i.severity==="Severe"&&i.status==="Active").length}   color={C.red}/>
            <StatCard icon="🟠" label="Moderate"          value={injuries.filter(i=>i.severity==="Moderate"&&i.status==="Active").length} color={C.amber}/>
            <StatCard icon="✅" label="Cleared today"     value={injuries.filter(i=>i.status==="Cleared").length}  color={C.green}/>
          </div>

          {injuries.filter(i=>i.status==="Active"&&i.severity==="Severe").length>0 && (
            <Alert type="error">🚨 {injuries.filter(i=>i.status==="Active"&&i.severity==="Severe").length} severe injury requires immediate attention — HIA / hospital assessment may be needed.</Alert>
          )}

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15 }}>Active injuries</div>
                <button className="btn-outline-green" onClick={()=>setPage("injuries")} style={{ fontSize:11,padding:"4px 12px" }}>View all</button>
              </div>
              {injuries.filter(i=>i.status==="Active").map((inj,i)=>(
                <div key={inj.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<injuries.filter(x=>x.status==="Active").length-1?`1px solid ${C.border}`:"none" }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:sevColor[inj.severity],flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{inj.jersey?`#${inj.jersey} `:""}{inj.player} · {inj.team.split(" ")[0]}</div>
                    <div style={{ fontSize:11,color:C.textSoft }}>{inj.type}</div>
                  </div>
                  <span style={{ padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600,background:sevBg[inj.severity],color:sevColor[inj.severity] }}>{inj.severity}</span>
                </div>
              ))}
              {injuries.filter(i=>i.status==="Active").length===0 && (
                <div style={{ textAlign:"center",padding:"20px",color:C.textSoft,fontSize:13 }}>No active injuries.</div>
              )}
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontFamily:"'Syne'",fontWeight:700,fontSize:15,marginBottom:14 }}>Quick actions</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                <button className="btn-primary" onClick={()=>{ setShowInjuryForm(true); setPage("log"); }} style={{ fontSize:13,justifyContent:"flex-start" }}>
                  🏥 Log new injury
                </button>
                <button className="btn-ghost" onClick={()=>setPage("injuries")} style={{ fontSize:13,justifyContent:"flex-start" }}>
                  📋 View all injuries
                </button>
                <button className="btn-ghost" onClick={()=>setPage("teams")} style={{ fontSize:13,justifyContent:"flex-start" }}>
                  👥 Team health overview
                </button>
              </div>
              <div style={{ marginTop:14,padding:"10px 12px",background:C.amberLight,borderRadius:8,fontSize:12,color:C.amber }}>
                🔔 Team Managers are notified instantly when you log an injury for one of their players.
              </div>
            </div>
          </div>
        </div>
      )}
      {page==="log"      && (showInjuryForm ? <LogInjuryForm/> : (
        <div className="fade-up" style={{ textAlign:"center",padding:"60px 20px" }}>
          <div style={{ fontSize:56,marginBottom:16 }}>🏥</div>
          <div style={{ fontFamily:"'Syne'",fontSize:20,fontWeight:700,color:C.text,marginBottom:8 }}>Log an Injury</div>
          <p style={{ fontSize:14,color:C.textSoft,marginBottom:20 }}>Record a player injury with severity and clinical notes</p>
          <button className="btn-primary" onClick={()=>setShowInjuryForm(true)}>+ Log injury now</button>
        </div>
      ))}
      {page==="injuries" && <InjuryListPage/>}
      {page==="teams"    && <MedicTeamHealthPage injuries={injuries}/>}
    </DashboardShell>
  );
};


export default function App() {
  const [view, setView] = useState("landing");
  const [user, setUser] = useState(null);
  const [liveMatches, setLiveMatches]     = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleNotify = (notif) => {
    setNotifications(prev => [{ id: Date.now(), ...notif, read: false }, ...prev]);
  };

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
      {view==="public"           && <PublicPage onBack={()=>setView("landing")} liveMatches={liveMatches}/>}
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
          {user.role==="team_manager"          && <TeamManagerDashboard         {...p} notifications={notifications}/>}
          {user.role==="data_entry"            && <DataEntryDashboard           {...p} liveMatches={liveMatches} setLiveMatches={setLiveMatches}/>}
          {user.role==="master_referee"        && <MasterRefereeDashboard       {...p} onNotify={handleNotify}/>}
          {user.role==="medic"                 && <MedicDashboard               {...p} onNotify={handleNotify}/>}
        </>
      )}
    </>
  );
}
