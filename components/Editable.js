'use client';
// Generic wrapper that shows an always-visible edit button next to its children
import EditButton from './EditButton';
import { useEdit } from './EditModeProvider';

export default function Editable({ children, title, fields }) {
  const { openEditor } = useEdit();
  return (
    <span className="relative inline-block">
      <EditButton onEdit={() => openEditor({ title, fields })} />
      {children}
    </span>
  );
}
