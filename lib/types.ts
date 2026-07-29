export interface ProtestEvent {
  id: string;
  date: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  location: string;
  event: string;
  duration_day: number;
  estimated_participants: number;
  main_demand: string;
  secondary_demand: string | null;
  government_response: string;
  police_action: string;
  media_attention: "Low" | "Moderate" | "High" | "Very High";
  outcome: "Accepted" | "Rejected" | "Pending" | "Partially Accepted";
  status: "Ongoing" | "Resolved";
  source: string;
  source_url: string;
}

export interface DatasetMeta {
  title: string;
  disclaimer: string;
  start_date: string;
  end_date: string;
  total_duration_days: number;
  cities: string[];
  main_demands: string[];
  generated_at: string;
}

export interface Dataset {
  meta: DatasetMeta;
  events: ProtestEvent[];
}

export interface Filters {
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  demand?: string;
  outcome?: string;
  eventType?: string;
  query?: string;
}
