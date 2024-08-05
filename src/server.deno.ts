import app from "./server"
// import bbsmenuJson from './module/bbsmenu'

Deno.serve(app.fetch)