export function success(res, status, data={message:"Done"}) {
  return res.status(status).json(data);
}
