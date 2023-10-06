import { serve } from 'std/http/server.ts';
import { Router } from './router.ts';

const router = new Router()
const handler = await router.getHandler()

serve(handler);
