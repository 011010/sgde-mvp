import { google } from "googleapis";
import { env } from "@/config/env.config";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

export class GoogleDriveService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      env.google.clientId,
      env.google.clientSecret,
      env.google.redirectUri
    );
  }

  getAuthUrl(userId: string): string {
    const scopes = [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: userId,
    });
  }

  async handleCallback(code: string, userId: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      await prisma.cloudIntegration.upsert({
        where: {
          userId_provider: {
            userId,
            provider: "google_drive",
          },
        },
        create: {
          userId,
          provider: "google_drive",
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || null,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
        update: {
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      });

      logger.info("Google Drive integration successful", { userId });

      return { success: true };
    } catch (error) {
      logger.error("Google Drive callback error", error);
      throw new Error("Failed to connect Google Drive");
    }
  }

  async getAccessToken(userId: string): Promise<string> {
    const integration = await prisma.cloudIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: "google_drive",
        },
      },
    });

    if (!integration) {
      throw new Error("Google Drive not connected");
    }

    if (integration.expiresAt && integration.expiresAt < new Date()) {
      if (!integration.refreshToken) {
        throw new Error("Token expired and no refresh token available");
      }

      this.oauth2Client.setCredentials({
        refresh_token: integration.refreshToken,
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();

      await prisma.cloudIntegration.update({
        where: {
          userId_provider: {
            userId,
            provider: "google_drive",
          },
        },
        data: {
          accessToken: credentials.access_token!,
          expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        },
      });

      return credentials.access_token!;
    }

    return integration.accessToken;
  }

  async listFiles(userId: string, pageSize = 20, pageToken?: string) {
    const accessToken = await this.getAccessToken(userId);

    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const drive = google.drive({ version: "v3", auth: this.oauth2Client });

    const response = await drive.files.list({
      pageSize,
      pageToken,
      fields:
        "nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink)",
    });

    return {
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
    };
  }

  async downloadFile(userId: string, fileId: string) {
    const accessToken = await this.getAccessToken(userId);

    this.oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const drive = google.drive({ version: "v3", auth: this.oauth2Client });

    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    return response.data;
  }

  async disconnect(userId: string) {
    await prisma.cloudIntegration.delete({
      where: {
        userId_provider: {
          userId,
          provider: "google_drive",
        },
      },
    });

    logger.info("Google Drive disconnected", { userId });

    return { success: true };
  }
}

export const googleDriveService = new GoogleDriveService();
