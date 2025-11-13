export default function handler(req, res) {
  res.setHeader("x-from", "vercel-fn");
  res.status(200).json({ ok: true });
}
