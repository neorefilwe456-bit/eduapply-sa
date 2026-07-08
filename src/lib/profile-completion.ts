type ProfileForCompletion = {
  first_name?: string | null;
  last_name?: string | null;
  id_number?: string | null;
  passport_number?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  province?: string | null;
  city?: string | null;
  physical_address?: string | null;
};

const WEIGHTED_FIELDS: (keyof ProfileForCompletion)[] = [
  "first_name",
  "last_name",
  "date_of_birth",
  "gender",
  "mobile_number",
  "email",
  "province",
  "city",
  "physical_address",
];

export function calculateProfileCompletion(profile: ProfileForCompletion | null): number {
  if (!profile) return 0;

  let filled = 0;
  const total = WEIGHTED_FIELDS.length + 1; // +1 for id_number/passport pair

  for (const field of WEIGHTED_FIELDS) {
    if (profile[field] && String(profile[field]).trim().length > 0) filled++;
  }

  if (
    (profile.id_number && profile.id_number.trim().length > 0) ||
    (profile.passport_number && profile.passport_number.trim().length > 0)
  ) {
    filled++;
  }

  return Math.round((filled / total) * 100);
}
