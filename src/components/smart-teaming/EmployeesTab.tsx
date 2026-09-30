import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Target, Check, X, ClipboardCheck, Plus } from "lucide-react";
import { EmployeeProfile, getProfile, type EmployeeDetail } from "./EmployeeProfile";

const initiatives = [
  { id: "dt2025", name: "Digital Transformation 2025" },
  { id: "cxo", name: "Customer Experience Overhaul" },
  { id: "dpm", name: "Data Platform Migration" },
  { id: "ais", name: "AI-Powered Support" },
];

const allEmployees = [
  { name: "Sarah Chen", role: "Data Scientist", department: "Engineering", skills: 12, proficiency: 87, availability: 85 },
  { name: "Marcus Johnson", role: "Product Manager", department: "Product", skills: 9, proficiency: 82, availability: 40 },
  { name: "Aisha Patel", role: "UX Designer", department: "Design", skills: 11, proficiency: 91, availability: 90 },
  { name: "David Kim", role: "Software Engineer", department: "Engineering", skills: 15, proficiency: 88, availability: 75 },
  { name: "Elena Rodriguez", role: "Business Analyst", department: "Operations", skills: 8, proficiency: 79, availability: 95 },
  { name: "James Wright", role: "DevOps Engineer", department: "Engineering", skills: 10, proficiency: 84, availability: 80 },
  { name: "Priya Sharma", role: "Data Analyst", department: "Operations", skills: 7, proficiency: 76, availability: 60 },
  { name: "Tom Baker", role: "Frontend Developer", department: "Engineering", skills: 13, proficiency: 90, availability: 72 },
];

export function EmployeesTab({ initialTalentPool }: { initialTalentPool: boolean }) {
  const [filter, setFilter] = useState<"all" | "talent-pool">(initialTalentPool ? "talent-pool" : "all");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [showAssessPanel, setShowAssessPanel] = useState(false);
  const [assessRatings, setAssessRatings] = useState<Record<string, number>>({});
  const [assessNotes, setAssessNotes] = useState("");
  const [assessSaved, setAssessSaved] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [chosenInitiative, setChosenInitiative] = useState<string | null>(null);
  const [assigned, setAssigned] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<EmployeeDetail | null>(null);

  // For assessment, pick the first selected employee
  const assessEmployee = useMemo(() => {
    if (selected.size === 0) return null;
    const name = [...selected][0];
    return allEmployees.find((e) => e.name === name) ?? null;
  }, [selected]);

  const departments = useMemo(() => [...new Set(allEmployees.map((e) => e.department))], []);

  const employees = useMemo(() => {
    let list = allEmployees;
    if (filter === "talent-pool") list = list.filter((e) => e.availability >= 70);
    if (roleFilter !== "all") list = list.filter((e) => e.department === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, roleFilter, search]);

  const toggleOne = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === employees.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(employees.map((e) => e.name)));
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setShowAssignPanel(false);
    setChosenInitiative(null);
    setAssigned(false);
  };

  const handleAssign = () => {
    setAssigned(true);
    setTimeout(() => {
      clearSelection();
    }, 2000);
  };

  const allChecked = employees.length > 0 && selected.size === employees.length;
  const someChecked = selected.size > 0 && selected.size < employees.length;

  return (
    <div className="relative">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {filter === "talent-pool" ? "Talent pool" : "Employee directory"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "talent-pool"
                  ? `${employees.length} employees with 70%+ availability ready for immediate deployment`
                  : "Select employees and assign them to dynamic teams directly."}
              </p>
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-xl shrink-0">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All employees
              </button>
              <button
                onClick={() => setFilter("talent-pool")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === "talent-pool" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Talent pool
              </button>
            </div>
          </div>

          {/* Search & Department Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, or department…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-12 px-4 py-3">
                <button
                  onClick={toggleAll}
                  aria-label={allChecked ? "Deselect all employees" : "Select all employees"}
                  aria-pressed={allChecked}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    allChecked
                      ? "bg-primary border-primary"
                      : someChecked
                      ? "border-primary bg-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {allChecked && <Check size={12} className="text-primary-foreground" />}
                  {someChecked && !allChecked && <div className="w-2.5 h-0.5 bg-primary rounded-full" />}
                </button>
              </th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Department</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Skills</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Proficiency</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Availability</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No employees match your search criteria.
                </td>
              </tr>
            ) : (
              employees.map((e) => {
                const isChecked = selected.has(e.name);
                return (
                  <tr
                    key={e.name}
                    onClick={() => setViewingEmployee(e)}
                    className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                      isChecked ? "bg-primary/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="w-12 px-4 py-4" onClick={(ev) => { ev.stopPropagation(); toggleOne(e.name); }}>
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isChecked ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {isChecked && <Check size={12} className="text-primary-foreground" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{e.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{e.role}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-muted text-foreground">
                        {e.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">{e.skills}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full max-w-[120px]">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${e.proficiency}%` }} />
                        </div>
                        <span className="text-foreground font-medium">{e.proficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-sm font-semibold ${
                        e.availability >= 70 ? "bg-success-dark/10 text-success-foreground" : "text-muted-foreground"
                      }`}>
                        {e.availability}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-6 left-0 right-0 z-50 flex justify-center"
          >
            <div className="bg-foreground text-background rounded-2xl shadow-lg px-6 py-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm font-semibold">{selected.size} selected</span>
              </div>
              <div className="w-px h-5 bg-background/20" />
              <button
                onClick={() => { setShowAssignPanel(true); setAssigned(false); setChosenInitiative(null); }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Target size={14} /> Assign to dynamic team
              </button>
              {selected.size === 1 && (
                <button
                  onClick={() => {
                    setShowAssessPanel(true);
                    setAssessSaved(false);
                    setAssessNotes("");
                    setNewSkillName("");
                    if (assessEmployee) {
                      const profile = getProfile(assessEmployee);
                      const initial: Record<string, number> = {};
                      profile.topSkills.forEach((s) => { initial[s.name] = s.level; });
                      setAssessRatings(initial);
                    }
                  }}
                  className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <ClipboardCheck size={14} /> Assess user
                </button>
              )}
              <button
                onClick={clearSelection}
                aria-label="Clear selection"
                className="p-1.5 rounded-lg hover:bg-background/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign to Dynamic Team Panel */}
      <AnimatePresence>
        {showAssignPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
            onClick={() => setShowAssignPanel(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6 space-y-5"
            >
              {assigned ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success-dark/10 flex items-center justify-center mx-auto">
                    <Check size={24} className="text-success-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Team assembled!</h3>
                  <p className="text-sm text-muted-foreground">
                    {selected.size} members assigned to {initiatives.find((i) => i.id === chosenInitiative)?.name}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Assign to dynamic team</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add {selected.size} selected employee{selected.size > 1 ? "s" : ""} to a dynamic team
                    </p>
                  </div>

                  <div className="space-y-2">
                    {initiatives.map((init) => {
                      const isChosen = chosenInitiative === init.id;
                      return (
                        <button
                          key={init.id}
                          onClick={() => setChosenInitiative(init.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            isChosen
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {init.name}
                            {isChosen && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check size={12} className="text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected employees preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {[...selected].slice(0, 4).map((name) => (
                      <span key={name} className="px-2.5 py-1 rounded-full text-sm font-medium bg-muted text-foreground">
                        {name}
                      </span>
                    ))}
                    {selected.size > 4 && (
                      <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                        +{selected.size - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowAssignPanel(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssign}
                      disabled={!chosenInitiative}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Target size={14} /> Assign team
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Employee Profile Sheet */}
      <AnimatePresence>
        {viewingEmployee && (
          <EmployeeProfile employee={viewingEmployee} onClose={() => setViewingEmployee(null)} />
        )}
      </AnimatePresence>

      {/* Assess User Modal */}
      <AnimatePresence>
        {showAssessPanel && assessEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
            onClick={() => setShowAssessPanel(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              {assessSaved ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success-dark/10 flex items-center justify-center mx-auto">
                    <Check size={24} className="text-success-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Assessment saved!</h3>
                  <p className="text-sm text-muted-foreground">
                    Skill ratings for {assessEmployee.name} have been updated.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <ClipboardCheck size={18} className="text-primary" /> Assess skills
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rate {assessEmployee.name}'s proficiency for each skill
                    </p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(assessRatings).map(([skillName, rating]) => (
                      <div key={skillName} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{skillName}</span>
                          <span className="text-sm font-semibold text-primary">{rating}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={rating}
                          onChange={(e) =>
                            setAssessRatings((prev) => ({ ...prev, [skillName]: Number(e.target.value) }))
                          }
                          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Advanced</span>
                          <span>Expert</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new skill */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground tracking-wide">Add a skill</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const trimmed = newSkillName.trim();
                            if (trimmed && !assessRatings[trimmed]) {
                              setAssessRatings((prev) => ({ ...prev, [trimmed]: 50 }));
                              setNewSkillName("");
                            }
                          }
                        }}
                        placeholder="e.g. Leadership, Agile…"
                        maxLength={60}
                        className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <button
                        onClick={() => {
                          const trimmed = newSkillName.trim();
                          if (trimmed && !assessRatings[trimmed]) {
                            setAssessRatings((prev) => ({ ...prev, [trimmed]: 50 }));
                            setNewSkillName("");
                          }
                        }}
                        disabled={!newSkillName.trim() || !!assessRatings[newSkillName.trim()]}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Notes / comments */}
                  <div className="space-y-2">
                    <label htmlFor="assess-notes" className="text-sm font-semibold text-muted-foreground tracking-wide">
                      Leader notes
                    </label>
                    <textarea
                      id="assess-notes"
                      value={assessNotes}
                      onChange={(e) => setAssessNotes(e.target.value)}
                      placeholder="Add qualitative feedback, strengths, growth areas…"
                      maxLength={1000}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{assessNotes.length}/1000</p>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => setShowAssessPanel(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setAssessSaved(true);
                        setTimeout(() => {
                          setShowAssessPanel(false);
                        }, 2000);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Check size={14} /> Save assessment
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
