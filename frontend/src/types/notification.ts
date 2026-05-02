export interface NotificationRequest {
  id: string;
  description: string;
  status: number;
  created_on: string;
  user: {
    first_name: string;
    last_name: string;
    avarta: string;
  };
}

export interface ActivityNotification {
  id: string;
  activity: string;
  title: string;
  acted_on: string;
  actor: {
    user: {
      first_name: string;
      last_name: string;
      avarta: string;
    };
  };
  project: {
    name: string;
  };
}
