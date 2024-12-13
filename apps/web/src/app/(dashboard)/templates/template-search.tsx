'use client';

import { useContext, useEffect, useState } from 'react';

import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { useUpdateSearchParams } from '@documenso/lib/client-only/hooks/use-update-search-params';
import { Input } from '@documenso/ui/primitives/input';

import { TemplateTableContext } from './templater-table-provider';

export const TemplateSearch = () => {
  const { startTransition } = useContext(TemplateTableContext);
  const updateSearchParams = useUpdateSearchParams();
  const [searchString, setSearchString] = useState('');
  const debouncedSearchString = useDebouncedValue(searchString, 1000);

  useEffect(() => {
    startTransition(() => {
      updateSearchParams({
        query: debouncedSearchString,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchString]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <Input
      className="my-6 flex w-96 flex-row gap-4"
      type="text"
      placeholder="Search by name or email"
      value={searchString}
      onChange={handleChange}
    />
  );
};
