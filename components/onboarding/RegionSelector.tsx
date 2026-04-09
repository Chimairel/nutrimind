import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

export default function RegionSelector() {
  const regions = [
    'Metro Manila (NCR)', 'Cordillera (CAR)', 'Ilocos Region (1)', 
    'Cagayan Valley (2)', 'Central Luzon (3)', 'Calabarzon (4A)', 
    'Mimaropa (4B)', 'Bicol Region (5)', 'Western Visayas (6)',
    'Central Visayas (7)', 'Eastern Visayas (8)', 'Zamboanga Peninsula (9)',
    'Northern Mindanao (10)', 'Davao Region (11)', 'Soccsksargen (12)',
    'Caraga (13)', 'BARMM'
  ];

  return (
    <Select.Root defaultValue="Metro Manila (NCR)">
      <Select.Trigger className="inline-flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-none text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/50 font-medium transition-colors">
        <Select.Value placeholder="Select a region..." />
        <Select.Icon>
          <ChevronDown size={16} className="text-gray-400" />
        </Select.Icon>
      </Select.Trigger>
      
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-xl bg-white shadow-xl border border-gray-100 w-[var(--radix-select-trigger-width)] max-h-64 z-[70] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Select.ScrollUpButton className="flex cursor-default items-center justify-center h-[25px] bg-white text-gray-700 hover:bg-gray-50">
            ▲
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1">
            {regions.map(region => (
              <Select.Item key={region} value={region} className="relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-8 pr-2 text-sm text-gray-800 font-medium outline-none hover:bg-green-50 focus:bg-green-50 focus:text-green-900 transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
                  <Select.ItemIndicator>
                    <Check size={14} className="text-green-600 stroke-[3]" />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{region}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex cursor-default items-center justify-center h-[25px] bg-white text-gray-700 hover:bg-gray-50">
            ▼
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
