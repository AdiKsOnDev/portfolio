import { getBlogIndex } from "@/lib/admin/store";
import { devGuard, ok, fail } from "@/lib/admin/api";

export async function GET() {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    return ok(getBlogIndex());
  } catch (e) {
    return fail(e, 500);
  }
}
