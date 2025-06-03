document.addEventListener('DOMContentLoaded', function() {
  function updateProgressBar() {
    fetch('/cart.js', {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(cart => {
        const threshold = {{ free_shipping_threshold }} * 100;
        const total = cart.total_price;
        const percentage = Math.min((total / threshold) * 100, 100);
        const remaining = Math.max(threshold - total, 0);

        const progressBar = document.querySelector('.progress-bar');
        const message = document.querySelector('.free-shipping-message');
        progressBar.style.width = percentage + '%';
        progressBar.dataset.progress = percentage;

        if (total >= threshold) {
          message.innerHTML = '<span class="free-shipping-success">Parabéns! Você ganhou frete grátis!</span>';
        } else {
          message.innerHTML = `<span class="free-shipping-progress">Faltam ${formatMoney(remaining)} para o frete grátis!</span>`;
        }
      })
      .catch(error => console.error('Erro ao atualizar carrinho:', error));
  }

  function formatMoney(cents) {
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: '{{ cart.currency.iso_code }}'
    });
  }
  document.addEventListener('cart:updated', updateProgressBar);

  updateProgressBar();
  
});