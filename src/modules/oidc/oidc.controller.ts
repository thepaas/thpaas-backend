import { Controller, All, Req, Res, Post, Body, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { OidcService } from './oidc.service';
import { Public } from 'src/common/decorators';

@Controller('/oidc-provider')
export class OidcController {
  constructor(private readonly oidcService: OidcService) {}

  @Public()
  @Post('interaction/:uid/login')
  async login(
    @Body() body: { login: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!body.login) {
      throw new Error('Login ID required');
    }

    const result = {
      login: {
        accountId: body.login,
      },
    };
    await this.oidcService.getProvider().interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    });
  }

  @Public()
  @Get('interaction/:uid/details')
  async getInteractionDetails(@Req() req: Request, @Res() res: Response) {
    const details = await this.oidcService
      .getProvider()
      .interactionDetails(req, res);
    const { uid: interactionUid, prompt, params } = details;

    res.json({
      uid: interactionUid,
      client_id: params.client_id,
      scope: params.scope,
      promptName: prompt.name,
    });
  }

  @Public()
  @Post('interaction/:uid/confirm')
  async confirmInteraction(@Req() req: Request, @Res() res: Response) {
    const interactionDetails = await this.oidcService
      .getProvider()
      .interactionDetails(req, res);
    const {
      prompt: { details },
      params,
      session,
    } = interactionDetails;

    if (!session) {
      throw new Error('Session not found');
    }

    const grant = interactionDetails.grantId
      ? await this.oidcService
          .getProvider()
          .Grant.find(interactionDetails.grantId)
      : new (this.oidcService.getProvider().Grant)({
          accountId: session.accountId,
          clientId: params.client_id as string | undefined,
        });

    if (grant) {
      if (details.missingOIDCScope) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        grant.addOIDCScope(details.missingOIDCScope.join(' '));
      }
      if (details.missingOIDCClaims) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        grant.addOIDCClaims(details.missingOIDCClaims);
      }
      if (details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(
          details.missingResourceScopes,
        )) {
          grant.addResourceScope(indicator, scopes.join(' '));
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const grantId = await grant.save();
    const result = { consent: { grantId } };

    await this.oidcService.getProvider().interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  }

  @Public()
  @Post('interaction/:uid/abort')
  async abortInteraction(@Req() req: Request, @Res() res: Response) {
    const result = {
      error: 'access_denied',
      error_description: 'User denied the request',
    };
    await this.oidcService.getProvider().interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    });
  }

  @Public()
  @All('/oidc/*')
  handleAllRoutes(@Req() req: Request, @Res() res: Response) {
    const callback = this.oidcService.getProvider().callback();

    req.url = req.originalUrl.replace('/oidc-provider/oidc', '');
    return callback(req, res);
  }
}
