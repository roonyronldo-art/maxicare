// lib/initLabAdmin.js
// مؤقتًا: تعطيل كل منطق إنشاء وتجهيز مجموعات PocketBase
// لتسهيل تسجيل الدخول حتى يتم ضبط بيانات Admin الصحيحة.
import PocketBase from 'pocketbase';

export default async function ensureLabAdmin() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090');

  // authenticate as admin if credentials provided
  const adminEmail = process.env.PB_ADMIN_EMAIL;
  const adminPass = process.env.PB_ADMIN_PASS;
  let adminOK = false;
  if (adminEmail && adminPass) {
    try {
      await pb.admins.authWithPassword(adminEmail, adminPass);
      adminOK = true;
    } catch (e) {
      console.warn('PocketBase admin auth failed with env creds:', e?.message || e);
    }
  }
  if (!adminOK) {
    // try to create admin if none exist
    try {
      await pb.admins.create({ email: 'adminlab@lab.com', password: '12345678', passwordConfirm: '12345678' });
      await pb.admins.authWithPassword('adminlab@lab.com', '12345678');
      adminOK = true;
      console.log('ensureLabAdmin: created and authenticated new adminlab@lab.com');
    } catch {}
  }
  if (!adminOK) {
    // try common fallback creds list
    const fallbackPairs = [
      ['adminlab@lab.com','12345678'],
      ['admin@example.com','12345678'],
    ];
    for (const [email, pass] of fallbackPairs) {
      if (adminOK) break;
      try {
        await pb.admins.authWithPassword(email, pass);
        adminOK = true;
        console.log(`ensureLabAdmin: authenticated with fallback ${email}`);
      } catch {}
    }
  }
  if (!adminOK) {
    console.warn('ensureLabAdmin: no admin auth; cannot create collections');
    return;
  }

  // -------- ensure lab_users collection --------
  let labUsersCol = (await pb.collections.getFullList()).find(c=>c.name==='lab_users');
  if (!labUsersCol) {
    labUsersCol = await pb.collections.create({ name:'lab_users', type:'base', schema:[
      { name:'name', type:'text' },
      { name:'email', type:'email', required:true, unique:true },
      { name:'password', type:'text', required:true },
      { name:'role', type:'text' },
      { name:'phone', type:'text' },
      { name:'address', type:'text' },
    ]});
    console.log('lab_users collection created');
  }

  // ensure default admin user in lab_users
  try {
    const existingAdmin = await pb.collection('lab_users').getFirstListItem('role="admin"').catch(()=>null);
    if (!existingAdmin) {
      await pb.collection('lab_users').create({
        name: 'Lab Admin',
        email: 'adminlab@lab.com',
        password: '12345678',
        role: 'admin',
      });
      console.log('Default lab admin user created in lab_users');
    }
  } catch (e) {
    console.warn('Unable to create default lab admin user', e?.message || e);
  }

  // -------- ensure labRequests collection --------
  const collections = await pb.collections.getFullList();
  // reuse existing labUsersCol variable
  labUsersCol = collections.find(c=>c.name==='lab_users') || labUsersCol;
  const labReqCol = collections.find(c=>c.name==='labRequests');
  if (!labReqCol) {
    await pb.collections.create({
      name: 'labRequests',
      type: 'base',
      schema: [
        { name: 'description', type: 'text', required: true, unique: false },
        { name: 'files', type: 'file', required: false, options: { maxSelect: 10, maxSize: 5242880 } },
        { name: 'user', type: 'relation', required: true, options: { collectionId: labUsersCol?.id, cascadeDelete: false } },
        { name: 'status', type: 'text', required: false },
        { name: 'replyFiles', type: 'file', required: false, options: { maxSelect: 10, maxSize: 5242880 } },
        { name: 'adminReply', type: 'text', required: false },
      ],
      createRule: '', // public
      listRule: '',
      viewRule: '',
    });
    console.log('labRequests collection created');
  } else {
    let needUpdate = false;
    // ensure relation points to lab_users correctly
    const userField = labReqCol.schema.find(f=>f.name==='user');
    if (userField && userField.options?.collectionId !== labUsersCol?.id) {
      userField.options.collectionId = labUsersCol?.id;
      needUpdate = true;
    }
    // ensure rules are public
    if (labReqCol.createRule !== '' || labReqCol.listRule !== '' || labReqCol.viewRule !== '') {
      labReqCol.createRule = '';
      labReqCol.listRule = '';
      labReqCol.viewRule = '';
      needUpdate = true;
    }
    if (needUpdate) {
      await pb.collections.update(labReqCol.id, {
        schema: labReqCol.schema,
        createRule: labReqCol.createRule,
        listRule: labReqCol.listRule,
        viewRule: labReqCol.viewRule,
      });
      console.log('labRequests collection schema/rules updated');
    }
  }
}