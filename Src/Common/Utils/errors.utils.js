export function errorThrow(status=500,message="Server Error")
{
    const err=new Error(message);
    err.status=status;
    throw err;
}