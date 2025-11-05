import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/lib/infrastructure/storage/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
