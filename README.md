# 🛡️ IR Report Generator

**Incident Response Report Platform** — Aggregate security tool data into professional, structured incident response reports.

> Built by [0xsabry](https://github.com/0xsabry)

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](LICENSE)

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
| 🖨️ **Export**            | PDF (print), clipboard text, JSON data export                               |
| 💾 **Auto-Save**         | localStorage auto-backup & manual save/load drafts                          |

## 🔧 Supported Security Tools

- **SIEM**: Splunk, IBM QRadar, Wazuh, Microsoft Sentinel, Elastic SIEM, LogRhythm, ArcSight
- **EDR/XDR**: CrowdStrike Falcon, SentinelOne, Microsoft Defender, Carbon Black, Cortex XDR, Trend Micro
- **IDS/IPS**: Snort, Suricata, Zeek (Bro), OSSEC, Cisco IPS
- **Firewall**: Palo Alto NGFW, Fortinet FortiGate, Cisco ASA, pfSense, Check Point, Sophos XG
- **Email Security**: Proofpoint, Mimecast, MS Defender for Office 365, Barracuda
- **WAF**: AWS WAF, Cloudflare, Akamai, ModSecurity, F5 ASM, Imperva
- **Threat Intel**: VirusTotal, AbuseIPDB, Shodan, AlienVault OTX, MISP, ThreatFox, Recorded Future

## 🚀 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/0xsabry/IR-Report-Generator.git
   cd IR-Report-Generator
   ```

2. Open `index.html` in your browser — no server or dependencies needed!

3. Start building your incident report:
   - Fill in incident metadata
   - Add findings from your security tools
   - Build the timeline
   - Track IOCs (or auto-extract them)
   - Map MITRE ATT&CK techniques
   - Document response actions
   - Generate and export the report

## 📸 Screenshots

### Dashboard & Incident Form

![Dashboard](screenshots/dashboard.png)

### Generated Report

![Report](screenshots/report.png)

## 🏗️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom dark cybersecurity theme with glassmorphism, animations, responsive design
- **Vanilla JavaScript** — Zero dependencies, runs entirely in the browser
- **Google Fonts** — Inter + JetBrains Mono

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 🛡️ by <a href="https://github.com/0xsabry">0xsabry</a>
</p>
