import { Injectable } from '@nestjs/common';
import Provider, {
  Interaction,
  KoaContextWithOIDC,
  ResponseType,
  TokenFormat,
} from 'oidc-provider';
import { oidcJwks } from './oidc-config';

const configuration = {
  jwks: oidcJwks,
  cookies: {
    httpOnly: true,
    sameSite: 'lax',
    keys: ['your-cookie-secret-key-1', 'your-cookie-secret-key-2'],
    short: { path: '/' },
    long: { path: '/' },
  },
  features: {
    clientCredentials: {
      enabled: true,
    },
    introspection: {
      enabled: true,
    },
    devInteractions: { enabled: false },
    resourceIndicators: {
      enabled: true,
      getResourceServerInfo(
        ctx: KoaContextWithOIDC,
        resourceIndicator: string,
      ) {
        if (resourceIndicator === 'urn:api') {
          return {
            scope: 'read',
            audience: 'urn:api',
            accessTokenTTL: 1 * 60 * 60, // 1 hour
            accessTokenFormat: 'jwt' as TokenFormat,
          };
        }

        throw new Error('Invalid resource indicator');
      },
    },
  },
  clients: [
    {
      client_id: 'app',
      client_secret: 'a_secret',
      grant_types: ['client_credentials'],
      redirect_uris: [],
      response_types: [],
    },
    {
      client_id: 'oidc_client',
      client_secret: 'a_different_secret',
      grant_types: ['authorization_code'],
      response_types: ['code'] as ResponseType[],
      redirect_uris: ['http://138.124.81.132/front/cb'],
    },
  ],
  claims: {
    profile: [
      'birthdate',
      'family_name',
      'gender',
      'given_name',
      'locale',
      'middle_name',
      'name',
      'nickname',
      'picture',
      'preferred_username',
      'profile',
      'updated_at',
      'website',
      'zoneinfo',
    ],
    email: ['email', 'email_verified'],
  },
  interactions: {
    url(ctx: KoaContextWithOIDC, interaction: Interaction) {
      return `http://138.124.81.132/front/interaction/${interaction.uid}`;
    },
  },
};

@Injectable()
export class OidcService {
  private oidc: Provider;

  constructor() {
    this.oidc = new Provider('http://localhost:5001', configuration);
  }

  getProvider(): Provider {
    return this.oidc;
  }
}
