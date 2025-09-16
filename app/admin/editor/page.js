'use client';

import { useState, useEffect, useRef } from 'react';
import { pb } from '@/lib/pocketbase';
import useConfig from '@/lib/useConfig';

export default function VisualEditor() {
  const iframeRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState('');

  // form state
  const [cardKey, setCardKey] = useState('clinic');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const { config, mutate } = useConfig();

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // pre-fill fields when config or selected card changes
  useEffect(() => {
    if (!config) return;
    const keyCap = capitalize(cardKey);
    setTitleEn(config[`home${keyCap}TitleEn`] || '');
    setTitleAr(config[`home${keyCap}TitleAr`] || '');
    // we don't pre-fill file; user chooses new one
  }, [config, cardKey]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMsg('');
    try {
      const keyCap = capitalize(cardKey);
      const data = {
        [`home${keyCap}TitleEn`]: titleEn,
        [`home${keyCap}TitleAr`]: titleAr,
      };
      if (file) data[`home${keyCap}Img`] = file;

      await pb.collection('config').update(config.id, data);
      await mutate();
      // reload iframe to reflect changes
      iframeRef.current?.contentWindow?.location.reload();
      setMsg('تم الحفظ بنجاح');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMsg('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  // highlight logic for preview clicks
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = e.currentTarget.getAttribute('data-edit');
      if (key) {
        setSelected(key);
        // auto-switch dropdown to clicked element
        if (key.includes('Clinic')) setCardKey('clinic');
        else if (key.includes('Lab')) setCardKey('lab');
        else if (key.includes('Edu')) setCardKey('education');
      }
    };

    const apply = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      const nodes = doc.querySelectorAll('[data-edit]');
      nodes.forEach((el) => {
        el.style.outline = editMode ? '2px dashed #10b981' : '';
        el.style.cursor = editMode ? 'pointer' : '';
        el.removeEventListener('click', handleClick);
        if (editMode) el.addEventListener('click', handleClick);
      });
    };

    if (iframe.contentDocument?.readyState === 'complete') apply();
    iframe.addEventListener('load', apply);
    return () => iframe.removeEventListener('load', apply);
  }, [editMode]);

  return (
    <div className="flex h-screen">
      {/* Preview */}
      <div className="flex-1 p-4">
        <iframe
          ref={iframeRef}
          src="/"
          className="w-full h-full border rounded"
        />
        <button
          onClick={() => setEditMode(!editMode)}
          className="mt-2 px-3 py-1 rounded bg-indigo-600 text-white shadow"
        >
          {editMode ? 'إيقاف التعديل' : 'وضع التعديل'}
        </button>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-2">إدارة محتوى الصفحة الرئيسية</h2>

        <label className="block text-sm font-medium mb-1">اختر البطاقة</label>
        <select
          value={cardKey}
          onChange={(e) => setCardKey(e.target.value)}
          className="w-full border rounded px-2 py-1 mb-2"
        >
          <option value="clinic">Clinic</option>
          <option value="lab">Lab</option>
          <option value="education">Education</option>
        </select>

        <label className="block text-sm font-medium mt-2">العنوان (EN)</label>
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />

        <label className="block text-sm font-medium mt-2">العنوان (AR)</label>
        <input
          value={titleAr}
          onChange={(e) => setTitleAr(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />

        <label className="block text-sm font-medium mt-2">صورة</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 w-full py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ…' : 'حفظ'}
        </button>
        {msg && <p className="text-center text-sm mt-1">{msg}</p>}
      </div>
    </div>
  );
}
