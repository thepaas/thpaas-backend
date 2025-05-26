import * as Joi from 'joi';

export const envValidator = Joi.object({
  // General
  NODE_ENV: Joi.string(),
  HOST: Joi.string(),
  PORT: Joi.string(),
  FE_URL: Joi.string(),
  // Auth
  JWT_PRIVATE_KEY: Joi.string().required(),
  JWT_PUBLIC_KEY: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number(),
  VERIFY_EMAIL_TOKEN_EXPIRES_IN: Joi.number(),
  FORGOT_PASSWORD_TOKEN_EXPIRES_IN: Joi.number(),
  // Database
  POSTGRES_HOST: Joi.string(),
  POSTGRES_USER: Joi.string(),
  POSTGRES_PASSWORD: Joi.string(),
  POSTGRES_DATABASE: Joi.string(),
  POSTGRES_PORT: Joi.string(),
  POSTGRES_SSL: Joi.string(),
  POSTGRES_LOGGING: Joi.string(),
  // Web3
  ACCOUNT_PRIVATE_KEY: Joi.string().required(),
  ACCOUNT_ADDRESS: Joi.string().required(),
  CHAIN_ID: Joi.string().required(),
  NETWORK: Joi.string().required(),
  RPC_URL: Joi.string().required(),
  ETH_TOKEN_ADDRESS: Joi.string().required(),
  STRK_TOKEN_ADDRESS: Joi.string().required(),
  NFT_TOKEN_URI: Joi.string().required(),

  // WaltId
  WALTID_BASE_URL: Joi.string().required(),
  WALTID_EMAIL: Joi.string().required(),
  WALTID_PASSWORD: Joi.string().required(),
});
