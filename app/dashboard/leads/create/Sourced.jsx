import { headers } from 'next/headers';
import {GetuserId} from "../../../context/Usercontext.jsx"
export default async function Sourced() {
    const [userId, setUserId]=GetuserId()
  const headersList = await headers();
  
const userAgent = headersList.get('userid');
setUserId(userAgent)
console.log(userAgent);

  return (
    <div>Sourced</div>
  )
}