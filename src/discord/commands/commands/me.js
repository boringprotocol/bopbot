import PriceService from '../../../price/PriceService';
import Wallet from '../../../wallet';
import { COMMAND_PREFIX } from '../../../config';

export default {
  name: 'me',
  description: 'Returns public key and its balance for the currently selected cluster. You must be logged in to use this command.',
  usage: [`${COMMAND_PREFIX}me`],
  async execute(message) {
    const { publicKey } = await Wallet.getKeyPair(message.author.id);
    const cluster = await Wallet.getCluster(message.author.id);
    const sol = PriceService.convertLamportsToSol(await Wallet.getBalance(publicKey, cluster));
    let dollarValue;
    try {
      dollarValue = await PriceService.getDollarValueForSol(sol);
    } catch {}

    message.channel.send(`Your public key: ${publicKey}\nYour account balance: ${sol} Sol ${dollarValue ? `(~${dollarValue}) ` : ''}on cluster: ${cluster}`);
  },
};