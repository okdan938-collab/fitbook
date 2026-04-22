import { TrainerProfile, User } from "@prisma/client";

import { distanceInKm } from "@/lib/geolocation";

type MatchInput = {
  athlete: Pick<User, "latitude" | "longitude" | "skillLevel">;
  trainers: Array<
    Pick<User, "id" | "latitude" | "longitude"> & {
      trainerProfile: Pick<TrainerProfile, "id" | "sports" | "experience"> | null;
    }
  >;
  sport?: string;
};

export function rankTrainerMatches({ athlete, trainers, sport }: MatchInput) {
  return trainers
    .map((trainer) => {
      if (!trainer.latitude || !trainer.longitude || !athlete.latitude || !athlete.longitude) {
        return null;
      }

      const profile = trainer.trainerProfile;
      if (!profile) return null;

      const distanceScore = Math.max(
        0,
        1 - distanceInKm(athlete.latitude, athlete.longitude, trainer.latitude, trainer.longitude) / 50
      );

      const sportScore = sport
        ? profile.sports.some((s) => s.toLowerCase() === sport.toLowerCase())
          ? 1
          : 0
        : 0.6;

      const skillScore = athlete.skillLevel && profile.experience.toLowerCase().includes(athlete.skillLevel.toLowerCase()) ? 1 : 0.5;

      const totalScore = distanceScore * 0.45 + sportScore * 0.35 + skillScore * 0.2;

      return {
        trainerId: trainer.id,
        profileId: profile.id,
        score: Number(totalScore.toFixed(3))
      };
    })
    .filter((item): item is { trainerId: string; profileId: string; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score);
}
