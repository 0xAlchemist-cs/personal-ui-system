import type { ReactNode } from 'react';

interface StoryFrameProps {
  children: ReactNode;
  title: string;
  description: string;
  inputs: string;
  events: string;
  dependencies: string;
  fullScreen?: boolean;
}

/** Story-only documentation; it never enters the product application. */
export function StoryFrame({ children, title, description, inputs, events, dependencies, fullScreen = false }: StoryFrameProps) {
  return (
    <div className={fullScreen ? 'pui-story-fullscreen' : 'pui-preview'}>
      {children}
      <aside className={`pui-story-documentation${fullScreen ? ' pui-preview' : ''}`} aria-label="Story 说明">
        <details className="pui-panel">
          <summary>{title} · 用途与接口</summary>
          <p>{description}</p>
          <dl>
            <dt>输入</dt><dd>{inputs}</dd>
            <dt>事件</dt><dd>{events}</dd>
            <dt>依赖</dt><dd>{dependencies}</dd>
            <dt>预设与密度</dt><dd>minimal-saas · light · comfortable · blue · medium</dd>
            <dt>验证范围</dt><dd>T5 已检查本页与 Stories 的 375/768/1440px 布局、交互和主要状态。minimal-saas 仅在此固定组合与已测范围为 validated；部件仍留在应用内，未收录为公共资产。</dd>
          </dl>
          <p>此说明与演示参数仅属于 Storybook。重新选择或重置 Story 可恢复固定初始状态。</p>
        </details>
      </aside>
    </div>
  );
}
