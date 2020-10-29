import { IAlert, useToast } from '@chakra-ui/core';
import { useCallback } from 'react';

export default function useApiResToast() {
  const toast = useToast();

  return useCallback(
    (title: string, status: IAlert['status'] = 'success', description?: string, duration?: number) => {
      toast({
        title,
        status,
        description,
        duration: duration ?? 4000,
        isClosable: true,
        position: 'bottom-right',
      });
    },
    [toast],
  );
}
