export type ReviewPlateStatus = "available" | "active" | "disabled";

export type ReviewPlate = {
  code: string;
  customerName: string | null;
  destinationUrl: string | null;
  status: ReviewPlateStatus;
};

const reviewPlates: Record<string, ReviewPlate> = {
  "AT-R001": {
    code: "AT-R001",
    customerName: "Clínica Ultrassaúde",
    destinationUrl:
      "https://search.google.com/local/writereview?placeid=ChIJu_hNpWBFAQcRyUl-xdkPKn0",
    status: "active",
  },

  "AT-R002": {
    code: "AT-R002",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R003": {
    code: "AT-R003",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R004": {
    code: "AT-R004",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R005": {
    code: "AT-R005",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R006": {
    code: "AT-R006",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R007": {
    code: "AT-R007",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R008": {
    code: "AT-R008",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R009": {
    code: "AT-R009",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },

  "AT-R010": {
    code: "AT-R010",
    customerName: null,
    destinationUrl: null,
    status: "available",
  },
};

export function getReviewPlate(code: string): ReviewPlate | null {
  return reviewPlates[code.trim().toUpperCase()] ?? null;
}
