import crypto from 'crypto';
import getLabPB from './labPocketBase.js';

export default async function ensureLabAdmin() {
    const pb = getLabPB();
  // login as admin using env credentials or default fallback
  let adminLogged = false;
  if (process.env.PB_ADMIN_EMAIL && process.env.PB_ADMIN_PASS) {
    try {
      await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL, process.env.PB_ADMIN_PASS);
      adminLogged = true;
    } catch (authErr) {
      console.warn('PocketBase admin auth failed with env creds:', authErr?.message || authErr);
    }
  }
  if (!adminLogged) {
    try {
      try {
      await pb.admins.authWithPassword('admin@example.com', 'admin123456');
      adminLogged = true;
    } catch {
      await pb.admins.authWithPassword('admin@example.com', '123456');
      adminLogged = true;
    }
      adminLogged = true;
    } catch {}
  }
  // proceed even if admin login fails; collection creation will fail but handled
  try {
    const needed = ['lab_users','lab_tickets','lab_messages'];
    const existingCols = (await pb.collections.getFullList()).map(c=>c.name);
    for (const col of needed) {
      if (!existingCols.includes(col)) {
          if (col === 'lab_users') {
            await pb.collections.create({
              name: 'lab_users',
              type: 'base',
              schema: [
                { name: 'email', type: 'text', required: true, unique: false },
                { name: 'password', type: 'text', required: true, unique: false },
                { name: 'role', type: 'text', required: true, unique: false },
                { name: 'name', type: 'text', required: false, unique: false }
              ]
            });
          } else {
            await pb.collections.create({ name: col, type: 'base', schema: [] });
          }
        } else if (col === 'lab_users') {
          // ensure required fields exist
          const labCol = (await pb.collections.getFullList()).find(c=>c.name==='lab_users');
          const need = ['email','password','role','name'];
          const missing = need.filter(f=>!labCol.schema.some(s=>s.name===f));
          if (missing.length){
            const updatedSchema=[...labCol.schema, ...missing.map(n=>({name:n,type:'text',required:(n!=='name'),unique:false}))];
            await pb.collections.update(labCol.id,{schema:updatedSchema});
          }
        }
    }
    // ensure deterministic admin credentials for user convenience
    const preferredEmail = 'adminlab@lab.com';
    const preferredPass = crypto.randomBytes(4).toString('base64url');
    let existing = await pb.collection('lab_users').getFirstListItem(`email="${preferredEmail}"`).catch(() => null);
    if (!existing) {
      await pb.collection('lab_users').create({ email: preferredEmail, password: preferredPass, role: 'admin', name: 'Lab Admin' });
      console.log('LAB ADMIN CREATED =>', preferredEmail, preferredPass);
      return { email: preferredEmail, password: preferredPass };
    }
    return { email: existing.email, password: existing.password };
  } catch (e) {
    console.error('ensureLabAdmin error', e);
  }
}
