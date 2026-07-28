export default async function Post(Request) {
    try {
        const { email, password } = await Request.json();
        console.log(email, password)


    }
    catch (err) {
        console.log(err)
    }
}