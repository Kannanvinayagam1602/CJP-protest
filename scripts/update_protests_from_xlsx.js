#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function normalizeHeader(h){
	return (h||'').toString().trim().toLowerCase().replace(/\s+/g,'_');
}

const argv = process.argv.slice(2);
if(argv.length < 1){
	console.error('Usage: node scripts/update_protests_from_xlsx.js <excel-file>');
	process.exit(2);
}
const excelPath = path.resolve(argv[0]);
const workspaceRoot = process.cwd();
const jsonPath = path.join(workspaceRoot, 'public', 'data', 'protests.json');
const backupPath = path.join(workspaceRoot, 'public', 'data', `protests.backup.${Date.now()}.json`);

if(!fs.existsSync(excelPath)){
	console.error('Excel file not found:', excelPath);
	process.exit(1);
}
if(!fs.existsSync(jsonPath)){
	// allow creating new json if missing
	fs.writeFileSync(jsonPath, JSON.stringify({meta:{generated_at:null}, events:[]}, null, 2));
}

const wb = xlsx.readFile(excelPath);
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(ws, {defval: null});
if(rows.length === 0){
	console.error('No rows found in sheet', sheetName);
	process.exit(1);
}

function mapRow(row, idx){
	const hdr = {};
	Object.keys(row).forEach(h => { hdr[normalizeHeader(h)] = row[h]; });
	const mapped = {
		id: hdr['id'] || hdr['event_id'] || `EVT-VD-${String(idx+1).padStart(4,'0')}`,
		date: hdr['date'] || null,
		location: hdr['location'] || null,
		city: (hdr['location'] ? hdr['location'].toString().replace(/^New\s+/i,'') : null),
		state: null,
		lat: null,
		lng: null,
		event: hdr['event'] || null,
		duration_day: hdr['duration_day'] ? Number(hdr['duration_day']) : (hdr['day'] ? Number(hdr['day']) : null),
		estimated_participants: hdr['participants_reported'] ? Number(hdr['participants_reported']) : null,
		arrests_reported: hdr['arrests_reported'] ? Number(hdr['arrests_reported']) : null,
		injuries_reported: hdr['injuries_reported'] ? Number(hdr['injuries_reported']) : null,
		main_demand: hdr['main_demand'] || null,
		secondary_demand: hdr['secondary_demand'] || null,
		government_response: hdr['government_action'] || null,
		police_action: hdr['police_action'] || null,
		media_attention: hdr['media_attention'] || null,
		outcome: hdr['outcome'] || null,
		status: hdr['status'] || null,
		source: hdr['source'] || null,
		source_url: hdr['source_url'] || null
	};
	Object.keys(mapped).forEach(k => { if(mapped[k] === '') mapped[k] = null; });
	return mapped;
}

const events = rows.map((r, i) => mapRow(r, i));

// backup existing
let existing = {meta:{generated_at:null}, events:[]};
try{ existing = JSON.parse(fs.readFileSync(jsonPath,'utf8')); }catch(e){}
fs.writeFileSync(backupPath, JSON.stringify(existing,null,2), 'utf8');

// derive meta fields from events
const dates = events.map(e => e.date).filter(Boolean).map(d => new Date(d));
const minDate = dates.length ? new Date(Math.min(...dates.map(d=>d.getTime()))) : null;
const maxDate = dates.length ? new Date(Math.max(...dates.map(d=>d.getTime()))) : null;
const uniqCities = Array.from(new Set(events.map(e=>e.city).filter(Boolean)));
const uniqDemands = Array.from(new Set(events.map(e=>e.main_demand).filter(Boolean)));

const newMeta = Object.assign({}, existing.meta || {});
newMeta.generated_at = new Date().toISOString().slice(0,10);
newMeta.title = 'CJP Protest Movement — Verified Dataset';
newMeta.disclaimer = 'This dataset contains verified sample records provided by user. Review sources for real-world use.';
if(minDate && maxDate){
	newMeta.start_date = minDate.toISOString().slice(0,10);
	newMeta.end_date = maxDate.toISOString().slice(0,10);
	const diffDays = Math.round((maxDate - minDate)/(1000*60*60*24)) + 1;
	newMeta.total_duration_days = diffDays;
}
if(uniqCities.length) newMeta.cities = uniqCities;
if(uniqDemands.length) newMeta.main_demands = uniqDemands;

const out = { meta: newMeta, events };
fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', events.length, 'events to', jsonPath);
console.log('Backup saved to', backupPath);
