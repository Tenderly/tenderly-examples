import { ethers } from 'ethers';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

let name = 'something';
const ethersProvider = writable();

type Tx = {
  from: string;
  to: string;
  value: string;
  data: string;
};

let tx: Tx = {
  from: '',
  to: '0x82d8Cfd5D3789ea35FF4AE5228d2A50AF15F8112',
  value: '0.0001',
  data: ''
};

$: priceHex = ethers.utils.parseEther(tx.value).toHexString();

type TTx = (keyof Tx)[];
const fields: TTx = ['from', 'to', 'value', 'data'];

async function init() {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  ethersProvider.set(provider);
  tx.from = await signer.getAddress();
}

async function submit() {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  tx.from = await signer.getAddress();
  try {
    const params = {
      network_id: 5,
      from: tx.from,
      to: tx.to,
      value: ethers.utils.parseUnits(tx.value, 'ether').toHexString(),
      gas: 100000000000000
    };

    const ret = await fetch(
      'https://api.tenderly.co/api/v1/account/nenad/project/t-demo/simulate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': 'MIUhAlTwcbswlmmyG9EQ1wLmlrlSnqd1'
        },
        body: JSON.stringify(params)
      }
    );
    console.log(JSON.stringify(ret));
    const response = await signer.sendTransaction(params);
    console.log(response);
    console.log(JSON.stringify(response));
  } catch (e) {
    // @ts-ignore
    if (e.code == 'ACTION_REJECTED') {
      console.log('rejected');
    }
  }
  // console.log(response)
}
