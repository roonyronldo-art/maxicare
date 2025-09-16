'use client';
// components/EditModeProvider.js

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Dialog } from '@headlessui/react';

import useConfig from '@/lib/useConfig';

// provide empty default to avoid destructuring errors when provider is absent
const EditCtx = createContext({});

export function useEdit() {
  return useContext(EditCtx);
}

export default function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false);
  // debug: expose globally
  typeof window !== 'undefined' && (window.__editMode = editMode);
  const [loginPanel, setLoginPanel] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const adminKeyRef = useRef(process.env.NEXT_PUBLIC_ADMIN_KEY || '');
  const [panel, setPanel] = useState({ open: false });
  const { config, mutate } = useConfig();

  // activate edit mode by toggling contentEditable on all [data-field] elements
  const toggleContentEditable = (state) => {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-field]').forEach((el) => {
      if (el.tagName === 'IMG') return; // handled separately
      el.contentEditable = state;
      const field = el.dataset.field;
      const onInput = () => {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.edit-label').forEach((n)=>n.remove());
        drafts.current[field] = clone.innerText;
      };
      // disable link/button default during edit mode
      const blockClick = (e) => e.preventDefault();
      if (state) {
        if (field && !el.__onInput) {
          el.addEventListener('input', onInput);
          el.__onInput = onInput;
        }
        if ((el.tagName === 'A' || el.tagName === 'BUTTON') && !el.__blockClick) {
          el.addEventListener('click', blockClick);
          el.__blockClick = blockClick;
        }
      } else {
        if (el.__onInput) {
          el.removeEventListener('input', el.__onInput);
          delete el.__onInput;
        }
        if (el.__blockClick) {
          el.removeEventListener('click', el.__blockClick);
          delete el.__blockClick;
        }
      }
      // manage label
      if (state) {
        if (!el.querySelector('.edit-label')) {
          const lbl = document.createElement('span');
          lbl.className = 'edit-label';
          lbl.textContent = 'edit';
          lbl.style.cssText = 'background:#f97316;color:#fff;font-size:10px;padding:1px 3px;border-radius:3px;margin-left:4px;pointer-events:none;';
          if (getComputedStyle(el).display === 'inline' || el.tagName === 'SPAN' || el.tagName === 'A') {
            el.appendChild(lbl);
          } else {
            lbl.style.position = 'absolute';
            lbl.style.top = '2px';
            lbl.style.right = '2px';
            el.style.position = 'relative';
            el.appendChild(lbl);
          }
        }
      } else {
        const lbl = el.querySelector('.edit-label');
        lbl && lbl.remove();
      }
      el.style.outline = state ? '2px dashed #ec4899' : '';
    });
    document.querySelectorAll('img[data-field]').forEach((img) => {
      img.style.outline = state ? '2px dashed #0af' : '';
    // label for images
    if (state) {
      if (!img.parentElement.querySelector('.edit-label')) {
        const lbl = document.createElement('span');
        lbl.className = 'edit-label';
        lbl.textContent = 'edit';
        lbl.style.cssText = 'position:absolute;top:2px;right:2px;background:#f97316;color:#fff;font-size:10px;padding:1px 3px;border-radius:3px;pointer-events:none;z-index:60;';
        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(lbl);
      }
    } else {
      const lbl = img.parentElement.querySelector('.edit-label');
      lbl && lbl.remove();
    }
      if (state) {
        img.addEventListener('click', handleImgClick);
      } else {
        img.removeEventListener('click', handleImgClick);
      }
    });
  };

  const handleImgClick = (e) => {
    const field = e.target.dataset.field;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (ev) => {
      const file = ev.target.files?.[0];
      if (!file) return;
      // preview locally
      e.target.src = URL.createObjectURL(file);
      drafts.current[field] = file; // store File object for upload
    };
    fileInput.click();
  };

  const drafts = useRef({});
  typeof window !== 'undefined' && (window.__drafts = drafts.current);

  const openEditor = useCallback((options) => {
    if (!editMode) {
      setLoginPanel(true);
      return;
    }
    // options: { title, fields: [{key,label,type}], prefix }
    setPanel({ open: true, ...options });
  }, []);

  const close = () => setPanel({ open: false });

  const save = async () => {
    if (!config) return;
    const data = {};
    panel.fields.forEach((f) => {
      if (f.type === 'file') {
        if (f.value) data[f.key] = f.value;
      } else {
        data[f.key] = f.value;
      }
    });
    try {
      await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: adminKeyRef.current || process.env.NEXT_PUBLIC_ADMIN_KEY, data }),
      });
      await mutate();
      close();
    } catch (e) {
      alert('Failed to save');
    }
  };

  const handleLogin = async () => {
    const adminKey = (process.env.NEXT_PUBLIC_ADMIN_KEY || 'yourSecret').trim();
    if (typeof window !== 'undefined') console.log('EXPECTED_ADMIN_KEY', adminKey);
    if (email === 'admin' && password === adminKey) {
      adminKeyRef.current = password;
      setLoginPanel(false);
      setEditMode(true);
      toggleContentEditable(true);
    } else {
      setAuthError('بيانات الدخول غير صحيحة');
    }
  };

  const saveAll = async () => {
    const payload = { ...drafts.current };
    if (Object.keys(payload).length === 0) {
      alert('No changes');
      return;
    }
    // convert File objects to base64 strings
    const entries = await Promise.all(
      Object.entries(payload).map(async ([k, v]) => {
        if (v instanceof File) {
          const dataUrl = await new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.readAsDataURL(v);
          });
          return [k, dataUrl];
        }
        return [k, v];
      }),
    );
    const body = {
      adminKey: adminKeyRef.current || process.env.NEXT_PUBLIC_ADMIN_KEY,
      data: Object.fromEntries(entries),
    };
    const res = await fetch('/api/save-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      alert('Failed to save');
      return;
    }
    drafts.current = {};
    await mutate(undefined, { revalidate: true });
    toggleContentEditable(false);
    setEditMode(false);
  };

  return (
    <EditCtx.Provider value={{ editMode, setEditMode, openEditor }}>
      {children}
      {/* toggle button bottom-right */}




      {/* Panel */}
      <Dialog open={panel.open} onClose={close} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg space-y-4 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="font-bold text-lg mb-2">
              {panel.title || 'Edit'}
            </Dialog.Title>
            {panel.fields?.map((field, idx) => (
              <div key={idx} className="space-y-1">
                <label className="block text-sm font-medium">{field.label}</label>
                {field.type === 'file' ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      field.value = files?.[0] || null;
                      setPanel({ ...panel });
                    }}
                  />
                ) : (
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={field.value}
                    onChange={(e) => {
                      field.value = e.target.value;
                      setPanel({ ...panel });
                    }}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={close}
                className="px-3 py-1 rounded border"
              >
                إلغاء
              </button>
              <button
                onClick={save}
                className="px-4 py-1 rounded bg-green-600 text-white"
              >
                حفظ
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    {/* Login Dialog */}
      <Dialog open={loginPanel} onClose={() => setLoginPanel(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 shadow space-y-4">
            <Dialog.Title className="font-bold text-lg">تسجيل دخول الأدمن</Dialog.Title>
            {authError && <p className="text-red-600 text-sm">{authError}</p>}
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded px-2 py-1"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button className="px-3 py-1 rounded border" onClick={() => setLoginPanel(false)}>
                إلغاء
              </button>
              <button className="px-4 py-1 rounded bg-indigo-600 text-white" onClick={handleLogin}>
                دخول
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </EditCtx.Provider>
  );
}
