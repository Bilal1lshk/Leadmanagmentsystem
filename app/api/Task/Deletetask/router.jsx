async function POST(Request) {
    try {
        await dbConnect()
        const deleted=await taskmodel.findByIdAndDelete(Request.params.id)
        if(!deleted) return NextResponse.json({message:"No task found with this id"}, {status:404})
        return NextResponse.json({message:"Task deleted successfully"}, {status:200})
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({ message: "Error in Deleting task" }, { status: 500 })
    }
}