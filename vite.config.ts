import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fleetPlugin } from './vite-plugin-fleet.ts'

export default defineConfig({
  plugins: [react(), fleetPlugin()],
})
