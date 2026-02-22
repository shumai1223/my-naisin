'use client';

import * as React from 'react';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="secondary"
      onClick={handlePrint}
      leftIcon={<Printer className="h-4 w-4" />}
      className="print:hidden"
    >
      印刷する
    </Button>
  );
}
