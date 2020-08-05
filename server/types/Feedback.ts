export interface FeedbackMessage {
  message: string;
  code: number;
}

export interface FeedbackMessages {
  [key: string]: FeedbackMessage;
}
