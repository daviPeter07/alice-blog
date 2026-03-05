"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/schemas/comment.schema";
import type { ActionResult } from "@/lib/types";

export async function createComment(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    postId:      formData.get("postId"),
    parentId:    formData.get("parentId") || undefined,
    authorName:  formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    body:        formData.get("body"),
  };

  const parsed = createCommentSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success:     false,
      error:       "Por favor, corrija os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.comment.create({ data: parsed.data });
    revalidateTag(`comments:${parsed.data.postId}`, "max");
    return { success: true, data: undefined };
  } catch {
    return {
      success: false,
      error:   "Erro ao salvar comentário. Tente novamente.",
    };
  }
}
