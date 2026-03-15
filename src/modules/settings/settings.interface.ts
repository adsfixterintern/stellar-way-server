

export interface ISettings {
  siteName: string;
  logo: string;
  location: string;
  phone: string;
  email: string;
  // Updated to Nested Object
  deliveryCharge: {
    insideDhaka: number;
    outsideDhaka: number;
  };
  tax: number;
  maintenanceMode: boolean;


}
