import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/logo';

const featureCards = [
  {
    title: '续费闭环',
    description: '从提醒、处理、暂停到续费完成，统一记录状态、备注、负责人和处理时间。',
    badge: 'Workflow',
  },
  {
    title: '自动提醒',
    description: '围绕到期时间自动进入提醒窗口，按日检查发送，避免依赖人工记忆。',
    badge: 'Automation',
  },
  {
    title: '邮件投递',
    description: '同时支持 HTTP API 和 SMTP，两种方式都适合个人和团队自托管。',
    badge: 'Delivery',
  },
  {
    title: 'Cloudflare Stack',
    description: '基于 Workers、D1、KV、Cron 和 React，部署成本低，维护路径清晰。',
    badge: 'Platform',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: '录入域名资产',
    description: '保存到期时间、提醒邮箱、注册商链接和续费周期，让每个域名都具备可追踪信息。',
  },
  {
    step: '02',
    title: '自动进入提醒窗口',
    description: '系统依据到期时间计算提醒起点，按计划持续发送，不遗漏关键节点。',
  },
  {
    step: '03',
    title: '状态流转与协作',
    description: '支持标记已处理、暂停提醒、已放弃，并记录负责人、备注和处理时间。',
  },
  {
    step: '04',
    title: '续费并进入下周期',
    description: '续费后自动顺延到期日、清零提醒进度，回到新的管理周期。',
  },
];

const signals = [
  { label: '状态流转', value: 'active / handled / paused / abandoned' },
  { label: '提醒通道', value: 'HTTP API + SMTP' },
  { label: '部署方式', value: 'Cloudflare Workers + D1' },
];

const metrics = [
  { value: '4', label: '工作流状态' },
  { value: '2', label: '邮件发送方式' },
  { value: '100%', label: '自托管友好' },
];

export function Home() {
  return (
    <div className="app-shell ink-wash-bg landing-shell">
      <div className="ink-pattern" />
      <div className="landing-orb landing-orb--one" />
      <div className="landing-orb landing-orb--two" />
      <div className="landing-orb landing-orb--three" />

      <header className="app-topbar landing-topbar">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <BrandLogo title="爱自由域名管理" subtitle="Domain Renewal Reminder Service" />
          <nav className="landing-nav" aria-label="Homepage actions">
            <a href="#workflow" className="ghost-button">
              查看工作流
            </a>
            <Link to="/login" className="secondary-button">
              登录
            </Link>
            <Link to="/register" className="primary-button">
              免费注册
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main landing-main">
        <section className="landing-hero">
          <div className="liquid-panel liquid-panel--hero animate-slideUp">
            <div className="liquid-chip">Liquid Glass Homepage</div>
            <div className="landing-copy">
              <p className="landing-kicker">Brand-first domain operations</p>
              <h1 className="landing-title">
                先展示产品价值，
                <span className="text-gradient"> 再引导用户进入注册和登录流程。</span>
              </h1>
              <p className="landing-description">
                爱自由域名管理不是单纯的到期提醒页，而是一个面向长期维护的域名续费管理台。
                它把提醒计划、状态流转、邮件投递和续费闭环集中到一个清晰、可自托管的工作流里。
              </p>
            </div>

            <div className="landing-actions">
              <Link to="/register" className="primary-button">
                立即开始
              </Link>
              <Link to="/login" className="secondary-button">
                已有账号登录
              </Link>
            </div>

            <div className="landing-signal-grid">
              {signals.map((item) => (
                <div key={item.label} className="liquid-signal">
                  <div className="liquid-signal__label">{item.label}</div>
                  <div className="liquid-signal__value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-panel liquid-panel--aside animate-slideUp">
            <div className="liquid-preview">
              <div className="liquid-preview__header">
                <div>
                  <div className="liquid-preview__eyebrow">Renewal Console</div>
                  <h2>域名续费闭环，一眼可见</h2>
                </div>
                <div className="liquid-status-pill">
                  <span className="liquid-status-pill__dot" />
                  Auto check daily
                </div>
              </div>

              <div className="liquid-stat-grid">
                {metrics.map((item) => (
                  <div key={item.label} className="liquid-stat-card">
                    <div className="liquid-stat-card__value">{item.value}</div>
                    <div className="liquid-stat-card__label">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="liquid-stack">
                <div className="liquid-stack-card">
                  <div className="liquid-stack-card__label">当前工作流</div>
                  <div className="liquid-stack-card__title">提醒中 → 已处理 → 已续费</div>
                  <p>续费完成后自动进入下一个周期，不需要手动重置提醒进度。</p>
                </div>

                <div className="liquid-stack-card liquid-stack-card--accent">
                  <div className="liquid-stack-card__label">邮件投递</div>
                  <div className="liquid-stack-card__title">HTTP API / SMTP</div>
                  <p>面向个人和小团队，既能快速上线，也保留自托管控制力。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section__heading">
            <div className="liquid-chip liquid-chip--soft">Core capabilities</div>
            <h2>不是临时页面，而是可以对外展示的产品首页</h2>
            <p>
              首屏只保留一个明确主动作，下面用更轻的玻璃信息卡解释产品范围、闭环能力和技术定位。
            </p>
          </div>

          <div className="landing-feature-grid">
            {featureCards.map((item, index) => (
              <article
                key={item.title}
                className={`liquid-card ${index === 0 ? 'liquid-card--wide' : ''}`}
              >
                <div className="liquid-card__badge">{item.badge}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="landing-section">
          <div className="landing-section__heading">
            <div className="liquid-chip liquid-chip--soft">Renewal workflow</div>
            <h2>用一个完整工作流，替代“发完提醒就结束”的半成品体验</h2>
            <p>
              这套流程把资产录入、自动提醒、协作处理和续费后的周期重置串起来，更适合长期维护和开源展示。
            </p>
          </div>

          <div className="workflow-grid">
            {workflowSteps.map((item) => (
              <article key={item.step} className="workflow-node">
                <div className="workflow-node__step">{item.step}</div>
                <div className="workflow-node__body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="liquid-panel liquid-panel--cta">
            <div>
              <div className="liquid-chip liquid-chip--soft">Open source ready</div>
              <h2 className="landing-cta__title">把它作为个人作品、团队工具，或开源展示项目都成立。</h2>
              <p className="landing-cta__text">
                现在访客先看到的是产品价值、品牌和工作流，而不是一上来就被丢到登录页。
              </p>
            </div>

            <div className="landing-actions landing-actions--compact">
              <Link to="/register" className="primary-button">
                创建账号
              </Link>
              <Link to="/login" className="secondary-button">
                进入控制台
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
