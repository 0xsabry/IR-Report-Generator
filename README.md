# 🛡️ IR Report Generator — Incident Response Reporting Platform

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)
![Tools](https://img.shields.io/badge/Security%20Tools-40%2B-red?style=for-the-badge)
![Zero Deps](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=for-the-badge)

**Aggregate security tool data (SIEM, EDR, XDR, IDS, Firewall, WAF, Threat Intel) into professional, structured incident response reports — entirely in your browser.**

Built by [**0xSABRY**](https://github.com/0xsabry) — SOC Analyst & Security Researcher

[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mohamed-sabry-hamdan/)

</div>

---

## Overview

A zero-dependency, browser-based Incident Response Report Generator designed for SOC analysts, IR teams, and threat hunters. No servers, no installations — just open `index.html` and start building professional IR reports.

> 🎯 Follows NIST 800-61 incident handling framework and MITRE ATT&CK tactic mapping

---

## ✨ Features

| Feature                  | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| 📋 **Incident Metadata** | ID, title, severity, status, category, analyst, affected assets             |
| 🔧 **8 Tool Categories** | SIEM, EDR/XDR, IDS/IPS, Firewall, Email Security, WAF, Threat Intel, Custom |
| ⏱️ **Timeline Builder**  | Chronological event timeline with auto-sorting                              |
| 🎯 **IOC Tracker**       | Manual entry + auto-extraction of IPs, domains, hashes, URLs, emails        |
| 🗺️ **MITRE ATT&CK**      | Full framework tactic & technique mapping                                   |
| 🛡️ **Response Actions**  | Containment, eradication, recovery, recommendations                         |
| 📄 **Report Generation** | Auto executive summary, structured sections, CONFIDENTIAL footer            |
| 🖨️ **Multi-Export**      | PDF (print), clipboard text, JSON data export                               |
| 💾 **Auto-Save**         | localStorage auto-backup & manual save/load drafts                          |
| 🌙 **Dark Theme**        | Professional cybersecurity dark theme with glassmorphism                    |

---

## 🔧 Supported Security Tools (40+)

| Category         | Tools                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **SIEM**         | Splunk, IBM QRadar, Wazuh, Microsoft Sentinel, Elastic SIEM, LogRhythm, ArcSight           |
| **EDR/XDR**      | CrowdStrike Falcon, SentinelOne, Microsoft Defender, Carbon Black, Cortex XDR, Trend Micro |
| **IDS/IPS**      | Snort, Suricata, Zeek (Bro), OSSEC, Cisco IPS                                              |
| **Firewall**     | Palo Alto NGFW, Fortinet FortiGate, Cisco ASA, pfSense, Check Point, Sophos XG             |
| **Email**        | Proofpoint, Mimecast, MS Defender for Office 365, Barracuda                                |
| **WAF**          | AWS WAF, Cloudflare, Akamai, ModSecurity, F5 ASM, Imperva                                  |
| **Threat Intel** | VirusTotal, AbuseIPDB, Shodan, AlienVault OTX, MISP, ThreatFox, Recorded Future            |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/0xsabry/IR-Report-Generator.git
cd IR-Report-Generator

# Open in your browser — no server needed!
# Windows:
start index.html
# Mac:
open index.html
# Linux:
xdg-open index.html
```

### Workflow

1. **📝 Incident Details** — Fill in metadata (ID, severity, category, analyst)
2. **🔧 Security Tool Findings** — Add findings from SIEM, EDR, IDS, etc.
3. **⏱️ Timeline** — Build chronological event timeline
4. **🎯 IOC Tracking** — Enter or auto-extract indicators of compromise
5. **🗺️ MITRE Mapping** — Map tactics & techniques
6. **🛡️ Response** — Document containment, eradication, recovery actions
7. **📄 Generate & Export** — Auto-generate professional report → PDF/JSON/Clipboard

---

## 🏗️ Tech Stack

| Technology       | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| **HTML5**        | Semantic structure                                              |
| **CSS3**         | Dark cybersecurity theme, glassmorphism, animations, responsive |
| **Vanilla JS**   | Zero dependencies — runs entirely client-side                   |
| **Google Fonts** | Inter + JetBrains Mono for professional typography              |

---

## 📁 Project Structure

```
IR-Report-Generator/
├── index.html          # Main application page
├── style.css           # Dark cybersecurity theme
├── app.js              # Application logic (report builder, IOC extractor)
├── CONTRIBUTING.md     # Contribution guidelines
├── SECURITY.md         # Security policy
├── LICENSE             # MIT License
└── README.md           # This file
```

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">

Made with 🛡️ by [0xSABRY](https://github.com/0xsabry) — SOC Analyst & Security Researcher

[![LinkedIn](https://img.shields.io/badge/Connect_on_LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohamed-sabry-hamdan/)
[![GitHub](https://img.shields.io/badge/Follow_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0xsabry)

</div>
