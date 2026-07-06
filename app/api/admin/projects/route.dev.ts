import { getProjects, saveProjects } from "@/lib/admin/store";
import { devGuard, ok, fail } from "@/lib/admin/api";
import type { ProjectsData } from "@/types";

export async function GET() {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    return ok(getProjects());
  } catch (e) {
    return fail(e, 500);
  }
}

export async function PUT(request: Request) {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    const body = (await request.json()) as ProjectsData;
    saveProjects(body);
    return ok({ saved: true });
  } catch (e) {
    return fail(e);
  }
}
