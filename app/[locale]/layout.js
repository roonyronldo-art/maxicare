import "../globals.css";
import I18nProvider from "../../components/I18nProvider";
import ThemeProvider from "../../components/ThemeProvider";
import { AuthProvider } from "../../context/AuthContext";
import { dir } from "i18next";
import Navbar from "../../components/Navbar";
import EditWrapper from "../../components/EditWrapper";
import WhatsAppButton from "../../components/WhatsAppButton";

export const metadata = {
  title: "Maxicare",
  description: "Maxicare medical management platform",
};

export default async function RootLayout({ children, params }) {
    const { locale } = await params;
  return (
    <div lang={locale} dir={dir(locale)} className="antialiased">
      <EditWrapper>
        <AuthProvider>
          <ThemeProvider>
          <I18nProvider>
            <Navbar />
            {children}
            <WhatsAppButton />
          </I18nProvider>
        </ThemeProvider>
        </AuthProvider>
      </EditWrapper>
    </div>
  );
}
