import connectdb from './config/mongodbconnection.js'
export default function Home() {
  connectdb()
  return <div></div>;

}
