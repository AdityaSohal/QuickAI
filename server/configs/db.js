/* This code snippet is importing the `neon` function from the `@neondatabase/serverless` module. It
then creates a constant `sql` by calling the `neon` function with the `DATABASE_URL` environment
variable as an argument. Finally, it exports the `sql` constant as the default export of the module.
This code is likely setting up a connection to a database using the `neon` function and the database
URL stored in the `DATABASE_URL` environment variable. */
import {neon} from '@neondatabase/serverless'

const sql = neon(`${process.env.DATABASE_URL}`);

export default sql;