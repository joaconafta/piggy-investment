import {usePrivy, useWallets} from '@privy-io/react-auth';
import Login from '../Login';

export default function AuthProvider() {
    const {wallets} = useWallets();

  return (
    !wallets.length ? <Login/> : wallets[0].address
  );
}