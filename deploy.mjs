// oral-fun-kids-keijikai デプロイスクリプト
// 2026-05-23 作成: 個人情報漏洩防止のため NETLIFY_EXCLUDE 設定済み
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { preDeployFieldCheck, shouldDeployFile, preDeployContentScan } from '../.claude/scripts/pre-deploy-check.mjs';

const configPath = path.join(process.env.APPDATA, 'netlify', 'Config', 'config.json');
const c = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const tok = c.users[c.userId].auth.token;
const siteId = 'd9ce2196-7833-4a2b-b17a-05a8dbb3dee5'; // oral-fun-kids-keijikai
const dir = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')));

// 🛡 PRE-DEPLOY フィールド連携チェック（必須）
await preDeployFieldCheck(dir);

const NETLIFY_EXCLUDE = new Set([
  'patients.json', 'patients_honin.json', 'patients_east.json', 'staff-master.json',
  'firestore.rules', 'firestore.indexes.json', 'firebase.json',
  'deploy.mjs', 'serve.mjs', '.env', '.env.local', 'package.json', 'package-lock.json'
]);

const files = {};
// 🛡 ホワイトリスト方式（2026-05-25 対策1）
// アプリ固有の追加許可（個人情報を含まないJSON等。manifest.json は DEFAULT_ALLOW_FILES に含む）
const EXTRA_ALLOW_FILES = new Set([
  // 必要に応じてアプリ固有の許可ファイルをここに追加

  // 2026-05-25 ハニーポット（攻撃者の偵察行動検知用）
  'honeypot-patients-v2.json',
  'honeypot-backup.json',
]);

function walk(d) {
  for (const f of fs.readdirSync(d)) {
    if (f.startsWith('.') || f === 'node_modules') continue;
    const full = path.join(d, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else {
      if (!shouldDeployFile(f, { exclude: NETLIFY_EXCLUDE, extraAllowFiles: EXTRA_ALLOW_FILES })) continue;
      const rel = '/' + path.relative(dir, full).split(path.sep).join('/');
      const hash = crypto.createHash('sha1').update(fs.readFileSync(full)).digest('hex');
      files[rel] = hash;
    }
  }
}
walk(dir);
console.log('Files:', Object.keys(files).length);

// 🔍 デプロイ予定ファイルの中身を全部スキャン（CRITICAL検出で即exit 1）
await preDeployContentScan(files, dir);

const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ files })
});
console.log('Create deploy:', res.status);
const deploy = await res.json();

if (deploy.required?.length) {
  console.log('Uploading', deploy.required.length, 'files...');
  for (const hash of deploy.required) {
    const filePath = Object.entries(files).find(([, h]) => h === hash)?.[0];
    if (!filePath) continue;
    const body = fs.readFileSync(path.join(dir, filePath));
    const r = await fetch(`https://api.netlify.com/api/v1/deploys/${deploy.id}/files${filePath}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/octet-stream' },
      body
    });
    console.log(' ', filePath, r.status);
  }
}
console.log('Deploy:', deploy.ssl_url || deploy.url);
console.log('State:', deploy.state);

// ============================================================
// 🛡 Post-deploy 個人情報漏洩 自動検証（2026-05-24 追加）
// 過去事故: 2026-05-23 漏洩、2026-05-24 再発（Claudeが netlify deploy --dir=. を使用）
// このブロックは「ルール破り」があっても結果として漏洩を検知する最終ガード
// ============================================================
console.log('\n=== 🛡 Post-deploy security verification ===');
const PERSONAL_INFO_FILES = ['patients.json','patients_honin.json','patients_east.json','staff-master.json'];
const SENSITIVE_INFRA_FILES = ['deploy.mjs','serve.mjs','firebase.json','firestore.rules','firestore.indexes.json','.env','.env.local'];

// プロダクションURLを取得
const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
  headers: { Authorization: `Bearer ${tok}` }
});
const site = await siteRes.json();
const baseUrl = site.ssl_url || site.url;
console.log('Verifying production URL:', baseUrl);

// CDN伝播待ち（8秒）
console.log('Waiting 8s for CDN propagation...');
await new Promise(r => setTimeout(r, 8000));

let leakDetected = false;
for (const fn of PERSONAL_INFO_FILES) {
  const url = `${baseUrl}/${fn}?_check=${Date.now()}`;
  try {
    const r = await fetch(url);
    const text = await r.text();
    const head = text.substring(0, 100).trim();
    // JSONらしく始まれば漏洩
    if (head.startsWith('{') || head.startsWith('[')) {
      console.error(`🚨 LEAK DETECTED: ${fn} (${text.length} bytes)`);
      console.error(`   Head: ${head.substring(0, 60)}`);
      leakDetected = true;
    } else {
      console.log(`✅ ${fn}: safe`);
    }
  } catch (e) {
    console.log(`⚠️  ${fn}: check failed (${e.message})`);
  }
}

// インフラファイル（deploy.mjs等）の公開チェック
for (const fn of SENSITIVE_INFRA_FILES) {
  const url = `${baseUrl}/${fn}?_check=${Date.now()}`;
  try {
    const r = await fetch(url);
    const text = await r.text();
    const head = text.substring(0, 200);
    if (head.includes('import ') || head.includes('require(') || head.includes('rules_version') || head.includes('"indexes"')) {
      console.error(`🚨 インフラ漏洩 LEAK DETECTED: ${fn}`);
      console.error(`   Head: ${head.substring(0, 80)}`);
      leakDetected = true;
    } else {
      console.log(`✅ ${fn}: safe`);
    }
  } catch (e) {
    console.log(`⚠️  ${fn}: check failed (${e.message})`);
  }
}

if (leakDetected) {
  console.error('\n🚨🚨🚨 個人情報漏洩を検出しました 🚨🚨🚨');
  console.error('即座に以下を実行してください:');
  console.error('1. Netlify Console で今のデプロイを Delete deploy');
  console.error('2. deploy.mjs の NETLIFY_EXCLUDE を確認・追加');
  console.error('3. node deploy.mjs で再デプロイ');
  console.error('4. 漏洩していた可能性のあるデータを CLAUDE.md「個人情報JSON漏洩ルール」に基づいて対応');
  process.exit(1);
}

console.log('\n✅ Security verification passed. No personal info leaked.');
