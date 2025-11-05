import { NextRequest } from "next/server";
import { authService } from "@/lib/application/services/auth.service";
import { registerSchema } from "@/lib/application/validators/auth.validators";
import { createdResponse, errorResponse, handleApiError } from "@/utils/api-response";
import { logger } from "@/utils/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.parse(body);

    const user = await authService.registerUser(validatedData);

    return createdResponse(user, "User registered successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return errorResponse(error.message, 409);
      }

      if (error.name === "ZodError") {
        return errorResponse("Validation error: " + error.message, 400);
      }
    }

    logger.error("Registration error", error);
    return handleApiError(error);
  }
}
