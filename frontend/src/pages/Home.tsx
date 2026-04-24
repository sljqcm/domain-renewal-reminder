import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/logo';

const heroSignals = [
  { label: '提醒策略', value: '支持按到期前 30 / 15 / 7 天分段提醒' },
  { label: '导入方式', value: '手动录入、CSV 批量导入、AI 辅助识别' },
  { label: '处理闭环', value: '提醒中、已处理、已暂停、已放弃全程可追踪' },
];

const dashboardStats = [
  { value: '24', label: '本月需要留意的域名' },
  { value: '08', label: '已经进入提醒周期' },
  { value: '03', label: '今天刚完成续费更新' },
];

const reminderQueue = [
  { domain: 'aiziyou.com', meta: '2026-05-03 到期', status: '提醒中', owner: '运营负责人' },
  { domain: 'studio-notes.cn', meta: '2026-05-18 到期', status: '待确认', owner: '创始人' },
  { domain: 'client-landing.io', meta: '2026-06-02 到期', status: '已续费', owner: '项目经理' },
];

const capabilities = [
  {
    badge: 'Domain Desk',
    title: '把零散域名收进同一个控制台',
    description:
      '域名、注册商、到期时间、续费地址、处理人和备注都在一个地方，搜索和排查比翻表格快得多。',
  },
  {
    badge: 'Reminder Engine',
    title: '把“记得续费”变成自动执行',
    description:
      '系统按计划巡检并生成提醒，不用依赖个人记忆，也不用靠每个月重新查一遍日历。',
  },
  {
    badge: 'Workflow',
    title: '把处理状态和责任归属说清楚',
    description:
      '每个域名当前是谁在跟进、处理到哪一步、什么时候续费过，都能被团队成员一眼看懂。',
  },
  {
    badge: 'Batch Import',
    title: '把历史资产更快迁进来',
    description:
      '支持 CSV 导入和 AI 识别整理，适合把旧表格、聊天记录或零散清单逐步迁移到系统里。',
  },
];

const workflow = [
  {
    step: '01',
    title: '录入或导入域名资产',
    description: '先建立统一清单，再把到期时间、续费入口、负责人和备注补充完整。',
  },
  {
    step: '02',
    title: '系统自动计算提醒窗口',
    description: '根据到期时间生成提醒开始时间和提醒频率，减少人工维护规则的负担。',
  },
  {
    step: '03',
    title: '处理人更新状态与结果',
    description: '谁接手、是否已经续费、为什么暂停或放弃，都会沉淀在当前记录里。',
  },
  {
    step: '04',
    title: '续费完成后进入下一轮',
    description: '一旦标记续费，系统会切换到新的到期周期，避免完成一次后又重新漏管。',
  },
];

const trustCards = [
  {
    label: '适合谁',
    title: '个人站长也能用，小团队更能受益',
    description:
      '一个人管理多个域名时能防漏；2 到 10 人协作时，更能把责任归属和处理节奏固定下来。',
  },
  {
    label: '部署方式',
    title: '基于 Cloudflare 的轻运维方案',
    description:
      '前端运行在 Pages，任务与接口运行在 Workers，数据由 D1 与 KV 承接，不需要自己维护传统服务器。',
  },
  {
    label: '管理透明度',
    title: '不是提醒一下就结束，而是把过程留住',
    description:
      '从提醒触发到续费完成，每个阶段都有状态和备注可以追溯，适合做长期资产管理。',
  },
];

const productHighlights = [
  '首页不是宣传图，而是把你每天真正需要看的提醒视图先摆出来。',
  '状态设计面向实际协作，不只区分“到期”和“未到期”。',
  '信息结构优先照顾移动端，避免在手机上横向滚动和难点按。',
];

export function Home() {
  return (
    <div className="app-shell ink-wash-bg landing-shell landing-shell--executive">
      <a href="#home-main-content" className="skip-link">
        跳到主要内容
      </a>
      <div className="ink-pattern" />
      <div className="landing-orb landing-orb--one" />
      <div className="landing-orb landing-orb--two" />
      <div className="landing-orb landing-orb--three" />

      <header className="app-topbar landing-topbar landing-topbar--minimal">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo title="爱自由域名管理" subtitle="Domain Renewal Reminder Service" />
          <nav className="landing-nav landing-nav--rich" aria-label="Homepage navigation">
            <a href="#capabilities" className="landing-anchor-link">
              核心能力
            </a>
            <a href="#workflow" className="landing-anchor-link">
              工作流
            </a>
            <a href="#trust" className="landing-anchor-link">
              部署与可信度
            </a>
            <a
              href="https://github.com/zhikanyeye/domain-renewal-reminder"
              target="_blank"
              rel="noreferrer"
              className="landing-icon-link"
              aria-label="GitHub repository"
              title="GitHub repository"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.59 2 12.25c0 4.528 2.865 8.37 6.839 9.727.5.096.682-.223.682-.495 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.39-3.369-1.39-.455-1.192-1.11-1.51-1.11-1.51-.908-.638.069-.625.069-.625 1.004.073 1.532 1.058 1.532 1.058.892 1.566 2.341 1.114 2.91.852.091-.667.349-1.115.635-1.371-2.22-.26-4.555-1.14-4.555-5.074 0-1.121.39-2.038 1.03-2.757-.104-.261-.447-1.312.097-2.735 0 0 .84-.276 2.75 1.053A9.303 9.303 0 0 1 12 6.838c.85.004 1.706.118 2.504.347 1.909-1.329 2.748-1.053 2.748-1.053.545 1.423.202 2.474.099 2.735.64.719 1.028 1.636 1.028 2.757 0 3.944-2.339 4.811-4.566 5.066.359.319.679.948.679 1.912 0 1.381-.012 2.494-.012 2.833 0 .274.18.596.688.494C19.138 20.616 22 16.776 22 12.25 22 6.59 17.523 2 12 2Z" />
              </svg>
            </a>
            <Link to="/login" className="secondary-button landing-login-button">
              登录
            </Link>
            <Link to="/register" className="primary-button landing-entry-button">
              开始管理域名
            </Link>
          </nav>
        </div>
      </header>

      <main id="home-main-content" className="app-main landing-main">
        <section className="landing-hero animate-slideUp" aria-labelledby="hero-title">
          <div className="liquid-panel liquid-panel--hero">
            <div className="liquid-chip">Product-grade Homepage</div>
            <div className="landing-copy">
              <p className="landing-kicker">Domain Renewal Operations</p>
              <h1 id="hero-title" className="landing-title">
                把域名续费从“别忘了”变成一套稳定运转的流程
              </h1>
              <p className="landing-description">
                爱自由域名管理把域名记录、提醒节奏、处理状态和续费结果整合到同一个控制台，帮助个人站长、工作室和小团队更稳地守住自己的线上资产。
              </p>
            </div>

            <div className="landing-actions">
              <Link to="/register" className="primary-button">
                注册并建立清单
              </Link>
              <Link to="/login" className="secondary-button">
                登录查看控制台
              </Link>
            </div>

            <div className="landing-signal-grid" aria-label="Homepage highlights">
              {heroSignals.map((signal) => (
                <article key={signal.label} className="liquid-signal">
                  <div className="liquid-signal__label">{signal.label}</div>
                  <div className="liquid-signal__value">{signal.value}</div>
                </article>
              ))}
            </div>

            <ul className="hero-proof-list" aria-label="Design highlights">
              {productHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="liquid-panel liquid-panel--aside animate-fadeIn" aria-label="Product preview">
            <div className="liquid-preview">
              <div className="liquid-preview__header">
                <div>
                  <div className="liquid-preview__eyebrow">Live board preview</div>
                  <h2>首页先交付你真正关心的提醒视图</h2>
                </div>
                <div className="liquid-status-pill">
                  <span className="liquid-status-pill__dot" aria-hidden="true" />
                  自动巡检已开启
                </div>
              </div>

              <div className="liquid-stat-grid" aria-label="Preview metrics">
                {dashboardStats.map((item) => (
                  <div key={item.label} className="liquid-stat-card metric-card">
                    <div className="liquid-stat-card__value">{item.value}</div>
                    <div className="liquid-stat-card__label">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="preview-board">
                <div className="preview-board__header">
                  <strong>近期续费处理队列</strong>
                  <span>今日同步</span>
                </div>
                <ul className="preview-queue">
                  {reminderQueue.map((item) => (
                    <li key={item.domain} className="preview-queue__item">
                      <div className="preview-queue__main">
                        <strong>{item.domain}</strong>
                        <span>{item.meta}</span>
                      </div>
                      <div className="preview-queue__meta">
                        <span className="preview-status-tag">{item.status}</span>
                        <span>{item.owner}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="liquid-stack">
                <div className="liquid-stack-card liquid-stack-card--accent">
                  <div className="liquid-stack-card__label">工作方式</div>
                  <div className="liquid-stack-card__title">记录、提醒、处理、续费接续</div>
                  <p>不是只发一次提醒，而是让每次续费动作都能衔接回下一轮周期。</p>
                </div>
                <div className="liquid-stack-card">
                  <div className="liquid-stack-card__label">部署结构</div>
                  <div className="liquid-stack-card__title">Cloudflare Pages + Workers + D1 + KV</div>
                  <p>前台体验轻，后台任务稳定，适合长期托管域名类资产管理工具。</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section id="capabilities" className="landing-section animate-slideUp" aria-labelledby="capabilities-title">
          <div className="landing-section__heading">
            <div className="liquid-chip">Capabilities</div>
            <h2 id="capabilities-title">首页把产品能力讲清楚，也把使用后的工作状态展示清楚</h2>
            <p>
              这不是一页只写“支持提醒”的介绍，而是把域名资产管理真正会遇到的录入、排查、协作与续费回路，一起组织进产品叙事里。
            </p>
          </div>

          <div className="landing-feature-grid">
            {capabilities.map((item) => (
              <article key={item.title} className="liquid-card">
                <div className="liquid-card__badge">{item.badge}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="landing-section animate-slideUp" aria-labelledby="workflow-title">
          <div className="landing-section__heading">
            <div className="liquid-chip">Workflow</div>
            <h2 id="workflow-title">用四步把续费管理从临时救火变成可持续运营</h2>
            <p>
              页面里的工作流部分不是概念图，而是为了让第一次访问的人马上理解系统上线之后，团队每天会如何使用它。
            </p>
          </div>

          <div className="workflow-grid">
            {workflow.map((item) => (
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

        <section id="trust" className="landing-section animate-slideUp" aria-labelledby="trust-title">
          <div className="landing-section__heading">
            <div className="liquid-chip">Trust Layer</div>
            <h2 id="trust-title">产品可信度来自部署方式、协作清晰度和长期可维护性</h2>
            <p>
              对域名这类长期资产来说，首页不仅要“好看”，还要让用户相信这套产品能长期跑、能交接、能追踪。
            </p>
          </div>

          <div className="trust-grid">
            {trustCards.map((item) => (
              <article key={item.title} className="trust-card">
                <div className="trust-card__label">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section animate-slideUp" aria-labelledby="cta-title">
          <div className="liquid-panel liquid-panel--cta">
            <div>
              <div className="liquid-chip liquid-chip--soft">Ready to Start</div>
              <h2 id="cta-title" className="landing-cta__title">
                先把域名资产收拢起来，再把提醒和续费交给系统持续运转
              </h2>
              <p className="landing-cta__text">
                如果你已经有一份旧表格或正在靠聊天记录记域名，现在就是把它整理进正式产品的最好时机。
              </p>
            </div>
            <div className="landing-actions landing-actions--compact">
              <Link to="/register" className="primary-button">
                创建账户
              </Link>
              <Link to="/login" className="secondary-button">
                已有账户，立即登录
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
