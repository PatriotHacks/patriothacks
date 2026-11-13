import {
  createDrizzleSupabaseClient,
  type DatabaseTransaction,
  type SupabaseToken,
} from "@patriothacks/database";

/**
 * The RLS entry point for signed-in reads. The service-role client is reached
 * only through `withServiceRole` below, and `rls/no-admin-db-client` fails the
 * build anywhere else — forgetting the wrapper does not throw, it just silently
 * returns every applicant's rows.
 */
export async function withRls<T>(
  token: SupabaseToken,
  query: (tx: DatabaseTransaction) => Promise<T>,
): Promise<T> {
  const db = createDrizzleSupabaseClient(token);
  try {
    return await db.rls(query);
  } finally {
    await db.end();
  }
}

/**
 * Forms are anonymous, so reading a published form and inserting a submission
 * cannot go through RLS: there is no session to carry. This is the one
 * service-role entry point, used only by `loadPublishedForm` and `submitForm`,
 * which re-validate everything the browser sent before writing it.
 */
export async function withServiceRole<T>(
  query: (tx: DatabaseTransaction) => Promise<T>,
): Promise<T> {
  const db = createDrizzleSupabaseClient({ role: "service_role" });
  try {
    // eslint-disable-next-line rls/no-admin-db-client -- see the note above: anonymous form reads and one-shot submits have no session to scope.
    return await db.admin.transaction(query);
  } finally {
    await db.end();
  }
}
