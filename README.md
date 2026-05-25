# IR Report Generator

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-16A34A?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

**A polished, browser-based incident response report builder for SOC analysts, DFIR teams, and threat hunters.**

Build structured IR reports from SIEM, EDR, XDR, IDS, firewall, WAF, threat intelligence, IOC, timeline, forensics, and chain-of-custody data without a backend or install step.

[Report a Bug](https://github.com/0xsabry/IR-Report-Generator/issues/new?template=bug_report.md) ·
[Request a Feature](https://github.com/0xsabry/IR-Report-Generator/issues/new?template=feature_request.md) ·
[Connect on LinkedIn](https://www.linkedin.com/in/mohamed-sabry-hamdan/)

</div>

---

## Why It Exists

Incident response notes are often scattered across alerts, endpoint detections, packet captures, forensic tools, threat intelligence lookups, and analyst timelines. IR Report Generator brings those inputs into one focused workspace and turns them into a professional report that can be printed, copied, or exported.

The app runs entirely in the browser. Your data stays local unless you export or share it.

## Highlights

| Capability | What it does |
| ---------- | ------------ |
| Incident metadata | Captures ID, title, status, severity, category, analyst, team, dates, and affected assets |
| Security tool findings | Supports SIEM, EDR/XDR, IDS/IPS, firewall, email security, WAF, threat intel, forensics, and custom sources |
| IOC management | Tracks indicators manually and auto-extracts IPs, domains, hashes, URLs, and emails from findings |
| Timeline builder | Creates a chronological incident narrative from response and detection events |
| MITRE ATT&CK mapping | Documents tactics, techniques, and procedures for threat context |
| Chain of custody | Records evidence, hashes, custodians, storage locations, and transfer history |
| Digital forensics | Captures examination scope, tools, artifacts, findings, and examiner notes |
| Report generation | Produces a structured incident response report with executive summary and evidence sections |
| Export options | Print to PDF, copy report text, or export source data as JSON |
| Premium UI | Responsive layout, light/dark themes, saved theme preference, refined transitions, and reduced-motion support |

## Supported Tool Families

| Category | Examples |
| -------- | -------- |
| SIEM | Splunk, IBM QRadar, Wazuh, Microsoft Sentinel, Elastic SIEM, LogRhythm, ArcSight |
| EDR / XDR | CrowdStrike Falcon, SentinelOne, Microsoft Defender, Carbon Black, Cortex XDR, Trend Micro |
| IDS / IPS | Snort, Suricata, Zeek, OSSEC, Cisco IPS |
| Firewall | Palo Alto NGFW, Fortinet FortiGate, Cisco ASA, pfSense, Check Point, Sophos XG |
| Email Security | Proofpoint, Mimecast, Microsoft Defender for Office 365, Barracuda |
| WAF | AWS WAF, Cloudflare, Akamai, ModSecurity, F5 ASM, Imperva |
| Threat Intel | VirusTotal, AbuseIPDB, Shodan, AlienVault OTX, MISP, ThreatFox, Recorded Future |
| Forensics | Autopsy, FTK, EnCase, Volatility, X-Ways, Magnet AXIOM, Cellebrite, SANS SIFT, KAPE, Velociraptor, Plaso, ExifTool, YARA |

## Quick Start

```bash
git clone https://github.com/0xsabry/IR-Report-Generator.git
cd IR-Report-Generator
```

Open `index.html` in your browser. No server or package installation is required.

For local testing with a simple server:

```bash
python -m http.server 5173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5173/`.

## Analyst Workflow

1. Add the core incident metadata.
2. Enter findings from security tools and forensic sources.
3. Build the incident timeline.
4. Add or auto-extract IOCs.
5. Map relevant MITRE ATT&CK techniques.
6. Document evidence and chain of custody.
7. Record response actions and recommendations.
8. Generate, review, and export the final report.

## Project Structure

```text
IR-Report-Generator/
├── index.html
├── style.css
├── app.js
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

## Technology

This project intentionally stays lightweight:

| Layer | Technology |
| ----- | ---------- |
| Interface | HTML5 and CSS3 |
| Logic | Vanilla JavaScript |
| Storage | Browser localStorage |
| Typography | Inter and JetBrains Mono |
| Dependencies | None |

## Security Model

- No backend service.
- No database.
- No telemetry.
- Report data remains in the browser unless manually exported.
- Local drafts are stored in `localStorage`.

For vulnerability reporting, see [SECURITY.md](SECURITY.md).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), use the issue templates where possible, and keep changes scoped and testable.

## License

MIT License. See [LICENSE](LICENSE).

---

<div align="center">

Built by [0xSABRY](https://github.com/0xsabry) for practical incident response reporting.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mohamed-sabry-hamdan/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0xsabry)

</div>
