/**
 * Represents error messages related to user.
 */
export enum ErrorUser {
  NotFound = 'User not found',
  AccountCannotBeRegistered = 'Account cannot be registered',
  BalanceCouldNotBeRetrieved = 'User balance could not be retrieved',
  InvalidCredentials = 'Invalid credentials',
  UserNotActive = 'User not active',
  UserAccountAddressMissing = 'User does not have an associated account address',
  DuplicatedAccountAddress = 'The address you are trying to use already exists. Please check that the address is correct or use a different address',
  AlreadyAssigned = 'User already has an address assigned',
  BBIdAlreadyAssigned = 'User already has an bBId assigned',
  DuplicatedAddress = 'The address you are trying to use already exists',
}

/**
 * Represents error messages related to trade.
 */
export enum ErrorTrade {
  NotFound = 'Trade not found',
  InvalidStatus = 'Trade is not in a valid state',
  InvalidReceiver = 'Invalid receiver',
  InvalidInitiator = 'Invalid initiator',
  InvalidGemAmount = 'Invalid gem amount',
  DuplicateGemColors = 'Duplicate gem colors',
  UserNotAuthorized = 'User not authorized',
}

/**
 * Represents error messages related to auth.
 */
export enum ErrorAuth {
  NotFound = 'Token not found',
  InvalidSignature = 'Invalid signature',
  RefreshTokenHasExpired = 'Refresh token has expired',
  TokenExpired = 'Token has expired',
  CodeExpired = 'Code has expired',
  PasswordIsNotStrongEnough = 'Password is not strong enough. Password must be at least 8 characters long and contain 1 upper, 1 lowercase, 1 number and 1 special character. (!@#$%^&*()_+={}|\'"/`[]:;<>,.?~-])',
  InvalidToken = 'Invalid token',
  InvalidCode = 'Invalid code',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
}

/**
 * Represents error messages related to token.
 */
export enum ErrorToken {
  NotFound = 'Token not found',
}

/**
 * Represents error messages related to send grid.
 */
export enum ErrorSendGrid {
  EmailNotSent = 'Email was not sent',
  InvalidApiKey = 'Invalid SendGrid API key',
}

/**
 * Represents error messages related to postgres.
 */
export enum ErrorPostgres {
  NumericFieldOverflow = 'Numeric field overflow',
}

/**
 * Represents error messages related to quest.
 */
export enum ErrorQuest {
  NotFound = 'Quest not found',
  NoTasks = 'Quest does not contain tasks',
  InvalidStatus = 'Quest has invalid status for this action',
  AlreadyAssignedToQuest = 'User is already assigned to this quest',
  NotAssignedToQuest = 'User is not assigned to this quest',
  InvalidTransactionSenderAddress = 'Invalid transaction sender address',
  InvalidTransaction = 'Invalid transaction',
  RewardAlreadyClaimed = 'Reward already claimed',
  ImageCreationFailed = 'Failed to create the image',
}

/**
 * Represents error messages related to reward.
 */
export enum ErrorReward {
  SwapAlreadyMade = 'Swap already made',
}

/**
 * Represents error messages related to Gem.
 */
export enum ErrorGem {
  NotFound = 'Gem not found',
  InvalidTokensForSwap = 'Amount of tokens owned is invalid for a swap operation',
  InvalidTokensForTrade = 'Amount of tokens owned is invalid for a trade operation',
  TokenNotOwned = 'No token owned by user',
}

/**
 * Represents error messages related to Loomi.
 */
export enum ErrorLoomi {
  NotFound = 'Loomi not found',
  AlreadyExist = 'Loomi already exist',
}

/**
 * Represents error messages related to task.
 */
export enum ErrorTask {
  NotFound = 'Task not found',
  InvalidStatus = 'Task has invalid status for this action',
}

/**
 * Represents error messages related to team.
 */
export enum ErrorTeam {
  NotFound = 'Team not found',
  NoTeamsFound = 'No teams found',
  UnknownTeam = 'Unknown team',
  SameTeamRequired = 'Users must be in the same team',
}

/**
 * Represents error messages related to signature.
 */
export enum ErrorSignature {
  InvalidSignature = 'Invalid signature',
}

/**
 * Represents error messages related to web3.
 */
export enum ErrorWeb3 {
  TransferFailed = 'Failed to transfer funds',
  AccountDeploymentFailed = 'Failed to deploy account',
  ExecuteTransactionFailed = 'Failed to execute transaction',
  TransactionReceiptNotReceived = 'Transaction receipt not received',
  NoAbiFound = 'No ABI found',
  InvalidTransactionSenderAddress = 'Invalid transaction sender address',
  InvalidTransaction = 'Invalid transaction',
  TokenNotFound = 'Token not found',
  MissingEvents = 'Missing events',
  NonceFailed = 'Nonce failed',
  ApproveMinterFailed = 'Approve minter failed',
  ParsedEventNotFound = 'No event found matching the expected structure or identifier.',
}

/**
 * Represents error messages related to chat.
 */
export enum ErrorChat {
  NotFound = 'Chat not found',
}

/**
 * Represents error messages related to message.
 */
export enum ErrorMessage {
  NotFound = 'Message not found',
}
