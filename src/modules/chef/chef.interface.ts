export interface IChef {
  name: string;
  image: string;
  designation: string;
  bio: string;
  speciality: string;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
}