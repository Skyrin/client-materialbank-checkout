import { forOwn } from "lodash-es";

export const REGIONS = {
  AL: {
    id: 1,
    name: "Alabama",
  },
  AK: {
    id: 2,
    name: "Alaska",
  },
  AS: {
    id: 3,
    name: "American Samoa",
  },
  AZ: {
    id: 4,
    name: "Arizona",
  },
  AR: {
    id: 5,
    name: "Arkansas",
  },
  AE: {
    id: 6,
    name: "Armed Forces Africa",
  },
  AA: {
    id: 7,
    name: "Armed Forces Americas",
  },
  AP: {
    id: 11,
    name: "Armed Forces Pacific",
  },
  CA: {
    id: 12,
    name: "California",
  },
  CO: {
    id: 13,
    name: "Colorado",
  },
  CT: {
    id: 14,
    name: "Connecticut",
  },
  DE: {
    id: 15,
    name: "Delaware",
  },
  DC: {
    id: 16,
    name: "District of Columbia",
  },
  FM: {
    id: 17,
    name: "Federated States Of Micronesia",
  },
  FL: {
    id: 18,
    name: "Florida",
  },
  GA: {
    id: 19,
    name: "Georgia",
  },
  GU: {
    id: 20,
    name: "Guam",
  },
  HI: {
    id: 21,
    name: "Hawaii",
  },
  ID: {
    id: 22,
    name: "Idaho",
  },
  IL: {
    id: 23,
    name: "Illinois",
  },
  IN: {
    id: 24,
    name: "Indiana",
  },
  IA: {
    id: 25,
    name: "Iowa",
  },
  KS: {
    id: 26,
    name: "Kansas",
  },
  KY: {
    id: 27,
    name: "Kentucky",
  },
  LA: {
    id: 28,
    name: "Louisiana",
  },
  ME: {
    id: 29,
    name: "Maine",
  },
  MH: {
    id: 30,
    name: "Marshall Islands",
  },
  MD: {
    id: 31,
    name: "Maryland",
  },
  MA: {
    id: 32,
    name: "Massachusetts",
  },
  MI: {
    id: 33,
    name: "Michigan",
  },
  MN: {
    id: 34,
    name: "Minnesota",
  },
  MS: {
    id: 35,
    name: "Mississippi",
  },
  MO: {
    id: 36,
    name: "Missouri",
  },
  MT: {
    id: 37,
    name: "Montana",
  },
  NE: {
    id: 38,
    name: "Nebraska",
  },
  NV: {
    id: 39,
    name: "Nevada",
  },
  NH: {
    id: 40,
    name: "New Hampshire",
  },
  NJ: {
    id: 41,
    name: "New Jersey",
  },
  NM: {
    id: 42,
    name: "New Mexico",
  },
  NY: {
    id: 43,
    name: "New York",
  },
  NC: {
    id: 44,
    name: "North Carolina",
  },
  ND: {
    id: 45,
    name: "North Dakota",
  },
  MP: {
    id: 46,
    name: "Northern Mariana Islands",
  },
  OH: {
    id: 47,
    name: "Ohio",
  },
  OK: {
    id: 48,
    name: "Oklahoma",
  },
  OR: {
    id: 49,
    name: "Oregon",
  },
  PW: {
    id: 50,
    name: "Palau",
  },
  PA: {
    id: 51,
    name: "Pennsylvania",
  },
  PR: {
    id: 52,
    name: "Puerto Rico",
  },
  RI: {
    id: 53,
    name: "Rhode Island",
  },
  SC: {
    id: 54,
    name: "South Carolina",
  },
  SD: {
    id: 55,
    name: "South Dakota",
  },
  TN: {
    id: 56,
    name: "Tennessee",
  },
  TX: {
    id: 57,
    name: "Texas",
  },
  UT: {
    id: 58,
    name: "Utah",
  },
  VT: {
    id: 59,
    name: "Vermont",
  },
  VI: {
    id: 60,
    name: "Virgin Islands",
  },
  VA: {
    id: 61,
    name: "Virginia",
  },
  WA: {
    id: 62,
    name: "Washington",
  },
  WV: {
    id: 63,
    name: "West Virginia",
  },
  WI: {
    id: 64,
    name: "Wisconsin",
  },
  W: {
    id: 65,
    name: "Wyoming",
  },
};

export const getRegionFromId = (id: number) => {
  let result = {
    id: 43,
    code: "NY",
    name: "New York",
  }; // Default
  forOwn(REGIONS, (regionInfo, regionCode) => {
    if (id === regionInfo.id) {
      result = {
        id: regionInfo.id,
        code: regionCode,
        name: regionInfo.name,
      };
      return false; // Exit forOwn
    }
  });
  return result;
};

export const getRegionFromName = (name: string) => {
  let result = {
    id: 43,
    code: "NY",
    name: "New York",
  }; // Default
  forOwn(REGIONS, (regionInfo, regionCode) => {
    if (name === regionInfo.name) {
      result = {
        id: regionInfo.id,
        code: regionCode,
        name: regionInfo.name,
      };
      return false; // Exit forOwn
    }
  });
  return result;
};

export const getRegionFromCode = (code: string) => {
  return {
    ...REGIONS[code],
    code: code,
  };
};
