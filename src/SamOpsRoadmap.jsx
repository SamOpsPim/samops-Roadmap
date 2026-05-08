import React, { useState, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import {
  Check, ChevronDown, ChevronRight, Server, TestTube, Send, Layers,
  Handshake, Code, Briefcase, Megaphone, TrendingUp, DollarSign, Users,
  Zap, Shield, Globe, Smartphone, Award, ArrowRight, Rocket, Target,
  Clock, BarChart2, Lock, MapPin, Sparkles, GitBranch, Plus, Building,
  Milestone, Circle, Sun, Moon,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const SPRINT = [
  {
    id: "s1", period: "Month 1", title: "Fix, Deploy & Go Live", icon: Server,
    summary: "Ship a clean production platform. Register the business in Tunisia. Get first 5 signups.",
    tasks: [
      { id: "s1-t1", text: "Fix RBAC SSH frontend / backend permission mismatch", cat: "Technical" },
      { id: "s1-t2", text: "Remove all debug hooks (127.0.0.1 calls) and MOCK_REPORTS fallbacks", cat: "Technical" },
      { id: "s1-t3", text: "Deploy backend on Hetzner CX11 — Docker Compose + Nginx + Let's Encrypt SSL", cat: "Technical" },
      { id: "s1-t4", text: "Deploy Next.js on Vercel — configure app.samops.io + api.samops.io", cat: "Technical" },
      { id: "s1-t5", text: "Set up CI/CD GitHub Actions pipeline: test → build → deploy", cat: "Technical" },
      { id: "s1-b1", text: "Register auto-entrepreneur at RNE (Registre National des Entreprises, Tunisia)", cat: "Business" },
      { id: "s1-b2", text: "Set up Lemon Squeezy payment and subscription integration", cat: "Business" },
      { id: "s1-m1", text: "Build samops.io landing page (hero, pricing, screenshots, single CTA)", cat: "Marketing" },
      { id: "s1-m2", text: "LinkedIn launch announcement post — product screenshots + founding story + team of 5 intro", cat: "Marketing" },
      { id: "s1-m3", text: "Create SamOps LinkedIn company page + Twitter/X account + GitHub org profile", cat: "Marketing" },
      { id: "s1-m4", text: "Post a Twitter/X thread: 'Why we built SamOps — the cloud cost problem no one talks about in MENA'", cat: "Marketing" },
      { id: "s1-m5", text: "Submit SamOps to r/SideProject and r/startups on Reddit — first external visibility", cat: "Marketing" },
    ],
    targets: [
      { label: "Platform live", value: "app.samops.io" },
      { label: "Monthly cost",  value: "< $50/mo" },
      { label: "Signups",       value: "5+" },
    ],
  },
  {
    id: "s2", period: "Month 2", title: "First Users & Feedback Loop", icon: TestTube,
    summary: "Onboard 3-5 real testers from Tunisia, iterate on feedback, apply to incubators.",
    tasks: [
      { id: "s2-t1", text: "Build real report generation — PDF / CSV from live cloud cost data", cat: "Technical" },
      { id: "s2-t2", text: "Persist notification preferences to Supabase (not local useState)", cat: "Technical" },
      { id: "s2-t3", text: "Fix SSH InsecureIgnoreHostKey security vulnerability", cat: "Technical" },
      { id: "s2-t4", text: "Build onboarding wizard: auth → cloud connector → first dashboard", cat: "Technical" },
      { id: "s2-t5", text: "Integrate PostHog free tier — track funnel: signup → activation → upgrade", cat: "Technical" },
      { id: "s2-b1", text: "Recruit 3-5 beta testers from Tunis tech scene (Startup Studio, coworking, LinkedIn)", cat: "Business" },
      { id: "s2-b2", text: "Run weekly 30-min feedback calls with each tester (structured: UX + bugs + value)", cat: "Business" },
      { id: "s2-b3", text: "Submit application to B@Labs or Flat6Labs Tunis incubator", cat: "Business" },
      { id: "s2-m1", text: "Publish 2 LinkedIn long-form articles: 'FinOps for MENA startups' + 'How we cut our AWS bill by 40%'", cat: "Marketing" },
      { id: "s2-m2", text: "Launch documentation site on Mintlify (guides, FAQ, API reference)", cat: "Marketing" },
      { id: "s2-m3", text: "Record 5-minute Loom product walkthrough — share on LinkedIn, Twitter/X, and WhatsApp tech groups", cat: "Marketing" },
      { id: "s2-m4", text: "Post weekly LinkedIn carousel: 'FinOps tip of the week' series — 4 posts this month", cat: "Marketing" },
      { id: "s2-m5", text: "Engage in r/aws, r/devops, r/sysadmin — answer FinOps questions, build credibility without spamming", cat: "Marketing" },
      { id: "s2-m6", text: "Participate in Hack Tunisia or Orange Digital Center hackathon — showcase SamOps as a real tool, not just a concept", cat: "Marketing" },
    ],
    targets: [
      { label: "Feedback items",      value: "20+" },
      { label: "Incubator applied",   value: "1+" },
      { label: "Testers — Startups",  value: "2–3" },
      { label: "Testers — PME",       value: "1–2" },
      { label: "Testers — GE",        value: "0" },
    ],
  },
  {
    id: "s3", period: "Month 3", title: "First Revenue", icon: Send,
    summary: "Convert early testers into first active clients. Open public signups. Begin establishing first recurring revenue.",
    tasks: [
      { id: "s3-t1", text: "Fix top 3 UX / bug issues identified in feedback sessions", cat: "Technical" },
      { id: "s3-t2", text: "Full mobile responsive audit across all dashboard views", cat: "Technical" },
      { id: "s3-t3", text: "Integrate Slack alert notifications for cost anomalies", cat: "Technical" },
      { id: "s3-t4", text: "Wire budget threshold alerts to notification pipeline", cat: "Technical" },
      { id: "s3-b1", text: "Convert early testers into first active clients", cat: "Business" },
      { id: "s3-b2", text: "Attend El Gazala Technopark event or BIAT Innovation Lab demo day", cat: "Business" },
      { id: "s3-b3", text: "Follow up on incubator applications, prepare for interviews if shortlisted", cat: "Business" },
      { id: "s3-m1", text: "Write first anonymous case study (Tunisian startup, cloud cost reduction result) — publish on LinkedIn + blog", cat: "Marketing" },
      { id: "s3-m2", text: "Prepare Product Hunt listing: hunter outreach, assets, teaser posts, hunter community warm-up", cat: "Marketing" },
      { id: "s3-m3", text: "Submit to BetaList, Startup Stash, Launching Next, and SaaS Hub directories", cat: "Marketing" },
      { id: "s3-m4", text: "Post a 'building in public' LinkedIn thread: Month 1→3 journey — metrics, learnings, honest numbers", cat: "Marketing" },
      { id: "s3-m5", text: "Launch Twitter/X FinOps tips thread series — 1 actionable tip per day for 7 days (awareness campaign)", cat: "Marketing" },
      { id: "s3-m6", text: "Apply to Startup Weekend Tunis or Junction Hackathon (Europe) — pitch SamOps, win visibility and feedback", cat: "Marketing" },
    ],
    targets: [
      { label: "Active users",        value: "8–12" },
      { label: "Open signups",        value: "Live" },
      { label: "Clients — Startups",  value: "1–2" },
      { label: "Clients — PME",       value: "0–1" },
      { label: "Clients — GE",        value: "0" },
    ],
  },
];

const GROWTH = [
  {
    id: "g1", period: "Month 4", title: "Mobile App & Incubator Entry", icon: Layers,
    summary: "Ship a mobile MVP, secure incubator spot, start structured outreach to Tunisian companies.",
    tasks: [
      { id: "g1-t1", text: "Build mobile app MVP (React Native): cost dashboard + push alerts", cat: "Technical" },
      { id: "g1-t2", text: "Complete Slack + Teams notification integration (round-trip tested)", cat: "Technical" },
      { id: "g1-t3", text: "Improve anomaly detection — reduce false positive rate by 40%+", cat: "Technical" },
      { id: "g1-t4", text: "Write API v1 documentation (endpoints, auth, rate limits, examples)", cat: "Technical" },
      { id: "g1-b1", text: "Submit full incubator dossier if shortlisted by B@Labs or Flat6Labs Tunis", cat: "Business" },
      { id: "g1-b2", text: "Apply to AWS Activate Founders + Microsoft for Startups (Azure) programs", cat: "Business" },
      { id: "g1-b2b", text: "Confirm Azure for Startups label activation — unlock cloud credits, technical support, and co-sell benefits", cat: "Business" },
      { id: "g1-b3", text: "Cold outreach to 30 Tunisian tech companies via LinkedIn (target CTOs, DevOps)", cat: "Business" },
      { id: "g1-m1", text: "Create G2 and Capterra profiles — collect first 3 verified reviews from beta testers", cat: "Marketing" },
      { id: "g1-m2", text: "LinkedIn content cadence: 3 posts/week — FinOps tips, product updates, founder story, team highlights", cat: "Marketing" },
      { id: "g1-m3", text: "Co-author 'FinOps ROI' article with first paying client — publish on LinkedIn + Medium + dev.to", cat: "Marketing" },
      { id: "g1-m4", text: "Launch SamOps YouTube channel: first 2 videos — product demo + 'What is FinOps?' explainer", cat: "Marketing" },
      { id: "g1-m5", text: "Post a 'Show HN' on Hacker News — honest product intro with live demo link", cat: "Marketing" },
      { id: "g1-m6", text: "Participate in AWS Build On Hackathon or Microsoft Imagine Cup — demonstrate cloud cost intelligence use case", cat: "Marketing" },
      { id: "g1-m7", text: "Start LinkedIn Newsletter 'FinOps MENA Weekly' — cloud cost tips, industry news, SamOps updates (biweekly)", cat: "Marketing" },
    ],
    targets: [
      { label: "Incubator",           value: "Accepted" },
      { label: "MRR",                 value: "$200–$500" },
      { label: "Clients — Startups",  value: "2–4" },
      { label: "Clients — PME",       value: "1–2" },
      { label: "Clients — GE",        value: "0" },
    ],
  },
  {
    id: "g2", period: "Month 5", title: "First Pilot & Pre-seed Prep", icon: Handshake,
    summary: "Sign first paid pilot, add second cloud provider, finalize 12-slide pitch deck.",
    tasks: [
      { id: "g2-t1", text: "Add second cloud provider (GCP if AWS-only, or AWS if GCP-only)", cat: "Technical" },
      { id: "g2-t2", text: "Build public API with API key management for integration partners", cat: "Technical" },
      { id: "g2-t3", text: "Start SOC 2 Type I gap analysis — list controls, identify missing ones", cat: "Technical" },
      { id: "g2-t3b", text: "Begin ISO 27001 readiness assessment — define scope, inventory assets, identify security control gaps", cat: "Technical" },
      { id: "g2-t4", text: "RBAC v2 — fine-grained permissions per cloud account and per team", cat: "Technical" },
      { id: "g2-b1", text: "Sign 1 paid pilot contract with a Tunisian company (3 months, $200–500/mo)", cat: "Business" },
      { id: "g2-b2", text: "Register French micro-entreprise for EU billing (critical for expansion)", cat: "Business" },
      { id: "g2-b3", text: "Finalize 12-slide pre-seed pitch deck (problem / solution / traction / ask)", cat: "Business" },
      { id: "g2-b4", text: "Submit BFPME Startup Fund application if eligible ($10k–$20k TND)", cat: "Business" },
      { id: "g2-m1", text: "Host live webinar: 'FinOps pour les startups tunisiennes' — LinkedIn Live + Zoom, 50+ attendees target", cat: "Marketing" },
      { id: "g2-m2", text: "Identify 1 Tunisian cloud MSP for co-selling partnership discussion", cat: "Marketing" },
      { id: "g2-m3", text: "Publish Product Hunt launch — coordinate upvote campaign via LinkedIn, Twitter/X, and community Slack groups", cat: "Marketing" },
      { id: "g2-m4", text: "Twitter/X Spaces session: 'Cloud costs in MENA startups' — invite DevOps leads and CTOs as speakers", cat: "Marketing" },
      { id: "g2-m5", text: "LinkedIn Newsletter 'FinOps MENA Weekly' — grow to 300+ subscribers this month", cat: "Marketing" },
      { id: "g2-m6", text: "Compete in Flat6Labs Demo Day or Enactus Hackathon — present SamOps live in front of investors and press", cat: "Marketing" },
      { id: "g2-m7", text: "Post monthly 'Startup Metrics Transparent' LinkedIn thread — ARR, users, team, learnings (builds trust)", cat: "Marketing" },
    ],
    targets: [
      { label: "Pilot signed",        value: "1" },
      { label: "MRR",                 value: "$500–$1,000" },
      { label: "Clients — Startups",  value: "3–5" },
      { label: "Clients — PME",       value: "2–4" },
      { label: "Clients — GE",        value: "0–1" },
    ],
  },
  {
    id: "g3", period: "Month 6", title: "Secure, Mobile v1 & Investor Talks", icon: Milestone,
    summary: "Harden the platform, release mobile v1, open first investor conversations.",
    tasks: [
      { id: "g3-t1", text: "Internal security audit — auth flows, data access, API attack surfaces", cat: "Technical" },
      { id: "g3-t1b", text: "Advance SOC 2 Type I controls implementation — document policies, access controls, encryption standards", cat: "Technical" },
      { id: "g3-t1c", text: "Implement ISO 27001 core controls: risk treatment plan, incident response procedure, data classification policy", cat: "Technical" },
      { id: "g3-t2", text: "Migrate to k3s Kubernetes on Hetzner (replace Docker Compose in prod)", cat: "Technical" },
      { id: "g3-t3", text: "Release mobile app v1.0 — TestFlight (iOS) + Play Store beta (Android)", cat: "Technical" },
      { id: "g3-t4", text: "Add CSV + Excel data export for all cost reports and anomaly summaries", cat: "Technical" },
      { id: "g3-b1", text: "Hold 5+ investor meetings — angel network, incubator fund, BFPME officer", cat: "Business" },
      { id: "g3-b2", text: "Formalize co-founder roles: CEO / CTO / CPO — documented split", cat: "Business" },
      { id: "g3-b3", text: "Start Morocco outreach — identify 10 targets in Casablanca tech ecosystem", cat: "Business" },
      { id: "g3-m1", text: "Collect 3+ customer testimonials (video or written) — publish on website, LinkedIn, and pitch deck", cat: "Marketing" },
      { id: "g3-m2", text: "Exhibit at GITEX Africa or Tunisia Startup Summit — branded booth, live demos, press kit ready", cat: "Marketing" },
      { id: "g3-m3", text: "Launch referral program: 1 free month per successful paying referral — promote via email + LinkedIn", cat: "Marketing" },
      { id: "g3-m4", text: "Publish 6-month 'Building in Public' retrospective on LinkedIn + Medium — full honest metrics and story", cat: "Marketing" },
      { id: "g3-m5", text: "Reach 1,000 LinkedIn followers on company page — run follower growth campaign with giveaway or free audit offer", cat: "Marketing" },
      { id: "g3-m6", text: "Sponsor or co-organize a local hackathon (DevFest Tunisia, GDG Tunis) — SamOps API as challenge theme", cat: "Marketing" },
      { id: "g3-m7", text: "YouTube: publish 4 videos total — customer onboarding walkthrough, anomaly detection demo, FinOps 101 series", cat: "Marketing" },
      { id: "g3-m8", text: "LinkedIn Newsletter 'FinOps MENA Weekly' — reach 1,000+ subscribers, pitch to guest contributors", cat: "Marketing" },
    ],
    targets: [
      { label: "MRR",                 value: "$800–$1,500" },
      { label: "Investor meetings",   value: "5+" },
      { label: "Cert. track",         value: "SOC 2 + ISO 27001" },
      { label: "Clients — Startups",  value: "4–7" },
      { label: "Clients — PME",       value: "3–6" },
      { label: "Clients — GE",        value: "1–2" },
    ],
  },
];

const Y1 = {
  milestones: [
    { id:"y1-1",  icon:Shield,     text:"SOC 2 Type I certification completed", cat:"Technical" },
    { id:"y1-2",  icon:Globe,      text:"Multi-cloud dashboard: AWS + GCP live (Azure roadmap started)", cat:"Technical" },
    { id:"y1-3",  icon:Lock,       text:"Enterprise SSO / SAML for Business tier customers", cat:"Technical" },
    { id:"y1-4",  icon:Smartphone, text:"Mobile app v2: cost approvals, 1-click fixes, team management", cat:"Technical" },
    { id:"y1-5",  icon:Zap,        text:"AI FinOps co-pilot: natural language cost queries + auto-recommendations", cat:"Technical" },
    { id:"y1-6",  icon:Building,   text:"First enterprise pilot: 1-2 Tunisian companies with 50+ employees", cat:"Business" },
    { id:"y1-7",  icon:DollarSign, text:"Pre-seed closed: $30k–$100k (BFPME + incubator grant + Tunisian angels)", cat:"Business" },
    { id:"y1-8",  icon:Users,      text:"Core team of 5 — capacity focused on product-market fit and early client success", cat:"Business" },
    { id:"y1-9",  icon:Award,      text:"AWS Activate Advanced + Microsoft for Startups (Azure) partner programs activated", cat:"Business" },
    { id:"y1-10", icon:MapPin,     text:"First 2-3 Moroccan customers (Casablanca tech startups)", cat:"Business" },
    { id:"y1-11", icon:Megaphone,  text:"Speaking slot at GITEX Africa or Tunisia Startup Summit — live product demo in front of 500+ attendees", cat:"Marketing" },
    { id:"y1-12", icon:BarChart2,  text:"FinOps MENA blog: 1,000+ monthly organic readers — SEO-optimized articles targeting cloud cost keywords", cat:"Marketing" },
    { id:"y1-13", icon:GitBranch,  text:"3 active reseller / MSP partner agreements (TN + MA)", cat:"Marketing" },
    { id:"y1-14", icon:TrendingUp, text:"G2 rating ≥ 4.5 stars with 20+ verified reviews", cat:"Marketing" },
    { id:"y1-15", icon:Megaphone,  text:"LinkedIn company page: 3,000+ followers — consistent content engine (tips, case studies, team posts)", cat:"Marketing" },
    { id:"y1-16", icon:Sparkles,   text:"LinkedIn Newsletter 'FinOps MENA Weekly': 2,500+ subscribers — recognized as #1 FinOps voice in MENA", cat:"Marketing" },
    { id:"y1-17", icon:Rocket,     text:"Win or place top 3 in a regional startup competition or hackathon (Flat6Labs Demo Day, GITEX Supernova)", cat:"Marketing" },
    { id:"y1-18", icon:Globe,      text:"YouTube channel: 20+ videos, 500+ subscribers — tutorials, demos, FinOps explainers", cat:"Marketing" },
    { id:"y1-19", icon:BarChart2,  text:"Twitter/X: 1,000+ followers — viral thread on FinOps savings results (10k+ impressions target)", cat:"Marketing" },
  ],
  targets: [
    { label:"MRR (end Y1)",         value:"$3k–$5k" },
    { label:"Team",                  value:"5 people" },
    { label:"Funding",               value:"$30k–$100k" },
    { label:"Markets",               value:"TN + MA" },
    { label:"Compliance",            value:"SOC 2 Type I" },
    { label:"Clients — Startups",    value:"5–7" },
    { label:"Clients — PME",         value:"3–5" },
    { label:"Clients — GE",          value:"1–2" },
    { label:"Clients — Individuel",  value:"0–1" },
  ],
};

const Y2 = {
  milestones: [
    { id:"y2-1",  icon:Shield,    text:"SOC 2 Type I report issued — shared with enterprise prospects as trust credential", cat:"Technical" },
    { id:"y2-1b", icon:Shield,    text:"SOC 2 Type II audit initiated — continuous monitoring controls active", cat:"Technical" },
    { id:"y2-2",  icon:Layers,    text:"White-label platform for MSP resellers with custom branding", cat:"Technical" },
    { id:"y2-3",  icon:Zap,       text:"FinOps automation: auto-rightsizing + reserved instance optimizer", cat:"Technical" },
    { id:"y2-4",  icon:Globe,     text:"Azure connector + multi-region data residency (EU + MENA)", cat:"Technical" },
    { id:"y2-5",  icon:Sparkles,  text:"AI spend forecasting V2: predictive alerts + budget runway", cat:"Technical" },
    { id:"y2-6",  icon:Shield,     text:"ISO 27001 certification audit completed — information security management system (ISMS) formally certified", cat:"Technical" },
    { id:"y2-6b", icon:Shield,     text:"CSA STAR Level 1 self-assessment published — cloud security transparency for enterprise clients", cat:"Technical" },
    { id:"y2-7",  icon:DollarSign,text:"Seed round: $150k–$400k (regional VC or co-investing angels)", cat:"Business" },
    { id:"y2-8x", icon:Users,     text:"Team grows to 6-8 — first dedicated sales and customer success hires", cat:"Business" },
    { id:"y2-9x", icon:MapPin,    text:"France market entry: 5-10 French SMB tech companies as first customers", cat:"Business" },
    { id:"y2-10x",icon:Globe,     text:"MENA expansion: Morocco + Egypt as primary growth markets", cat:"Business" },
    { id:"y2-11x",icon:Handshake, text:"5+ active channel partners (MSPs + cloud resellers across MENA)", cat:"Business" },
    { id:"y2-12x",icon:Building,  text:"AWS Marketplace listing live and generating inbound leads", cat:"Business" },
    { id:"y2-13x",icon:Megaphone, text:"Media coverage: Wamda, TechCrunch Africa, or ArabNet — product story + traction numbers", cat:"Marketing" },
    { id:"y2-14x",icon:Award,     text:"Conference presence: GITEX Global Dubai or AWS Summit Paris — speaking slot + networking", cat:"Marketing" },
    { id:"y2-15", icon:Megaphone, text:"LinkedIn company page: 8,000+ followers — video content, hiring posts, customer spotlights", cat:"Marketing" },
    { id:"y2-16", icon:Sparkles,  text:"LinkedIn Newsletter 'FinOps MENA Weekly': 6,000+ subscribers — guest articles from enterprise clients", cat:"Marketing" },
    { id:"y2-17", icon:Globe,     text:"YouTube channel: 50+ videos, 2,000+ subscribers — onboarding series, integration tutorials, webinar replays", cat:"Marketing" },
    { id:"y2-18", icon:Rocket,    text:"Sponsor or co-organize a regional hackathon (DevFest, AWS Community Day) — SamOps API as official challenge tool", cat:"Marketing" },
    { id:"y2-19", icon:TrendingUp,text:"Twitter/X: 3,000+ followers — weekly FinOps benchmarks thread drives consistent organic reach", cat:"Marketing" },
    { id:"y2-20", icon:BarChart2, text:"Launch 'State of FinOps in MENA' annual report — distributed to 500+ CTOs and DevOps leads via LinkedIn + email", cat:"Marketing" },
  ],
  targets: [
    { label:"MRR (end Y2)",         value:"$12k–$22k" },
    { label:"Team",                  value:"6–8 people" },
    { label:"Funding",               value:"$150k–$400k" },
    { label:"Markets",               value:"TN+MA+FR+EG" },
    { label:"Compliance",            value:"ISO 27001 + SOC 2 I/II" },
    { label:"Clients — Startups",    value:"12–15" },
    { label:"Clients — PME",         value:"30–35" },
    { label:"Clients — GE",          value:"8–10" },
    { label:"Clients — Individuel",  value:"2–5" },
  ],
};

const Y3 = {
  milestones: [
    { id:"y3-1",  icon:Sparkles,  text:"AI-native FinOps: autonomous cost optimization with human-in-the-loop guardrails", cat:"Technical" },
    { id:"y3-2",  icon:Code,      text:"Developer SDK + Terraform provider + Pulumi plugin published", cat:"Technical" },
    { id:"y3-3",  icon:Globe,     text:"Multi-cloud + on-prem hybrid FinOps (VMware, OpenStack connectors)", cat:"Technical" },
    { id:"y3-4",  icon:Shield,    text:"ISO 27001 (information security) + ISO 9001 (quality management) certifications renewed and audited", cat:"Technical" },
    { id:"y3-4b", icon:Shield,    text:"SOC 2 Type II report renewed — GDPR + PDPA (Tunisia) compliance framework fully operational", cat:"Technical" },
    { id:"y3-4c", icon:Shield,    text:"CSA STAR Level 2 (third-party audit) achieved — enterprise-grade cloud security posture certified", cat:"Technical" },
    { id:"y3-5",  icon:Layers,    text:"Integration marketplace with community-built connectors", cat:"Technical" },
    { id:"y3-6",  icon:DollarSign,text:"Series A or large seed: $500k–$1.5M (Partech Africa, YC, or strategic partner)", cat:"Business" },
    { id:"y3-7",  icon:Users,     text:"Team: 12–18 people across TN, FR, and remote MENA", cat:"Business" },
    { id:"y3-8",  icon:MapPin,    text:"MENA + France + 2 additional EU markets established", cat:"Business" },
    { id:"y3-9",  icon:Building,  text:"10+ enterprise contracts ($1k–$5k/mo ACV per client)", cat:"Business" },
    { id:"y3-10", icon:Rocket,    text:"International HQ consideration: Paris or Dubai for EU/MENA ops", cat:"Business" },
    { id:"y3-11", icon:Award,     text:"G2 Leader badge in Cloud Cost Management (MENA category) — 100+ verified reviews", cat:"Marketing" },
    { id:"y3-12", icon:Megaphone, text:"FinOps MENA Summit: annual event co-hosted with FinOps Foundation — 200+ attendees, sponsors, press coverage", cat:"Marketing" },
    { id:"y3-13", icon:TrendingUp,text:"FinOps Foundation Certified Platform Partner status achieved", cat:"Marketing" },
    { id:"y3-14", icon:Megaphone, text:"LinkedIn company page: 15,000+ followers — thought leadership brand established across MENA + EU tech circles", cat:"Marketing" },
    { id:"y3-15", icon:Sparkles,  text:"LinkedIn Newsletter 'FinOps MENA Weekly': 12,000+ subscribers — industry benchmark publication", cat:"Marketing" },
    { id:"y3-16", icon:Globe,     text:"YouTube channel: 100+ videos, 8,000+ subscribers — full FinOps certification prep course launched", cat:"Marketing" },
    { id:"y3-17", icon:Rocket,    text:"Main sponsor of 2+ major hackathons (GITEX Hackathon, Junction) — SamOps brand as the FinOps tool for builders", cat:"Marketing" },
    { id:"y3-18", icon:TrendingUp,text:"Twitter/X: 8,000+ followers — weekly 'Cloud Cost Benchmarks' thread becomes reference in DevOps community", cat:"Marketing" },
    { id:"y3-19", icon:BarChart2, text:"'State of FinOps in MENA' report: Year 3 edition — 2,000+ downloads, cited by Wamda, Sifted, and AWS blog", cat:"Marketing" },
    { id:"y3-20", icon:Users,     text:"Brand ambassador program: 10+ active advocates (customers + partners) producing organic content about SamOps", cat:"Marketing" },
  ],
  targets: [
    { label:"MRR (end Y3)",         value:"$40k–$60k" },
    { label:"Team",                  value:"12–18 people" },
    { label:"Funding",               value:"$500k–$1.5M" },
    { label:"Markets",               value:"MENA + EU" },
    { label:"Compliance",            value:"ISO 27001 + ISO 9001 + SOC 2 II + CSA STAR" },
    { label:"Clients — Startups",    value:"20–25" },
    { label:"Clients — PME",         value:"55–70" },
    { label:"Clients — GE",          value:"18–25" },
    { label:"Clients — Individuel",  value:"5–10" },
  ],
};

const REVENUE_CHART = [
  { n:"M1",    cost:50,   rev:0,      label:"Month 1"    },
  { n:"M2",    cost:50,   rev:0,      label:"Month 2"    },
  { n:"M3",    cost:50,   rev:80,     label:"Month 3"    },
  { n:"M4",    cost:120,  rev:300,    label:"Month 4"    },
  { n:"M5",    cost:120,  rev:600,    label:"Month 5"    },
  { n:"M6",    cost:150,  rev:1200,   label:"Month 6"    },
  { n:"Q3 Y1", cost:200,  rev:2500,   label:"Q3 Year 1"  },
  { n:"Q4 Y1", cost:250,  rev:4000,   label:"Q4 Year 1"  },
  { n:"Q1 Y2", cost:350,  rev:7000,   label:"Q1 Year 2"  },
  { n:"Q2 Y2", cost:450,  rev:12000,  label:"Q2 Year 2"  },
  { n:"Q4 Y2", cost:600,  rev:20000,  label:"Q4 Year 2"  },
  { n:"Q2 Y3", cost:900,  rev:38000,  label:"Q2 Year 3"  },
  { n:"Q4 Y3", cost:1500, rev:58000,  label:"Q4 Year 3"  },
];

const COST_BREAKDOWN = [
  { period:"Month 1–3  (≈ $50/mo)", items:[
    { item:"Hetzner CX11 VPS",      cost:5  },
    { item:"Supabase free tier",    cost:0  },
    { item:"Vercel Hobby",          cost:0  },
    { item:"Domain + email",        cost:5  },
    { item:"LLM API (OpenAI)",      cost:30 },
    { item:"Misc (tools, subs)",    cost:10 },
  ]},
  { period:"Month 4–6  (≈ $150/mo)", items:[
    { item:"Hetzner CX21 VPS",       cost:15 },
    { item:"Supabase Pro",           cost:25 },
    { item:"Vercel Hobby",           cost:0  },
    { item:"Domain + CDN",           cost:5  },
    { item:"Email (Resend Starter)", cost:20 },
    { item:"LLM API (OpenAI)",       cost:80 },
    { item:"Monitoring (Sentry)",    cost:10 },
    { item:"PostHog + Crisp",        cost:0  },
  ]},
];

const FUNDING = [
  { event:"Bootstrap",          when:"Month 1",    amount:"$0",           detail:"Student resources + free cloud tiers" },
  { event:"Incubator grant",    when:"Month 3–5",  amount:"$10k–$30k",   detail:"B@Labs or Flat6Labs Tunis (workspace + cash)" },
  { event:"BFPME / PNATI",     when:"Month 6–9",  amount:"$10k–$20k",   detail:"Tunisia national startup funding programs" },
  { event:"Angel pre-seed",     when:"Month 9–15", amount:"$30k–$80k",   detail:"Tunisian + diaspora angels, some international" },
  { event:"Seed round",         when:"Year 2",     amount:"$150k–$400k", detail:"Regional VC + international co-investor" },
  { event:"Series A / bridge",  when:"Year 3",     amount:"$500k–$1.5M", detail:"Partech Africa, YC alumni, or strategic MENA partner" },
];

// ─── Marketing Plan Data ──────────────────────────────────────────────────────

const MARKETING_PLAN = [
  {
    category: "Acquisition clients",
    color: "blue",
    objectives: [
      {
        id: "mkt-a1",
        objective: "Atteindre un portefeuille de clients actifs payants",
        kpi: "Nombre de clients actifs",
        y1: "10–15 clients",
        y2: "50–60 clients",
        y3: "100–150 clients",
        segment: "Startups + PME + GE",
        action: "Cold outreach LinkedIn, hackathons, démos live, partenariats MSP",
      },
      {
        id: "mkt-a2",
        objective: "Convertir les utilisateurs gratuits / testers en abonnés payants",
        kpi: "Taux de conversion free → paid",
        y1: "15–20%",
        y2: "20–25%",
        y3: "25–30%",
        segment: "Tous segments",
        action: "Onboarding wizard, séquences email, case studies, suivi hebdomadaire",
      },
      {
        id: "mkt-a3",
        objective: "Acquérir des clients entreprise (GE) via pilotes signés",
        kpi: "Contrats pilotes signés",
        y1: "1–2 GE",
        y2: "8–10 GE",
        y3: "18–25 GE",
        segment: "Grande Entreprise",
        action: "Pitch deck enterprise, démos personnalisées, certifications sécurité (ISO 27001, SOC 2)",
      },
    ],
  },
  {
    category: "Notoriété & réseaux sociaux",
    color: "pink",
    objectives: [
      {
        id: "mkt-b1",
        objective: "Établir SamOps comme référence FinOps sur LinkedIn en MENA",
        kpi: "Followers page LinkedIn",
        y1: "3 000+",
        y2: "8 000+",
        y3: "15 000+",
        segment: "CTOs, DevOps, DSI",
        action: "3 posts/semaine, carousels FinOps tips, building in public, témoignages clients",
      },
      {
        id: "mkt-b2",
        objective: "Développer la newsletter 'FinOps MENA Weekly' en publication de référence",
        kpi: "Abonnés newsletter LinkedIn",
        y1: "2 500+",
        y2: "6 000+",
        y3: "12 000+",
        segment: "Tech leaders MENA + EU",
        action: "Contenu biweekly, guest contributors, promotion croisée webinaires",
      },
      {
        id: "mkt-b3",
        objective: "Construire une audience YouTube autour du contenu FinOps",
        kpi: "Abonnés YouTube",
        y1: "500+",
        y2: "2 000+",
        y3: "8 000+",
        segment: "DevOps engineers, cloud teams",
        action: "Tutoriels produit, FinOps 101, démos intégrations, replays webinaires",
      },
      {
        id: "mkt-b4",
        objective: "Développer la présence Twitter/X et crédibilité technique",
        kpi: "Followers Twitter/X",
        y1: "1 000+",
        y2: "3 000+",
        y3: "8 000+",
        segment: "DevOps, SRE, Cloud Engineers",
        action: "Threads FinOps tips, Twitter Spaces, benchmarks cloud coûts hebdo",
      },
      {
        id: "mkt-b5",
        objective: "Obtenir une couverture médiatique dans la presse tech MENA",
        kpi: "Articles presse / mentions",
        y1: "2–3 articles",
        y2: "6–8 articles",
        y3: "12+ articles",
        segment: "Écosystème startup MENA",
        action: "PR outreach Wamda, TechCrunch Africa, ArabNet, communiqués presse",
      },
    ],
  },
  {
    category: "Engagement & rétention",
    color: "amber",
    objectives: [
      {
        id: "mkt-c1",
        objective: "Maintenir un haut niveau de satisfaction et rétention client",
        kpi: "Churn MRR mensuel",
        y1: "< 5%",
        y2: "< 4%",
        y3: "< 3%",
        segment: "Tous clients actifs",
        action: "Onboarding structuré, support réactif, feedback calls mensuels",
      },
      {
        id: "mkt-c2",
        objective: "Obtenir un NPS élevé et des avis vérifiés sur G2 / Capterra",
        kpi: "NPS + G2 rating",
        y1: "NPS ≥ 40 · G2 ≥ 4.5",
        y2: "NPS ≥ 50 · 40+ avis",
        y3: "NPS ≥ 60 · 100+ avis",
        segment: "Clients actifs",
        action: "Demande d'avis post-onboarding, incentive G2, programme ambassadeur",
      },
      {
        id: "mkt-c3",
        objective: "Activer un programme de référencement client (referral)",
        kpi: "% nouveaux clients via referral",
        y1: "10–15%",
        y2: "20–25%",
        y3: "25–30%",
        segment: "Clients satisfaits",
        action: "1 mois gratuit par referral, suivi Lemon Squeezy, communication mensuelle",
      },
    ],
  },
  {
    category: "Hackathons & événements",
    color: "emerald",
    objectives: [
      {
        id: "mkt-d1",
        objective: "Participer à des hackathons pour gagner en visibilité produit",
        kpi: "Hackathons participés / an",
        y1: "3–4",
        y2: "5–6",
        y3: "8+",
        segment: "Communauté tech MENA + EU",
        action: "Hack Tunisia, Orange Digital Center, AWS Build On, Junction, Flat6Labs Demo Day",
      },
      {
        id: "mkt-d2",
        objective: "Obtenir des speaking slots dans les conférences cloud & FinOps",
        kpi: "Speaking slots obtenus",
        y1: "1–2",
        y2: "4–5",
        y3: "8+",
        segment: "CIOs, CTOs, Cloud Teams",
        action: "GITEX Africa, Tunisia Startup Summit, AWS Summit Paris, GITEX Global Dubai",
      },
      {
        id: "mkt-d3",
        objective: "Sponsoriser / co-organiser un hackathon autour de l'API SamOps",
        kpi: "Hackathons sponsorisés",
        y1: "0–1",
        y2: "1–2",
        y3: "2–3",
        segment: "Développeurs, étudiants tech",
        action: "DevFest Tunisia, GDG Tunis, AWS Community Day — SamOps API comme outil officiel",
      },
      {
        id: "mkt-d4",
        objective: "Publier le rapport annuel 'State of FinOps in MENA'",
        kpi: "Téléchargements rapport",
        y1: "—",
        y2: "500+",
        y3: "2 000+",
        segment: "DSI, VCs, presse tech",
        action: "Recherche primaire clients + enquêtes, distribution LinkedIn + email + presse",
      },
    ],
  },
  {
    category: "Partenariats & distribution",
    color: "brand",
    objectives: [
      {
        id: "mkt-e1",
        objective: "Signer des accords de revente avec des partenaires MSP",
        kpi: "Partenaires MSP actifs",
        y1: "2–3",
        y2: "5+",
        y3: "10+",
        segment: "MSPs TN + MA + FR",
        action: "Co-sell agreements, formation partenaires, portail revendeur, commissions",
      },
      {
        id: "mkt-e2",
        objective: "Être référencé sur AWS Marketplace et Azure Marketplace",
        kpi: "Listings marketplaces actifs",
        y1: "—",
        y2: "AWS Marketplace",
        y3: "AWS + Azure",
        segment: "Clients cloud entreprise",
        action: "AWS ISV program, Azure Marketplace onboarding, optimisation fiche produit",
      },
    ],
  },
];

// ─── Collaborative State ──────────────────────────────────────────────────────

const STORAGE_KEY = "samops_roadmap_v3";

function useRoadmapState() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { done:{}, doneBy:{}, doneAt:{}, user:"Amine", members:["Amine","Sami"] };
  });

  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const toggleTask = useCallback((id) => {
    commit((prev) => {
      const nowDone = !prev.done[id];
      return {
        ...prev,
        done:   { ...prev.done,   [id]: nowDone },
        doneBy: { ...prev.doneBy, [id]: nowDone ? prev.user : null },
        doneAt: { ...prev.doneAt, [id]: nowDone
          ? new Date().toLocaleDateString("fr-TN", { day:"2-digit", month:"short", year:"2-digit" })
          : null },
      };
    });
  }, [commit]);

  const setUser   = useCallback((user)  => commit((p) => ({ ...p, user })), [commit]);
  const addMember = useCallback((name)  => {
    const n = name.trim();
    if (!n) return;
    commit((p) => p.members.includes(n) ? p : { ...p, members:[...p.members, n] });
  }, [commit]);

  return { state, toggleTask, setUser, addMember };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (n = "") => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";

const phaseProgress = (tasks, done) => {
  if (!tasks.length) return 0;
  return Math.round(tasks.filter(t => done[t.id]).length / tasks.length * 100);
};

const milestoneProgress = (list, done) => {
  if (!list.length) return 0;
  return Math.round(list.filter(m => done[m.id]).length / list.length * 100);
};

function catIcon(cat) {
  if (cat === "Technical") return <Code      size={13} className="text-blue-500 dark:text-blue-400" />;
  if (cat === "Business")  return <Briefcase size={13} className="text-brand" />;
  if (cat === "Marketing") return <Megaphone size={13} className="text-pink-500 dark:text-pink-400" />;
  return null;
}

const catVariant = (cat) =>
  ({ Technical:"technical", Business:"business", Marketing:"marketing" }[cat] ?? "secondary");

// ─── Primitives ───────────────────────────────────────────────────────────────

function Badge({ children, variant = "default", className = "" }) {
  const v = {
    default:   "bg-brand/10 text-brand border-brand/25",
    success:   "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    warning:   "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    secondary: "bg-zinc-100 dark:bg-white/[0.07] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/[0.08]",
    technical: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    business:  "bg-brand/10 text-brand border-brand/20",
    marketing: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${v[variant]??v.default} ${className}`}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4 flex items-start gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-0.5">{label}</p>
        <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">{value}</p>
        {sub && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function CircularProgress({ value, size = 44 }) {
  const sw = 3, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={value === 100 ? "#10b981" : "url(#cg)"}
        strokeWidth={sw} strokeDasharray={c}
        strokeDashoffset={c - (value/100)*c}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        className="transition-all duration-500"
      />
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#d46a3a" />
          <stop offset="100%" stopColor="#e07844" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className={`text-[10px] font-semibold font-mono ${value===100 ? "fill-emerald-500" : "fill-zinc-500 dark:fill-zinc-400"}`}>
        {value}%
      </text>
    </svg>
  );
}

// ─── Task Item ────────────────────────────────────────────────────────────────

function TaskItem({ task, isDone, doneBy, doneAt, onToggle }) {
  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`flex items-start gap-2.5 rounded-lg px-2 py-1.5 group cursor-pointer select-none transition-colors
        hover:bg-zinc-50 dark:hover:bg-white/[0.02] ${isDone ? "opacity-50" : ""}`}
    >
      {/* Custom checkbox */}
      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
        isDone
          ? "bg-brand border-brand"
          : "border-zinc-300 dark:border-white/20 group-hover:border-brand/60"
      }`}>
        {isDone && <Check size={9} className="text-white" strokeWidth={3} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-relaxed ${
          isDone ? "line-through text-zinc-400 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"
        }`}>
          {task.text}
        </p>
        {isDone && doneBy && (
          <p className="text-[10px] mt-0.5 font-mono text-brand/60">
            ✓ {doneBy}{doneAt ? `  ·  ${doneAt}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Phase Card ───────────────────────────────────────────────────────────────

function PhaseCard({ data, state, onToggle, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon  = data.icon;
  const prog  = phaseProgress(data.tasks, state.done);
  const doneN = data.tasks.filter(t => state.done[t.id]).length;
  const cats  = [...new Set(data.tasks.map(t => t.cat))];

  const dotCls = prog === 100
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : prog > 0
    ? "border-brand/40 bg-brand/10 text-brand"
    : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] text-zinc-400 dark:text-zinc-500";

  return (
    <div className="relative flex gap-4 mb-4">
      {/* Timeline */}
      <div className="flex flex-col items-center pt-1">
        <div className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${dotCls}`}>
          {prog === 100 ? <Check size={16} /> : <Icon size={15} />}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-zinc-200 dark:from-white/10 to-transparent mt-1" />
      </div>

      {/* Card */}
      <div className={`flex-1 min-w-0 rounded-xl bg-white dark:bg-[#14161c] overflow-hidden mb-2 transition-all ${
        prog > 0 && prog < 100 ? "card-shadow-accent" : "card-shadow"
      }`}>
        <button onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-3 p-4 text-left hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {data.period}
              </span>
              {prog === 100 && <Badge variant="success"><Check size={9} strokeWidth={3} />Done</Badge>}
              {prog > 0 && prog < 100 && <Badge variant="default"><Clock size={9} />In progress</Badge>}
              {prog === 0 && <Badge variant="secondary"><Circle size={9} />Upcoming</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{data.title}</h3>
            <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mt-0.5 leading-relaxed line-clamp-2">{data.summary}</p>
            {/* Progress bar */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-zinc-100 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width:`${prog}%`, backgroundColor: prog===100 ? "#10b981" : "#d46a3a" }} />
              </div>
              <span className="text-[10px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 shrink-0">
                {doneN} / {data.tasks.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CircularProgress value={prog} />
            {open ? <ChevronDown size={15} className="text-zinc-400" /> : <ChevronRight size={15} className="text-zinc-400" />}
          </div>
        </button>

        {open && (
          <div className="border-t border-zinc-100 dark:border-white/[0.04] px-4 pb-4 pt-3 space-y-4">
            {cats.map(cat => {
              const catTasks = data.tasks.filter(t => t.cat === cat);
              const catDone  = catTasks.filter(t => state.done[t.id]).length;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {catIcon(cat)}
                    <Badge variant={catVariant(cat)}>{cat}</Badge>
                    <span className="text-[10px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 ml-auto">
                      {catDone} / {catTasks.length}
                    </span>
                  </div>
                  <div>
                    {catTasks.map(task => (
                      <TaskItem key={task.id} task={task}
                        isDone={!!state.done[task.id]}
                        doneBy={state.doneBy[task.id]}
                        doneAt={state.doneAt[task.id]}
                        onToggle={onToggle} />
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Targets */}
            <div className="pt-1 border-t border-zinc-100 dark:border-white/[0.04]">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                <Target size={12} className="text-brand" />Phase targets
              </p>
              <div className="flex flex-wrap gap-2">
                {data.targets.map(t => (
                  <div key={t.label} className="rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.04] px-3 py-2">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{t.label}</p>
                    <p className="text-xs font-bold font-mono text-brand">{t.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Milestone List ───────────────────────────────────────────────────────────

function MilestoneList({ data, state, onToggle }) {
  const [filter, setFilter] = useState("All");
  const { milestones, targets } = data;
  const prog    = milestoneProgress(milestones, state.done);
  const doneN   = milestones.filter(m => state.done[m.id]).length;
  const visible = filter === "All" ? milestones : milestones.filter(m => m.cat === filter);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-zinc-600 dark:text-[#a0aec0]">Milestones completed</span>
            <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">{doneN} / {milestones.length}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width:`${prog}%`, backgroundColor: prog===100 ? "#10b981" : "#d46a3a" }} />
          </div>
        </div>
        <span className="text-xl font-bold font-mono text-brand tabular-nums shrink-0">{prog}%</span>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {["All","Technical","Business","Marketing"].map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
              filter === c
                ? "bg-brand/10 text-brand border-brand/30"
                : "bg-zinc-100 dark:bg-white/[0.03] text-zinc-500 border-zinc-200 dark:border-white/[0.06] hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Milestones */}
      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] divide-y divide-zinc-100 dark:divide-white/[0.04] overflow-hidden">
        {visible.map(m => {
          const MIcon  = m.icon;
          const isDone = !!state.done[m.id];
          return (
            <div key={m.id} onClick={() => onToggle(m.id)}
              className={`flex items-center gap-3 px-4 py-3 group transition-colors cursor-pointer select-none
                hover:bg-zinc-50 dark:hover:bg-white/[0.02] ${isDone ? "opacity-50" : ""}`}>
              <div className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-all ${
                isDone ? "bg-brand border-brand" : "border-zinc-300 dark:border-white/20 group-hover:border-brand/60"
              }`}>
                {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.04]">
                <MIcon size={13} className={`transition-colors ${
                  isDone
                    ? "text-zinc-400 dark:text-zinc-600"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-brand"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${
                  isDone ? "line-through text-zinc-400 dark:text-zinc-600" : "text-zinc-700 dark:text-zinc-300"
                }`}>{m.text}</p>
                {isDone && state.doneBy[m.id] && (
                  <p className="text-[10px] mt-0.5 font-mono text-brand/60">
                    ✓ {state.doneBy[m.id]}{state.doneAt[m.id] ? `  ·  ${state.doneAt[m.id]}` : ""}
                  </p>
                )}
              </div>
              <Badge variant={catVariant(m.cat)} className="shrink-0">{m.cat}</Badge>
            </div>
          );
        })}
      </div>

      {/* Targets */}
      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
          <Target size={12} className="text-brand" />Key targets
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {targets.map(t => (
            <div key={t.label} className="rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.04] py-3 px-2 text-center">
              <p className="text-sm font-bold font-mono gradient-text">{t.value}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Team Switcher ────────────────────────────────────────────────────────────

function TeamSwitcher({ state, onSetUser, onAddMember }) {
  const [open, setOpen]       = useState(false);
  const [newName, setNewName] = useState("");

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all hover:opacity-80"
        style={{ backgroundColor:"rgba(212,106,58,0.15)", color:"#d46a3a", border:"1px solid rgba(212,106,58,0.3)" }}
        title={`Acting as: ${state.user}`}>
        {getInitials(state.user)}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-48 card-shadow rounded-xl bg-white dark:bg-[#14161c] p-2 overflow-hidden">
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Acting as
            </p>
            {state.members.map(m => (
              <button key={m} onClick={() => { onSetUser(m); setOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  state.user === m
                    ? "bg-brand/10 text-brand"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                }`}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shrink-0"
                  style={{ backgroundColor:"rgba(212,106,58,0.12)", color:"#d46a3a" }}>
                  {getInitials(m)}
                </span>
                <span className="flex-1 text-left">{m}</span>
                {state.user === m && <Check size={12} className="text-brand shrink-0" />}
              </button>
            ))}
            <div className="mt-2 border-t border-zinc-100 dark:border-white/[0.06] pt-2 flex gap-1.5">
              <input value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && newName.trim()) {
                    onAddMember(newName); onSetUser(newName.trim());
                    setNewName(""); setOpen(false);
                  }
                }}
                placeholder="Add member…"
                className="flex-1 rounded-lg bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-brand/50 transition-colors" />
              <button onClick={() => {
                if (newName.trim()) { onAddMember(newName); onSetUser(newName.trim()); setNewName(""); setOpen(false); }
              }} className="rounded-lg bg-zinc-100 dark:bg-white/[0.04] px-2 hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors">
                <Plus size={13} className="text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-shadow rounded-lg bg-white dark:bg-[#14161c] px-3 py-2 text-xs">
      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{payload[0]?.payload?.label ?? label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ${p.value >= 1000 ? `${(p.value/1000).toFixed(0)}k` : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Marketing Plan Tab ───────────────────────────────────────────────────────

const CAT_COLORS = {
  blue:    { badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",    dot: "bg-blue-500"    },
  pink:    { badge: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",    dot: "bg-pink-500"    },
  amber:   { badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20", dot: "bg-amber-500"  },
  emerald: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20", dot: "bg-emerald-500" },
  brand:   { badge: "bg-brand/10 text-brand border-brand/20", dot: "bg-brand" },
};

function MarketingPlanTab() {
  const [openCat, setOpenCat] = useState(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4 border-l-2 border-brand">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          3. Objectifs Marketing — SamOps
        </h3>
        <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] leading-relaxed">
          Plan structuré sur 3 ans · 5 axes stratégiques · KPIs mesurables par année
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        {["Year 1", "Year 2", "Year 3"].map((y, i) => (
          <span key={y} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border font-medium ${
            i === 0 ? "bg-brand/10 text-brand border-brand/25" :
            i === 1 ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" :
                      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${i===0?"bg-brand":i===1?"bg-blue-500":"bg-emerald-500"}`} />
            {y}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border font-medium bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 border-zinc-200 dark:border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />KPI · Segment · Action
        </span>
      </div>

      {/* Categories */}
      {MARKETING_PLAN.map((cat, ci) => {
        const colors = CAT_COLORS[cat.color] ?? CAT_COLORS.brand;
        const isOpen = openCat === ci;
        return (
          <div key={cat.category} className="card-shadow rounded-xl bg-white dark:bg-[#14161c] overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => setOpenCat(isOpen ? null : ci)}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-left"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
              <span className="flex-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                {cat.category}
              </span>
              <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 border ${colors.badge}`}>
                {cat.objectives.length} objectifs
              </span>
              {isOpen
                ? <ChevronDown size={14} className="text-zinc-400 shrink-0" />
                : <ChevronRight size={14} className="text-zinc-400 shrink-0" />}
            </button>

            {/* Objectives table */}
            {isOpen && (
              <div className="border-t border-zinc-100 dark:border-white/[0.04]">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-0 border-b border-zinc-100 dark:border-white/[0.04] bg-zinc-50 dark:bg-white/[0.02] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  <span>Objectif / KPI</span>
                  <span className="text-center">Year 1</span>
                  <span className="text-center">Year 2</span>
                  <span className="text-center">Year 3</span>
                  <span>Action clé</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                  {cat.objectives.map((obj, oi) => (
                    <div key={obj.id} className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                      {/* Mobile layout */}
                      <div className="sm:hidden space-y-2">
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                            {obj.objective}
                          </p>
                        </div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 pl-3.5">KPI : {obj.kpi}</p>
                        <div className="flex gap-2 flex-wrap pl-3.5">
                          <span className="text-[10px] rounded px-2 py-0.5 bg-brand/10 text-brand font-mono font-bold">{obj.y1}</span>
                          <span className="text-[10px] rounded px-2 py-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono font-bold">{obj.y2}</span>
                          <span className="text-[10px] rounded px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-bold">{obj.y3}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 pl-3.5 italic">{obj.action}</p>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 items-start">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed">{obj.objective}</p>
                          </div>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 pl-3.5">
                            KPI : <span className="font-medium text-zinc-500 dark:text-zinc-400">{obj.kpi}</span>
                          </p>
                          <p className="text-[10px] pl-3.5">
                            <span className={`rounded-full px-1.5 py-0.5 border text-[9px] font-medium ${colors.badge}`}>{obj.segment}</span>
                          </p>
                        </div>
                        <div className="text-center pt-0.5">
                          <span className="text-[11px] font-bold font-mono text-brand">{obj.y1}</span>
                        </div>
                        <div className="text-center pt-0.5">
                          <span className="text-[11px] font-bold font-mono text-blue-600 dark:text-blue-400">{obj.y2}</span>
                        </div>
                        <div className="text-center pt-0.5">
                          <span className="text-[11px] font-bold font-mono text-emerald-600 dark:text-emerald-400">{obj.y3}</span>
                        </div>
                        <div className="pt-0.5">
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed italic">{obj.action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary totals */}
      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
          <TrendingUp size={12} className="text-brand" />Récapitulatif des objectifs clés
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Clients actifs — Year 1",       value: "10–15",       color: "text-brand" },
            { label: "Clients actifs — Year 2",       value: "50–60",       color: "text-blue-600 dark:text-blue-400" },
            { label: "Clients actifs — Year 3",       value: "100–150",     color: "text-emerald-600 dark:text-emerald-400" },
            { label: "LinkedIn followers — Year 3",   value: "15 000+",     color: "text-brand" },
            { label: "Newsletter abonnés — Year 3",   value: "12 000+",     color: "text-pink-600 dark:text-pink-400" },
            { label: "Hackathons participés — 3 ans", value: "16–18",       color: "text-amber-600 dark:text-amber-400" },
            { label: "NPS cible — Year 3",            value: "≥ 60",        color: "text-emerald-600 dark:text-emerald-400" },
            { label: "G2 reviews — Year 3",           value: "100+",        color: "text-brand" },
            { label: "Partenaires MSP — Year 3",      value: "10+",         color: "text-blue-600 dark:text-blue-400" },
          ].map(t => (
            <div key={t.label} className="rounded-lg bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.04] py-3 px-3 text-center">
              <p className={`text-sm font-bold font-mono ${t.color}`}>{t.value}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-tight">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Financial Tab ────────────────────────────────────────────────────────────

function FinancialTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Bootstrap cost"   value="$50/mo"      sub="Months 1–3"        color="bg-brand/10 text-brand" />
        <StatCard icon={TrendingUp} label="Target M6 MRR"   value="$1.2k"       sub="8-15 customers"    color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={Award}      label="Pre-seed target"  value="$30k–$100k" sub="Month 9-15"         color="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
        <StatCard icon={Rocket}     label="Year 3 ARR target" value="$480k–$720k" sub="Progressive upside" color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
          Cost vs Revenue — 3-Year Projection
        </h3>
        <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-4">
          Conservative, Tunisia-realistic estimates — no hockey-stick assumptions.
        </p>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_CHART} margin={{ top:4, right:4, left:-12, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="n" tick={{ fill:"#9ca3af", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#9ca3af", fontSize:10 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `$${v/1000}k` : `$${v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize:11, color:"#9ca3af" }} />
              <Bar dataKey="cost" name="Cost"    fill="#d46a3a" radius={[3,3,0,0]} maxBarSize={32} />
              <Bar dataKey="rev"  name="Revenue" fill="#10b981" radius={[3,3,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {COST_BREAKDOWN.map(block => {
          const total = block.items.reduce((s,i) => s + i.cost, 0);
          return (
            <div key={block.period} className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4">
              <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">{block.period}</h4>
              <div className="space-y-2">
                {block.items.map(item => (
                  <div key={item.item} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-[#a0aec0]">{item.item}</span>
                    <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300">
                      {item.cost === 0 ? <span className="text-emerald-500 text-[10px]">Free</span> : `$${item.cost}`}
                    </span>
                  </div>
                ))}
                <div className="border-t border-zinc-100 dark:border-white/[0.06] pt-2 flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-500 dark:text-zinc-400">Total</span>
                  <span className="font-mono text-brand tabular-nums">${total}/mo</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
          <Award size={13} className="text-amber-500 dark:text-amber-400" />Funding Roadmap
        </h4>
        {FUNDING.map((f, i) => (
          <div key={f.event} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${
                ["bg-zinc-300 dark:bg-zinc-600","bg-brand/60","bg-brand","bg-amber-400","bg-emerald-400","bg-blue-400"][i] ?? "bg-zinc-400"
              }`} />
              {i < FUNDING.length-1 && <div className="w-px flex-1 bg-zinc-100 dark:bg-white/[0.06] my-1" />}
            </div>
            <div className={`flex-1 flex items-start justify-between gap-2 ${i < FUNDING.length-1 ? "pb-4" : ""}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{f.event}</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{f.when}</span>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-0.5">{f.detail}</p>
              </div>
              <span className="text-xs font-bold font-mono gradient-text shrink-0">{f.amount}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-shadow rounded-xl bg-white dark:bg-[#14161c] p-4 border border-emerald-500/15 dark:border-emerald-500/10">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          <TrendingUp size={13} className="text-emerald-500 dark:text-emerald-400" />Revenue Milestones
        </h4>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
          {[
            { period:"Month 3",  mrr:"~$100",  desc:"1-2 first clients" },
            { period:"Month 6",  mrr:"$1.2k",  desc:"8-15 customers" },
            { period:"Year 1",   mrr:"$4k",    desc:"10-15 customers" },
            { period:"Year 2",   mrr:"$20k",   desc:"50-60 customers" },
            { period:"Year 3",   mrr:"$58k",   desc:"100-150 customers" },
          ].map((t,i) => (
            <React.Fragment key={t.period}>
              <div className="flex-1 text-center py-1">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{t.period}</p>
                <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{t.mrr}</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600">{t.desc}</p>
              </div>
              {i < 4 && <ArrowRight size={12} className="text-zinc-300 dark:text-zinc-700 hidden sm:block shrink-0 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id:"sprint",    label:"0–3 Months" },
  { id:"growth",    label:"4–6 Months" },
  { id:"year1",     label:"Year 1" },
  { id:"year2",     label:"Year 2" },
  { id:"year3",     label:"Year 3" },
  { id:"marketing", label:"Marketing" },
  { id:"budget",    label:"Finances" },
];

export default function SamOpsRoadmap() {
  const { state, toggleTask, setUser, addMember } = useRoadmapState();
  const [activeTab, setActiveTab] = useState("sprint");

  // Theme — defaults to dark (samops-landing style)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("samops_theme") ?? "dark"; } catch { return "dark"; }
  });
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("samops_theme", next); } catch {}
  };

  // Overall progress (sprint + growth phases only)
  const allTasks = useMemo(() => [...SPRINT, ...GROWTH].flatMap(p => p.tasks), []);
  const overallProg = phaseProgress(allTasks, state.done);
  const totalDone   = allTasks.filter(t => state.done[t.id]).length;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0d0f14] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

        {/* ── Background — samops-landing ambient glow (dark only) ─── */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Orange gradient orb — top right */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-0 dark:opacity-25 transition-opacity duration-500"
            style={{ background:"radial-gradient(circle, #d46a3a 0%, transparent 65%)", transform:"translate(35%,-35%)" }} />
          {/* Secondary orb — bottom left */}
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-0 dark:opacity-12 transition-opacity duration-500"
            style={{ background:"radial-gradient(circle, #d46a3a 0%, #2b2f3a 50%, transparent 70%)", transform:"translate(-35%,35%)" }} />
          {/* Grid (dark only) */}
          <div className="absolute inset-0 opacity-0 dark:opacity-[0.025] transition-opacity duration-500"
            style={{ backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        </div>

        {/* ── Fixed header — samops-web / samops-landing style ──────── */}
        <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#0d0f14]/95 backdrop-blur-sm px-4 py-1.5">
          <div className="flex h-8 items-center gap-2 max-w-5xl mx-auto">
            {/* Logo */}
            <img src="/samops-icon.svg" alt="SamOps" className="size-6 shrink-0" />

            {/* Alpha badge — exact samops-web header style */}
            <span className="h-5 rounded-md border px-1.5 text-[10px] font-semibold uppercase tracking-wide flex items-center"
              style={{ borderColor:"rgba(212,106,58,0.30)", backgroundColor:"rgba(212,106,58,0.10)", color:"#d46a3a" }}>
              Alpha
            </span>

            <span className="text-zinc-300 dark:text-white/20 text-lg font-light select-none">/</span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">Roadmap</span>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-3">
              {/* Sprint progress */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-20 h-1 rounded-full bg-zinc-200 dark:bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width:`${overallProg}%`, backgroundColor:"#d46a3a" }} />
                </div>
                <span className="text-[11px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
                  {totalDone}/{allTasks.length}
                </span>
              </div>

              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className="flex h-7 w-7 items-center justify-center rounded-full border transition-all
                  border-zinc-200 dark:border-white/[0.10] bg-zinc-50 dark:bg-white/[0.04]
                  text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                {theme === "dark"
                  ? <Sun  size={13} />
                  : <Moon size={13} />}
              </button>

              {/* Team switcher */}
              <TeamSwitcher state={state} onSetUser={setUser} onAddMember={addMember} />
            </div>
          </div>
        </header>
        <div className="h-11 shrink-0" />

        {/* ── Page content ───────────────────────────────────────────── */}
        <main className="relative max-w-4xl mx-auto px-4 py-8 sm:py-10">

          {/* Hero */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-sm font-medium"
              style={{ borderColor:"rgba(212,106,58,0.25)", backgroundColor:"rgba(212,106,58,0.08)", color:"#d46a3a" }}>
              <Rocket size={14} />
              From academic project to FinOps SaaS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              SamOps —{" "}
              <span className="gradient-text">3-Year Roadmap</span>
            </h1>
            <p className="text-sm text-zinc-600 dark:text-[#a0aec0]">
              Tunisia-based · Team of 5 · FinOps / Cloud Cost Optimization · Realistic B2B SaaS growth
            </p>

            {/* Context banner */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3 text-xs leading-relaxed glass-strong dark:glass-strong"
              style={{ backgroundColor:"rgba(212,106,58,0.05)", border:"1px solid rgba(212,106,58,0.15)" }}>
              <span style={{ color:"#d46a3a" }} className="shrink-0 mt-0.5">ⓘ</span>
              <span className="text-zinc-600 dark:text-[#a0aec0]">
                We are a team of 5 building a B2B SaaS FinOps platform from Tunisia.
                The core product is built. This roadmap covers our go-to-market and growth execution —
                scoped realistically for an early-stage startup team.{" "}
                <strong className="text-zinc-800 dark:text-zinc-300">Click any task to mark it done.</strong>{" "}
                Use the avatar (top-right) to switch team members.
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-white/[0.08] text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "sprint" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                The immediate sprint: fix last technical debt, deploy to production, register the company in Tunisia,
                land first 1-2 paying customers.
                <span style={{ color:"#d46a3a" }} className="font-medium"> Click any task to mark it done.</span>
              </p>
              {SPRINT.map((p,i) => (
                <PhaseCard key={p.id} data={p} state={state} onToggle={toggleTask} defaultOpen={i===0} />
              ))}
            </div>
          )}

          {activeTab === "growth" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                With first customers validated: mobile app, incubator entry, first pilot contracts,
                open pre-seed conversations with Tunisian investors.
              </p>
              {GROWTH.map((p,i) => (
                <PhaseCard key={p.id} data={p} state={state} onToggle={toggleTask} defaultOpen={i===0} />
              ))}
            </div>
          )}

          {activeTab === "year1" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                Pre-seed deployed. SOC 2 Type I complete. First enterprise pilots in Tunisia.
                Team of 5. Morocco market entry. Target:{" "}
                <span style={{ color:"#d46a3a" }} className="font-medium">$3k–$5k MRR · ~10–15 clients</span>.
              </p>
              <MilestoneList data={Y1} state={state} onToggle={toggleTask} />
            </div>
          )}

          {activeTab === "year2" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                Seed round closed. Team of 6-8. France market entry. White-label for MSPs.
                AWS Marketplace listed. ISO 27001 process initiated. Target:{" "}
                <span style={{ color:"#d46a3a" }} className="font-medium">$12k–$22k MRR · ~50–60 clients</span>.
              </p>
              <MilestoneList data={Y2} state={state} onToggle={toggleTask} />
            </div>
          )}

          {activeTab === "year3" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                Series A targeted. Team of 12-18 across MENA + France. AI-native platform.
                ISO 27001 + ISO 9001 certified. MENA + EU established. Target:{" "}
                <span style={{ color:"#d46a3a" }} className="font-medium">$40k–$60k MRR · 100–150 clients</span>.
              </p>
              <MilestoneList data={Y3} state={state} onToggle={toggleTask} />
            </div>
          )}

          {activeTab === "marketing" && (
            <div>
              <p className="text-[11px] text-zinc-500 dark:text-[#a0aec0] mb-5 leading-relaxed">
                Plan marketing structuré sur 3 ans — 5 axes stratégiques avec KPIs mesurables.
                Cliquez sur chaque catégorie pour voir les objectifs détaillés.
              </p>
              <MarketingPlanTab />
            </div>
          )}

          {activeTab === "budget" && <FinancialTab />}

          {/* Footer */}
          <footer className="mt-14 pt-6 border-t border-zinc-100 dark:border-white/[0.04] text-center space-y-1">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
              SamOps Roadmap · FinOps SaaS from Tunisia · Team of 5 · B2B SaaS
            </p>
            <p className="text-[10px] text-zinc-300 dark:text-zinc-700">
              Realistic 3-year vision · Small team · Progressive growth
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
