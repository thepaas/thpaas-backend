import { ParsedEvent, GetTransactionReceiptResponse } from 'starknet';

export class ExecuteTransactionResponseDto {
  txReceipt: GetTransactionReceiptResponse;
  txHash: string;
}

export class Web3CallResponseDto extends ExecuteTransactionResponseDto {
  events: ParsedEvent[];
}

export class TransferDto {
  txHash: string;
}

export class ApproveMinterDto {
  txHash: string;
}
