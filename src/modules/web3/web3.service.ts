import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Account, Contract, RpcProvider, ParsedEvent, cairo } from 'starknet';
import { TPConfigService } from '../../common/config/tp-config.service';
import { ErrorWeb3 } from '../../common/constants/errors';
import { CustomHttpError } from '../../common/errors/controlled';
import { ContractMethod } from '../../common/enums/web3';
import { ExecuteTransactionResponseDto } from './web3.dto';
import { DEPLOY_ACCOUNT_FEE } from '../../common/constants';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);

  constructor(private readonly config: TPConfigService) {}

  getProvider(): RpcProvider {
    return new RpcProvider({ nodeUrl: this.config.rpcUrl });
  }

  getContract(abi: any, address: string): Contract {
    const provider = this.getProvider();
    return new Contract(abi, address, provider);
  }

  async getAbi(address: string): Promise<any> {
    const provider = this.getProvider();
    const { abi } = await provider.getClassAt(address);

    if (!abi) {
      return null;
    }

    return abi;
  }

  async executeTransaction(tx: any): Promise<ExecuteTransactionResponseDto> {
    const provider = this.getProvider();
    const account = new Account(
      provider,
      this.config.accountAddress,
      this.config.accountPrivateKey,
    );

    const feeEstimate = await account.estimateFee([tx]);
    const buffer = BigInt(200); // 200% buffer
    const maxFee = (feeEstimate.overall_fee * buffer) / BigInt(100);

    this.logger.log(`${''} - Estimated Fee: ${feeEstimate.overall_fee}`);
    const result = await account.execute([tx], undefined, { maxFee });

    this.logger.log(`Transaction Hash: ${result.transaction_hash}`);
    const txReceipt = await provider.waitForTransaction(
      result.transaction_hash,
    );

    if (!txReceipt.isSuccess()) {
      throw new CustomHttpError(
        ErrorWeb3.TransactionReceiptNotReceived,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { txReceipt, txHash: result.transaction_hash };
  }

  async depositAccount(
    recipientAddress: string,
  ): Promise<ExecuteTransactionResponseDto> {
    const provider = this.getProvider();
    const account = new Account(
      provider,
      this.config.accountAddress,
      this.config.accountPrivateKey,
    );
    const depositAmount = cairo.uint256(DEPLOY_ACCOUNT_FEE);

    try {
      const currentNonce = await account.getNonce();
      if (!currentNonce) {
        throw new CustomHttpError(
          ErrorWeb3.NonceFailed,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const maxFee = Math.ceil(DEPLOY_ACCOUNT_FEE * 1.1); // 10% buffer for max fee
      const result = await account.execute(
        {
          contractAddress: this.config.ethTokenAddress,
          entrypoint: ContractMethod.TRANSFER,
          calldata: [recipientAddress, depositAmount],
        },
        [],
        { nonce: currentNonce, maxFee },
      );

      this.logger.log(`Transaction Hash: ${result.transaction_hash}`);
      const txReceipt = await provider.waitForTransaction(
        result.transaction_hash,
      );

      if (!txReceipt.isSuccess()) {
        throw new CustomHttpError(
          ErrorWeb3.TransactionReceiptNotReceived,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return { txReceipt, txHash: result.transaction_hash };
    } catch (error) {
      this.logger.error('Token transfer failed:', error);
      throw new CustomHttpError(
        ErrorWeb3.TransferFailed,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async parseEvents(
    contractAddress: string,
    txHash: string,
  ): Promise<ParsedEvent[]> {
    const provider = this.getProvider();
    const abi = await this.getAbi(contractAddress);

    if (!abi) {
      throw new CustomHttpError(ErrorWeb3.NoAbiFound, HttpStatus.NOT_FOUND);
    }

    const contract = this.getContract(abi, contractAddress);

    const txReceipt: any = await provider.getTransactionReceipt(txHash);

    return contract.parseEvents(txReceipt);
  }
}
