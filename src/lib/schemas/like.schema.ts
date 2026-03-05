import { z } from "zod";

export const toggleLikeSchema = z.object({
  postId: z.string().cuid({ message: "ID do post inválido." }),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
