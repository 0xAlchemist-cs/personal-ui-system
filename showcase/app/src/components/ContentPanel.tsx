import type { ReactNode, Ref } from 'react';

interface ContentPanelProps {
  title: string;
  description?: string;
  headingId: string;
  headingRef?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}

export function ContentPanel({
  title,
  description,
  headingId,
  headingRef,
  children,
}: ContentPanelProps) {
  return (
    <section className="pui-panel pui-content-panel" aria-labelledby={headingId}>
      <header className="pui-content-panel-header">
        <h2 id={headingId} ref={headingRef} tabIndex={-1}>{title}</h2>
        {description && <p>{description}</p>}
      </header>
      {children}
    </section>
  );
}
