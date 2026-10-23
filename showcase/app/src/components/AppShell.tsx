import { Button, Drawer } from 'antd';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type Ref } from 'react';
import { toPixels } from '../theme/antd-theme';
import { resolvedTokens } from '../theme/tokens';
import { containDialogTab } from './dialog-focus';
import './shell.css';

const desktopQuery = `(min-width: ${toPixels(resolvedTokens['layout.breakpointLarge']!, 'layout.breakpointLarge')}px)`;

function subscribeToViewport(onChange: () => void): () => void {
  const viewport = window.matchMedia(desktopQuery);
  viewport.addEventListener('change', onChange);
  return () => viewport.removeEventListener('change', onChange);
}

function isDesktopViewport(): boolean {
  return window.matchMedia(desktopQuery).matches;
}

function getServerViewport(): boolean {
  return false;
}

function MembersNavigation({ onNavigate, linkRef }: { onNavigate?: () => void; linkRef?: Ref<HTMLAnchorElement> }) {
  return (
    <nav aria-label="工作台导航" className="pui-shell-nav">
      <a href="#members" aria-current="page" onClick={onNavigate} ref={linkRef}>
        成员管理
      </a>
    </nav>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const navLink = useRef<HTMLAnchorElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // Restore after the open-state focus lock has been released, including rapid closes.
    if (!open) trigger.current?.focus();
  }, [open]);

  return (
    <>
      <Button
        className="pui-shell-menu-trigger"
        aria-label="打开工作台导航"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? 'pui-mobile-navigation' : undefined}
        onClick={(event) => { trigger.current = event.currentTarget; setOpen(true); }}
      >
        导航
      </Button>
      <Drawer
        title="工作台导航"
        placement="left"
        size="min(var(--pui-layout-sidebar), calc(100vw - var(--pui-space-page-mobile)))"
        open={open}
        onClose={() => setOpen(false)}
        closable={{ 'aria-label': '关闭工作台导航' }}
        focusable={{ trap: true, focusTriggerAfterClose: false }}
        afterOpenChange={(visible) => {
          const dialog = navLink.current?.closest('[role="dialog"]');
          if (visible && open && !dialog?.contains(document.activeElement)) navLink.current?.focus();
        }}
        getContainer={false}
        destroyOnHidden
        classNames={{ root: 'pui-shell-drawer', close: 'pui-shell-drawer-close' }}
        styles={{ root: { position: 'fixed' }, body: { padding: 'var(--pui-space-panel)' } }}
      >
        <div id="pui-mobile-navigation">
          <p className="pui-shell-drawer-brand">Personal UI</p>
          <MembersNavigation onNavigate={() => setOpen(false)} linkRef={navLink} />
        </div>
      </Drawer>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const desktop = useSyncExternalStore(subscribeToViewport, isDesktopViewport, getServerViewport);

  return (
    <div className={`pui-shell${desktop ? ' pui-shell--desktop' : ''}`} onKeyDownCapture={containDialogTab}>
      <a className="pui-shell-skip" href="#main-content">跳到主要内容</a>
      {desktop && (
        <aside className="pui-shell-sidebar" aria-label="Personal UI 工作台">
          <p className="pui-shell-brand">Personal UI</p>
          <p className="pui-shell-sidebar-caption">组件工作台</p>
          <MembersNavigation />
        </aside>
      )}
      <div className="pui-shell-body">
        <header className="pui-shell-header">
          <div className="pui-shell-header-start">
            {!desktop && <MobileNavigation />}
            <span className="pui-shell-workspace">工作台</span>
          </div>
          <span className="pui-shell-local-label">本地演示</span>
        </header>
        <main id="main-content" tabIndex={-1} className="pui-shell-main">
          {children}
        </main>
      </div>
    </div>
  );
}
