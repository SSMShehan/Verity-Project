const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\sheha\\Desktop\\ITPM\\Verity Project\\frontend\\src';

const filesToThemed = [
  'components/layout/LecturerNav.tsx',
  'pages/Module1/LecturerDashboard.tsx',
  'pages/Module3/LecturerAssignments.tsx',
  'pages/Module3/LecturerGroupDashboard.tsx',
  'pages/Module3/LecturerGroupList.tsx',
  'pages/Module3/LecturerGroupMembers.tsx',
  'pages/Module3/LecturerReview.tsx',
  'pages/Module4/SubmissionReview.tsx',
  'pages/LecturerProfile.tsx'
];

let filesProcessed = 0;
let filesSkipped = 0;

filesToThemed.forEach(relPath => {
  const fullPath = path.join(srcDir, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Convert hex literal and ruby themes to Indigo
    content = content.replace(/\[#881337\]/g, 'indigo-900');
    content = content.replace(/rose-/g, 'indigo-');
    
    // Write back
    fs.writeFileSync(fullPath, content);
    console.log(`Updated theme for ${relPath}`);
    filesProcessed++;
  } else {
    console.log(`Skipped (Not Found): ${relPath}`);
    filesSkipped++;
  }
});

console.log(`\nDONE: Processed ${filesProcessed} files | Skipped ${filesSkipped} files`);
