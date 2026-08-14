export const AccountStatus = {
  INVITED: "INVITED",
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
} as const;

export type AccountStatus =
  (typeof AccountStatus)[keyof typeof AccountStatus];