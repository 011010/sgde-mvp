import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 201 }
  );
}

export function errorResponse(message: string, statusCode = 400): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: statusCode }
  );
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 404 }
  );
}

export function serverErrorResponse(message = "Internal server error"): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof Error) {
    console.error("API Error:", error);
    return serverErrorResponse(error.message);
  }

  console.error("Unknown error:", error);
  return serverErrorResponse("An unexpected error occurred");
}
