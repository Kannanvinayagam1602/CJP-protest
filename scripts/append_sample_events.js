#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(),'public','data','protests.json');
const backup = path.join(process.cwd(),'public','data',`protests.append.backup.${Date.now()}.json`);
if(!fs.existsSync(file)){ console.error('protests.json not found'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file,'utf8'));
fs.writeFileSync(backup, JSON.stringify(data,null,2),'utf8');
const sample = [
  { id:'EVT-SMP-0001', date:'2026-05-18', location:'Mumbai - Azad Maidan', city:'Mumbai', state:'Maharashtra', lat:19.076, lng:72.8777, event:'Rally', duration_day:1, estimated_participants:8200, arrests_reported:12, injuries_reported:4, main_demand:'Education Reform', secondary_demand:'Curriculum Review', government_response:'Public Statement', police_action:'Monitoring', media_attention:'High', outcome:'Pending', status:'Ongoing', source:'Hindustan Times', source_url:'https://example.org/ht-mumbai-azad' },
  { id:'EVT-SMP-0002', date:'2026-05-19', location:'Bangalore - City Center', city:'Bangalore', state:'Karnataka', lat:12.9716, lng:77.5946, event:'Sit-in', duration_day:2, estimated_participants:4500, arrests_reported:0, injuries_reported:1, main_demand:'Police Accountability', secondary_demand:'Campus Safety Measures', government_response:'Meeting Scheduled', police_action:'Barricades', media_attention:'Moderate', outcome:'Pending', status:'Ongoing', source:'Local Press', source_url:'https://example.org/local-bangalore' },
  { id:'EVT-SMP-0003', date:'2026-05-20', location:'Chennai - Marina Beach', city:'Chennai', state:'Tamil Nadu', lat:13.0827, lng:80.2707, event:'March', duration_day:1, estimated_participants:6200, arrests_reported:5, injuries_reported:2, main_demand:'Compensation', secondary_demand:'Fee Rollback', government_response:'Negotiation', police_action:'Monitoring', media_attention:'High', outcome:'Pending', status:'Ongoing', source:'The Hindu', source_url:'https://example.org/thehindu-chennai' },
  { id:'EVT-SMP-0004', date:'2026-07-21', location:'Kolkata - Esplanade', city:'Kolkata', state:'West Bengal', lat:22.5726, lng:88.3639, event:'Candlelight Vigil', duration_day:1, estimated_participants:2300, arrests_reported:0, injuries_reported:0, main_demand:'No Action Against Protestors', secondary_demand:'Independent Inquiry', government_response:'Public Statement', police_action:'None', media_attention:'Moderate', outcome:'Pending', status:'Ongoing', source:'Regional News', source_url:'https://example.org/regional-kolkata' },
  { id:'EVT-SMP-0005', date:'2026-07-22', location:'Hyderabad - Tank Bund', city:'Hyderabad', state:'Telangana', lat:17.385, lng:78.4867, event:'Press Conference', duration_day:1, estimated_participants:1800, arrests_reported:0, injuries_reported:0, main_demand:'Education Reform', secondary_demand:'Scholarship Fund', government_response:'Meeting Scheduled', police_action:'None', media_attention:'High', outcome:'Pending', status:'Ongoing', source:'Times of India', source_url:'https://example.org/toi-hyderabad' },
  { id:'EVT-SMP-0006', date:'2026-05-21', location:'Pune - Shivaji Garden', city:'Pune', state:'Maharashtra', lat:18.5204, lng:73.8567, event:'Public Statement', duration_day:1, estimated_participants:1250, arrests_reported:0, injuries_reported:0, main_demand:'Compensation', secondary_demand:null, government_response:'Meeting Scheduled', police_action:'None', media_attention:'Low', outcome:'Pending', status:'Ongoing', source:'Local Bulletin', source_url:'https://example.org/pune-bulletin' },
  { id:'EVT-SMP-0007', date:'2026-05-22', location:'Ahmedabad - Law Garden', city:'Ahmedabad', state:'Gujarat', lat:23.0225, lng:72.5714, event:'Student Assembly', duration_day:1, estimated_participants:3400, arrests_reported:2, injuries_reported:0, main_demand:'Police Accountability', secondary_demand:'Scholarship Fund', government_response:'Negotiation', police_action:'Monitoring', media_attention:'Moderate', outcome:'Pending', status:'Ongoing', source:'Local Press', source_url:'https://example.org/ahmedabad-news' },
  { id:'EVT-SMP-0008', date:'2026-05-23', location:'Delhi - Jantar Mantar', city:'Delhi', state:'Delhi', lat:28.6143, lng:77.2090, event:'Mass Rally', duration_day:1, estimated_participants:15000, arrests_reported:20, injuries_reported:6, main_demand:'Minister Resignation', secondary_demand:'Independent Inquiry', government_response:'Police Deployment', police_action:'Mild Dispersal', media_attention:'Very High', outcome:'Pending', status:'Ongoing', source:'National Media', source_url:'https://example.org/national-delhi' }
];

// avoid duplicates by id
const existingIds = new Set(data.events.map(e=>e.id));
const toAdd = sample.filter(s=>!existingIds.has(s.id));
if(toAdd.length===0){ console.log('No new sample events to add'); process.exit(0); }

data.events.push(...toAdd);

// recompute meta
const dates = data.events.map(e=>e.date).filter(Boolean).map(d=>new Date(d));
if(dates.length){
  const min = new Date(Math.min(...dates.map(d=>d.getTime())));
  const max = new Date(Math.max(...dates.map(d=>d.getTime())));
  data.meta.start_date = min.toISOString().slice(0,10);
  data.meta.end_date = max.toISOString().slice(0,10);
  data.meta.total_duration_days = Math.round((max-min)/(1000*60*60*24))+1;
}
const cities = Array.from(new Set(data.events.map(e=>e.city).filter(Boolean)));
if(cities.length) data.meta.cities = cities;
const demands = Array.from(new Set(data.events.map(e=>e.main_demand).filter(Boolean)));
if(demands.length) data.meta.main_demands = demands;

fs.writeFileSync(file, JSON.stringify(data,null,2),'utf8');
console.log('Appended', toAdd.length, 'events. Backup saved to', backup);
