'use client';



import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import useConfig from '@/lib/useConfig';

export default function DesignPage() {
  const router = useRouter();
  const { config, isLoading, error, mutate } = useConfig();

  // WYSIWYG state
  const iframeRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState('');

  const [form, setForm] = useState({
    logo: null,
    homeClinicImg: null,
    homeLabImg: null,
    homeEduImg: null,
    primaryColor: '',
    secondaryColor: '',
    footerText: '',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // ensure only admins reach this page
  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      const user = pb.authStore.model;
      if (!pb.authStore.isValid) {
        router.replace('/admin/login'); // يفترض أن لديك صفحة تسجيل دخول للمشرف
      } else if (user?.role !== 'admin') {
        router.replace('/');
      }
    });
    // استدعاء أوّل مرة
    const initialUser = pb.authStore.model;
    if (!pb.authStore.isValid) {
      router.replace('/admin/login');
    } else if (initialUser?.role !== 'admin') {
      router.replace('/');
    }
    return unsub;
  }, [router]);

  // when config loaded, populate defaults
  useEffect(() => {
    if (config) {
      setForm((f) => ({
        ...f,
        primaryColor: config.primaryColor || '#1e40af',
        secondaryColor: config.secondaryColor || '#0ea5e9',
        footerText: config.footerText || '',
      }));
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DESIGN] SUBMIT CLICKED');
    
    setSaving(true);
    setMsg('');
    try {
      // ensure we are working with up-to-date record
      let current = config;
      if (!current) {
        try {
          current = await pb.collection('config').getFirstListItem('');
        } catch {}
      }
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') {
          fd.append(k, v);
        }
      });
      if (current && current.id) {
        await pb.collection('config').update(current.id, fd);
      } else {
        const created = await pb.collection('config').create(fd);
        await mutate();
        setMsg('تم إنشاء إعداد جديد وحفظه بنجاح');
      }
      const latest = await pb.collection('config').getFirstListItem('');
      console.log('[DESIGN] LATEST CONFIG:', latest);
      await mutate(latest, { revalidate: false });
      console.log('[DESIGN] CONFIG SAVED SUCCESSFULLY');
      setMsg('تم الحفظ بنجاح');
      router.refresh();
      await mutate();
    } catch (err) {
     console.log('[DESIGN] PB URL =', pb.baseUrl || pb.url);
     console.error('[DESIGN] PB ERROR:', err);
     setMsg('فشل الحفظ: ' + JSON.stringify(err, null, 2));
    } finally {
      console.log('[DESIGN] FINALLY SAVING:', saving);
      setSaving(false);
    }
  };

  // Early data loading handled later to keep hooks order consistent

  

  // add/remove highlights inside iframe when editMode toggles
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = e.currentTarget.getAttribute('data-edit');
      if (key) setSelected(key);
    };

    const applyHighlights = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      doc.querySelectorAll('[data-edit]').forEach((el) => {
        el.style.outline = editMode ? '2px solid #22c55e' : '';
        el.style.cursor = editMode ? 'pointer' : '';
        el.removeEventListener('click', handleClick);
        if (editMode) el.addEventListener('click', handleClick);
      });
    };

    // Apply immediately if iframe already loaded
    if (iframe.contentDocument?.readyState === 'complete') {
      applyHighlights();
    }

    // Re-apply on every load (navigation inside iframe)
    iframe.addEventListener('load', applyHighlights);

    return () => {
      iframe.removeEventListener('load', applyHighlights);
    };
  }, [editMode]);

  const imgPreview = (fileField, fallback) => {
    if (form[fileField] instanceof File) return URL.createObjectURL(form[fileField]);
    return config[fileField] ? pb.files.getURL(config, config[fileField]) : fallback;
  };

  if (isLoading || !config) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error.message}</p>;

  return (
    <div className="flex flex-col lg:flex-row p-6 gap-6">
      <div className="flex-1">
          <iframe ref={iframeRef} src="/" className="w-full h-[80vh] border rounded-lg" />
          <button onClick={() => setEditMode(!editMode)} className="mt-2 px-3 py-1 rounded shadow text-sm bg-gray-800 text-white">
            {editMode ? 'إيقاف التعديل' : 'وضع التعديل'}
          </button>
        </div>
        <div className="w-full lg:w-[420px] space-y-6">
          <h1 className="text-2xl font-bold mb-4">إعداد تصميم الموقع</h1>
      {selected && (
            <div className="p-3 border rounded bg-gray-50">
              <p className="font-medium mb-2">العنصر المحدد: <span className="text-blue-600">{selected}</span></p>
              {['logo','homeClinicImg','homeLabImg','homeEduImg'].includes(selected) ? (
                <div className="space-y-2">
                  <input type="file" accept="image/*" onChange={(e)=>{
                    const file=e.target.files?.[0];
                    if(file){
                      setForm(prev=>({...prev,[selected]:file}));
                      setMsg('تم اختيار صورة جديدة، اضغط حفظ');
                    }
                  }} />
                  {form[selected] && (
                    <Image src={imgPreview(selected,'/placeholder.png')} alt="preview" width={180} height={100} className="border" />
                  )}
                </div>
              ): (
                <textarea className="w-full border rounded p-2" rows={3} value={form[selected]||''} onChange={(e)=>setForm(prev=>({...prev,[selected]:e.target.value}))} />
              )}
            </div>
          )}

          {msg && <p className="text-center text-green-700">{msg}</p>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Logo */}
        <div>
          <label className="block font-medium mb-1">شعار الموقع</label>
          {config.logo && (
            <Image src={pb.files.getURL(config, config.logo)} alt="logo" width={120} height={60} className="mb-2 border" />
          )}
          <input type="file" accept="image/*" name="logo" onChange={handleChange} />
        </div>

        {/* Home images */}
        <div>
          <label className="block font-medium mb-1">صور الصفحة الرئيسية</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['homeClinicImg', 'homeLabImg', 'homeEduImg'].map((f) => (
              <div key={f} className="flex flex-col gap-2 items-start">
                <Image
                  src={imgPreview(f, '/placeholder.png')}
                  alt={f}
                  width={180}
                  height={100}
                  className="object-cover border"
                />
                <input type="file" accept="image/*" name={f} onChange={handleChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">اللون الأساسي</label>
            <input type="color" name="primaryColor" value={form.primaryColor} onChange={handleChange} className="w-16 h-10 p-0 border" />
          </div>
          <div>
            <label className="block font-medium mb-1">اللون الثانوي</label>
            <input type="color" name="secondaryColor" value={form.secondaryColor} onChange={handleChange} className="w-16 h-10 p-0 border" />
          </div>
        </div>

        {/* Footer text */}
        <div>
          <label className="block font-medium mb-1">نص التذييل</label>
          <textarea name="footerText" value={form.footerText} onChange={handleChange} className="w-full border rounded p-2" rows={3} />
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  </div>
  );
}
