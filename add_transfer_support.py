import re

print("Script para adicionar suporte a transfer")

with open('edge_function.js', 'r') as f:
    content = f.read()

pattern = r'(// Processar HOTEL.*?}\s*)(else if \(isFlight\))'

transfer_code = '''
// PROCESSAR TRANSFER
else if (payload.transfer_type || payload.pickup_location) {
  const transferData = {
    type: payload.transfer_type,
    pickup: payload.pickup_location,
    dropoff: payload.dropoff_location,
    date: payload.transfer_date,
    time: payload.transfer_time,
    confirmation: payload.transfer_confirmation
  };
  
  const existingTransfers = tripData.transfers || [];
  const transferExists = existingTransfers.some(t => 
    t.confirmation === transferData.confirmation
  );
  
  if (!transferExists) {
    tripData.transfers = [...existingTransfers, transferData];
    console.log('Transfer adicionado');
  }
}
'''

new_content = re.sub(pattern, r'\1' + transfer_code + r'\n\2', content, flags=re.DOTALL)

with open('edge_function_updated.js', 'w') as f:
    f.write(new_content)

print("✅ Código adicionado com sucesso")
