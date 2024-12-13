'use client';

import { useCallback } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@documenso/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@documenso/ui/primitives/dropdown-menu';

const SortTemplateDropdownMenu: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="justify-between gap-2"
          aria-label="Sort options"
        >
          Sort <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full rounded-md border p-2 shadow-lg"
        align="end"
        forceMount
      >
        <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
          <Link href={pathname + '?' + createQueryString('sortBy', 'date')}>Sort by Date</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
          <Link href={pathname + '?' + createQueryString('sortBy', 'asc')}>Sort from A-Z</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-muted-foreground px-4 py-2" asChild>
          <Link href={pathname + '?' + createQueryString('sortBy', 'desc')}>Sort from Z-A</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortTemplateDropdownMenu;
