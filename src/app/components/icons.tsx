import type { SVGProps } from 'react';

export function ShowUpLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="font-headline font-bold text-2xl tracking-wider" {...props}>
      ShowUp
    </div>
  );
}
