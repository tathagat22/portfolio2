"use client";

import { useState } from "react";

const SKILL_ICONS: Record<string, string> = {
  "Autodesk Maya": "M",
  "Blender": "B",
  "Houdini": "H",
  "3ds Max": "3D",
  "AutoCAD": "AC",
  "Substance Painter": "SP",
  "Mudbox": "MB",
  "Adobe After Effects": "AE",
  "Adobe Photoshop": "PS",
  "Unreal Engine": "UE",
};

const SKILLS = [
  { name: "Autodesk Maya", category: "3D & Modeling", proficiency: 5 },
  { name: "Blender", category: "3D & Modeling", proficiency: 4 },
  { name: "Houdini", category: "3D & Modeling", proficiency: 3 },
  { name: "3ds Max", category: "3D & Modeling", proficiency: 3 },
  { name: "AutoCAD", category: "3D & Modeling", proficiency: 3 },
  { name: "Substance Painter", category: "Texturing", proficiency: 5 },
  { name: "Mudbox", category: "Texturing", proficiency: 3 },
  { name: "Adobe After Effects", category: "Compositing", proficiency: 4 },
  { name: "Adobe Photoshop", category: "Compositing", proficiency: 4 },
  { name: "Unreal Engine", category: "Game Engines", proficiency: 3 },
];

const CATEGORIES = ["3D & Modeling", "Texturing", "Compositing", "Game Engines"];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="relative py-24 md:py-40 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20">
          <p className="font-body text-sm text-[#888] tracking-[0.3em] uppercase mb-3">
            Toolkit
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Skills &amp;
            <br />
            <span style={{ color: "#00f0ff" }}>Tools</span>
          </h2>
        </div>

        {/* Skills by Category */}
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {CATEGORIES.map((category) => {
            const skillsInCategory = SKILLS.filter((s) => s.category === category);
            return (
              <div key={category}>
                {/* Category Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                  <h3 className="font-body" style={{ fontSize: "11px", color: "#555", letterSpacing: "0.3em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {category}
                  </h3>
                  <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.1)" }} />
                </div>

                {/* Cards Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "16px",
                }}>
                  {skillsInCategory.map((skill) => {
                    const isHovered = hoveredSkill === skill.name;
                    return (
                      <div
                        key={skill.name}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        style={{
                          background: isHovered ? "rgba(0, 240, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
                          border: isHovered ? "1px solid rgba(0, 240, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.06)",
                          borderRadius: "12px",
                          padding: "20px",
                          cursor: "default",
                          transition: "all 0.4s ease",
                          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                          boxShadow: isHovered ? "0 20px 40px rgba(0, 240, 255, 0.08)" : "none",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          background: isHovered ? "rgba(0, 240, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "16px",
                          transition: "all 0.4s ease",
                        }}>
                          <span className="font-display" style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: isHovered ? "#00f0ff" : "rgba(255,255,255,0.4)",
                            transition: "color 0.4s ease",
                          }}>
                            {SKILL_ICONS[skill.name] || skill.name.charAt(0)}
                          </span>
                        </div>

                        {/* Name */}
                        <p className="font-body" style={{
                          fontSize: "14px",
                          color: "#fff",
                          fontWeight: 500,
                          marginBottom: "16px",
                          lineHeight: 1.3,
                        }}>
                          {skill.name}
                        </p>

                        {/* Proficiency Bar */}
                        <div style={{
                          width: "100%",
                          height: "6px",
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${(skill.proficiency / 5) * 100}%`,
                            height: "100%",
                            borderRadius: "99px",
                            background: isHovered
                              ? "linear-gradient(90deg, #00f0ff, #8b5cf6)"
                              : "linear-gradient(90deg, #00f0ff, rgba(0,240,255,0.4))",
                            transition: "all 0.6s ease",
                          }} />
                        </div>

                        {/* Label */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "8px",
                        }}>
                          <span className="font-body" style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Proficiency
                          </span>
                          <span className="font-body" style={{
                            fontSize: "10px",
                            fontWeight: 500,
                            color: isHovered ? "#00f0ff" : "#888",
                            transition: "color 0.4s ease",
                          }}>
                            {skill.proficiency}/5
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
