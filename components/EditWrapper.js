// components/EditWrapper.js
'use client';
import EditModeProvider from './EditModeProvider';

export default function EditWrapper({ children }) {
  return <EditModeProvider>{children}</EditModeProvider>;
}
