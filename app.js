// ============================================
//  IR REPORT GENERATOR — CORE APPLICATION
// ============================================

"use strict";

// ---- DATA STORE ----
const store = {
  findings: {
    siem: [],
    edr: [],
    ids: [],
    firewall: [],
    email: [],
    waf: [],
    threat_intel: [],
    custom: [],
    forensics: [],
  },
  timeline: [],
  iocs: [],
  mitre: [],
  custody: [],
  forensicsExams: [],
};

const TOOL_LABELS = {
  siem: "SIEM",
  edr: "EDR / XDR",
  ids: "IDS / IPS",
  firewall: "Firewall",
  email: "Email Security",
  waf: "WAF",
  threat_intel: "Threat Intelligence",
  custom: "Other Tools",
  forensics: "Digital Forensics",
};

// ---- FIELD MAPPINGS per tool type ----
const TOOL_FIELDS = {
  siem: [
    "Tool Name",
    "Alert / Rule Name",
    "Severity",
    "Timestamp",
    "Source IP",
    "Destination IP",
    "Action Taken",
    "User Involved",
    "Raw Log / Evidence",
    "Analysis Notes",
  ],
  edr: [
    "Tool Name",
    "Detection Name",
    "Severity",
    "Timestamp",
    "Hostname / Endpoint",
    "Process Name",
    "File Hash (SHA256)",
    "Action Taken",
    "Raw Log / Evidence",
    "Analysis Notes",
  ],
  ids: [
    "Tool Name",
    "Signature / Rule",
    "Severity",
    "Timestamp",
    "Source IP:Port",
    "Destination IP:Port",
    "Protocol",
    "Action",
    "Raw Log / Packet Data",
    "Analysis Notes",
  ],
  firewall: [
    "Tool Name",
    "Rule / Policy Name",
    "Severity",
    "Timestamp",
    "Source IP / Zone",
    "Destination IP / Zone",
    "Port / Service",
    "Action",
    "Raw Log / Evidence",
    "Analysis Notes",
  ],
  email: [
    "Tool Name",
    "Alert / Detection",
    "Severity",
    "Timestamp",
    "Sender",
    "Recipient(s)",
    "Subject",
    "Action",
    "Email Headers / Evidence",
    "Analysis Notes",
  ],
  waf: [
    "Tool Name",
    "Rule / Attack Type",
    "Severity",
    "Timestamp",
    "Source IP",
    "Target URL / Path",
    "HTTP Method",
    "Action",
    "Request Payload / Log",
    "Analysis Notes",
  ],
  threat_intel: [
    "Source",
    "Intelligence Summary",
    "Confidence",
    "Date Retrieved",
    "Indicator Value",
    "Indicator Type",
    "Associated Threat Group",
    "Severity",
    "Full Intel Report / Evidence",
    "Analysis Notes",
  ],
  custom: [
    "Tool / Source Name",
    "Finding Title",
    "Severity",
    "Timestamp",
    "Category",
    "Affected Resource",
    "Action Taken",
    "Severity Classification",
    "Raw Data / Evidence",
    "Analysis Notes",
  ],
  forensics: [
    "Tool Name",
    "Examination Type",
    "Severity",
    "Timestamp",
    "Evidence Source",
    "Examiner Name",
    "Artifacts Found",
    "Action Taken",
    "Raw Output / Evidence",
    "Analysis Notes",
  ],
};

// ============================================
//  SIDEBAR NAVIGATION
// ============================================

function toggleSidebar() {
  document.querySelector(".app-layout").classList.toggle("sidebar-collapsed");
}

function initNavigation() {
  document.querySelectorAll(".sidebar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".sidebar-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".main-section")
        .forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
      // Close sidebar on mobile after selection
      if (window.innerWidth <= 768) {
        document.querySelector(".app-layout").classList.add("sidebar-collapsed");
      }
    });
  });
}

// Tool tabs navigation
document.querySelectorAll("#toolTabsNav .tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll("#toolTabsNav .tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document
      .getElementById("panel-" + btn.dataset.tool)
      .classList.add("active");
  });
});

// ============================================
//  TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================
//  FINDINGS MANAGEMENT
// ============================================

function addFinding(toolType) {
  const form = document.getElementById("form-" + toolType);
  const inputs = form.querySelectorAll("input, select, textarea");
  const fields = TOOL_FIELDS[toolType];
  const finding = {};
  let hasData = false;

  inputs.forEach((input, i) => {
    if (i < fields.length) {
      finding[fields[i]] = input.value.trim();
      if (input.value.trim()) hasData = true;
    }
  });

  if (!hasData) {
    showToast("Please fill in at least one field.", "error");
    return;
  }

  finding._id = Date.now() + Math.random();
  store.findings[toolType].push(finding);

  // Clear form
  inputs.forEach((input) => {
    if (input.tagName === "SELECT") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });

  renderFindings(toolType);
  updateStats();
  updateTabCounts();
  showToast(`${TOOL_LABELS[toolType]} finding added!`, "success");
  saveAutoBackup();
}

function removeFinding(toolType, id) {
  store.findings[toolType] = store.findings[toolType].filter(
    (f) => f._id !== id,
  );
  renderFindings(toolType);
  updateStats();
  updateTabCounts();
  saveAutoBackup();
}

function renderFindings(toolType) {
  const container = document.getElementById("findings-" + toolType);
  const findings = store.findings[toolType];

  if (findings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No findings added yet for ${TOOL_LABELS[toolType]}.</p>
      </div>`;
    return;
  }

  container.innerHTML = findings
    .map((f, idx) => {
      const fields = Object.entries(f).filter(([k]) => k !== "_id");
      const severityClass = (f["Severity"] || "").toLowerCase();
      return `
      <div class="finding-item severity-${severityClass}">
        <div class="finding-header">
          <span class="finding-number">#${idx + 1} — ${TOOL_LABELS[toolType]}</span>
          <button class="remove-finding" onclick="removeFinding('${toolType}', ${f._id})" title="Remove finding">✕</button>
        </div>
        <div class="form-grid" style="gap: 8px;">
          ${fields
            .map(([key, val]) => {
              if (!val) return "";
              const isLong = val.length > 100;
              return `
              <div class="form-group${isLong ? " full-width" : ""}" style="pointer-events:none;">
                <label>${key}</label>
                ${
                  isLong
                    ? `<div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green); background: var(--bg-input); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap; max-height: 150px; overflow-y: auto;">${escapeHtml(val)}</div>`
                    : `<div style="font-size: 0.88rem; color: var(--text-primary); padding: 4px 0;">${escapeHtml(val)}</div>`
                }
              </div>`;
            })
            .join("")}
        </div>
      </div>`;
    })
    .join("");
}

// ============================================
//  STATS
// ============================================

function updateStats() {
  const all = Object.values(store.findings).flat();
  const sev = (s) =>
    all.filter((f) => (f["Severity"] || "").toLowerCase() === s).length;

  document.getElementById("statTotal").textContent = all.length;
  document.getElementById("statCritical").textContent = sev("critical");
  document.getElementById("statHigh").textContent = sev("high");
  document.getElementById("statMedium").textContent = sev("medium");
  document.getElementById("statLow").textContent = sev("low");

  // Animate stat change
  document.querySelectorAll(".stat-value").forEach((el) => {
    el.style.transform = "scale(1.2)";
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 200);
  });
}

function updateTabCounts() {
  Object.keys(store.findings).forEach((tool) => {
    const el = document.getElementById("count-" + tool);
    if (el) el.textContent = store.findings[tool].length;
  });
}

// ============================================
//  TIMELINE
// ============================================

function addTimelineEvent() {
  const time = document.getElementById("tlTime").value;
  const event = document.getElementById("tlEvent").value.trim();
  const source = document.getElementById("tlSource").value.trim();

  if (!event) {
    showToast("Please enter an event description.", "error");
    return;
  }

  store.timeline.push({
    _id: Date.now() + Math.random(),
    time: time || "Not specified",
    event,
    source: source || "Manual",
  });

  // Sort by time
  store.timeline.sort((a, b) => {
    if (a.time === "Not specified") return 1;
    if (b.time === "Not specified") return -1;
    return new Date(a.time) - new Date(b.time);
  });

  document.getElementById("tlTime").value = "";
  document.getElementById("tlEvent").value = "";
  document.getElementById("tlSource").value = "";

  renderTimeline();
  showToast("Timeline event added!", "success");
  saveAutoBackup();
}

function removeTimelineEvent(id) {
  store.timeline = store.timeline.filter((t) => t._id !== id);
  renderTimeline();
  saveAutoBackup();
}

function renderTimeline() {
  const container = document.getElementById("timelineList");
  const empty = document.getElementById("timelineEmpty");

  if (store.timeline.length === 0) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  container.innerHTML = store.timeline
    .map(
      (t) => `
    <div class="timeline-item">
      <div class="tl-time">${formatDateTime(t.time)}</div>
      <div class="tl-event">${escapeHtml(t.event)}</div>
      <div class="tl-source">Source: ${escapeHtml(t.source)}</div>
      <button class="remove-tl" onclick="removeTimelineEvent(${t._id})" title="Remove">✕</button>
    </div>
  `,
    )
    .join("");
}

// ============================================
//  IOCs
// ============================================

function addIOC() {
  const type = document.getElementById("iocType").value;
  const value = document.getElementById("iocValue").value.trim();
  const context = document.getElementById("iocContext").value.trim();

  if (!value) {
    showToast("Please enter an IOC value.", "error");
    return;
  }

  // Deduplicate
  if (store.iocs.some((i) => i.value === value && i.type === type)) {
    showToast("This IOC already exists.", "error");
    return;
  }

  store.iocs.push({
    _id: Date.now(),
    type,
    value,
    context: context || "Manual entry",
  });

  document.getElementById("iocValue").value = "";
  document.getElementById("iocContext").value = "";

  renderIOCs();
  showToast("IOC added!", "success");
  saveAutoBackup();
}

function removeIOC(id) {
  store.iocs = store.iocs.filter((i) => i._id !== id);
  renderIOCs();
  saveAutoBackup();
}

function renderIOCs() {
  const tbody = document.getElementById("iocTableBody");
  const empty = document.getElementById("iocEmpty");
  const table = document.getElementById("iocTable");

  if (store.iocs.length === 0) {
    tbody.innerHTML = "";
    empty.style.display = "block";
    table.style.display = "none";
    return;
  }

  empty.style.display = "none";
  table.style.display = "table";

  tbody.innerHTML = store.iocs
    .map((i) => {
      const badgeClass = getBadgeClass(i.type);
      return `
      <tr>
        <td><span class="ioc-type-badge ${badgeClass}">${escapeHtml(i.type)}</span></td>
        <td>${escapeHtml(i.value)}</td>
        <td style="font-family: var(--font-sans); color: var(--text-secondary);">${escapeHtml(i.context)}</td>
        <td><button class="ioc-remove" onclick="removeIOC(${i._id})">✕</button></td>
      </tr>`;
    })
    .join("");
}

function getBadgeClass(type) {
  const t = type.toLowerCase();
  if (t.includes("ip")) return "ip";
  if (t.includes("domain")) return "domain";
  if (t.includes("hash")) return "hash";
  if (t.includes("url")) return "url";
  if (t.includes("email")) return "email";
  return "file";
}

// ---- Auto-extract IOCs from all findings ----
function autoExtractIOCs() {
  const allText = Object.values(store.findings)
    .flat()
    .map((f) =>
      Object.values(f)
        .filter((v) => typeof v === "string")
        .join(" "),
    )
    .join(" ");

  let extracted = 0;

  // IPv4
  const ipRegex =
    /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b/g;
  const ips = [...new Set(allText.match(ipRegex) || [])];
  ips.forEach((ip) => {
    if (
      !["127.0.0.1", "0.0.0.0", "255.255.255.255"].includes(ip) &&
      !store.iocs.some((i) => i.value === ip)
    ) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "IP Address",
        value: ip,
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  // Domains (basic)
  const domainRegex =
    /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|net|org|io|cc|ru|cn|tk|ml|ga|info|biz|xyz|top|pw|win|bid|download|stream|racing|review|trade|party|date|science|click|link|gdn|men|loan|work)\b/gi;
  const domains = [...new Set(allText.match(domainRegex) || [])];
  domains.forEach((d) => {
    if (!store.iocs.some((i) => i.value === d.toLowerCase())) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "Domain",
        value: d.toLowerCase(),
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  // SHA256
  const sha256Regex = /\b[a-fA-F0-9]{64}\b/g;
  const sha256s = [...new Set(allText.match(sha256Regex) || [])];
  sha256s.forEach((h) => {
    if (!store.iocs.some((i) => i.value === h.toLowerCase())) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "File Hash (SHA256)",
        value: h.toLowerCase(),
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  // MD5
  const md5Regex = /\b[a-fA-F0-9]{32}\b/g;
  const md5s = [...new Set(allText.match(md5Regex) || [])].filter(
    (h) => !sha256s.some((s) => s.includes(h)),
  );
  md5s.forEach((h) => {
    if (!store.iocs.some((i) => i.value === h.toLowerCase())) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "File Hash (MD5)",
        value: h.toLowerCase(),
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  // URLs
  const urlRegex = /https?:\/\/[^\s"'<>\)]+/gi;
  const urls = [...new Set(allText.match(urlRegex) || [])];
  urls.forEach((u) => {
    if (!store.iocs.some((i) => i.value === u)) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "URL",
        value: u,
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  // Emails
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  const emails = [...new Set(allText.match(emailRegex) || [])];
  emails.forEach((e) => {
    if (!store.iocs.some((i) => i.value === e.toLowerCase())) {
      store.iocs.push({
        _id: Date.now() + Math.random(),
        type: "Email Address",
        value: e.toLowerCase(),
        context: "Auto-extracted from findings",
      });
      extracted++;
    }
  });

  renderIOCs();
  if (extracted > 0) {
    showToast(`Extracted ${extracted} IOC(s) from findings!`, "success");
  } else {
    showToast("No new IOCs found in findings.", "info");
  }
  saveAutoBackup();
}

// ============================================
//  MITRE ATT&CK
// ============================================

function addMitre() {
  const tactic = document.getElementById("mitreTactic").value;
  const technique = document.getElementById("mitreTechnique").value.trim();

  if (!tactic && !technique) {
    showToast("Please select a tactic or enter a technique.", "error");
    return;
  }

  const label = technique
    ? `${tactic ? tactic + " → " : ""}${technique}`
    : tactic;

  if (store.mitre.some((m) => m.label === label)) {
    showToast("This mapping already exists.", "error");
    return;
  }

  store.mitre.push({ _id: Date.now(), tactic, technique, label });

  document.getElementById("mitreTactic").selectedIndex = 0;
  document.getElementById("mitreTechnique").value = "";

  renderMitre();
  showToast("MITRE ATT&CK mapping added!", "success");
  saveAutoBackup();
}

function removeMitre(id) {
  store.mitre = store.mitre.filter((m) => m._id !== id);
  renderMitre();
  saveAutoBackup();
}

function renderMitre() {
  const container = document.getElementById("mitreTagsList");
  const empty = document.getElementById("mitreEmpty");

  if (store.mitre.length === 0) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  container.innerHTML = store.mitre
    .map(
      (m) => `
    <span class="mitre-tag">
      ${escapeHtml(m.label)}
      <button class="remove-tag" onclick="removeMitre(${m._id})">✕</button>
    </span>
  `,
    )
    .join("");
}

// ============================================
//  CHAIN OF CUSTODY
// ============================================

function addCustodyEntry() {
  const evidenceId = document.getElementById("custodyEvidenceId").value.trim();
  const description = document.getElementById("custodyDescription").value.trim();
  const type = document.getElementById("custodyType").value;
  const collectedBy = document.getElementById("custodyCollectedBy").value.trim();
  const collectionDate = document.getElementById("custodyCollectionDate").value;
  const collectionLocation = document.getElementById("custodyCollectionLocation").value.trim();
  const hashValue = document.getElementById("custodyHashValue").value.trim();
  const hashType = document.getElementById("custodyHashType").value;
  const storageLocation = document.getElementById("custodyStorageLocation").value.trim();
  const currentCustodian = document.getElementById("custodyCurrentCustodian").value.trim();

  if (!evidenceId) {
    showToast("Please enter an Evidence ID.", "error");
    return;
  }

  store.custody.push({
    _id: Date.now(),
    evidenceId,
    description,
    type,
    collectedBy,
    collectionDate,
    collectionLocation,
    hashValue,
    hashType,
    storageLocation,
    currentCustodian,
    transfers: [],
  });

  // Clear form
  document.getElementById("custodyEvidenceId").value = "";
  document.getElementById("custodyDescription").value = "";
  document.getElementById("custodyType").selectedIndex = 0;
  document.getElementById("custodyCollectedBy").value = "";
  document.getElementById("custodyCollectionDate").value = "";
  document.getElementById("custodyCollectionLocation").value = "";
  document.getElementById("custodyHashValue").value = "";
  document.getElementById("custodyHashType").selectedIndex = 0;
  document.getElementById("custodyStorageLocation").value = "";
  document.getElementById("custodyCurrentCustodian").value = "";

  renderCustody();
  showToast("Evidence added to chain of custody!", "success");
  saveAutoBackup();
}

function removeCustodyEntry(id) {
  store.custody = store.custody.filter((c) => c._id !== id);
  renderCustody();
  saveAutoBackup();
}

function addTransferLog(evidenceId) {
  const from = document.getElementById(`transferFrom-${evidenceId}`).value.trim();
  const to = document.getElementById(`transferTo-${evidenceId}`).value.trim();
  const date = document.getElementById(`transferDate-${evidenceId}`).value;
  const purpose = document.getElementById(`transferPurpose-${evidenceId}`).value.trim();
  const notes = document.getElementById(`transferNotes-${evidenceId}`).value.trim();

  if (!from || !to) {
    showToast("Please enter both From and To custodians.", "error");
    return;
  }

  const entry = store.custody.find((c) => c._id === evidenceId);
  if (entry) {
    entry.transfers.push({ from, to, date: date || "Not specified", purpose, notes });
    entry.currentCustodian = to;
    renderCustody();
    showToast("Transfer log added!", "success");
    saveAutoBackup();
  }
}

function renderCustody() {
  const container = document.getElementById("custodyList");
  const empty = document.getElementById("custodyEmpty");

  if (store.custody.length === 0) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  container.innerHTML = store.custody
    .map((c) => {
      const transfersHtml = c.transfers.length
        ? `
        <div class="custody-transfers">
          <h4>Transfer Log</h4>
          <table class="custody-table">
            <thead><tr><th>From</th><th>To</th><th>Date</th><th>Purpose</th><th>Notes</th></tr></thead>
            <tbody>
              ${c.transfers
                .map(
                  (t) => `
                <tr>
                  <td>${escapeHtml(t.from)}</td>
                  <td>${escapeHtml(t.to)}</td>
                  <td>${formatDateTime(t.date)}</td>
                  <td>${escapeHtml(t.purpose)}</td>
                  <td>${escapeHtml(t.notes)}</td>
                </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>`
        : "";

      return `
      <div class="custody-item">
        <div class="custody-header">
          <div class="custody-meta">
            <span class="custody-id">${escapeHtml(c.evidenceId)}</span>
            <span class="custody-type-badge">${escapeHtml(c.type)}</span>
            <span class="custody-custodian">👤 ${escapeHtml(c.currentCustodian || "Unassigned")}</span>
          </div>
          <button class="remove-finding" onclick="removeCustodyEntry(${c._id})" title="Remove">✕</button>
        </div>
        <div class="custody-body">
          <div class="report-meta-grid" style="margin: 0;">
            ${c.description ? `<div class="report-meta-item"><div class="meta-label">Description</div><div class="meta-value">${escapeHtml(c.description)}</div></div>` : ""}
            ${c.collectedBy ? `<div class="report-meta-item"><div class="meta-label">Collected By</div><div class="meta-value">${escapeHtml(c.collectedBy)}</div></div>` : ""}
            ${c.collectionDate ? `<div class="report-meta-item"><div class="meta-label">Collection Date</div><div class="meta-value">${formatDateTime(c.collectionDate)}</div></div>` : ""}
            ${c.collectionLocation ? `<div class="report-meta-item"><div class="meta-label">Collection Location</div><div class="meta-value">${escapeHtml(c.collectionLocation)}</div></div>` : ""}
            ${c.hashValue ? `<div class="report-meta-item"><div class="meta-label">Hash (${escapeHtml(c.hashType)})</div><div class="meta-value" style="font-family: var(--font-mono); font-size: 0.78rem;">${escapeHtml(c.hashValue)}</div></div>` : ""}
            ${c.storageLocation ? `<div class="report-meta-item"><div class="meta-label">Storage Location</div><div class="meta-value">${escapeHtml(c.storageLocation)}</div></div>` : ""}
          </div>
          ${transfersHtml}
          <div class="custody-transfer-form">
            <h4>Add Transfer</h4>
            <div class="form-grid" style="gap: 10px;">
              <div class="form-group"><input type="text" id="transferFrom-${c._id}" placeholder="From" /></div>
              <div class="form-group"><input type="text" id="transferTo-${c._id}" placeholder="To" /></div>
              <div class="form-group"><input type="datetime-local" id="transferDate-${c._id}" /></div>
              <div class="form-group"><input type="text" id="transferPurpose-${c._id}" placeholder="Purpose" /></div>
              <div class="form-group full-width"><textarea id="transferNotes-${c._id}" rows="2" placeholder="Notes..."></textarea></div>
              <div class="form-group full-width">
                <button class="btn btn-secondary btn-sm" onclick="addTransferLog(${c._id})">➕ Log Transfer</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

// ============================================
//  FORENSICS EXAMINATIONS
// ============================================

function addForensicsExam() {
  const tool = document.getElementById("forensicsTool").value;
  const type = document.getElementById("forensicsType").value;
  const source = document.getElementById("forensicsSource").value.trim();
  const examiner = document.getElementById("forensicsExaminer").value.trim();
  const date = document.getElementById("forensicsDate").value;
  const artifacts = document.getElementById("forensicsArtifacts").value.trim();
  const output = document.getElementById("forensicsOutput").value.trim();
  const notes = document.getElementById("forensicsNotes").value.trim();

  if (!tool && !source) {
    showToast("Please enter at least a tool or evidence source.", "error");
    return;
  }

  store.forensicsExams.push({
    _id: Date.now(),
    tool,
    type,
    source,
    examiner,
    date,
    artifacts,
    output,
    notes,
  });

  document.getElementById("forensicsTool").selectedIndex = 0;
  document.getElementById("forensicsType").selectedIndex = 0;
  document.getElementById("forensicsSource").value = "";
  document.getElementById("forensicsExaminer").value = "";
  document.getElementById("forensicsDate").value = "";
  document.getElementById("forensicsArtifacts").value = "";
  document.getElementById("forensicsOutput").value = "";
  document.getElementById("forensicsNotes").value = "";

  renderForensicsExams();
  showToast("Forensics examination added!", "success");
  saveAutoBackup();
}

function removeForensicsExam(id) {
  store.forensicsExams = store.forensicsExams.filter((f) => f._id !== id);
  renderForensicsExams();
  saveAutoBackup();
}

function renderForensicsExams() {
  const container = document.getElementById("forensicsList");
  const empty = document.getElementById("forensicsEmpty");

  if (store.forensicsExams.length === 0) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  container.innerHTML = store.forensicsExams
    .map((f, idx) => {
      return `
      <div class="finding-item">
        <div class="finding-header">
          <span class="finding-number">#${idx + 1} — ${escapeHtml(f.tool || "Forensics")} (${escapeHtml(f.type || "Unknown")})</span>
          <button class="remove-finding" onclick="removeForensicsExam(${f._id})" title="Remove">✕</button>
        </div>
        <div class="form-grid" style="gap: 8px;">
          ${f.source ? `<div class="form-group"><label>Evidence Source</label><div style="font-size: 0.88rem; color: var(--text-primary); padding: 4px 0;">${escapeHtml(f.source)}</div></div>` : ""}
          ${f.examiner ? `<div class="form-group"><label>Examiner</label><div style="font-size: 0.88rem; color: var(--text-primary); padding: 4px 0;">${escapeHtml(f.examiner)}</div></div>` : ""}
          ${f.date ? `<div class="form-group"><label>Examination Date</label><div style="font-size: 0.88rem; color: var(--text-primary); padding: 4px 0;">${formatDateTime(f.date)}</div></div>` : ""}
          ${f.artifacts ? `<div class="form-group full-width"><label>Artifacts Found</label><div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green); background: var(--bg-input); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap; max-height: 150px; overflow-y: auto;">${escapeHtml(f.artifacts)}</div></div>` : ""}
          ${f.output ? `<div class="form-group full-width"><label>Raw Output</label><div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green); background: var(--bg-input); padding: 10px; border-radius: var(--radius-sm); white-space: pre-wrap; max-height: 150px; overflow-y: auto;">${escapeHtml(f.output)}</div></div>` : ""}
          ${f.notes ? `<div class="form-group full-width"><label>Analysis Notes</label><div style="font-size: 0.88rem; color: var(--text-primary); padding: 4px 0;">${escapeHtml(f.notes)}</div></div>` : ""}
        </div>
      </div>`;
    })
    .join("");
}

// ============================================
//  REPORT GENERATION
// ============================================

function generateReport() {
  const incidentId =
    document.getElementById("incidentId").value.trim() || "N/A";
  const title =
    document.getElementById("incidentTitle").value.trim() ||
    "Untitled Incident";
  const date = document.getElementById("incidentDate").value;
  const resolved = document.getElementById("incidentResolved").value;
  const analyst = document.getElementById("analystName").value.trim() || "N/A";
  const team = document.getElementById("teamName").value.trim();
  const severity =
    document.getElementById("incidentSeverity").value || "Not classified";
  const status = document.getElementById("incidentStatus").value;
  const category = document.getElementById("incidentCategory").value;
  const assets = document.getElementById("affectedAssets").value.trim();
  const execSummary = document.getElementById("execSummary").value.trim();
  const containment = document
    .getElementById("containmentActions")
    .value.trim();
  const eradication = document
    .getElementById("eradicationActions")
    .value.trim();
  const recovery = document.getElementById("recoveryActions").value.trim();
  const recommendations = document
    .getElementById("recommendations")
    .value.trim();

  const allFindings = Object.values(store.findings).flat();

  // Auto-generate executive summary if not provided
  let summary = execSummary;
  if (!summary) {
    const toolsUsed = Object.entries(store.findings)
      .filter(([, arr]) => arr.length > 0)
      .map(([k]) => TOOL_LABELS[k]);

    summary =
      `This incident response report documents ${category || "a security incident"} ` +
      `classified as ${severity} severity. ` +
      `A total of ${allFindings.length} finding(s) were recorded across ${toolsUsed.length} security tool(s)` +
      `${toolsUsed.length > 0 ? " (" + toolsUsed.join(", ") + ")" : ""}. ` +
      `${store.iocs.length} indicator(s) of compromise were identified. ` +
      `${store.timeline.length} timeline event(s) were recorded. ` +
      `${store.custody.length} evidence item(s) tracked in chain of custody. ` +
      `${store.forensicsExams.length} digital forensics examination(s) conducted. ` +
      `The incident was detected on ${date ? formatDateTime(date) : "an unspecified date"} ` +
      `and is currently ${status}.` +
      `${assets ? " Affected assets include: " + assets + "." : ""}`;
  }

  const sevClass = severity.toLowerCase();

  // Build report HTML
  let html = `
    <h1>🛡️ Incident Response Report</h1>
    <div class="report-subtitle">
      ${escapeHtml(title)} &nbsp;|&nbsp; ${escapeHtml(incidentId)} &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}
    </div>

    <h2>1. Incident Overview</h2>
    <div class="report-meta-grid">
      <div class="report-meta-item">
        <div class="meta-label">Incident ID</div>
        <div class="meta-value">${escapeHtml(incidentId)}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Title</div>
        <div class="meta-value">${escapeHtml(title)}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Severity</div>
        <div class="meta-value"><span class="severity-badge ${sevClass}">${escapeHtml(severity)}</span></div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Status</div>
        <div class="meta-value">${escapeHtml(status)}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Category</div>
        <div class="meta-value">${escapeHtml(category || "Not specified")}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Date Detected</div>
        <div class="meta-value">${date ? formatDateTime(date) : "Not specified"}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Date Resolved</div>
        <div class="meta-value">${resolved ? formatDateTime(resolved) : "Ongoing"}</div>
      </div>
      <div class="report-meta-item">
        <div class="meta-label">Lead Analyst</div>
        <div class="meta-value">${escapeHtml(analyst)}</div>
      </div>
      ${
        team
          ? `
      <div class="report-meta-item">
        <div class="meta-label">Team</div>
        <div class="meta-value">${escapeHtml(team)}</div>
      </div>`
          : ""
      }
    </div>

    ${
      assets
        ? `
    <h3>Affected Assets</h3>
    <table>
      <thead><tr><th>#</th><th>Asset</th></tr></thead>
      <tbody>
        ${assets
          .split(",")
          .map(
            (a, i) =>
              `<tr><td>${i + 1}</td><td>${escapeHtml(a.trim())}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>`
        : ""
    }

    <h2>2. Executive Summary</h2>
    <p>${escapeHtml(summary)}</p>
  `;

  // MITRE ATT&CK
  if (store.mitre.length > 0) {
    html += `<h2>3. MITRE ATT&CK Mapping</h2>
      <div class="mitre-tags" style="pointer-events:none;">
        ${store.mitre.map((m) => `<span class="mitre-tag">${escapeHtml(m.label)}</span>`).join("")}
      </div>`;
  }

  // Timeline
  if (store.timeline.length > 0) {
    html += `<h2>${store.mitre.length > 0 ? "4" : "3"}. Incident Timeline</h2>
      <table>
        <thead><tr><th>Time</th><th>Event</th><th>Source</th></tr></thead>
        <tbody>
          ${store.timeline
            .map(
              (t) => `
            <tr>
              <td style="white-space:nowrap;">${formatDateTime(t.time)}</td>
              <td style="font-family: var(--font-sans);">${escapeHtml(t.event)}</td>
              <td>${escapeHtml(t.source)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  }

  // IOCs
  if (store.iocs.length > 0) {
    let sectionNum = 3;
    if (store.mitre.length > 0) sectionNum++;
    if (store.timeline.length > 0) sectionNum++;

    html += `<h2>${sectionNum}. Indicators of Compromise (${store.iocs.length})</h2>
      <table>
        <thead><tr><th>Type</th><th>Value</th><th>Context</th></tr></thead>
        <tbody>
          ${store.iocs
            .map(
              (i) => `
            <tr>
              <td><span class="ioc-type-badge ${getBadgeClass(i.type)}" style="pointer-events:none;">${escapeHtml(i.type)}</span></td>
              <td>${escapeHtml(i.value)}</td>
              <td style="font-family: var(--font-sans);">${escapeHtml(i.context)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  }

  // Chain of Custody
  if (store.custody.length > 0) {
    let sectionNum = 3;
    if (store.mitre.length > 0) sectionNum++;
    if (store.timeline.length > 0) sectionNum++;
    if (store.iocs.length > 0) sectionNum++;

    html += `<h2>${sectionNum}. Chain of Custody (${store.custody.length} Evidence Items)</h2>`;
    store.custody.forEach((c, idx) => {
      html += `<h3>Evidence #${idx + 1}: ${escapeHtml(c.evidenceId)} <span class="ioc-type-badge ${c.type === "Digital" ? "hash" : c.type === "Physical" ? "ip" : "file"}">${escapeHtml(c.type)}</span></h3>`;
      html += `<div class="report-meta-grid">`;
      if (c.description) html += `<div class="report-meta-item"><div class="meta-label">Description</div><div class="meta-value">${escapeHtml(c.description)}</div></div>`;
      if (c.collectedBy) html += `<div class="report-meta-item"><div class="meta-label">Collected By</div><div class="meta-value">${escapeHtml(c.collectedBy)}</div></div>`;
      if (c.collectionDate) html += `<div class="report-meta-item"><div class="meta-label">Collection Date</div><div class="meta-value">${formatDateTime(c.collectionDate)}</div></div>`;
      if (c.collectionLocation) html += `<div class="report-meta-item"><div class="meta-label">Collection Location</div><div class="meta-value">${escapeHtml(c.collectionLocation)}</div></div>`;
      if (c.hashValue) html += `<div class="report-meta-item"><div class="meta-label">Hash (${escapeHtml(c.hashType)})</div><div class="meta-value" style="font-family: var(--font-mono); font-size: 0.78rem;">${escapeHtml(c.hashValue)}</div></div>`;
      if (c.storageLocation) html += `<div class="report-meta-item"><div class="meta-label">Storage Location</div><div class="meta-value">${escapeHtml(c.storageLocation)}</div></div>`;
      if (c.currentCustodian) html += `<div class="report-meta-item"><div class="meta-label">Current Custodian</div><div class="meta-value">${escapeHtml(c.currentCustodian)}</div></div>`;
      html += `</div>`;

      if (c.transfers.length > 0) {
        html += `<h4>Transfer Log</h4><table><thead><tr><th>From</th><th>To</th><th>Date</th><th>Purpose</th><th>Notes</th></tr></thead><tbody>`;
        c.transfers.forEach((t) => {
          html += `<tr><td>${escapeHtml(t.from)}</td><td>${escapeHtml(t.to)}</td><td>${formatDateTime(t.date)}</td><td>${escapeHtml(t.purpose)}</td><td>${escapeHtml(t.notes)}</td></tr>`;
        });
        html += `</tbody></table>`;
      }
    });
  }

  // Forensics Examinations
  if (store.forensicsExams.length > 0) {
    let sectionNum = 3;
    if (store.mitre.length > 0) sectionNum++;
    if (store.timeline.length > 0) sectionNum++;
    if (store.iocs.length > 0) sectionNum++;
    if (store.custody.length > 0) sectionNum++;

    html += `<h2>${sectionNum}. Digital Forensics Examinations (${store.forensicsExams.length})</h2>`;
    store.forensicsExams.forEach((f, idx) => {
      html += `<h3>Examination #${idx + 1}: ${escapeHtml(f.tool || "Forensics")} — ${escapeHtml(f.type || "Unknown")}</h3>`;
      html += `<div class="report-meta-grid">`;
      if (f.source) html += `<div class="report-meta-item"><div class="meta-label">Evidence Source</div><div class="meta-value">${escapeHtml(f.source)}</div></div>`;
      if (f.examiner) html += `<div class="report-meta-item"><div class="meta-label">Examiner</div><div class="meta-value">${escapeHtml(f.examiner)}</div></div>`;
      if (f.date) html += `<div class="report-meta-item"><div class="meta-label">Examination Date</div><div class="meta-value">${formatDateTime(f.date)}</div></div>`;
      html += `</div>`;
      if (f.artifacts) html += `<p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px; font-weight: 600;">Artifacts Found</p><div class="log-block">${escapeHtml(f.artifacts)}</div>`;
      if (f.output) html += `<p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px; font-weight: 600;">Raw Output</p><div class="log-block">${escapeHtml(f.output)}</div>`;
      if (f.notes) html += `<p>${escapeHtml(f.notes)}</p>`;
    });
  }

  // Tool findings
  let sectionBase = 3;
  if (store.mitre.length > 0) sectionBase++;
  if (store.timeline.length > 0) sectionBase++;
  if (store.iocs.length > 0) sectionBase++;
  if (store.custody.length > 0) sectionBase++;
  if (store.forensicsExams.length > 0) sectionBase++;

  Object.entries(store.findings).forEach(([tool, findings]) => {
    if (findings.length === 0) return;

    html += `<h2>${sectionBase}. ${TOOL_LABELS[tool]} Findings (${findings.length})</h2>`;
    sectionBase++;

    findings.forEach((f, idx) => {
      const fields = Object.entries(f).filter(([k, v]) => k !== "_id" && v);
      const sevF = (f["Severity"] || "").toLowerCase();

      html += `<h3>Finding #${idx + 1} ${f["Severity"] ? `<span class="severity-badge ${sevF}">${f["Severity"]}</span>` : ""}</h3>`;

      // Structured fields
      const structuredFields = fields.filter(([, v]) => v.length <= 100);
      const longFields = fields.filter(([, v]) => v.length > 100);

      if (structuredFields.length > 0) {
        html += `<div class="report-meta-grid">
          ${structuredFields
            .map(
              ([k, v]) => `
            <div class="report-meta-item">
              <div class="meta-label">${escapeHtml(k)}</div>
              <div class="meta-value">${escapeHtml(v)}</div>
            </div>`,
            )
            .join("")}
        </div>`;
      }

      longFields.forEach(([k, v]) => {
        html += `<p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 4px; font-weight: 600;">${escapeHtml(k)}</p>
          <div class="log-block">${escapeHtml(v)}</div>`;
      });
    });
  });

  // Response Actions
  if (containment || eradication || recovery) {
    html += `<h2>${sectionBase}. Response Actions</h2>`;
    sectionBase++;

    if (containment) {
      html += `<h3>Containment</h3>${renderTextBlock(containment)}`;
    }
    if (eradication) {
      html += `<h3>Eradication</h3>${renderTextBlock(eradication)}`;
    }
    if (recovery) {
      html += `<h3>Recovery</h3>${renderTextBlock(recovery)}`;
    }
  }

  // Recommendations
  if (recommendations) {
    html += `<h2>${sectionBase}. Lessons Learned & Recommendations</h2>
      ${renderTextBlock(recommendations)}`;
    sectionBase++;
  }

  // Footer
  html += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center;">
      <p style="color: var(--text-muted); font-size: 0.8rem;">
        Report generated by IR Report Generator &nbsp;|&nbsp; ${new Date().toLocaleString()} &nbsp;|&nbsp; CONFIDENTIAL
      </p>
    </div>`;

  document.getElementById("reportOutput").innerHTML = html;
  document.getElementById("exportBar").style.display = "flex";
  showToast("Report generated successfully!", "success");
}

function renderTextBlock(text) {
  // If text starts with - or *, render as list
  const lines = text.split("\n").filter((l) => l.trim());
  const isList = lines.every(
    (l) =>
      l.trim().startsWith("-") ||
      l.trim().startsWith("*") ||
      l.trim().match(/^\d+\./),
  );

  if (isList) {
    return `<ul style="margin: 8px 0 8px 20px; color: var(--text-secondary);">
      ${lines.map((l) => `<li style="margin-bottom: 4px;">${escapeHtml(l.replace(/^[-*\d.]+\s*/, ""))}</li>`).join("")}
    </ul>`;
  }

  return `<p>${escapeHtml(text)}</p>`;
}

// ============================================
//  EXPORT FUNCTIONS
// ============================================

function printReport() {
  // Navigate to report section first
  document
    .querySelectorAll(".sidebar-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelectorAll(".main-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("navReport").classList.add("active");
  document.getElementById("section-report").classList.add("active");

  setTimeout(() => window.print(), 300);
}

function copyReportText() {
  const reportEl = document.getElementById("reportOutput");
  const text = reportEl.innerText || reportEl.textContent;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Report text copied to clipboard!", "success");
    })
    .catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Report text copied to clipboard!", "success");
    });
}

function exportJSON() {
  const data = {
    metadata: {
      incidentId: document.getElementById("incidentId").value,
      title: document.getElementById("incidentTitle").value,
      dateDetected: document.getElementById("incidentDate").value,
      dateResolved: document.getElementById("incidentResolved").value,
      analyst: document.getElementById("analystName").value,
      team: document.getElementById("teamName").value,
      severity: document.getElementById("incidentSeverity").value,
      status: document.getElementById("incidentStatus").value,
      category: document.getElementById("incidentCategory").value,
      affectedAssets: document.getElementById("affectedAssets").value,
      executiveSummary: document.getElementById("execSummary").value,
    },
    findings: store.findings,
    timeline: store.timeline,
    iocs: store.iocs,
    mitre: store.mitre,
    custody: store.custody,
    forensicsExams: store.forensicsExams,
    responseActions: {
      containment: document.getElementById("containmentActions").value,
      eradication: document.getElementById("eradicationActions").value,
      recovery: document.getElementById("recoveryActions").value,
      recommendations: document.getElementById("recommendations").value,
    },
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `IR-Report-${data.metadata.incidentId || "export"}-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("JSON exported!", "success");
}

// ============================================
//  LOCAL STORAGE (Save / Load / Auto-backup)
// ============================================

function saveToLocalStorage() {
  const data = gatherAllData();
  localStorage.setItem("ir-report-draft", JSON.stringify(data));
  showToast("Draft saved to browser storage!", "success");
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem("ir-report-draft");
  if (!raw) {
    showToast("No saved draft found.", "error");
    return;
  }

  try {
    const data = JSON.parse(raw);
    restoreAllData(data);
    showToast("Draft loaded successfully!", "success");
  } catch (e) {
    showToast("Failed to load draft.", "error");
  }
}

function saveAutoBackup() {
  const data = gatherAllData();
  localStorage.setItem("ir-report-autobackup", JSON.stringify(data));
}

function gatherAllData() {
  return {
    metadata: {
      incidentId: document.getElementById("incidentId").value,
      title: document.getElementById("incidentTitle").value,
      dateDetected: document.getElementById("incidentDate").value,
      dateResolved: document.getElementById("incidentResolved").value,
      analyst: document.getElementById("analystName").value,
      team: document.getElementById("teamName").value,
      severity: document.getElementById("incidentSeverity").value,
      status: document.getElementById("incidentStatus").value,
      category: document.getElementById("incidentCategory").value,
      affectedAssets: document.getElementById("affectedAssets").value,
      executiveSummary: document.getElementById("execSummary").value,
    },
    findings: store.findings,
    timeline: store.timeline,
    iocs: store.iocs,
    mitre: store.mitre,
    custody: store.custody,
    forensicsExams: store.forensicsExams,
    responseActions: {
      containment: document.getElementById("containmentActions").value,
      eradication: document.getElementById("eradicationActions").value,
      recovery: document.getElementById("recoveryActions").value,
      recommendations: document.getElementById("recommendations").value,
    },
  };
}

function restoreAllData(data) {
  if (data.metadata) {
    const m = data.metadata;
    document.getElementById("incidentId").value = m.incidentId || "";
    document.getElementById("incidentTitle").value = m.title || "";
    document.getElementById("incidentDate").value = m.dateDetected || "";
    document.getElementById("incidentResolved").value = m.dateResolved || "";
    document.getElementById("analystName").value = m.analyst || "";
    document.getElementById("teamName").value = m.team || "";
    document.getElementById("incidentSeverity").value = m.severity || "";
    document.getElementById("incidentStatus").value = m.status || "Open";
    document.getElementById("incidentCategory").value = m.category || "";
    document.getElementById("affectedAssets").value = m.affectedAssets || "";
    document.getElementById("execSummary").value = m.executiveSummary || "";
  }

  if (data.findings) {
    Object.keys(data.findings).forEach((tool) => {
      store.findings[tool] = data.findings[tool] || [];
      renderFindings(tool);
    });
  }

  if (data.timeline) {
    store.timeline = data.timeline;
    renderTimeline();
  }

  if (data.iocs) {
    store.iocs = data.iocs;
    renderIOCs();
  }

  if (data.mitre) {
    store.mitre = data.mitre;
    renderMitre();
  }

  if (data.custody) {
    store.custody = data.custody;
    renderCustody();
  }

  if (data.forensicsExams) {
    store.forensicsExams = data.forensicsExams;
    renderForensicsExams();
  }

  if (data.responseActions) {
    const r = data.responseActions;
    document.getElementById("containmentActions").value = r.containment || "";
    document.getElementById("eradicationActions").value = r.eradication || "";
    document.getElementById("recoveryActions").value = r.recovery || "";
    document.getElementById("recommendations").value = r.recommendations || "";
  }

  updateStats();
  updateTabCounts();
}

// ============================================
//  UTILITIES
// ============================================

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatDateTime(dt) {
  if (!dt || dt === "Not specified") return "Not specified";
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return dt;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dt;
  }
}

// ============================================
//  INITIALIZATION
// ============================================

(function init() {
  initNavigation();

  // Try to load auto-backup
  const backup = localStorage.getItem("ir-report-autobackup");
  if (backup) {
    try {
      const data = JSON.parse(backup);
      const allEmpty =
        !data.metadata?.incidentId &&
        Object.values(data.findings || {}).every((a) => a.length === 0) &&
        (!data.timeline || data.timeline.length === 0) &&
        (!data.custody || data.custody.length === 0) &&
        (!data.forensicsExams || data.forensicsExams.length === 0);

      if (!allEmpty) {
        restoreAllData(data);
        showToast("Previous session restored from auto-backup.", "info");
      }
    } catch {
      /* ignore */
    }
  }

  // Initial render
  renderTimeline();
  renderIOCs();
  renderMitre();
  renderCustody();
  renderForensicsExams();
  updateStats();
  updateTabCounts();

  // Set default detection time to now
  if (!document.getElementById("incidentDate").value) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById("incidentDate").value = now
      .toISOString()
      .slice(0, 16);
  }
})();
