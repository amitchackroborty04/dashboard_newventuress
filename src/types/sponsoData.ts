export type SponsorshipData = {
  _id: string;
  planTitle: string;
  description: string;
  price: number;
  numberOfListing: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type SponsorshipResponse = {
  status: boolean;
  message: string;
  data: SponsorshipData[];
};
