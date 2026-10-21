import { ProgramSyllabusDetails } from "./types";

export const cybersecuritySyllabus: ProgramSyllabusDetails = {
  courseId: "cybersecurity-devsecops",
  title: "Enterprise Cybersecurity, Penetration Testing & DevSecOps",
  category: "Cybersecurity",
  badge: "DEFENSE & DEVSECOPS",
  duration: "6 Months · 175 Lab Hours",
  intake: "Nov 5, 2026",
  rating: 4.97,
  reviewsCount: 118,
  level: "Intermediate to Advanced",
  format: "Hybrid · Offensive & Defensive Cyber Labs",
  overview:
    "A rigorous, hands-on masterclass taking engineers into offensive security, penetration testing, web application security (OWASP Top 10), Zero-Trust architecture, and automated DevSecOps CI/CD security pipelines.",
  careerOutcomes: {
    targetRoles: [
      "Security Engineer / Application Security Analyst",
      "Penetration Tester / Ethical Hacker",
      "DevSecOps Architect",
      "SOC Threat Analyst",
    ],
    averageSalaryRange: "$95,000 – $145,000 / yr",
    hiringPartners: ["CrowdStrike Partner Network", "FinTech Security Labs", "CyberDefense Hubs", "Enterprise Cloud SOC"],
  },
  prerequisites: [
    "Basic understanding of Linux command-line and networking fundamentals (TCP/IP, DNS, HTTP)",
    "Familiarity with at least one programming or scripting language (Python, JavaScript, Bash, or C#)",
    "Fundamental grasp of web applications and REST APIs",
  ],
  technologies: [
    "Kali Linux",
    "Wireshark",
    "Metasploit",
    "Burp Suite",
    "OWASP ZAP",
    "Nmap",
    "SonarQube",
    "Trivy",
    "Vault by HashiCorp",
    "Docker Security",
    "Python Security",
    "OpenID Connect & OAuth2",
  ],
  modules: [
    {
      id: "mod-1",
      number: 1,
      duration: "Weeks 1–4",
      title: "Network Security, Packet Analysis & Threat Reconnaissance",
      summary:
        "Master network protocols, active & passive reconnaissance, port scanning, traffic analysis, and firewall evasion.",
      topics: [
        "TCP/IP protocol deep dive, packet framing, and packet crafting with Scapy",
        "Advanced network discovery and vulnerability scanning with Nmap",
        "Deep packet inspection and live traffic analysis using Wireshark",
        "Man-in-the-Middle (MitM) attacks, ARP poisoning, and SSL stripping defenses",
        "Network segmentation, IDS/IPS configuration (Snort/Suricata), and firewall rules",
      ],
      handsOnLab: {
        title: "Enterprise Network Penetration & Packet Analysis Lab",
        description:
          "Perform passive and active intelligence gathering against an isolated enterprise network subnet, capture encrypted vs unencrypted credentials, and draft an executive remediation brief.",
      },
      technologies: ["Kali Linux", "Wireshark", "Nmap", "Scapy", "Snort"],
    },
    {
      id: "mod-2",
      number: 2,
      duration: "Weeks 5–9",
      title: "Web Application Security & OWASP Top 10 Exploitation",
      summary:
        "Audit and exploit web vulnerabilities with Burp Suite, SQL injection, XSS, CSRF, and broken access controls.",
      topics: [
        "OWASP Top 10 vulnerability deep dive: Injection (SQLi, NoSQLi, Command Injection)",
        "Cross-Site Scripting (Reflected, Stored, DOM XSS) & CSRF mitigation",
        "Broken Object Level Authorization (BOLA) and modern API security flaws",
        "Interception proxies: Advanced automated and manual testing using Burp Suite Professional",
        "Secure session management, JWT signing vulnerabilities, and token forgery defense",
      ],
      handsOnLab: {
        title: "OWASP Vulnerability Assessment & Exploit Development Lab",
        description:
          "Conduct a full black-box and grey-box security audit against a vulnerable multi-tier web application, write proof-of-concept exploits, and patch the application code.",
      },
      technologies: ["Burp Suite", "OWASP ZAP", "SQLmap", "Postman Security", "JWT Tools"],
    },
    {
      id: "mod-3",
      number: 3,
      duration: "Weeks 10–13",
      title: "Cloud Security, IAM Governance & Zero-Trust Architecture",
      summary:
        "Harden cloud infrastructure across AWS/Azure, configure least-privilege IAM, and deploy Zero-Trust networks.",
      topics: [
        "Cloud shared responsibility model & attack surface analysis (AWS/Azure/GCP)",
        "Least privilege Identity & Access Management (IAM), role assumption & STS tokens",
        "Secrets management and dynamic credentials using HashiCorp Vault",
        "Container and Kubernetes security: Pod Security Standards, image scanning, and runtime alerts (Falco)",
        "Zero-Trust Architecture principles: Identity verification, micro-segmentation & mTLS",
      ],
      handsOnLab: {
        title: "Zero-Trust Cloud & Secrets Hardening Lab",
        description:
          "Deploy HashiCorp Vault into a Kubernetes cluster, configure dynamic PostgreSQL credentials, and enforce strict Zero-Trust network policies between microservices.",
      },
      technologies: ["HashiCorp Vault", "Kubernetes RBAC", "Falco", "Trivy", "Terraform Security"],
    },
    {
      id: "mod-4",
      number: 4,
      duration: "Weeks 14–16",
      title: "DevSecOps Pipelines, Automated SAST/DAST & Threat Hunting",
      summary:
        "Shift security left by integrating automated security scans into CI/CD pipelines and analyzing SIEM logs.",
      topics: [
        "DevSecOps philosophy: Shifting left in GitHub Actions and GitLab CI",
        "Static Application Security Testing (SAST) with SonarQube and Semgrep",
        "Software Bill of Materials (SBOM) and Software Supply Chain Security",
        "Dynamic Application Security Testing (DAST) automated pipeline runs",
        "SOC logging, SIEM threat hunting, and incident response runbooks",
      ],
      handsOnLab: {
        title: "Automated DevSecOps CI/CD Pipeline Lab",
        description:
          "Build an end-to-end GitHub Actions pipeline that blocks pull requests containing vulnerable dependencies (Trivy), security bugs (Semgrep), or exposed hardcoded API secrets.",
      },
      technologies: ["GitHub Actions", "SonarQube", "Semgrep", "Trivy", "SIEM Tools"],
    },
  ],
  capstoneProject: {
    title: "Enterprise Red Team vs Blue Team Capstone Simulation",
    description:
      "Fellows execute an end-to-end security engagement: perform ethical penetration testing on a staging enterprise banking environment, document vulnerabilities, and subsequently deploy defensive DevSecOps controls and HashiCorp Vault secrets to completely remediate all attack vectors.",
    deliverables: [
      "Professional Penetration Testing Report with risk-rated CVE findings",
      "Automated GitHub Actions DevSecOps security pipeline",
      "Remediated and hardened application source code and cloud configuration",
    ],
  },
};
