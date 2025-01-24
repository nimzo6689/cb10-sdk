export interface EventRequestOptions {
  year: number;
  month: number;
  uID: number;
}

export interface Event {
  year: number;
  month: number;
  day: number;
  start: string;
  end: string;
  title: string;
}
