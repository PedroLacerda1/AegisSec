'use client';

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Radio,
  Sparkles,
  ShieldAlert,
  Loader2,
  Layers,
} from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  badgeLevel: string;
}

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('pedrohenrilacerda@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Lead SecOps Cmdr');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-configured operator profiles for quick 1-click access
  const demoUsers: { user: AuthUser; pass: string; title: string }[] = [
    {
      user: {
        id: 'usr-1',
        name: 'Dr. Gabriel Vasconcelos',
        email: 'pedrohenrilacerda@gmail.com',
        initials: 'GV',
        role: 'Lead SecOps Cmdr',
        badgeLevel: 'SEC-LEVEL ALPHA',
      },
      pass: 'admin123',
      title: 'Comandante Chefe (CISO / SecOps Cmdr)',
    },
    {
      user: {
        id: 'usr-2',
        name: 'Ana Lacerda',
        email: 'ana.secops@aegis.bank',
        initials: 'AL',
        role: 'Identity & Access Analyst',
        badgeLevel: 'SEC-LEVEL BETA',
      },
      pass: 'analyst123',
      title: 'Analista de Identidade & Remediação',
    },
  ];

  const handleQuickLogin = (demo: typeof demoUsers[0]) => {
    setEmail(demo.user.email);
    setPassword(demo.pass);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(demo.user);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, informe seu email e senha de operador.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (isRegister) {
        if (!name.trim()) {
          setErrorMessage('Informe seu nome completo para o cadastro.');
          return;
        }
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'OP';

        const newUser: AuthUser = {
          id: `usr-${Date.now()}`,
          name,
          email,
          initials,
          role,
          badgeLevel: 'SEC-LEVEL ALPHA',
        };

        onLoginSuccess(newUser);
      } else {
        // Authenticate
        const match = demoUsers.find((d) => d.user.email.toLowerCase() === email.toLowerCase());
        if (match) {
          if (password !== match.pass) {
            setErrorMessage('Senha incorreta para este operador.');
            return;
          }
          onLoginSuccess(match.user);
        } else {
          // Custom authenticated user
          const initials = email.slice(0, 2).toUpperCase();
          const user: AuthUser = {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0].replace('.', ' '),
            email,
            initials,
            role: 'SecOps Engineer',
            badgeLevel: 'SEC-LEVEL ALPHA',
          };
          onLoginSuccess(user);
        }
      }
    }, 850);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-950 p-4 text-slate-100 overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Cyber Grid and Glowing Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Branding Lockup */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Shield className="h-7 w-7 fill-white text-blue-600" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
            </div>
            <div className="text-left">
              <div className="flex items-center text-xl font-extrabold tracking-tight text-white">
                <span>AEGIS</span>
                <span className="text-blue-500">SEC</span>
              </div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                DEFENSE OPS // SOC GATEWAY
              </div>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-mono text-[10px] text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>NODE SP-01 · CANAL DE AUTENTICAÇÃO mTLS CRIPTOGRAFADO</span>
          </div>
        </div>

        {/* Auth Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
          {/* Header Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <div>
              <h2 className="text-base font-extrabold text-white">
                {isRegister ? 'Cadastro de Operador SOC' : 'Acesso Seguro ao Terminal'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRegister ? 'Crie suas credenciais de segurança' : 'Insira suas credenciais corporativas'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage(null);
              }}
              className="font-mono text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              {isRegister ? 'Voltar ao Login' : 'Novo Operador?'}
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="font-semibold text-slate-300">Nome Completo do Operador:</label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Pedro Henrique Lacerda"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Cargo / Função SecOps:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Lead SecOps Cmdr">Lead SecOps Cmdr</option>
                    <option value="Security Architect / CISO">Security Architect / CISO</option>
                    <option value="SOC Incident Responder (L2/L3)">SOC Incident Responder (L2/L3)</option>
                    <option value="Identity & Access Analyst">Identity & Access Analyst</option>
                    <option value="DevSecOps Engineer">DevSecOps Engineer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="font-semibold text-slate-300">Email Corporativo / Identificador:</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operador@aegis.bank"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300">Senha de Autenticação:</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => setPassword('admin123')}
                    className="text-[11px] text-slate-400 hover:text-blue-400"
                  >
                    Redefinir demo
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-10 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Optional 2FA Code */}
            {!isRegister && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Fingerprint className="h-3.5 w-3.5 text-blue-400" />
                    <span>Token MFA / YubiKey (Opcional):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setMfaCode('849201')}
                    className="text-[10px] text-blue-400 hover:underline"
                  >
                    Gerar OTP
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Ex: 849201"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-center tracking-widest font-mono text-white placeholder:text-slate-700 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span>Lembrar dispositivo por 12 horas</span>
              </label>
              <span className="font-mono text-[10px] text-emerald-400">FIPS 140-3 OK</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Estabelecendo Conexão Segura...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>{isRegister ? 'Criar Credencial & Entrar' : 'Autenticar no Gateway'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Access for Demo Accounts */}
          {!isRegister && (
            <div className="mt-5 border-t border-slate-800 pt-4">
              <div className="mb-2.5 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Acesso Rápido de Demonstração
              </div>
              <div className="space-y-2">
                {demoUsers.map((d) => (
                  <button
                    key={d.user.id}
                    type="button"
                    onClick={() => handleQuickLogin(d)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 hover:border-blue-500/50 hover:bg-slate-900 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white group-hover:bg-blue-600 transition-colors">
                        {d.user.initials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {d.user.name}
                        </div>
                        <div className="text-[10px] text-slate-500">{d.title}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 text-center font-mono text-[10px] text-slate-600">
          Uso restrito e monitorado sob diretrizes ISO/IEC 27001 e NIST 800-53.<br />
          Sessão protegida por criptografia TLS 1.3 de ponta a ponta.
        </div>
      </div>
    </div>
  );
}
