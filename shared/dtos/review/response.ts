namespace ReviewResponse {
  export type GetList = {
    reviews: {
      id: number;
      productThumbnail: string;
      productName: string;
      rate: number;
      title: string;
      content: string;
      createdAt: Date;
    }[];
    totalCount: number;
  };
}

export default ReviewResponse;
