import { App, Button, Input } from 'antd';

export function ThemePreview() {
  const { message } = App.useApp();

  return (
    <main className="pui-preview">
      <header className="pui-preview-header">
        <p className="pui-brand">Personal UI System</p>
        <h1>组件工作台</h1>
        <p className="pui-intro">一套清晰、一致的设计语言，从基础控件开始。</p>
      </header>

      <div className="pui-preview-grid">
        <section className="pui-panel" aria-labelledby="controls-title">
          <h2 id="controls-title">基础控件</h2>
          <div className="pui-field">
            <label htmlFor="preview-name">显示名称</label>
            <Input id="preview-name" defaultValue="成员管理" autoComplete="off" />
          </div>
          <div className="pui-actions">
            <Button type="primary" onClick={() => void message.success('预览提示已显示')}>
              显示提示
            </Button>
            <Button disabled aria-describedby="disabled-reason">保存</Button>
          </div>
          <p id="disabled-reason" className="pui-help">这里用于预览控件，暂不保存数据。</p>
        </section>

        <section className="pui-panel" aria-labelledby="language-title">
          <h2 id="language-title">颜色与含义</h2>
          <dl className="pui-swatch-list">
            <div><span className="pui-swatch" aria-hidden="true" /><dt>强调</dt><dd>主要行动与当前焦点</dd></div>
            <div><span className="pui-swatch pui-swatch--success" aria-hidden="true" /><dt>成功</dt><dd>明确告诉用户操作结果</dd></div>
            <div><span className="pui-swatch pui-swatch--error" aria-hidden="true" /><dt>错误</dt><dd>说明问题并保留输入</dd></div>
          </dl>
        </section>
      </div>
    </main>
  );
}
