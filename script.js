/**
 * CONFIGURAÇÃO DO EVENTO
 */
const EVENT_CONFIG = {
  // Data alvo: Dia 14 de Novembro às 19:00 (horário local)
  targetMonth: 10, // 0 = Jan ... 10 = Novembro
  targetDay: 14,
  targetHour: 19,
  targetMinute: 0,

  // Links oficiais
  locationUrl: 'https://maps.app.goo.gl/ciUZGgc5M2XpVGJ2A',
  instagramUrl: 'https://www.instagram.com/jovens_ungidosparavencer/',
  whatsappUrl:
    'https://wa.me/557799369625?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Congresso%20de%20Jovens%20-%202%C2%AA%20Temporada%20Remanescentes%20(14%20e%2015%20de%20Novembro%20%C3%A0s%2019h).',

  addressText: 'Rua Clarice Lispector - Florais Léia - Ao lado da Rimacon',
};

function getTargetDate() {
  const now = new Date();
  const year = now.getFullYear();

  let target = new Date(
    year,
    EVENT_CONFIG.targetMonth,
    EVENT_CONFIG.targetDay,
    EVENT_CONFIG.targetHour,
    EVENT_CONFIG.targetMinute,
    0
  );

  const eventEnd = new Date(year, EVENT_CONFIG.targetMonth, 15, 23, 59, 59);

  if (now > eventEnd) {
    target = new Date(
      year + 1,
      EVENT_CONFIG.targetMonth,
      EVENT_CONFIG.targetDay,
      EVENT_CONFIG.targetHour,
      EVENT_CONFIG.targetMinute,
      0
    );
  }

  return target;
}

const targetDate = getTargetDate();

function pad2(num) {
  return String(Math.max(0, num)).padStart(2, '0');
}

function updateCountdown() {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const statusEl = document.getElementById('countdownStatusText');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (diffMs <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    if (statusEl) {
      statusEl.textContent = 'É HOJE • O AVANÇO COMEÇOU!';
    }
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = pad2(days);
  hoursEl.textContent = pad2(hours);
  minutesEl.textContent = pad2(minutes);
  secondsEl.textContent = pad2(seconds);
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function setupActions() {
  const copyBtn = document.getElementById('copyAddressBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EVENT_CONFIG.addressText);
        showToast('📍 Endereço copiado!');
      } catch {
        showToast(EVENT_CONFIG.addressText);
      }
    });
  }

  const shareHandler = async () => {
    const shareData = {
      title: 'Congresso de Jovens | 2ª Temporada Remanescentes',
      text: 'Você é nosso convidado para o Congresso de Jovens - 2ª Temporada Remanescentes: O Avanço! Dias 14 e 15 de Novembro às 19h.',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Cancelado pelo usuário
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('🔗 Link do evento copiado!');
      } catch {
        showToast('Compartilhe o link desta página!');
      }
    }
  };

  const topShareBtn = document.getElementById('topShareBtn');
  if (topShareBtn) {
    topShareBtn.addEventListener('click', shareHandler);
  }

  const shareEventBtn = document.getElementById('shareEventBtn');
  if (shareEventBtn) {
    shareEventBtn.addEventListener('click', shareHandler);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setupActions();
});
