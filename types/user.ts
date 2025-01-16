import Component from "./component";

interface User {
  id: number;
  clerkId: string;
  name: string;
  email: string;
  totalCredits: number;
  components?: Component[];
  createdAt: Date;
  updatedAt: Date;
}

export default User;