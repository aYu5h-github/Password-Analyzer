# 🔐 Dark Web Password Auditor v3.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Flask](https://img.shields.io/badge/Flask-2.3.0-black.svg)](https://flask.palletsprojects.com/)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

> A sophisticated, hacker-style password strength analyzer with dark web simulation, breach database checking, and real-time security auditing.

## 🎯 Features

### Core Security Analysis
- **Entropy Calculation** - Mathematical measurement of password randomness (bits)
- **Crack Time Estimation** - Realistic time estimates based on modern GPU cracking speeds
- **Pattern Detection** - Identifies sequential, repeated, and keyboard patterns
- **Character Variety Analysis** - Checks for uppercase, lowercase, numbers, and special characters
- **Breach Database Check** - Compares against known breached passwords (RockYou, LinkedIn, Adobe)

### Advanced Features
- **🖥️ Dynamic Theming** - Changes color based on password strength:
  - 🔴 **Red Alert** - Weak/Critical passwords
  - 🟡 **Amber Terminal** - Default/Moderate passwords  
  - 🟢 **Green Neon** - Secure/Impenetrable passwords

- **🌑 Dark Web Simulation** - Realistic hacking-style animations when vulnerabilities are found
- **📜 Password History** - Stores last 20 analyses locally (passwords are masked)
- **📄 Export Reports** - Generate detailed security audit reports as .txt files
- **🔐 Password Generator** - Create cryptographically strong 16-character passwords

### Visual Effects
- CRT monitor overlay with scan lines
- Glitch text animations
- Blinking cursor effects
- Matrix-style terminal interface
- Retro hacker aesthetic

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aYu5h-github/password-auditor.git
cd password-auditor
