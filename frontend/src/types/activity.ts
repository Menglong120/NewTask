export interface ActivityItem {
  id: string;
  activity: string;
  title: string;
  acted_on: string;
  actor: {
    user: {
      first_name: string;
      last_name: string;
      role: { name: string };
    }
  };
  project: { name: string };
}

export interface GroupedActivities {
  [date: string]: ActivityItem[];
}
