import { headers } from 'next/headers';

export default async function Sourced({userid}) {
  const headersList = await headers();
  
const userAgent = headersList.get('userid');
console.log(userAgent);

  return (
    <div>Sourced</div>
  )
}