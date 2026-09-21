import { ClientOrder, PaymentMethod, PaymentStatus } from '../types';
import { getDb } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const CLIENTS_COLLECTION = 'clients';
const LOCAL_STORAGE_KEY = 'studio_ia_client_orders_cache';

export const INITIAL_CLIENT_ORDERS: ClientOrder[] = [
  {
    id: 'cli-001',
    clientName: 'Mariana Silva & Lucas Mendes',
    clientPhone: '(11) 98765-4321',
    clientEmail: 'mariana.lucas@email.com',
    packageName: 'Álbum Casamento Luxo 30x30 com Caixa de Vidro',
    eventDate: '24 de Outubro, 2026',
    totalValue: 4200.0,
    paidValue: 4200.0,
    remainingValue: 0.0,
    paymentMethod: 'pix',
    installments: 1,
    paymentStatus: 'pago',
    notes: 'Pagamento integral com 5% de desconto via PIX no fechamento do contrato.',
    createdAt: '2026-09-01T10:30:00.000Z',
    updatedAt: '2026-09-15T14:20:00.000Z',
  },
  {
    id: 'cli-002',
    clientName: 'Studio IA (Ensaio & Álbum Principal)',
    clientPhone: '(11) 99123-8899',
    clientEmail: 'contato@studioia.com',
    packageName: 'Álbum Especial Veludo & Prata Imperial (Edição Acervo)',
    eventDate: '19 de Setembro, 2026',
    totalValue: 3500.0,
    paidValue: 3500.0,
    remainingValue: 0.0,
    paymentMethod: 'cartao_credito',
    installments: 3,
    paymentStatus: 'pago',
    notes: 'Álbum de portfólio oficial com acabamento em prata imperial e fotos ampliadas.',
    createdAt: '2026-09-10T11:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'cli-003',
    clientName: 'Patrícia Oliveira & Guilherme Costa',
    clientPhone: '(21) 97654-1234',
    clientEmail: 'patricia.costa@email.com',
    packageName: 'Ensaio Pré-Wedding & Álbum Linho Rústico 25x25',
    eventDate: '15 de Novembro, 2026',
    totalValue: 2400.0,
    paidValue: 1200.0,
    remainingValue: 1200.0,
    paymentMethod: 'pix',
    installments: 2,
    paymentStatus: 'parcial',
    notes: 'Entrada de 50% paga no agendamento. Saldo restante previsto para a entrega das provas.',
    createdAt: '2026-09-12T16:45:00.000Z',
    updatedAt: '2026-09-12T16:45:00.000Z',
  },
  {
    id: 'cli-004',
    clientName: 'Camila Fernandes & Rodrigo Barros',
    clientPhone: '(31) 98432-5678',
    clientEmail: 'camila.barros@email.com',
    packageName: 'Álbum Bodas de Prata 30x30 Acetinado',
    eventDate: '05 de Dezembro, 2026',
    totalValue: 2800.0,
    paidValue: 2800.0,
    remainingValue: 0.0,
    paymentMethod: 'boleto',
    installments: 1,
    paymentStatus: 'pago',
    notes: 'Boleto bancário compensado via Bradesco.',
    createdAt: '2026-09-05T09:15:00.000Z',
    updatedAt: '2026-09-08T11:30:00.000Z',
  },
  {
    id: 'cli-005',
    clientName: 'Beatriz Almeida & Felipe Nascimento',
    clientPhone: '(19) 99876-5432',
    clientEmail: 'beatriz.felipe@email.com',
    packageName: 'Álbum Fine Art Fotográfico & 2 Mini-Álbuns para Pais',
    eventDate: '18 de Janeiro, 2027',
    totalValue: 5600.0,
    paidValue: 2800.0,
    remainingValue: 2800.0,
    paymentMethod: 'cartao_credito',
    installments: 6,
    paymentStatus: 'parcial',
    notes: 'Parcelado em 6x no cartão de crédito. Entrada confirmada.',
    createdAt: '2026-09-16T18:00:00.000Z',
    updatedAt: '2026-09-16T18:00:00.000Z',
  },
  {
    id: 'cli-006',
    clientName: 'Juliana Paiva & Rafael Gomes',
    clientPhone: '(41) 99111-2233',
    clientEmail: 'juliana.gomes@email.com',
    packageName: 'Ensaio Externo Casal & Álbum Panorâmico 20x30',
    eventDate: '28 de Fevereiro, 2027',
    totalValue: 1850.0,
    paidValue: 0.0,
    remainingValue: 1850.0,
    paymentMethod: 'pix',
    installments: 1,
    paymentStatus: 'pendente',
    notes: 'Orçamento enviado. Aguardando confirmação do PIX da reserva da data.',
    createdAt: '2026-09-18T14:10:00.000Z',
    updatedAt: '2026-09-18T14:10:00.000Z',
  },
];

// --- Local Storage Cache ---
function loadLocalClients(): ClientOrder[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function saveLocalClients(clients: ClientOrder[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clients));
  } catch (err) {
    console.warn('Falha ao salvar clientes no localStorage:', err);
  }
}

// --- Firestore Syncing ---
export async function loadClientsFromStorage(): Promise<ClientOrder[]> {
  const local = loadLocalClients();

  try {
    const db = getDb();
    if (!db) {
      return local || INITIAL_CLIENT_ORDERS;
    }

    const clientsRef = collection(db, CLIENTS_COLLECTION);
    const snapshot = await getDocs(clientsRef);

    if (!snapshot.empty) {
      const list: ClientOrder[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ClientOrder;
        list.push({
          ...data,
          id: data.id || docSnap.id,
        });
      });

      // Sort by creation date descending
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      saveLocalClients(list);
      return list;
    }

    // Firestore empty: Seed with initial clients
    const initialList = local || INITIAL_CLIENT_ORDERS;
    await syncAllClientsToFirestore(initialList);
    saveLocalClients(initialList);
    return initialList;
  } catch (err) {
    console.warn('Erro ao carregar clientes do Firestore, usando fallback local:', err);
    return local || INITIAL_CLIENT_ORDERS;
  }
}

export async function syncAllClientsToFirestore(clients: ClientOrder[]): Promise<void> {
  const db = getDb();
  if (!db) return;

  for (const client of clients) {
    try {
      const docRef = doc(db, CLIENTS_COLLECTION, client.id);
      await setDoc(docRef, {
        ...client,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn(`Erro ao sincronizar cliente ${client.id}:`, err);
    }
  }
}

export async function saveClientToStorage(client: ClientOrder): Promise<void> {
  // Update local
  const current = (await loadClientsFromStorage()) || [];
  const existingIdx = current.findIndex((c) => c.id === client.id);
  let updated: ClientOrder[];

  const clientWithTimestamp: ClientOrder = {
    ...client,
    remainingValue: Math.max(0, client.totalValue - client.paidValue),
    paymentStatus:
      client.paidValue >= client.totalValue && client.totalValue > 0
        ? 'pago'
        : client.paidValue > 0
        ? 'parcial'
        : 'pendente',
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    updated = current.map((c) => (c.id === client.id ? clientWithTimestamp : c));
  } else {
    updated = [clientWithTimestamp, ...current];
  }

  saveLocalClients(updated);

  // Sync to Firestore
  try {
    const db = getDb();
    if (db) {
      const docRef = doc(db, CLIENTS_COLLECTION, clientWithTimestamp.id);
      await setDoc(docRef, clientWithTimestamp, { merge: true });
    }
  } catch (err) {
    console.error('Falha ao salvar cliente no Firestore:', err);
  }
}

export async function deleteClientFromStorage(id: string): Promise<void> {
  const current = (await loadClientsFromStorage()) || [];
  const filtered = current.filter((c) => c.id !== id);
  saveLocalClients(filtered);

  try {
    const db = getDb();
    if (db) {
      const docRef = doc(db, CLIENTS_COLLECTION, id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.error('Falha ao excluir cliente no Firestore:', err);
  }
}

export async function resetClientsToDefault(): Promise<ClientOrder[]> {
  saveLocalClients(INITIAL_CLIENT_ORDERS);
  try {
    await syncAllClientsToFirestore(INITIAL_CLIENT_ORDERS);
  } catch (err) {
    console.warn('Erro ao resetar clientes no Firestore:', err);
  }
  return INITIAL_CLIENT_ORDERS;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'pix':
      return 'PIX Instantâneo';
    case 'cartao_credito':
      return 'Cartão de Crédito';
    case 'cartao_debito':
      return 'Cartão de Débito';
    case 'boleto':
      return 'Boleto Bancário';
    case 'transferencia':
      return 'Transferência Bancária (TED/DOC)';
    case 'dinheiro':
      return 'Dinheiro / Espécie';
    default:
      return method;
  }
}
