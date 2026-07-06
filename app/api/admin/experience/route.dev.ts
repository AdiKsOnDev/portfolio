import { getExperience, saveExperience } from "@/lib/admin/store";
import { devGuard, ok, fail } from "@/lib/admin/api";
import type { ExperienceData } from "@/types";

export async function GET() {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    return ok(getExperience());
  } catch (e) {
    return fail(e, 500);
  }
}

export async function PUT(request: Request) {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    const body = (await request.json()) as ExperienceData;
    saveExperience(body);
    return ok({ saved: true });
  } catch (e) {
    return fail(e);
  }
}
