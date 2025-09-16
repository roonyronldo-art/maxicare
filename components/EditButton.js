// components/EditButton.js
'use client';

import { useEdit } from './EditModeProvider';

export default function EditButton({ onEdit }) {
  const { editMode } = useEdit();
  if (!editMode) return null;

  return (
    <button data-editable
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit();
      }}
      className="absolute top-2 right-2 z-50 text-xs bg-white rounded px-1.5 py-0.5 shadow"
    >
      ✎ Edit
    </button>
  );
}
