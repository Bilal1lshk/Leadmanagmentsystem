export default async function POST(Request) {
    console.log("request hitted")
    try {
        const { source, status } = await Request.json();
        console.log(source, status)
    }
    catch (err) {
        console.log(err)
    }
}