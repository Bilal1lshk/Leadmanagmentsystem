import { headers } from 'next/headers';
export default function Sourced() {
  const gettingheaders= async ()=>{
  const header=await headers()
  console.log(header)
  }
  gettingheaders()

  return (
    <div>Sourced</div>
  )
}
