import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_OrVKS7QZL4ca@ep-proud-sound-a5lo94sh-pooler.us-east-2.aws.neon.tech/ai-live-portrait-generator?sslmode=require',
},
  out: "./drizzle",
});



