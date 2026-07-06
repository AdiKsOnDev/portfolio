import { getBlog, saveBlog, deleteBlog } from "@/lib/admin/store";
import { devGuard, ok, fail } from "@/lib/admin/api";
import type { BlogData } from "@/types";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    const { slug } = await params;
    const post = getBlog(slug);
    if (!post) return fail("Post not found", 404);
    return ok(post);
  } catch (e) {
    return fail(e, 500);
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    const { slug } = await params;
    const body = (await request.json()) as { post: BlogData; originalSlug?: string };
    if (!body?.post) return fail("Missing 'post' in body");
    // the URL slug is authoritative for where the file lands
    const post = { ...body.post, slug };
    saveBlog(post, body.originalSlug);
    return ok({ saved: true, slug });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const blocked = devGuard();
  if (blocked) return blocked;
  try {
    const { slug } = await params;
    deleteBlog(slug);
    return ok({ deleted: true, slug });
  } catch (e) {
    return fail(e);
  }
}
