// Local-only previews with sample data. This script never sends emails.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const ts = require('typescript');
const React = require('react');
const { render } = require('@react-email/render');
const root = path.resolve(__dirname, '..');
const emailRoot = path.join(root, 'src/components/email');

for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    module._compile(result.outputText, filename);
  };
}
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
const files = walk(emailRoot).filter(file => file.endsWith('.tsx') && fs.readFileSync(file, 'utf8').includes('<EmailLogo'));
const examples = {
  type: 'welcome', company: 'Taskoria', username: 'Alex', customerName: 'Alex',
  verifyCode: '123456', taskTitle: 'House Cleaning', taskLocation: 'Brisbane',
  price: '150', unit: 'per job', messageFromProvider: 'Hello Alex, I can help with your house cleaning this week.',
  professional_name: 'Jordan', professional_company_name: 'Example Cleaning',
  contactName: 'Alex', contactEmail: 'alex@example.com', contactSubject: 'Example support request',
  contactMessage: 'This is sample content for the email preview.', completionPercent: 50,
  profileFlags: { hasAboutAndBio: true, hasServices: true, hasPhotos: false, hasSocialLinks: false, hasAccreditations: false, hasFaqs: false },
  title: 'Taskoria email preview', children: React.createElement('p', null, 'Example email content.'),
};
const options = files.map((file, index) => `<option value="${index}"${file.endsWith('/ProviderNewTaskEmail.tsx') ? ' selected' : ''}>${path.relative(emailRoot, file)}</option>`).join('');
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taskoria email previews</title>
<style>*{box-sizing:border-box}body{margin:0;background:#e8edf5;font:15px system-ui;color:#17233a}header{padding:18px 24px;background:white;border-bottom:1px solid #ced7e5}h1{margin:0 0 8px;font-size:22px}p{margin:8px 0;color:#526079}.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap}select,button{font:inherit;padding:8px;border:1px solid #b9c5d6;border-radius:6px;background:white}main{padding:20px 8px}iframe{display:block;margin:auto;width:390px;max-width:100%;height:80vh;border:1px solid #c1cbdc;background:white;border-radius:8px}</style></head>
<body><header><h1>Taskoria email previews</h1><p>Sample data only — no emails are sent. Browser previews do not reproduce every Gmail or Outlook behavior.</p><div class="controls"><label>Email <select id="email">${options}</select></label><label>Width <select id="size"><option value="320">Small mobile · 320px</option><option value="390" selected>Mobile · 390px</option><option value="768">Tablet · 768px</option><option value="900">Desktop · 900px</option></select></label><button id="refresh">Refresh preview</button></div></header><main><iframe id="preview" title="Selected email preview" sandbox=""></iframe></main>
<script>const email=document.getElementById('email'),size=document.getElementById('size'),preview=document.getElementById('preview');function update(){preview.style.width=size.value+'px';preview.src='/email/'+email.value+'?t='+Date.now()}email.onchange=update;size.onchange=()=>preview.style.width=size.value+'px';document.getElementById('refresh').onclick=update;update();</script></body></html>`;
const server = http.createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    return response.end(page);
  }
  const match = /^\/email\/(\d+)$/.exec(url.pathname);
  const file = match && files[Number(match[1])];
  if (!file) { response.statusCode = 404; return response.end('Not found'); }
  try {
    for (const key of Object.keys(require.cache)) if (key.startsWith(emailRoot + path.sep)) delete require.cache[key];
    const exports = require(file);
    const Component = Object.values(exports).find(value => typeof value === 'function');
    const html = await render(React.createElement(Component, examples));
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(html);
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.end('Could not render preview. See the terminal for details.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(3001, '127.0.0.1', () => console.log(`Email previews: http://127.0.0.1:3001 (${files.length} templates). Press Ctrl+C to stop.`));
