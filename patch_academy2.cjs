const fs = require('fs');
let code = fs.readFileSync('src/components/AcademyDashboard.tsx', 'utf8');

// Title yellow
code = code.replace(
  '<h2 className="text-2xl font-black text-white">SIRWISE AI WEB3 ACADEMY</h2>',
  '<h2 className="text-2xl font-black text-[#FFD700]">SIRWISE AI WEB3 ACADEMY</h2>'
);

// Grid to vertical stack with gap 16px
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
  '<div className="flex flex-col" style={{ gap: "16px" }}>'
);

// Card style
const oldCardWrapper = 'className={`bg-[#111] rounded-2xl p-6 border transition-all ${isCompleted ? \'border-[#10B981]\' : \'border-[#333] hover:border-[#666]\'}`}';
const newCardWrapper = 'className="bg-[#111] rounded-[16px] p-[20px] transition-all" style={{ border: "2px solid #FFD700" }}';
code = code.replace(/className=\{\`bg-\[\#111\] rounded-2xl p-6 border transition-all \$\{isCompleted \? 'border-\[\#10B981\]' : 'border-\[\#333\] hover:border-\[\#666\]'\}\`\}/g, newCardWrapper);

// Change "START MODULE" to "Start Learning"
code = code.replace(/> START MODULE<\/>\}/g, '> Start Learning</>}');

// Also make the locked button yellow if they want "yellow buttons"
code = code.replace(
  `bg-[#222] text-gray-500 border border-[#333] hover:bg-[#333] hover:text-white transition"`,
  `bg-[#FFD700] text-black font-bold border border-[#FFD700] hover:scale-105 transition"`
);
code = code.replace(`[ LOCKED ]`, `Unlock Course`);

// The "Complete all 4 modules" text -> "Complete all modules"
code = code.replace(`Complete all 4 modules`, `Complete all modules`);

fs.writeFileSync('src/components/AcademyDashboard.tsx', code);
