import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API route for recording status or future processing
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock endpoint for "saving" files (in a real app, this would use multer to save to disk/cloud)
  app.post("/api/upload", (req, res) => {
    const { filename } = req.body;
    console.log(`Received upload request for: ${filename}`);
    res.json({ success: true, message: `File ${filename} acknowledged.` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
