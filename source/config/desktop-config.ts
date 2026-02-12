/**
 * Desktop Configuration
 * Defines desktop icons and their properties
 */

import { BASE_URL, ICONS } from "./assets.js";
import type { IconConfig, TaskbarAppConfig } from "../types/index.js";

export const DESKTOP_ICONS: IconConfig[] = [
  // Top-left icons
  {
    id: "computer",
    name: "Computer",
    icon: ICONS.computer,
    column: "left",
    position: { y: 20 },
    contentType: "text",
    contentData: {
      text: "I will come up with something for this 😆"
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "properties", label: "Properties", action: "properties" },
      { type: "separator" },
      { id: "manage", label: "Manage", action: "manage" },
    ],
  },
  {
    id: "file-explorer",
    name: "File Explorer",
    icon: ICONS.fileExplorer,
    column: "left",
    position: { y: 120 },
    contentType: "folder",
    contentData: {
      items: [
        {
          name: "Recent",
          type: "folder",
          items: [],
        },
        {
          name: "Libraries",
          type: "folder",
          items: [
            {
              name: "Documents",
              type: "folder",
              items: [
                {
                  name: "The Interview.txt",
                  type: "file",
                  contentType: "text",
                  text: "Interviewer: It says here on your resume that you’re extremely fast at math.\nCandidate: Yes, I am.\nInterviewer: Okay, what’s $37 \times 42$? \nCandidate: 54.\nInterviewer: That’s not even close.\nCandidate: But it was fast."
                }
              ],
            },
            {
              name: "Pictures",
              type: "folder",
              items: [],
            },
          ],
        },
      ],
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      {
        id: "run-as-admin",
        label: "Run as administrator",
        action: "runAsAdmin",
      },
    ],
  },
  {
    id: "recycle-bin",
    name: "Recycle Bin",
    icon: ICONS.recycleBin,
    column: "left",
    position: { y: 220 },
    contentType: "folder",
    contentData: {
      items: [
        {
          name: "old_readme.txt",
          type: "file",
          contentType: "text",
          text: "The very first and only file that is deleted 😆😆",
        },
      ],
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "empty", label: "Empty Recycle Bin", action: "empty" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "privacy-policy",
    name: "Privacy Policy",
    icon: ICONS.privacyPolicy,
    column: "left",
    position: { y: 320 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/privacy-policy.html`,
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },

  // Middle icons
  {
    id: "work-experiences",
    name: "Professional Experiences",
    icon: ICONS.briefcase,
    column: "middle",
    position: { y: 20 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/work-experience.html`
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "view-resume", label: "View Resume", action: "viewResume" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "educations",
    name: "Educations & Certifications",
    icon: ICONS.graduation,
    column: "middle",
    position: { y: 120 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/edu-certs.html`
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      {
        id: "view-certificates",
        label: "View Certificates",
        action: "viewCertificates",
      },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    icon: ICONS.projects,
    column: "middle",
    position: { y: 220 },
    contentType: "folder",
    contentData: {
      items: [
        {
          contentType: "iframe",
          url: `${BASE_URL}tabs/search-service.html`,
          name: "Search Service",
          type: "iframe",
        },
        {
          contentType: "iframe",
          url: `${BASE_URL}tabs/video-service.html`,
          name: "Video Processing Service",
          type: "iframe",
        },
        {
          contentType: "iframe",
          url: `${BASE_URL}tabs/alumni-app.html`,
          name: "Alumni App",
          type: "iframe",
        },
      ],
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "view-github", label: "View on GitHub", action: "viewGithub" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },

  // Top-right icons
  {
    id: "photos",
    name: "Photos",
    icon: ICONS.photos,
    column: "right",
    position: { y: 20 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/gallery.html`,
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "import", label: "Import photos and videos", action: "import" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "movies",
    name: "Movies",
    icon: ICONS.movies,
    column: "right",
    position: { y: 120 },
    contentType: "text",
    contentData: {
      text: "Movie app coming soon...",
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "play", label: "Play all", action: "playAll" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "music",
    name: "Music",
    icon: ICONS.music,
    column: "right",
    position: { y: 220 },
    contentType: "text",
    contentData: {
      text: "Music app coming soon...",
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { id: "play-all", label: "Play all", action: "playAll" },
      { id: "shuffle", label: "Shuffle", action: "shuffle" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "ai",
    name: "AI",
    icon: ICONS.robot,
    column: "right",
    position: { y: 320 },
    contentType: "text",
    contentData: {
      text: "I'm about to master the technology of Artificial Intelligence. Stay tuned for amazing AI-powered applications!",
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "message-me",
    name: "Message Me",
    icon: ICONS.message,
    column: "right",
    position: { y: 420 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/message.html`,
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
  {
    id: "gmail-ai",
    name: "Gmail Cleaner AI",
    icon: ICONS.robot,
    column: "right",
    position: { y: 520 },
    contentType: "iframe",
    contentData: {
      url: `${BASE_URL}tabs/ai-chat.html`,
    },
    menuItems: [
      { id: "open", label: "Open", action: "open" },
      { type: "separator" },
      { id: "properties", label: "Properties", action: "properties" },
    ],
  },
];

export const TASKBAR_APPS: TaskbarAppConfig[] = [
  // Apps are added dynamically when windows open
];

export const DEFAULT_ICON_SPACING = 100;
