import formidable from "formidable";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // important
  },
};

// Convert request into a readable stream (Next.js Request is not directly compatible)
function toNodeReadable(req) {
  const reader = req.body.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(Buffer.from(value));
    },
  });

  // ✅ copy headers so formidable can see content-length, content-type, etc.
  stream.headers = Object.fromEntries(req.headers);

  return stream;
}

export async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true, // allow multiple files
      keepExtensions: true,
    });

    const nodeReq = toNodeReadable(req);
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}
