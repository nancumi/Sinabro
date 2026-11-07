import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';

export const metadata: Metadata = {
  title: 'Sinabro - 시간 때우기를 할 수 있는 곳',
  description: '다양한 미니게임과 유용한 콘텐츠를 시나브로 즐길 수 있는 공간입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-slate-950 text-slate-100 text-[12px] antialiased min-h-screen">
        <AuthProvider>
          <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
