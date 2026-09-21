import React, { useState, useMemo } from 'react';
import {
  ClientOrder,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import {
  formatCurrencyBRL,
  getPaymentMethodLabel,
  saveClientToStorage,
  deleteClientFromStorage,
  resetClientsToDefault,
} from '../utils/clientStorage';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Printer,
  Download,
  Search,
  Filter,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Calendar,
  Layers,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ClientReportsViewProps {
  clients: ClientOrder[];
  onRefreshClients: () => void;
  isSavingCloud?: boolean;
}

export const ClientReportsView: React.FC<ClientReportsViewProps> = ({
  clients,
  onRefreshClients,
  isSavingCloud = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientOrder | null>(null);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [packageName, setPackageName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [paidValue, setPaidValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [installments, setInstallments] = useState('1');
  const [notes, setNotes] = useState('');

  // Open modal for new client
  const handleOpenNewClient = () => {
    setEditingClient(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setPackageName('Álbum Luxo Fotográfico 30x30');
    setEventDate(new Date().toLocaleDateString('pt-BR'));
    setTotalValue('2500');
    setPaidValue('1000');
    setPaymentMethod('pix');
    setInstallments('1');
    setNotes('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (client: ClientOrder) => {
    setEditingClient(client);
    setClientName(client.clientName);
    setClientPhone(client.clientPhone);
    setClientEmail(client.clientEmail || '');
    setPackageName(client.packageName);
    setEventDate(client.eventDate || '');
    setTotalValue(String(client.totalValue));
    setPaidValue(String(client.paidValue));
    setPaymentMethod(client.paymentMethod);
    setInstallments(String(client.installments || 1));
    setNotes(client.notes || '');
    setIsModalOpen(true);
  };

  // Submit client
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !packageName.trim()) return;

    const total = parseFloat(totalValue) || 0;
    const paid = parseFloat(paidValue) || 0;
    const remaining = Math.max(0, total - paid);

    const clientData: ClientOrder = {
      id: editingClient ? editingClient.id : `cli-${Date.now()}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      packageName: packageName.trim(),
      eventDate: eventDate.trim() || undefined,
      totalValue: total,
      paidValue: paid,
      remainingValue: remaining,
      paymentMethod,
      installments: parseInt(installments, 10) || 1,
      paymentStatus:
        paid >= total && total > 0 ? 'pago' : paid > 0 ? 'parcial' : 'pendente',
      notes: notes.trim() || undefined,
      createdAt: editingClient ? editingClient.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveClientToStorage(clientData);
    setIsModalOpen(false);
    onRefreshClients();
  };

  // Delete client
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o cliente "${name}" do relatório?`)) {
      await deleteClientFromStorage(id);
      onRefreshClients();
    }
  };

  // Reset to default
  const handleResetDefaults = async () => {
    if (window.confirm('Restaurar clientes e orçamentos modelo padrão do álbum?')) {
      await resetClientsToDefault();
      onRefreshClients();
    }
  };

  // Print / PDF
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Cliente',
      'Telefone',
      'Email',
      'Pacote/Álbum',
      'Data do Evento',
      'Valor Total (R$)',
      'Valor Pago (R$)',
      'Saldo a Receber (R$)',
      'Forma de Pagamento',
      'Parcelas',
      'Status',
      'Observações',
    ];

    const rows = filteredClients.map((c) => [
      c.id,
      `"${c.clientName.replace(/"/g, '""')}"`,
      `"${c.clientPhone}"`,
      `"${c.clientEmail || ''}"`,
      `"${c.packageName.replace(/"/g, '""')}"`,
      `"${c.eventDate || ''}"`,
      c.totalValue.toFixed(2),
      c.paidValue.toFixed(2),
      c.remainingValue.toFixed(2),
      `"${getPaymentMethodLabel(c.paymentMethod)}"`,
      c.installments || 1,
      c.paymentStatus.toUpperCase(),
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `relatorio_clientes_albuns_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    let totalContracted = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;

    clients.forEach((c) => {
      totalContracted += c.totalValue;
      totalCollected += c.paidValue;
      totalPending += c.remainingValue;

      if (c.paymentStatus === 'pago') paidCount++;
      else if (c.paymentStatus === 'parcial') partialCount++;
      else pendingCount++;
    });

    const liquidationRate =
      totalContracted > 0 ? Math.round((totalCollected / totalContracted) * 100) : 0;

    return {
      totalContracted,
      totalCollected,
      totalPending,
      paidCount,
      partialCount,
      pendingCount,
      totalClients: clients.length,
      liquidationRate,
    };
  }, [clients]);

  // Filtered clients list
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      // Search
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        c.clientName.toLowerCase().includes(term) ||
        c.packageName.toLowerCase().includes(term) ||
        (c.clientPhone && c.clientPhone.includes(term)) ||
        (c.clientEmail && c.clientEmail.toLowerCase().includes(term));

      // Status
      const matchStatus = statusFilter === 'todos' || c.paymentStatus === statusFilter;

      // Payment method
      const matchMethod =
        paymentMethodFilter === 'todos' || c.paymentMethod === paymentMethodFilter;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [clients, searchTerm, statusFilter, paymentMethodFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 text-[#f2ede4]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2a241b] mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#cbd5e1]/15 text-[#cbd5e1] border border-[#cbd5e1]/40 tracking-wider">
              GESTÃO & FINANCEIRO
            </span>
            {isSavingCloud && (
              <span className="text-xs text-[#d4af37] animate-pulse font-cormorant italic">
                Sincronizando com Firestore...
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-display text-transparent bg-clip-text bg-gradient-to-r from-[#f8fafc] via-[#cbd5e1] to-[#94a3b8] mt-1 font-bold">
            Relatório de Clientes, Valores & Formas de Pagamento
          </h1>
          <p className="text-sm font-cormorant text-[#a09484] mt-0.5">
            Controle de pedidos de álbuns, ensaios fotográficos, faturamento e liquidação
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="new-client-btn"
            onClick={handleOpenNewClient}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#0f0c08] font-bold text-xs font-cinzel hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente / Pedido</span>
          </button>

          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-[#181d24] border border-[#cbd5e1]/30 text-[#cbd5e1] hover:bg-[#232a34] hover:text-white transition-all text-xs font-cinzel cursor-pointer"
            title="Exportar dados para planilha Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-[#181d24] border border-[#cbd5e1]/30 text-[#cbd5e1] hover:bg-[#232a34] hover:text-white transition-all text-xs font-cinzel cursor-pointer"
            title="Imprimir relatório financeiro ou salvar em PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            id="reset-clients-btn"
            onClick={handleResetDefaults}
            className="p-2 rounded-full bg-[#14120f] border border-[#382f20] text-[#a69680] hover:text-[#d4af37] hover:border-[#d4af37]/60 transition-all cursor-pointer"
            title="Restaurar Clientes Modelo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards (Financial Summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Contratado */}
        <div className="p-4 rounded-lg bg-[#0e1117] border border-[#334155]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#94a3b8] uppercase tracking-wider">
              Faturamento Contratado
            </span>
            <div className="p-2 rounded-full bg-[#1e293b] text-[#cbd5e1]">
              <DollarSign className="w-4 h-4 text-[#38bdf8]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-display text-white mt-2">
            {formatCurrencyBRL(metrics.totalContracted)}
          </p>
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mt-2 pt-2 border-t border-[#1e293b]">
            <span>{metrics.totalClients} pedidos no sistema</span>
            <span className="text-[#38bdf8] font-semibold">100% dos Contratos</span>
          </div>
        </div>

        {/* Card 2: Total Recebido / Liquidado */}
        <div className="p-4 rounded-lg bg-[#0e1117] border border-[#166534]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#86efac] uppercase tracking-wider">
              Total Recebido (Pago)
            </span>
            <div className="p-2 rounded-full bg-[#14532d] text-[#86efac]">
              <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-display text-[#4ade80] mt-2">
            {formatCurrencyBRL(metrics.totalCollected)}
          </p>
          <div className="flex items-center justify-between text-xs text-[#86efac] mt-2 pt-2 border-t border-[#1e293b]">
            <span>{metrics.paidCount} álbuns quitados</span>
            <span className="font-semibold text-[#4ade80]">{metrics.liquidationRate}% liquidado</span>
          </div>
        </div>

        {/* Card 3: Saldo a Receber */}
        <div className="p-4 rounded-lg bg-[#0e1117] border border-[#854d0e]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#fde047] uppercase tracking-wider">
              Saldo Restante a Receber
            </span>
            <div className="p-2 rounded-full bg-[#713f12] text-[#fef08a]">
              <Clock className="w-4 h-4 text-[#facc15]" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-display text-[#facc15] mt-2">
            {formatCurrencyBRL(metrics.totalPending)}
          </p>
          <div className="flex items-center justify-between text-xs text-[#ca8a04] mt-2 pt-2 border-t border-[#1e293b]">
            <span>{metrics.partialCount + metrics.pendingCount} pendentes/parciais</span>
            <span className="font-semibold">{100 - metrics.liquidationRate}% a receber</span>
          </div>
        </div>

        {/* Card 4: Formas de Pagamento Mais Usadas */}
        <div className="p-4 rounded-lg bg-[#0e1117] border border-[#475569]/60 shadow-[0_8px_20px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#cbd5e1] uppercase tracking-wider">
              Liquidação & Métodos
            </span>
            <div className="p-2 rounded-full bg-[#1e293b] text-[#cbd5e1]">
              <CreditCard className="w-4 h-4 text-[#a78bfa]" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#94a3b8]">PIX Instantâneo</span>
              <span className="text-white font-semibold">Maior Preferência</span>
            </div>
            <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#4ade80] h-full" style={{ width: `${metrics.liquidationRate}%` }} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-[#94a3b8] mt-2 pt-2 border-t border-[#1e293b]">
            <span>Cartão em até 6x</span>
            <span className="text-[#cbd5e1]">Boleto & TED</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-lg bg-[#0e1117] border border-[#334155]/60 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            id="search-clients-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, pacote de álbum, telefone ou email..."
            className="w-full pl-9 pr-4 py-2 rounded-md bg-[#181d24] border border-[#334155] text-xs font-cinzel text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#cbd5e1]"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#94a3b8] font-cinzel hidden sm:inline">Status:</span>
          <select
            id="filter-status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-[#181d24] border border-[#334155] text-xs font-cinzel text-[#cbd5e1] focus:outline-none focus:border-[#cbd5e1]"
          >
            <option value="todos">Todos os Status</option>
            <option value="pago">Quitados / Pagos</option>
            <option value="parcial">Parcial (Entrada)</option>
            <option value="pendente">Aguardando Pagamento</option>
          </select>

          {/* Payment Method filter */}
          <select
            id="filter-method-select"
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-[#181d24] border border-[#334155] text-xs font-cinzel text-[#cbd5e1] focus:outline-none focus:border-[#cbd5e1]"
          >
            <option value="todos">Todas Formas de Pgto</option>
            <option value="pix">PIX</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="boleto">Boleto Bancário</option>
            <option value="transferencia">Transferência TED</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>
      </div>

      {/* Clients Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-lg bg-[#0e1117] border border-[#334155]/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181d24] text-[#94a3b8] uppercase font-cinzel border-b border-[#334155]">
              <tr>
                <th className="py-3 px-4">Cliente & Contato</th>
                <th className="py-3 px-4">Pacote / Modelo do Álbum</th>
                <th className="py-3 px-4">Data do Evento</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
                <th className="py-3 px-4 text-right">Valor Pago</th>
                <th className="py-3 px-4 text-right">Saldo Restante</th>
                <th className="py-3 px-4">Forma de Pagamento</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] font-sans">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#94a3b8] font-cormorant text-base">
                    Nenhum cliente ou pedido encontrado com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isPaid = client.paymentStatus === 'pago';
                  const isPartial = client.paymentStatus === 'parcial';

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-[#141922] transition-colors group"
                    >
                      {/* Cliente */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">
                          {client.clientName}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-[#94a3b8] mt-0.5">
                          {client.clientPhone && (
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-[#4ade80]" />
                              {client.clientPhone}
                            </span>
                          )}
                          {client.clientEmail && (
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-[#38bdf8]" />
                              {client.clientEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pacote */}
                      <td className="py-3.5 px-4 text-[#cbd5e1] max-w-[220px]">
                        <div className="font-medium truncate" title={client.packageName}>
                          {client.packageName}
                        </div>
                        {client.notes && (
                          <div className="text-[11px] text-[#94a3b8] truncate italic mt-0.5" title={client.notes}>
                            {client.notes}
                          </div>
                        )}
                      </td>

                      {/* Data */}
                      <td className="py-3.5 px-4 text-[#94a3b8] whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-[#cbd5e1]" />
                          {client.eventDate || 'A definir'}
                        </div>
                      </td>

                      {/* Valor Total */}
                      <td className="py-3.5 px-4 text-right font-semibold text-white whitespace-nowrap">
                        {formatCurrencyBRL(client.totalValue)}
                      </td>

                      {/* Valor Pago */}
                      <td className="py-3.5 px-4 text-right font-semibold text-[#4ade80] whitespace-nowrap">
                        {formatCurrencyBRL(client.paidValue)}
                      </td>

                      {/* Saldo Restante */}
                      <td className="py-3.5 px-4 text-right font-semibold whitespace-nowrap">
                        <span
                          className={
                            client.remainingValue > 0 ? 'text-[#facc15]' : 'text-[#64748b]'
                          }
                        >
                          {formatCurrencyBRL(client.remainingValue)}
                        </span>
                      </td>

                      {/* Forma de Pagamento */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-cinzel font-medium bg-[#1e293b] text-[#cbd5e1] border border-[#334155]">
                          <CreditCard className="w-3 h-3 mr-1 text-[#38bdf8]" />
                          {getPaymentMethodLabel(client.paymentMethod)}
                          {client.paymentMethod === 'cartao_credito' && client.installments && client.installments > 1 && (
                            <span className="ml-1 text-[#38bdf8] font-bold">({client.installments}x)</span>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isPaid && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#14532d] text-[#86efac] border border-[#166534]">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Pago
                          </span>
                        )}
                        {isPartial && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#713f12] text-[#fef08a] border border-[#854d0e]">
                            <Clock className="w-3 h-3 mr-1" />
                            Parcial
                          </span>
                        )}
                        {!isPaid && !isPartial && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7f1d1d] text-[#fca5a5] border border-[#991b1b]">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pendente
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            id={`edit-client-${client.id}`}
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 rounded bg-[#1e293b] text-[#cbd5e1] hover:text-[#38bdf8] hover:bg-[#334155] transition-colors"
                            title="Editar Dados / Registrar Pagamento"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-client-${client.id}`}
                            onClick={() => handleDelete(client.id, client.clientName)}
                            className="p-1.5 rounded bg-[#1e293b] text-[#cbd5e1] hover:text-[#f87171] hover:bg-[#334155] transition-colors"
                            title="Remover Cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating / Editing Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-lg bg-[#0e1117] border border-[#cbd5e1]/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#181d24]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#cbd5e1]" />
                <h3 className="font-cinzel text-base font-bold text-white">
                  {editingClient ? 'Editar Cliente & Pagamento' : 'Novo Cliente & Pedido de Álbum'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#94a3b8] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Cliente */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Nome Completo do Cliente *
                  </label>
                  <input
                    id="modal-client-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Studio IA, Mariana & Lucas..."
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs font-cinzel text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    id="modal-client-phone"
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Email de Contato
                  </label>
                  <input
                    id="modal-client-email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Pacote / Álbum */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Pacote / Descrição do Álbum *
                  </label>
                  <input
                    id="modal-client-package"
                    type="text"
                    required
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Ex: Álbum Casamento Luxo 30x30 Acabamento Prata..."
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Data do Evento */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Data do Evento / Ensaio
                  </label>
                  <input
                    id="modal-client-date"
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="Ex: 24 de Outubro, 2026"
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    id="modal-client-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  >
                    <option value="pix">PIX Instantâneo</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="transferencia">Transferência TED/DOC</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>

                {/* Valor Total */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Valor Total (R$) *
                  </label>
                  <input
                    id="modal-client-total"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white font-bold focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Valor Já Pago */}
                <div>
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Valor Já Pago / Entrada (R$)
                  </label>
                  <input
                    id="modal-client-paid"
                    type="number"
                    step="0.01"
                    min="0"
                    value={paidValue}
                    onChange={(e) => setPaidValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-[#4ade80] font-bold focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>

                {/* Parcelas quando cartão */}
                {paymentMethod === 'cartao_credito' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                      Número de Parcelas
                    </label>
                    <select
                      id="modal-client-installments"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none"
                    >
                      <option value="1">1x à vista no cartão</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                      <option value="4">4x</option>
                      <option value="5">5x</option>
                      <option value="6">6x</option>
                      <option value="10">10x</option>
                      <option value="12">12x</option>
                    </select>
                  </div>
                )}

                {/* Saldo Restante Calculado em Tempo Real */}
                <div className="sm:col-span-2 p-3 rounded bg-[#181d24] border border-[#334155] flex items-center justify-between text-xs">
                  <span className="text-[#94a3b8]">Saldo Calculado a Receber:</span>
                  <span className="font-bold text-base text-[#facc15]">
                    {formatCurrencyBRL(
                      Math.max(0, (parseFloat(totalValue) || 0) - (parseFloat(paidValue) || 0))
                    )}
                  </span>
                </div>

                {/* Observações */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel text-[#cbd5e1] mb-1">
                    Observações do Pedido
                  </label>
                  <textarea
                    id="modal-client-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalhes do acabamento, prazos, descontos acordados..."
                    className="w-full px-3 py-2 rounded bg-[#181d24] border border-[#334155] text-xs text-white focus:outline-none focus:border-[#cbd5e1]"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-cinzel text-[#94a3b8] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="save-client-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#0f0c08] font-bold text-xs font-cinzel hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
                >
                  {editingClient ? 'Salvar Alterações' : 'Cadastrar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
