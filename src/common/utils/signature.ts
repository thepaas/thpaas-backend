import {
  ec,
  encode,
  Signer,
  TypedData,
  typedData,
  WeierstrassSignatureType,
} from 'starknet';

export function verifyMessage(
  fullPublicKey: string,
  messageStructure: TypedData,
  signature: string,
): boolean {
  const uncompressedKey = fullPublicKey.startsWith('0x040')
    ? fullPublicKey.slice(5)
    : fullPublicKey;
  const publicKey = encode.addHexPrefix(uncompressedKey.slice(0, 63)); // pubX
  // const pubY = encode.addHexPrefix(fullPublicKey.slice(69)) // pubY

  const messageHash = typedData.getMessageHash(
    messageStructure,
    BigInt(publicKey),
  );

  return ec.starkCurve.verify(signature, messageHash, fullPublicKey);
}

export async function signMessage(
  privateKey: string,
  messageStructure: TypedData,
): Promise<string> {
  const starknetPublicKey = ec.starkCurve.getStarkKey(privateKey);
  const signer = new Signer(privateKey);

  try {
    const signature = (await signer.signMessage(
      messageStructure,
      starknetPublicKey,
    )) as WeierstrassSignatureType;
    return signature.toCompactHex();
  } catch (error) {
    console.error('Error signing the message:', error);
    throw error;
  }
}
