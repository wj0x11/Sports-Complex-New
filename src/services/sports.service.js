import { SPORTS } from "../config/sports.config";

export const getAllSports = () => SPORTS;

export const getFeaturedSports = () => SPORTS.filter((sport) => sport.featured);

export const getSportBySlug = (slug) =>
  SPORTS.find((sport) => sport.slug === slug) ?? null;

export const getTimetableSports = () =>
  SPORTS.filter((sport) => sport.hasTimetable);

export const getCourtSports = () =>
  SPORTS.filter((sport) => sport.type === "court");

export const getCoachSports = () =>
  SPORTS.filter((sport) => sport.type === "coach");

export const findCoachById = (coachId) => {
  for (const sport of SPORTS) {
    const coach = sport.coaches?.find((item) => item.id === coachId);
    if (coach) {
      return { coach, sport };
    }
  }
  return { coach: null, sport: null };
};

export const findCourtById = (courtId) => {
  for (const sport of SPORTS) {
    const court = sport.courts?.find((item) => item.id === courtId);
    if (court) {
      return { court, sport };
    }
  }
  return { court: null, sport: null };
};

export const getAdminSportSummaries = () =>
  SPORTS.map((sport) => ({
    id: `sport-${sport.slug}`,
    slug: sport.slug,
    name: sport.name,
    featured: sport.featured,
    type: sport.type,
    courtsCount: sport.courts?.length ?? 0,
    coachesCount: sport.coaches?.length ?? 0,
    equipmentCount: sport.equipment?.length ?? 0,
    image: sport.image,
    description: sport.description,
  }));
