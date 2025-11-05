import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { env } from "@/config/env.config";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

export class OneDriveService {
  private msalClient;

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: env.microsoft.clientId,
        authority: `https://login.microsoftonline.com/${env.microsoft.tenantId}`,
        clientSecret: env.microsoft.clientSecret,
      },
    });
  }

  getAuthUrl(userId: string): string {
    const authCodeUrlParameters = {
      scopes: ["Files.Read", "Files.ReadWrite", "User.Read"],
      redirectUri: env.microsoft.redirectUri,
      state: userId,
    };

    return this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  async handleCallback(code: string, userId: string) {
    try {
      const tokenRequest = {
        code,
        scopes: ["Files.Read", "Files.ReadWrite", "User.Read"],
        redirectUri: env.microsoft.redirectUri,
      };

      const response = await this.msalClient.acquireTokenByCode(tokenRequest);

      if (!response) {
        throw new Error("Failed to acquire token");
      }

      await prisma.cloudIntegration.upsert({
        where: {
          userId_provider: {
            userId,
            provider: "one_drive",
          },
        },
        create: {
          userId,
          provider: "one_drive",
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || null,
          expiresAt: response.expiresOn || null,
        },
        update: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || undefined,
          expiresAt: response.expiresOn || null,
        },
      });

      logger.info("OneDrive integration successful", { userId });

      return { success: true };
    } catch (error) {
      logger.error("OneDrive callback error", error);
      throw new Error("Failed to connect OneDrive");
    }
  }

  async getAccessToken(userId: string): Promise<string> {
    const integration = await prisma.cloudIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: "one_drive",
        },
      },
    });

    if (!integration) {
      throw new Error("OneDrive not connected");
    }

    if (integration.expiresAt && integration.expiresAt < new Date()) {
      if (!integration.refreshToken) {
        throw new Error("Token expired and no refresh token available");
      }

      const refreshTokenRequest = {
        refreshToken: integration.refreshToken,
        scopes: ["Files.Read", "Files.ReadWrite", "User.Read"],
      };

      const response = await this.msalClient.acquireTokenByRefreshToken(refreshTokenRequest);

      if (!response) {
        throw new Error("Failed to refresh token");
      }

      await prisma.cloudIntegration.update({
        where: {
          userId_provider: {
            userId,
            provider: "one_drive",
          },
        },
        data: {
          accessToken: response.accessToken,
          expiresAt: response.expiresOn || null,
        },
      });

      return response.accessToken;
    }

    return integration.accessToken;
  }

  async listFiles(userId: string, path = "/") {
    const accessToken = await this.getAccessToken(userId);

    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const response = await client
      .api(`/me/drive/root${path === "/" ? "" : `:${path}:`}/children`)
      .get();

    return {
      files: response.value || [],
    };
  }

  async downloadFile(userId: string, fileId: string) {
    const accessToken = await this.getAccessToken(userId);

    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const response = await client.api(`/me/drive/items/${fileId}/content`).get();

    return response;
  }

  async disconnect(userId: string) {
    await prisma.cloudIntegration.delete({
      where: {
        userId_provider: {
          userId,
          provider: "one_drive",
        },
      },
    });

    logger.info("OneDrive disconnected", { userId });

    return { success: true };
  }
}

export const oneDriveService = new OneDriveService();
