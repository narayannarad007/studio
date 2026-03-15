import { config } from 'dotenv';
config();

import '@/ai/flows/parse-resume.ts';
import '@/ai/flows/optimize-resume-for-job.ts';
import '@/ai/flows/prepare-for-interview.ts';
import '@/ai/flows/generate-cover-letter.ts';
import '@/ai/flows/chat-career-assistant.ts';
import '@/ai/flows/analyze-job.ts';