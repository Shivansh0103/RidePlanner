export const tripKeys = {
  all: ["trips"] as const,

  detail: (id: string) => ["trips", id] as const,
};