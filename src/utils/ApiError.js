class ApiError extends Error{
    constructor (
        status,
        message = "Something went wrong",
        error = []
    ){
        super(message)
        this.data = null
        this.status = status
        this.error = error
        this.success = false
    }
}

export {ApiError}