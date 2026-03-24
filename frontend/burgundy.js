import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const base = path.join(__dirname, 'src');

function r(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  for (const [from, to] of replacements) {
    if (typeof from === 'string') {
      newContent = newContent.split(from).join(to);
    } else {
      newContent = newContent.replace(from, to);
    }
  }
  if(newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }
}

// 1. LecturerNav.tsx
const navPath = path.join(base, 'components/layout/LecturerNav.tsx');
r(navPath, [
  ['#78350f', '#881337'],
  ['amber-100', 'rose-100'],
  ['border-amber-200', 'border-rose-200'], 
  ['amber-600', 'rose-600'],
  ['amber-700', 'rose-700'],
  ['amber-50', 'rose-50']
]);

// 2. LecturerProfile.tsx
const profilePath = path.join(base, 'pages/LecturerProfile.tsx');
r(profilePath, [
  ['#78350f', '#881337'],
  ['amber-100', 'rose-100'],
  ['amber-200', 'rose-200'],
  ['amber-300', 'rose-300'],
  ['amber-600', 'rose-600'],
  ['amber-700', 'rose-700'],
  ['amber-800', 'rose-800'],
  ['amber-900', 'rose-900'],
  ['amber-50', 'rose-50'],
  ['orange-50', 'stone-50'],
  ['orange-600', 'stone-600'],
  ['orange-700', 'stone-700'],
  ['badge-amber', 'badge-rose']
]);

// 3. LecturerAssignments.tsx
const assignPath = path.join(base, 'pages/Module3/LecturerAssignments.tsx');
r(assignPath, [
  ['#78350f', '#881337'],
  ['hover:bg-amber-900', 'hover:bg-rose-900'],
  ['shadow-amber-900/20', 'shadow-rose-900/20'],
  ['border-b-amber-200', 'border-b-rose-200'],
  ['border-l-amber-600', 'border-l-rose-600'],
  ['group-hover:text-amber-900', 'group-hover:text-rose-900'],
  ['bg-amber-50', 'bg-rose-50'],
  ['border-amber-200', 'border-rose-200'],
  ['text-amber-700', 'text-rose-700'],
  ['bg-amber-100/50', 'bg-rose-100/50'],
  ['border-amber-100', 'border-rose-100'],
  ['text-amber-800', 'text-rose-800'],
  ['ring-amber-500', 'ring-rose-500'],
  ['border-amber-500', 'border-rose-500'],
  ['hover:border-amber-300', 'hover:border-rose-300'],
  // Do not universally replace amber-600 or badge-amber as they are used for 'Late/At Risk' states.
]);

// 4. LecturerGroupList.tsx
const groupListPath = path.join(base, 'pages/Module3/LecturerGroupList.tsx');
r(groupListPath, [
  ['#78350f', '#881337'],
  ['border-b-amber-200', 'border-b-rose-200'],
  ['<span className="text-amber-600 text-2xl font-black">({selectedModule})</span>', '<span className="text-rose-600 text-2xl font-black">({selectedModule})</span>']
]);

// 5. LecturerDashboard.tsx
const dashPath = path.join(base, 'pages/Module1/LecturerDashboard.tsx');
r(dashPath, [
  ['hover:border-emerald-100', 'hover:border-rose-100'],
  ['group-hover:text-emerald-600', 'group-hover:text-rose-600'],
  ['hover:bg-emerald-600', 'hover:bg-rose-600']
]);

console.log('Lecturer pages updated to Burgundy & Rosewood.');
