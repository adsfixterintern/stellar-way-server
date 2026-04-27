export interface IContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "pending" | "read" | "replied";
}
