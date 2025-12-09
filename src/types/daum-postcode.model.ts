declare global {
  interface Window {
    daum: {
      Postcode: new (options: any) => {
        open: () => void;
      };
    };
  }
}

export {};
