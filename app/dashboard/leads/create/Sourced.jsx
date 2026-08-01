import { headers } from 'next/headers';
import SourceClient from './SourceClient.jsx'
export default async function Sourced() {
  const headersList = await headers();
  
const userAgent = headersList.get('userid');

console.log(userAgent);

  return (
    <>
    <SourceClient userAgent={userAgent}/>
    </>
  )
}