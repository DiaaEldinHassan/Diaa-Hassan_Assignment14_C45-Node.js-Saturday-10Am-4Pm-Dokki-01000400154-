export function successThrow(status=200,data) {
    return {
        success:true,
        status,
        data
    }
}