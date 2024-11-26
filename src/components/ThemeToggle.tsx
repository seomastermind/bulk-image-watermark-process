import { Moon, Sun } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

interface Props {
  isDark: boolean;
  onToggle: (checked: boolean) => void;
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-gray-600" />
      <Switch.Root
        checked={isDark}
        onCheckedChange={onToggle}
        className="relative h-6 w-11 cursor-pointer rounded-full bg-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=checked]:bg-blue-600"
      >
        <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
      <Moon className="h-4 w-4 text-gray-600" />
    </div>
  );
}