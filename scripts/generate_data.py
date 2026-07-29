"""
Deterministic generator for a FICTIONAL protest-movement dataset used to
power the CJP (Citizens for Justice Platform) Protest Analytics Dashboard.

IMPORTANT: This is illustrative/sample data for a fictional scenario.
It is NOT reporting on a real event and is NOT attributed to real news
organizations. The `source` field says "Sample Data" throughout.
"""
import json
import random
from datetime import date, timedelta

random.seed(42)

CITIES = [
    ("Delhi", "Delhi", 28.6139, 77.2090),
    ("Mumbai", "Maharashtra", 19.0760, 72.8777),
    ("Chennai", "Tamil Nadu", 13.0827, 80.2707),
    ("Hyderabad", "Telangana", 17.3850, 78.4867),
    ("Bangalore", "Karnataka", 12.9716, 77.5946),
    ("Kolkata", "West Bengal", 22.5726, 88.3639),
    ("Pune", "Maharashtra", 18.5204, 73.8567),
    ("Ahmedabad", "Gujarat", 23.0225, 72.5714),
]

MAIN_DEMANDS = [
    "Education Reform",
    "Minister Resignation",
    "Compensation",
    "Police Accountability",
    "No Action Against Protestors",
]

SECONDARY_DEMANDS = [
    "Fee Rollback",
    "Independent Inquiry",
    "Curriculum Review",
    "Scholarship Fund",
    "Campus Safety Measures",
    None,
]

EVENT_TYPES = [
    "Rally",
    "Sit-in",
    "March",
    "Candlelight Vigil",
    "Student Assembly",
    "Press Conference",
    "Negotiation Meeting",
    "Police Action",
    "Public Statement",
]

GOV_RESPONSES = [
    "No Response",
    "Public Statement",
    "Meeting Scheduled",
    "Negotiation",
    "Partial Concession",
    "Police Deployment",
    "Formal Committee Formed",
]

POLICE_ACTIONS = ["None", "Monitoring", "Barricades", "Mild Dispersal", "Detentions"]
MEDIA_ATTENTION = ["Low", "Moderate", "High", "Very High"]
OUTCOMES = ["Accepted", "Rejected", "Pending", "Partially Accepted"]

START_DATE = date(2026, 2, 3)
TOTAL_DAYS = 36

SOURCE = "Sample Data (Illustrative)"
SOURCE_URL = "https://example.org/sample-dataset/cjp-protest"

events = []
event_id = 1

# Baseline intensity curve: builds up, peaks mid-way, tapers after negotiations
def intensity_for_day(day_index: int) -> float:
    # day_index 0..35
    ramp_up = min(1.0, day_index / 10)
    peak = 1.0 if 10 <= day_index <= 22 else 0.0
    taper = max(0.0, 1 - (day_index - 22) / 14) if day_index > 22 else 1.0
    base = max(ramp_up, peak) * taper
    return max(0.05, base)


for day_index in range(TOTAL_DAYS):
    current_date = START_DATE + timedelta(days=day_index)
    intensity = intensity_for_day(day_index)

    # number of events that day scales with intensity
    num_events = 1 if intensity < 0.3 else (2 if intensity < 0.7 else 3)

    for _ in range(num_events):
        city, state, lat, lng = random.choice(CITIES)
        main_demand = random.choices(
            MAIN_DEMANDS, weights=[30, 20, 20, 20, 10], k=1
        )[0]
        secondary_demand = random.choice(SECONDARY_DEMANDS)

        # participants scale with city weight (Delhi/Mumbai larger) and intensity
        city_weight = {
            "Delhi": 1.4, "Mumbai": 1.2, "Chennai": 0.9, "Hyderabad": 0.85,
            "Bangalore": 1.0, "Kolkata": 0.8, "Pune": 0.7, "Ahmedabad": 0.75,
        }[city]
        base_participants = int(2000 + 14000 * intensity * city_weight)
        estimated_participants = max(150, base_participants + random.randint(-800, 800))

        # event type & government response loosely tied to phase of movement
        if day_index < 6:
            event = random.choice(["Rally", "Student Assembly", "March"])
            government_response = random.choice(["No Response", "Public Statement"])
        elif day_index < 22:
            event = random.choice(["Rally", "Sit-in", "March", "Police Action", "Press Conference"])
            government_response = random.choice(
                ["Public Statement", "Meeting Scheduled", "Negotiation", "Police Deployment"]
            )
        else:
            event = random.choice(["Negotiation Meeting", "Public Statement", "Candlelight Vigil", "Student Assembly"])
            government_response = random.choice(
                ["Negotiation", "Partial Concession", "Formal Committee Formed", "Meeting Scheduled"]
            )

        police_action = "None"
        if event == "Police Action":
            police_action = random.choice(["Barricades", "Mild Dispersal", "Detentions"])
        elif intensity > 0.6:
            police_action = random.choice(["None", "Monitoring", "Barricades"])

        media_attention = random.choices(
            MEDIA_ATTENTION, weights=[1, 3, 4, 2] if intensity > 0.5 else [4, 3, 2, 1], k=1
        )[0]

        duration_day = 1

        # outcome/status logic: mostly Pending until final third, then resolve
        if day_index < 24:
            outcome = "Pending"
            status = "Ongoing"
        else:
            outcome = random.choices(
                ["Accepted", "Partially Accepted", "Rejected", "Pending"],
                weights=[35, 30, 20, 15], k=1
            )[0]
            status = "Resolved" if outcome in ("Accepted", "Rejected", "Partially Accepted") else "Ongoing"

        events.append({
            "id": f"EVT-{event_id:04d}",
            "date": current_date.isoformat(),
            "city": city,
            "state": state,
            "lat": lat,
            "lng": lng,
            "location": f"{city} - {'City Center' if intensity > 0.5 else 'District Office'}",
            "event": event,
            "duration_day": duration_day,
            "estimated_participants": estimated_participants,
            "main_demand": main_demand,
            "secondary_demand": secondary_demand,
            "government_response": government_response,
            "police_action": police_action,
            "media_attention": media_attention,
            "outcome": outcome,
            "status": status,
            "source": SOURCE,
            "source_url": SOURCE_URL,
        })
        event_id += 1

# Sort by date
events.sort(key=lambda e: e["date"])

dataset = {
    "meta": {
        "title": "CJP (Citizens for Justice Platform) Protest Movement — Sample Dataset",
        "disclaimer": (
            "This dataset describes a FICTIONAL protest movement created for "
            "demonstration purposes only. It is not a record of real events and "
            "is not sourced from real news organizations. All 'source' fields "
            "are intentionally labeled as sample data."
        ),
        "start_date": START_DATE.isoformat(),
        "end_date": (START_DATE + timedelta(days=TOTAL_DAYS - 1)).isoformat(),
        "total_duration_days": TOTAL_DAYS,
        "cities": [c[0] for c in CITIES],
        "main_demands": MAIN_DEMANDS,
        "generated_at": "2026-07-29",
    },
    "events": events,
}

with open("/home/claude/dac-proj1/public/data/protests.json", "w") as f:
    json.dump(dataset, f, indent=2)

print(f"Generated {len(events)} events across {TOTAL_DAYS} days.")
